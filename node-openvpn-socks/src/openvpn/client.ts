import * as dgram from 'dgram';
import * as net from 'net';
import * as tls from 'tls';
import * as crypto from 'crypto';
import { EventEmitter } from 'events';
import { OpenVPNConfig } from '../config';
import { ControlChannel } from './control';
import { VirtualTransport } from './transport';
import { Opcode } from './packet';
import { OpenVPNCrypto } from './crypto';
import { OpenVPNStaticKey } from './static_key';

/**
 * OpenVPN Key Method 2 string field: `[uint16 length-including-null][str\0]`.
 * An empty string serializes as `[00 01] 00` — NOT `[00 00]`, which strict
 * OpenVPN servers reject.
 */
function encodeString(s: string): Buffer {
    const data = Buffer.from(s + '\0', 'utf8');
    const len = Buffer.alloc(2);
    len.writeUInt16BE(data.length, 0);
    return Buffer.concat([len, data]);
}

export class OpenVPNClient extends EventEmitter {
    private udpSocket?: dgram.Socket;
    private tcpSocket?: net.Socket;
    private controlChannel: ControlChannel;
    private virtualTransport: VirtualTransport;
    private tlsSocket?: tls.TLSSocket;

    // TCP Framing Buffer
    private tcpBuffer: Buffer = Buffer.alloc(0);

    private securityContext?: {
        // client->server (we encrypt outgoing with these)
        encCipherKey: Buffer;
        encHmacKey: Buffer;
        encIv: Buffer;
        // server->client (we decrypt incoming with these)
        decCipherKey: Buffer;
        decHmacKey: Buffer;
        decIv: Buffer;
        packetId: number;
        cipher: string;     // runtime-negotiated cipher (may differ from .ovpn)
        auth: string;       // runtime-negotiated auth digest
        peerId: number;     // peer-id assigned by server (for P_DATA_V2)
    };
    private keyBlock?: Buffer;  // full 256-byte PRF output; re-sliced on NCP cipher change
    // Compression framing negotiated in PUSH_REPLY. 'none' skips the stub
    // byte; 'stub' prepends 0xFA to every plaintext; 'stub-v2' only
    // prepends [0x50,0x00] if plaintext starts with 0x50.
    private compressionMode: 'none' | 'stub' | 'stub-v2' = 'none';
    // Canonical IV_PROTO bits we advertise to the server. The key-derivation
    // path (TLS-EKM vs legacy PRF) must exactly match bit 3 (TLS_KEY_EXPORT).
    // IV_PROTO bits WITHOUT TLS_KEY_EXPORT (bit 3) — this forces the server
    // to derive data-channel keys via the legacy MD5/SHA1 PRF, which is what
    // older NordVPN servers appear to use. For a 2.6 server (which auto-
    // negotiates TLS-EKM), applyPushReply will detect `protocol-flags tls-ekm`
    // in the PUSH_REPLY and flip us onto TLS-EKM for that session.
    private readonly iv_proto: number =
        (1 << 1) | (1 << 2) | (1 << 4) | (1 << 6) | (1 << 7) | (1 << 8) | (1 << 9);  // 982

    private clientRandom1?: Buffer;
    private clientRandom2?: Buffer;
    private clientPreMaster?: Buffer;
    private serverKeyMaterialReceived = false;
    private tlsRecvBuffer: Buffer = Buffer.alloc(0);
    private keepaliveTimer?: NodeJS.Timeout;
    private static readonly PING_MAGIC = Buffer.from('2a187bf3641eb4cb07ed2d0a981fc748', 'hex');

    constructor(private config: OpenVPNConfig) {
        super();
        this.controlChannel = new ControlChannel();
        this.virtualTransport = new VirtualTransport(this.controlChannel);

        this.setupSocket();
        this.setupControlChannel();
    }

