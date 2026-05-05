#!/usr/bin/env node
import * as net from 'net';
import * as dns from 'dns';
import { promisify } from 'util';
import { Socks5Server } from './socks5/server';
import { OpenVPNClient } from './openvpn/client';
import { readConfigFile } from './config';
import { NetworkStack } from './net/stack';
import { log, setLogLevel, LogLevel } from './log';

const dnsLookup = promisify(dns.lookup);

interface CliArgs {
    configPath: string;
    port: number;
    host: string;
    verbose: boolean;
    remoteHost?: string;
    remotePort?: number;
    remoteProto?: 'tcp' | 'udp';
    authUser?: string;
    authPass?: string;
    authFile?: string;
}

function parseArgs(argv: string[]): CliArgs | { help: true } | { error: string } {
    const args: Partial<CliArgs> = { port: 1080, host: '127.0.0.1', verbose: false };
    const positional: string[] = [];

    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '-h' || a === '--help') return { help: true };
        else if (a === '-v' || a === '--verbose') args.verbose = true;
        else if (a === '-p' || a === '--port') {
            const v = argv[++i];
            if (!v) return { error: `${a} requires a value` };
            const n = parseInt(v, 10);
            if (isNaN(n) || n < 1 || n > 65535) return { error: `invalid port: ${v}` };
            args.port = n;
        } else if (a === '-H' || a === '--host') {
            const v = argv[++i];
            if (!v) return { error: `${a} requires a value` };
            args.host = v;
        } else if (a === '-r' || a === '--remote') {
            const v = argv[++i];
            if (!v) return { error: `${a} requires a value (host or host:port)` };
            const [h, p] = v.split(':');
            if (!h) return { error: `invalid remote: ${v}` };
            args.remoteHost = h;
            if (p !== undefined) {
                const n = parseInt(p, 10);
                if (isNaN(n) || n < 1 || n > 65535) return { error: `invalid remote port: ${p}` };
                args.remotePort = n;
            }
        } else if (a === '--remote-port') {
            const v = argv[++i];
            if (!v) return { error: `${a} requires a value` };
            const n = parseInt(v, 10);
            if (isNaN(n) || n < 1 || n > 65535) return { error: `invalid remote port: ${v}` };
            args.remotePort = n;
        } else if (a === '--proto') {
            const v = argv[++i];
            if (!v) return { error: `${a} requires a value (tcp|udp)` };
            const lower = v.toLowerCase();
            if (lower !== 'tcp' && lower !== 'udp') return { error: `--proto must be 'tcp' or 'udp', got: ${v}` };
            args.remoteProto = lower;
        } else if (a === '--user') {
            const v = argv[++i];
            if (!v) return { error: `${a} requires a value` };
            args.authUser = v;
        } else if (a === '--pass') {
            const v = argv[++i];
            if (!v) return { error: `${a} requires a value` };
            args.authPass = v;
        } else if (a === '--auth-file') {
            const v = argv[++i];
            if (!v) return { error: `${a} requires a file path` };
            args.authFile = v;
        } else if (a.startsWith('-')) {
            return { error: `unknown flag: ${a}` };
        } else {
            positional.push(a);
        }
    }

    if (positional.length === 0) return { error: 'missing <config.ovpn> argument' };
    if (positional.length > 1) return { error: `unexpected extra argument: ${positional[1]}` };
    args.configPath = positional[0];

    return args as CliArgs;
}