    private setupSocket() {
        const remote = this.config.remote[0];
        const proto = this.config.proto as string;
        const isTcp = proto.includes('tcp');

        // TLS Auth Setup
        if (this.config.tlsAuth && this.config.tlsAuth.key) {
            try {
                console.log('Configuring TLS-Auth...');
                const keyBuf = OpenVPNStaticKey.parse(this.config.tlsAuth.key);
                const direction = this.config.tlsAuth.direction;
                const { sendKey, recvKey } = OpenVPNStaticKey.getHmacKeys(keyBuf, direction);
                this.controlChannel.setTlsAuth(sendKey, recvKey, this.config.auth || 'SHA1');
            } catch (e) {
                console.error('Failed to setup TLS Auth:', e);
            }
        }

        if (isTcp) {
            console.log(`Initializing TCP Client to ${remote.host}:${remote.port}`);
            this.tcpSocket = new net.Socket();

            this.tcpSocket.on('data', (data: Buffer | string) => {
                this.handleTcpData(data);
            });

            this.tcpSocket.on('error', (err) => console.error('TCP Error:', err));
            this.tcpSocket.on('close', () => console.log('TCP Connection closed'));

        } else {
            // UDP. Each datagram carries one complete OpenVPN packet, so
            // there's no framing state to maintain — way simpler than TCP.
            console.log(`Initializing UDP Client to ${remote.host}:${remote.port}`);
            this.udpSocket = dgram.createSocket('udp4');
            this.udpSocket.on('message', (msg, rinfo) => {
                // Drop datagrams from anywhere but our configured remote.
                // OpenVPN wouldn't accept them anyway (HMAC would fail or
                // sessions wouldn't match), but dropping early saves CPU
                // and keeps logs less noisy in shared-NAT environments.
                if (rinfo.address !== remote.host || rinfo.port !== remote.port) {
                    console.warn(`UDP RX from unexpected ${rinfo.address}:${rinfo.port}, dropping`);
                    return;
                }
                this.processIncomingPacket(msg);
            });
            this.udpSocket.on('error', (err) => {
                console.error('UDP Socket error:', err);
            });
        }
    }

    private handleTcpData(data: Buffer | string) {
        const buf = typeof data === 'string' ? Buffer.from(data) : data;
        this.tcpBuffer = Buffer.concat([this.tcpBuffer, buf]);

        while (this.tcpBuffer.length >= 2) {
            const len = this.tcpBuffer.readUInt16BE(0);
            if (this.tcpBuffer.length >= 2 + len) {
                const packet = this.tcpBuffer.slice(2, 2 + len);
                this.tcpBuffer = this.tcpBuffer.slice(2 + len);
                this.processIncomingPacket(packet);
            } else {
                break; // Wait for more data
            }
        }
    }

    private processIncomingPacket(msg: Buffer) {
        const firstByte = msg.readUInt8(0);
        const opcode = firstByte >> 3;

        if (opcode === Opcode.P_DATA_V1 || opcode === Opcode.P_DATA_V2) {
            this.handleDataChannelPacket(msg);
        } else {
            this.controlChannel.handlePacket(msg);
        }
    }

    private setupControlChannel() {
        this.controlChannel.on('send', (buffer: Buffer) => {
            this.sendRawPacket(buffer);
        });
        // Note: VirtualTransport subscribes to controlChannel 'data' itself and
        // frames TLS records. Do NOT also push raw data here — it causes duplicate
        // ServerHello and OpenSSL throws "unexpected message".
    }

    public connect() {
        const remote = this.config.remote[0];
        console.log(`Connecting to ${remote.host}:${remote.port}...`);

        if (this.tcpSocket) {
            this.tcpSocket.connect(remote.port, remote.host, () => {
                console.log('TCP Connected to Server');
                this.controlChannel.start();
            });
        }
        else {
            this.controlChannel.start();
        }

        const options: tls.ConnectionOptions = {
            socket: this.virtualTransport,
            checkServerIdentity: () => undefined,
            minVersion: 'TLSv1.2',
            maxVersion: 'TLSv1.3',
            rejectUnauthorized: false,
        };

        if (this.config.cert) options.cert = this.config.cert;
        if (this.config.key) options.key = this.config.key;

        this.tlsSocket = tls.connect(options, () => { // This is 'secureConnect'
            const cipher = this.tlsSocket?.getCipher();
            const proto = this.tlsSocket?.getProtocol();
            console.log(`TLS Handshake established! proto=${proto} cipher=${cipher?.name} kx=${(cipher as any)?.standardName}`);
            this.onTlsSecure();
        });

        this.tlsSocket.on('secureConnect', () => {
            console.log('TLS secureConnect Event emitted');
        });

        this.tlsSocket.on('keylog', (line) => {
            console.log('TLS Keylog:', line.toString('utf8').trim());
        });

        this.tlsSocket.on('error', (err) => {
            console.error('TLS Error:', err);
        });

        this.tlsSocket.on('data', (data: Buffer) => {
            console.log(`TLS RX ${data.length} bytes: ${data.slice(0, Math.min(32, data.length)).toString('hex')}...`);
            this.tlsRecvBuffer = Buffer.concat([this.tlsRecvBuffer, data]);
            this.processTlsData();
        });
    }

    private onTlsSecure() {
        if (this.clientPreMaster) return;

        console.log('TLS secure. Sending Key Method 2 payload (2.6 style)...');

        const preMaster = crypto.randomBytes(48);
        const random1 = crypto.randomBytes(32);
        const random2 = crypto.randomBytes(32);
        this.clientPreMaster = preMaster;
        this.clientRandom1 = random1;
        this.clientRandom2 = random2;

        const cipherName = (this.config.cipher || 'AES-128-CBC').toUpperCase();

        // peer-info matches stock OpenVPN 2.6.x (ssl.c:2046 push_peer_info)
        // minus compression — we don't implement compstub, so we explicitly
        // don't advertise IV_COMP_*. The server will not push a compress
        // directive that we don't announce support for.
        const peerInfoStr =
            `IV_VER=2.6.16\n` +
            `IV_PLAT=linux\n` +
            `IV_TCPNL=1\n` +
            `IV_MTU=1600\n` +
            `IV_NCP=2\n` +
            `IV_CIPHERS=AES-256-GCM:AES-128-GCM:CHACHA20-POLY1305:${cipherName}\n` +
            `IV_PROTO=${this.iv_proto}\n`;

        // Prepare optional username/password. Some commercial VPNs
        // (NordVPN, ProtonVPN, …) gate access with auth-user-pass; leave
        // empty for VPN Gate / cert-only servers.
        const creds = this.config.authUserPass;
        const userStr = creds?.username || '';
        const passStr = creds?.password || '';

        const keyMsg = Buffer.concat([
            Buffer.alloc(4),                          // leading uint32=0
            Buffer.from([0x02]),                      // key_method=2
            preMaster,
            random1,
            random2,
            encodeString(''),                         // options string (empty)
            encodeString(userStr),                    // username
            encodeString(passStr),                    // password
            encodeString(peerInfoStr),                // peer_info
        ]);

        this.tlsSocket?.write(keyMsg);
        console.log(`Sent Key Method 2 client payload: ${keyMsg.length} bytes (user=${userStr ? userStr : '(empty)'} auth=${creds?.required ? 'required' : 'cert-only'})`);
    }