function printHelp() {
    console.log(`openvpn-socks — run an OpenVPN client and expose a SOCKS5 proxy

Usage:
  openvpn-socks [options] <config.ovpn>

SOCKS5 options:
  -p, --port <n>        SOCKS5 port (default: 1080)
  -H, --host <ip>       SOCKS5 bind address (default: 127.0.0.1)

Remote overrides (take precedence over values in the .ovpn file):
  -r, --remote <h[:p]>  override remote host, optionally with :port
      --remote-port <n> override remote port only
      --proto <tcp|udp> override transport protocol

Auth (when the .ovpn has auth-user-pass — NordVPN, ProtonVPN, etc.):
      --user <u>        username
      --pass <p>        password
      --auth-file <p>   path to 2-line file (line 1: user, line 2: pass)
                        Env fallback: OPENVPN_USER / OPENVPN_PASS

Other:
  -v, --verbose         print OpenVPN protocol details (noisy)
  -h, --help            show this help

Examples:
  openvpn-socks ./vpn.ovpn --port 1080
  openvpn-socks ./vpn.ovpn -r 219.100.37.59:443 --proto tcp
  openvpn-socks ./vpn.ovpn -r 1.2.3.4 --remote-port 995
  curl -x socks5h://127.0.0.1:1080 https://example.com/

Notes:
  - Hostname resolution uses the OS resolver, not the VPN tunnel.
  - The virtual TCP/IP stack is minimal; some sites may behave flakily
    under heavy reordering or large bursts.
  - Only OpenVPN over TCP with AES-128-CBC / SHA1 has been verified
    (tested against VPN Gate / SoftEther servers).`);
}