    private processTlsData() {
        if (!this.serverKeyMaterialReceived) {
            console.log(`  processTlsData FULL DUMP (${this.tlsRecvBuffer.length}B): ${this.tlsRecvBuffer.toString('hex')}`);
            // VPN Gate / SoftEther server omits the 48-byte pre_master field.
            // Layout: [4 zeros] [1 flags] [32 rand1] [32 rand2] [2 opts_len] [opts\0] [...]
            const minNoPre = 4 + 1 + 32 + 32 + 2;
            if (this.tlsRecvBuffer.length < minNoPre) return;

            const tryParse = (hasPreMaster: boolean): boolean => {
                let off = 4;
                if (this.tlsRecvBuffer[off] !== 0x02) return false;
                off += 1;
                if (hasPreMaster) off += 48;
                off += 32 + 32; // random1 + random2
                if (this.tlsRecvBuffer.length < off + 2) return false;
                const optsLen = this.tlsRecvBuffer.readUInt16BE(off);
                off += 2;
                if (optsLen > 2048 || optsLen < 4) return false;
                if (this.tlsRecvBuffer.length < off + optsLen) return false;
                const opts = this.tlsRecvBuffer.slice(off, off + optsLen).toString('ascii').replace(/\0+$/, '');
                return opts.startsWith('V4,');
            };

            let hasPreMaster: boolean;
            if (tryParse(false)) hasPreMaster = false;
            else if (tryParse(true)) hasPreMaster = true;
            else {
                console.log(`  processTlsData: format not recognized yet, bufLen=${this.tlsRecvBuffer.length}`);
                return;
            }

            let off = 4 + 1;
            if (hasPreMaster) off += 48;
            const serverRandom1 = this.tlsRecvBuffer.slice(off, off + 32); off += 32;
            const serverRandom2 = this.tlsRecvBuffer.slice(off, off + 32); off += 32;
            const optsLen = this.tlsRecvBuffer.readUInt16BE(off); off += 2;
            const optsBytes = this.tlsRecvBuffer.slice(off, off + optsLen);
            off += optsLen;
            const serverOptions = optsBytes.toString('ascii').replace(/\0+$/, '');
            console.log(`  Server Options (preMaster=${hasPreMaster ? 'included' : 'omitted'}): "${serverOptions}"`);

            this.tlsRecvBuffer = this.tlsRecvBuffer.slice(off);
            this.serverKeyMaterialReceived = true;

            this.deriveKeys(serverRandom1, serverRandom2);
            this.emit('data-channel-ready');
            // Don't start keepalives yet — wait for PUSH_REPLY to complete
            // the NCP negotiation, so our first data packet uses the final
            // negotiated cipher and peer-id.

            const pushReq = Buffer.from('PUSH_REQUEST\0', 'ascii');
            this.tlsSocket?.write(pushReq);
            console.log(`  Sent PUSH_REQUEST`);
        }

        // Remaining bytes are control messages (null-terminated ASCII)
        while (this.tlsRecvBuffer.length > 0) {
            // Skip leading NULs (padding from server's KM2 reply)
            while (this.tlsRecvBuffer.length > 0 && this.tlsRecvBuffer[0] === 0) {
                this.tlsRecvBuffer = this.tlsRecvBuffer.slice(1);
            }
            if (this.tlsRecvBuffer.length === 0) break;
            const idx = this.tlsRecvBuffer.indexOf(0);
            if (idx < 0) break;
            const msg = this.tlsRecvBuffer.slice(0, idx).toString('ascii');
            this.tlsRecvBuffer = this.tlsRecvBuffer.slice(idx + 1);
            console.log(`  Control Msg: ${msg}`);
            if (msg.startsWith('PUSH_REPLY')) this.applyPushReply(msg);
            this.emit('control-message', msg);
        }
    }

    // Cache of KM2 randoms, reused if PUSH_REPLY tells us to switch derivation path.
    private derivationState?: {
        serverRandom1: Buffer;
        serverRandom2: Buffer;
    };

    private deriveKeys(serverRandom1: Buffer, serverRandom2: Buffer) {
        this.derivationState = { serverRandom1, serverRandom2 };
        // Initial derivation path: if we advertised TLS_KEY_EXPORT (bit 3),
        // a 2.4/2.5-era server will silently use TLS-EKM based on our bit
        // alone (no push signal), so match that preemptively. If the peer is
        // OpenVPN 2.6+, PUSH_REPLY may explicitly push `protocol-flags` —
        // `applyPushReply` below can then flip us to/from EKM if needed.
        const useEkm = (this.iv_proto & (1 << 3)) !== 0;
        this.computeKeyBlock(useEkm);
        this.keyBlockIsEkm = useEkm;
        this.rebuildSecurityContext(
            (this.config.cipher || 'AES-128-CBC').toUpperCase(),
            (this.config.auth || 'SHA1').toUpperCase(),
            0,
            true,
        );
    }

    /**
     * Compute the 256-byte key block via either TLS-EKM or the legacy
     * MD5/SHA1 PRF. Does NOT touch the security context — call
     * rebuildSecurityContext() afterwards to re-slice.
     */
    private computeKeyBlock(useEkm: boolean) {
        if (!this.clientPreMaster || !this.clientRandom1 || !this.clientRandom2) return;
        if (!this.derivationState) return;
        const { serverRandom1, serverRandom2 } = this.derivationState;

        const localSid = this.controlChannel.getLocalSessionId();
        const remoteSid = this.controlChannel.getRemoteSessionId();
        if (!remoteSid) {
            console.error('[keys] cannot derive: no remote session ID yet');
            return;
        }

        if (useEkm) {
            const tlsAny = this.tlsSocket as any;
            if (!tlsAny || typeof tlsAny.exportKeyingMaterial !== 'function') {
                console.warn('[keys] server asked for TLS-EKM but exportKeyingMaterial not available; falling back to legacy PRF');
                useEkm = false;
            } else {
                this.keyBlock = tlsAny.exportKeyingMaterial(256, 'EXPORTER-OpenVPN-datakeys');
                console.log(`[keys] derived via TLS-EKM`);
            }
        }
        if (!useEkm) {
            const masterSeed = Buffer.concat([this.clientRandom1, serverRandom1]);
            const master = OpenVPNCrypto.prf(this.clientPreMaster, 'OpenVPN master secret', masterSeed, 48);
            const expSeed = Buffer.concat([this.clientRandom2, serverRandom2, localSid, remoteSid]);
            this.keyBlock = OpenVPNCrypto.prf(master, 'OpenVPN key expansion', expSeed, 256);
            console.log(`[keys] derived via legacy MD5/SHA1 PRF`);
        }
    }