async function run(cliArgs: CliArgs) {
    setLogLevel(cliArgs.verbose ? LogLevel.TRACE : LogLevel.INFO);
    if (!cliArgs.verbose) {
        // Silence the many console.log debug messages scattered across the
        // protocol code. Errors still go through console.error.
        console.log = () => {};
    }

    log.info(`[openvpn-socks] loading config: ${cliArgs.configPath}`);
    const config = readConfigFile(cliArgs.configPath);

    // Apply CLI overrides for remote host/port/proto
    if (cliArgs.remoteHost || cliArgs.remotePort !== undefined || cliArgs.remoteProto) {
        if (config.remote.length === 0) {
            config.remote.push({ host: '', port: 1194, proto: config.proto || 'udp' });
        }
        const r = config.remote[0];
        if (cliArgs.remoteHost) r.host = cliArgs.remoteHost;
        if (cliArgs.remotePort !== undefined) r.port = cliArgs.remotePort;
        if (cliArgs.remoteProto) {
            r.proto = cliArgs.remoteProto;
            config.proto = cliArgs.remoteProto;
        }
        log.info(`[openvpn-socks] override: remote=${r.host}:${r.port} proto=${config.proto}`);
    }

    // auth-user-pass credentials (NordVPN, ProtonVPN, etc.). Precedence:
    // explicit --user/--pass > --auth-file > env > whatever readConfigFile
    // already pulled from an inline auth-user-pass <file> directive.
    if (cliArgs.authFile) {
        const lines = require('fs').readFileSync(cliArgs.authFile, 'utf-8').split(/\r?\n/);
        if (!config.authUserPass) config.authUserPass = { required: true };
        if (lines[0]) config.authUserPass.username = lines[0].trim();
        if (lines[1]) config.authUserPass.password = lines[1].trim();
    }
    if (cliArgs.authUser || process.env.OPENVPN_USER) {
        if (!config.authUserPass) config.authUserPass = { required: true };
        config.authUserPass.username = cliArgs.authUser || process.env.OPENVPN_USER;
    }
    if (cliArgs.authPass || process.env.OPENVPN_PASS) {
        if (!config.authUserPass) config.authUserPass = { required: true };
        config.authUserPass.password = cliArgs.authPass || process.env.OPENVPN_PASS;
    }
    if (config.authUserPass?.required && (!config.authUserPass.username || !config.authUserPass.password)) {
        throw new Error(
            'the .ovpn requires auth-user-pass but no credentials were given. ' +
            'Pass --user/--pass, --auth-file <file>, or set OPENVPN_USER / OPENVPN_PASS.'
        );
    }

    if (config.remote.length === 0 || !config.remote[0].host) {
        throw new Error('no remote configured (pass --remote <host[:port]> or add "remote ..." to the .ovpn file)');
    }

    const remote = config.remote[0];
    log.info(`[openvpn-socks] remote: ${remote.host}:${remote.port} (${config.proto.toUpperCase()})`);
    log.info(`[openvpn-socks] cipher: ${config.cipher} / auth: ${config.auth}`);

    const socksServer = new Socks5Server(cliArgs.port);
    const vpnClient = new OpenVPNClient(config);
    const netStack = new NetworkStack('0.0.0.0');

    let tunnelReady = false;
    const tunnelReadyPromise = new Promise<void>((resolve) => {
        vpnClient.on('control-message', (msg: string) => {
            if (!msg.startsWith('PUSH_REPLY')) return;

            // IPv4 ifconfig (existing path that marks the tunnel up).
            const m = msg.match(/ifconfig\s+(\d+\.\d+\.\d+\.\d+)\s+(\d+\.\d+\.\d+\.\d+)/);
            if (m) {
                const [, ourIp, gatewayIp] = m;
                netStack.setLocalIp(ourIp);
                if (!tunnelReady) {
                    tunnelReady = true;
                    log.info(`[openvpn-socks] tunnel up: ip=${ourIp} gateway=${gatewayIp}`);
                    resolve();
                }
            }

            // IPv6 detection (measurement-only; we don't route v6 yet).
            // Log in a grep-friendly shape so vpngate-crawler's log can
            // be trivially post-processed to count how many VPN Gate
            // servers push IPv6.
            const m6 = msg.match(/ifconfig-ipv6\s+(\S+)\s+(\S+)/);
            if (m6) {
                log.info(`[openvpn-socks] ipv6-push server=${remote.host}:${remote.port} local=${m6[1]} peer=${m6[2]}`);
            }
            const routeV6 = msg.match(/(route-ipv6(?:-gateway)?|tun-ipv6|dhcp-option\s+DNS6)[^,]*/g);
            if (routeV6 && routeV6.length > 0) {
                log.info(`[openvpn-socks] ipv6-tokens server=${remote.host}:${remote.port} tokens=${JSON.stringify(routeV6)}`);
            }
        });
    });

    socksServer.on('connect', async (req) => {
        log.info(`[socks5] CONNECT ${req.dstAddr}:${req.dstPort}`);

        if (!tunnelReady) {
            log.error(`[socks5] reject ${req.dstAddr}:${req.dstPort}: tunnel not ready`);
            socksServer.sendReply(req.socket, 0x04);
            req.socket.end();
            return;
        }

        let destIp = req.dstAddr;
        if (!net.isIP(destIp)) {
            try {
                const { address } = await dnsLookup(destIp, { family: 4 });
                destIp = address;
                log.info(`[socks5] ${req.dstAddr} -> ${destIp} (OS DNS)`);
            } catch (err) {
                log.error(`[socks5] resolve ${req.dstAddr} failed: ${(err as Error).message}`);
                socksServer.sendReply(req.socket, 0x04);
                return;
            }
        }

        const socket = netStack.createConnection(destIp, req.dstPort, req.socket);
        const connectTimeout = setTimeout(() => {
            log.error(`[socks5] ${destIp}:${req.dstPort} connect timeout`);
            socksServer.sendReply(req.socket, 0x04);
            req.socket.end();
        }, 8000);
        socket.once('connected', () => {
            clearTimeout(connectTimeout);
            socksServer.sendReply(req.socket, 0x00);
        });
    });

    netStack.on('output', (ipPacket: Buffer) => vpnClient.sendDataPacket(ipPacket));
    vpnClient.on('ip-packet', (ipPacket: Buffer) => netStack.handleIpPacket(ipPacket));

    socksServer.listen(cliArgs.host);
    vpnClient.connect();

    const shutdown = async (signal: string) => {
        log.info(`[openvpn-socks] ${signal} received, shutting down...`);
        try { vpnClient.stop(); } catch {}
        try { await socksServer.close(); } catch {}
        process.exit(0);
    };
    process.on('SIGINT',  () => void shutdown('SIGINT'));
    process.on('SIGTERM', () => void shutdown('SIGTERM'));

    // Print a heads-up if the tunnel takes too long
    const readyTimeout = setTimeout(() => {
        if (!tunnelReady) log.error('[openvpn-socks] tunnel still not ready after 30s — check server/config');
    }, 30_000);
    tunnelReadyPromise.then(() => clearTimeout(readyTimeout));
}

async function main() {
    const parsed = parseArgs(process.argv.slice(2));
    if ('help' in parsed) { printHelp(); return; }
    if ('error' in parsed) {
        console.error(`error: ${parsed.error}`);
        console.error(`run with --help for usage.`);
        process.exit(2);
    }
    try {
        await run(parsed);
    } catch (err) {
        console.error('[openvpn-socks] fatal:', (err as Error).message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