    /**
     * Slice the PRF-derived 256-byte key block for the given cipher/auth.
     * Called once after KM2 with the .ovpn cipher, and again when PUSH_REPLY
     * negotiates a different cipher via NCP (typical with NordVPN: CBC → GCM).
     *
     * Key-block layout (fixed, per OpenVPN key_direction_state_init w/
     * KEY_DIRECTION_NORMAL for a client):
     *   bytes   0..63  — key0 cipher (TX)
     *   bytes  64..127 — key0 HMAC   (TX + first 8 B used as GCM implicit IV)
     *   bytes 128..191 — key1 cipher (RX)
     *   bytes 192..255 — key1 HMAC   (RX + first 8 B used as GCM implicit IV)
     */
    private rebuildSecurityContext(cipherName: string, authName: string, peerId: number, resetPacketId: boolean) {
        if (!this.keyBlock) return;
        const isGcm = cipherName.endsWith('GCM');

        let cipherKeyLen = 16;
        if (cipherName.includes('256')) cipherKeyLen = 32;
        else if (cipherName.includes('192')) cipherKeyLen = 24;

        let hmacKeyLen = 20;
        if (authName === 'SHA256') hmacKeyLen = 32;
        else if (authName === 'SHA384') hmacKeyLen = 48;
        else if (authName === 'SHA512') hmacKeyLen = 64;
        else if (authName === 'MD5') hmacKeyLen = 16;

        const encCipherKey = this.keyBlock.slice(0, cipherKeyLen);
        const encHmacKey   = this.keyBlock.slice(64, 64 + hmacKeyLen);
        const decCipherKey = this.keyBlock.slice(128, 128 + cipherKeyLen);
        const decHmacKey   = this.keyBlock.slice(192, 192 + hmacKeyLen);

        const encIv = isGcm ? this.keyBlock.slice(64, 72) : Buffer.alloc(0);
        const decIv = isGcm ? this.keyBlock.slice(192, 200) : Buffer.alloc(0);

        const prevPid = resetPacketId ? 1 : (this.securityContext?.packetId ?? 1);
        this.securityContext = {
            encCipherKey, encHmacKey, encIv,
            decCipherKey, decHmacKey, decIv,
            packetId: prevPid,
            cipher: cipherName,
            auth: authName,
            peerId,
        };

        console.log(`[data-plane] cipher=${cipherName} auth=${authName} peer-id=${peerId} cipherKeyLen=${cipherKeyLen} hmacKeyLen=${hmacKeyLen}${isGcm ? ' (AEAD)' : ''}`);
    }

    /**
     * Apply NCP settings from PUSH_REPLY. Called by processTlsData when the
     * server's PUSH_REPLY is parsed.  If the negotiated cipher differs from
     * the .ovpn default, we re-slice the PRF key block (no new PRF run is
     * needed — OpenVPN's 256-byte block is cipher-agnostic).
     */
    private applyPushReply(msg: string) {
        if (!this.keyBlock) return;

        // Parse compression mode. NordVPN's OCC has `comp-lzo` as its base
        // (meaning LZO framing is enabled at daemon level) but pushes
        // `comp-lzo no` to disable LZO itself. In OpenVPN 2.x, `comp-lzo`
        // with value "no" means LZO is OFF, but the 1-byte framing prefix
        // (0xFA no-compress) is still used. Only `comp-lzo adaptive` or a
        // missing `comp-lzo` baseline means no framing.
        // See openvpn/src/openvpn/comp.c for the matrix.
        const compLzoMatch = msg.match(/(?:^|,)\s*comp-lzo(?:\s+([^,]+))?/);
        const compressMatch = msg.match(/(?:^|,)\s*compress(?:\s+([^,]+))?/);
        if (compressMatch) {
            const arg = (compressMatch[1] || '').trim();
            this.compressionMode = arg === 'stub-v2' ? 'stub-v2' : (arg === '' || arg === 'stub' ? 'stub' : 'stub');
        } else if (compLzoMatch) {
            // `comp-lzo` baseline means LZO framing is active on the wire.
            this.compressionMode = 'stub';
        } else {
            this.compressionMode = 'none';
        }
        console.log(`[comp] compression mode = ${this.compressionMode}`);

        const cipherMatch = msg.match(/(?:^|,)\s*cipher\s+([A-Za-z0-9-]+)/);
        const peerIdMatch = msg.match(/(?:^|,)\s*peer-id\s+(\d+)/);
        const cipher = cipherMatch ? cipherMatch[1].toUpperCase() : (this.securityContext?.cipher || (this.config.cipher || 'AES-128-CBC').toUpperCase());
        const peerId = peerIdMatch ? parseInt(peerIdMatch[1], 10) : (this.securityContext?.peerId ?? 0);
        const auth   = (this.config.auth || 'SHA1').toUpperCase();

        // Resolve server's key-derivation choice from PUSH_REPLY.  Per
        // openvpn/src/openvpn/push.c:660-694, a 2.6+ server signals EKM via
        //   protocol-flags ... tls-ekm ...     (new style, bundled with cc-exit)
        //   key-derivation tls-ekm             (fallback for 2.5-compat peers)
        // A 2.6+ server that disabled EKM sends `protocol-flags` WITHOUT
        // tls-ekm, in which case we must drop back to legacy PRF. An older
        // (2.4/2.5) server sends no protocol-flags at all, and the choice is
        // driven purely by our IV_PROTO bit 3 — nothing to override here.
        const pfMatch = msg.match(/(?:^|,)\s*protocol-flags\s+([^,]+)/);
        const keyDerivMatch = msg.match(/(?:^|,)\s*key-derivation\s+([^,]+)/);
        let wantsEkm = this.keyBlockIsEkm;     // default: keep what we chose
        if (pfMatch) {
            wantsEkm = /\btls-ekm\b/.test(pfMatch[1]);
        } else if (keyDerivMatch) {
            wantsEkm = keyDerivMatch[1].trim() === 'tls-ekm';
        }

        if (wantsEkm !== this.keyBlockIsEkm) {
            console.log(`[keys] PUSH_REPLY flipping derivation: ${this.keyBlockIsEkm ? 'EKM' : 'PRF'} → ${wantsEkm ? 'EKM' : 'PRF'}`);
            this.computeKeyBlock(wantsEkm);
            this.keyBlockIsEkm = wantsEkm;
        }

        const prev = this.securityContext;
        const changed = !prev || prev.cipher !== cipher || prev.peerId !== peerId;
        if (changed) {
            console.log(`[NCP] PUSH_REPLY negotiated cipher=${cipher} peer-id=${peerId} (was cipher=${prev?.cipher}, peer-id=${prev?.peerId})`);
            this.rebuildSecurityContext(cipher, auth, peerId, true);
        }
        // Data plane is now fully negotiated; start keepalive.
        this.startKeepalive();
    }
    private keyBlockIsEkm = false;

    private startKeepalive() {
        if (this.keepaliveTimer) return;
        // Send OpenVPN data-channel ping every 3 seconds
        this.keepaliveTimer = setInterval(() => {
            if (this.securityContext) {
                this.sendDataPacket(OpenVPNClient.PING_MAGIC);
            }
        }, 3000);
    }

    public stop() {
        if (this.keepaliveTimer) {
            clearInterval(this.keepaliveTimer);
            this.keepaliveTimer = undefined;
        }
        this.controlChannel.stop();
        try { this.tlsSocket?.destroy(); } catch {}
        try { this.tcpSocket?.destroy(); } catch {}
        try { this.udpSocket?.close(); } catch {}
    }

    public sendDataPacket(ipPacket: Buffer) {
        if (!this.securityContext) return;

        const ctx = this.securityContext;
        const cipherName = ctx.cipher;
        const isGcm = cipherName.endsWith('GCM');
        const keyId = 0;

        // Compression framing. When the server pushed `comp-lzo` (not
        // `comp-lzo no`) or `compress stub`, every data-plane plaintext has
        // a 1-byte prefix:
        //   0xFA = no compression, payload follows as-is
        // (per openvpn/src/openvpn/compstub.c:stub_compress + comp.h
        //  NO_COMPRESS_BYTE). This happens BEFORE encryption.
        if (this.compressionMode === 'stub') {
            ipPacket = Buffer.concat([Buffer.from([0xFA]), ipPacket]);
        } else if (this.compressionMode === 'stub-v2') {
            // stub-v2: only prepend if first byte happens to be 0x50 (the
            // indicator byte). Otherwise send raw.
            if (ipPacket.length > 0 && ipPacket[0] === 0x50) {
                ipPacket = Buffer.concat([Buffer.from([0x50, 0x00]), ipPacket]);
            }
        }

        if (isGcm) {
            // Per OpenVPN 2.6 crypto.c:openvpn_encrypt_aead + forward.c:process_outgoing_link:
            //   For P_DATA_V2, tls_prepend_opcode_v2 prepends [op|kid][peer-id]
            //   to the work buffer BEFORE openvpn_encrypt is called. Then
            //   encryption writes pid, reserves tag space, and hashes the
            //   first (work_len - tag_len) bytes as AAD.
            //   Resulting wire format: [op|kid(1)] [peer-id(3)] [pid(4)] [tag(16)] [ciphertext(N)]
            //   AAD  = [op|kid(1)] [peer-id(3)] [pid(4)]  (8 bytes)
            //   nonce(12) = [pid(4)] [implicit_iv(8, = key_block[64..72])]
            const header = Buffer.alloc(4);
            header[0] = (Opcode.P_DATA_V2 << 3) | keyId;
            header.writeUIntBE(ctx.peerId & 0xffffff, 1, 3);

            const pidBuf = Buffer.alloc(4);
            pidBuf.writeUInt32BE(ctx.packetId, 0);
            const aad = Buffer.concat([header, pidBuf]);

            const { ciphertext, tag } = OpenVPNCrypto.encryptGcm(ipPacket, ctx.encCipherKey, ctx.encIv, ctx.packetId, aad);
            const packet = Buffer.concat([header, pidBuf, tag, ciphertext]);
            ctx.packetId++;
            this.sendRawPacket(packet);
        } else {
            // CBC + HMAC. Two variants, depending on whether the server
            // assigned a peer-id (NCP on modern servers):
            //   P_DATA_V1: [op|kid(1)]             [hmac(N)] [iv(16)] [cipher(N)]
            //   P_DATA_V2: [op|kid(1)] [peer-id(3)] [hmac(N)] [iv(16)] [cipher(N)]
            // HMAC covers just [iv][cipher] — NOT the opcode+peer-id header.
            // (OpenVPN prepends peer-id AFTER computing the HMAC.)
            const useV2 = ctx.peerId > 0;
            const header = useV2
                ? (() => { const b = Buffer.alloc(4); b[0] = (Opcode.P_DATA_V2 << 3) | keyId; b.writeUIntBE(ctx.peerId & 0xffffff, 1, 3); return b; })()
                : Buffer.from([(Opcode.P_DATA_V1 << 3) | keyId]);
            const iv = crypto.randomBytes(16);
            const pidBuf = Buffer.alloc(4); pidBuf.writeUInt32BE(ctx.packetId, 0);
            const plaintext = Buffer.concat([pidBuf, ipPacket]);
            const ciphertext = OpenVPNCrypto.encryptCbc(plaintext, ctx.encCipherKey, iv, cipherName);
            const hmac = OpenVPNCrypto.calculateHmac(Buffer.concat([iv, ciphertext]), ctx.encHmacKey, ctx.auth);
            const packet = Buffer.concat([header, hmac, iv, ciphertext]);
            ctx.packetId++;
            this.sendRawPacket(packet);
        }
    }

    private sendRawPacket(packet: Buffer) {
        if (this.tcpSocket) {
            const lenBuf = Buffer.alloc(2);
            lenBuf.writeUInt16BE(packet.length, 0);
            console.log(`TCP TX: Packet len=${packet.length} Hex=${packet.toString('hex')}`);
            this.tcpSocket.write(Buffer.concat([lenBuf, packet]));
        } else if (this.udpSocket) {
            const remote = this.config.remote[0];
            if (!remote) return;
            // `send` auto-binds on first call. Callback surfaces kernel-level
            // errors (ENETUNREACH, EMSGSIZE, etc.) that otherwise never hit
            // the 'error' handler.
            this.udpSocket.send(packet, remote.port, remote.host, (err) => {
                if (err) console.error(`UDP TX failed (${remote.host}:${remote.port}):`, err.message);
            });
            console.log(`UDP TX: Packet len=${packet.length} Hex=${packet.toString('hex')}`);
        }
    }

    private handleDataChannelPacket(buffer: Buffer) {
        if (!this.securityContext) return;
        const ctx = this.securityContext;
        const isGcm = ctx.cipher.endsWith('GCM');

        if (isGcm) {
            // Inverse of TX format: [op|kid(1)][peer-id(3)(V2 only)][pid(4)][tag(16)][ciphertext(N)]
            const opcode = buffer[0] >> 3;
            let headerLen: number;
            if (opcode === Opcode.P_DATA_V2)      headerLen = 4;
            else if (opcode === Opcode.P_DATA_V1) headerLen = 1;
            else return;
            if (buffer.length < headerLen + 4 + 16) return;

            const pidBuf = buffer.slice(headerLen, headerLen + 4);
            const tag = buffer.slice(headerLen + 4, headerLen + 20);
            const ciphertext = buffer.slice(headerLen + 20);
            const packetId = pidBuf.readUInt32BE(0);
            // AAD = [opcode][peer-id(if V2)][pid]
            const aad = Buffer.concat([buffer.slice(0, headerLen), pidBuf]);

            try {
                const plaintext = OpenVPNCrypto.decryptGcm(ciphertext, ctx.decCipherKey, ctx.decIv, packetId, tag, aad);
                this.emitIpPacket(plaintext);
            } catch (e) {
                console.error(`Decrypt GCM failed (pid=${packetId}): ${(e as Error).message}`);
            }
        } else {
            const opcode = buffer[0] >> 3;
            const headerLen = opcode === Opcode.P_DATA_V2 ? 4 : 1;

            let hmacLen = 20;
            if (ctx.auth === 'SHA256') hmacLen = 32;
            else if (ctx.auth === 'SHA384') hmacLen = 48;
            else if (ctx.auth === 'SHA512') hmacLen = 64;
            else if (ctx.auth === 'MD5') hmacLen = 16;

            if (buffer.length < headerLen + hmacLen + 16) return;
            const rxHmac = buffer.slice(headerLen, headerLen + hmacLen);
            const iv = buffer.slice(headerLen + hmacLen, headerLen + hmacLen + 16);
            const ciphertext = buffer.slice(headerLen + hmacLen + 16);

            const expectedHmac = OpenVPNCrypto.calculateHmac(Buffer.concat([iv, ciphertext]), ctx.decHmacKey, ctx.auth);
            if (!expectedHmac.equals(rxHmac)) {
                console.error(`Data HMAC mismatch. got=${rxHmac.toString('hex')} expected=${expectedHmac.toString('hex')}`);
                return;
            }
            try {
                const plaintext = OpenVPNCrypto.decryptCbc(ciphertext, ctx.decCipherKey, iv, ctx.cipher);
                if (plaintext.length > 4) this.emitIpPacket(plaintext.slice(4));
            } catch (e) {
                console.error('Decrypt CBC failed', (e as Error).message);
            }
        }
    }

    private emitIpPacket(ipPacket: Buffer) {
        if (ipPacket.length === 0) return;
        // Strip compression framing added by the peer (compstub.c decompress):
        //   0xFA → raw follows (no-compression marker)
        //   0xFB → swap version: 0xFB replaced last byte of payload
        //   0x50 then 0x00 → stub-v2 indicator (0x00 = uncompressed)
        if (this.compressionMode === 'stub' && ipPacket[0] === 0xFA) {
            ipPacket = ipPacket.slice(1);
        } else if (this.compressionMode === 'stub-v2' && ipPacket.length >= 2 && ipPacket[0] === 0x50 && ipPacket[1] === 0x00) {
            ipPacket = ipPacket.slice(2);
        }
        if (ipPacket.length === 16 && ipPacket.equals(OpenVPNClient.PING_MAGIC)) {
            return; // keepalive, silently consume
        }
        this.emit('ip-packet', ipPacket);
    }
}
