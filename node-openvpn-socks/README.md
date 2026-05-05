# openvpn-socks

Pure-Node.js OpenVPN client that exposes a local **SOCKS5** proxy.

No tun/tap, no native dependencies, no `sudo`. The OpenVPN control channel
(TLS handshake, key exchange), the data channel (AES encryption), and a
small virtual TCP/IP stack all run in user-space JavaScript. Incoming
SOCKS5 connections are translated into raw IP packets inside the tunnel.

```
  curl ──► SOCKS5 :1080 ──► virtual TCP/IP ──► OpenVPN data channel ──► VPN server ──► internet
```

---

## Requirements

- Node.js **≥ 20** (uses built-in `tls`, `crypto`, `dgram`, `net`).
- An OpenVPN `.ovpn` config file for a server using **TCP** transport,
  **AES-128-CBC** cipher, **SHA1** auth, key-method 2. This is the VPN
  Gate / SoftEther profile; other configurations are not guaranteed to
  work yet.

A fresh free server list is available at
[freevpn.gg/api/list.json](https://freevpn.gg/api/list.json). Any entry
can be dropped into an existing VPN Gate `.ovpn` file by changing the
`remote <ip> <port>` line.

---

## Usage

```bash
npm install
npm start -- ./test.ovpn                 # defaults: 127.0.0.1:1080
# or
npx ts-node src/cli.ts ./test.ovpn --port 1080
# or, after `npm run build`:
node dist/cli.js ./test.ovpn --port 1080
```

### CLI options

```
openvpn-socks [options] <config.ovpn>

SOCKS5:
  -p, --port <n>         SOCKS5 port (default: 1080)
  -H, --host <ip>        SOCKS5 bind address (default: 127.0.0.1)

Remote overrides (take precedence over the .ovpn file):
  -r, --remote <h[:p]>   override remote host, optionally with :port
      --remote-port <n>  override remote port only
      --proto <tcp|udp>  override transport protocol

Other:
  -v, --verbose          print OpenVPN protocol details (very noisy)
  -h, --help             show help
```

The remote overrides let you reuse one `.ovpn` file (ca/cert/key inlined)
while pointing at a different server — handy for picking a fresh IP from
[freevpn.gg/api/list.json](https://freevpn.gg/api/list.json) without
editing the config:

```bash
openvpn-socks ./test.ovpn --remote 219.100.37.59:443 --proto tcp
openvpn-socks ./test.ovpn -r 1.2.3.4 --remote-port 995
```

### Testing

```bash
# Start the proxy in one terminal
npm start -- ./test.ovpn --port 1080

# Use it from another
curl -x socks5://127.0.0.1:1080     https://1.1.1.1/
curl -x socks5h://127.0.0.1:1080    https://httpbin.org/ip
# { "origin": "<VPN exit IP>" }
```

`socks5h://` forwards the hostname to the proxy for resolution.
`socks5://` asks the client to resolve locally first. Both work; see
*Limitations* below.

---

## How it works

```
                                  ┌──────────────────────────────┐
  SOCKS5 client ──► Socks5Server ─►│ per-connection VirtualTcpSocket│
                                  └──────────────┬───────────────┘
                                                 │ IP packets
                                                 ▼
                                          NetworkStack
                                                 │ encrypt+HMAC
                                                 ▼
                                      OpenVPNClient (data channel)
                                                 │ TCP frame
                                                 ▼
                                          remote VPN server
```

- [`src/openvpn/client.ts`](src/openvpn/client.ts) — control+data channel,
  TLS handshake, Key Method 2 exchange, PUSH_REPLY parsing, keepalive.
- [`src/openvpn/control.ts`](src/openvpn/control.ts) — reliable control
  channel (packet IDs, ACKs, retransmission).
- [`src/openvpn/transport.ts`](src/openvpn/transport.ts) — `Duplex` bridge
  that framings TLS records between OpenVPN and Node's `tls` module.
- [`src/net/stack.ts`](src/net/stack.ts) — user-space IP demuxer
  (TCP/UDP).
- [`src/net/virtual_socket.ts`](src/net/virtual_socket.ts) — minimal TCP
  state machine (SYN, ACK, FIN; no retransmission, no reordering, no
  window management).
- [`src/socks5/server.ts`](src/socks5/server.ts) — SOCKS5 CONNECT
  handler (no auth).
- [`src/cli.ts`](src/cli.ts) — CLI entry, wires everything together.

---

## Limitations

Read these before assuming this is a drop-in replacement for `openvpn`.

1. **DNS resolution uses the OS resolver**, not the tunnel. VPN Gate
   servers silently drop outbound UDP 53, so tunnel DNS is unreliable.
   This means hostname lookups may leak to the local network. Traffic to
   the resolved IP still goes through the tunnel.
2. **The virtual TCP stack is small, not complete.** It handles
   retransmission (RTO-based), out-of-order receive reordering, MSS
   segmentation, RST, and combined payload+FIN packets — enough to
   proxy real HTTPS traffic reliably. It does **not** implement
   congestion control, SACK, window scaling, or fast retransmit on
   3 dup-ACKs, so throughput will be lower than a production TCP
   stack on high-RTT or lossy paths.
3. **TCP and UDP transport both verified** against VPN Gate servers.
   UDP typically completes the handshake in ~350 ms vs ~800 ms for
   TCP (no reliable-wrapper overhead).
4. **Only AES-128-CBC / SHA1 is verified.** Other ciphers compile but
   have not been tested against a live server.
5. **Server certificate is not verified.** `rejectUnauthorized` is off.
   Safe for casual free VPN use, not safe for trusted workloads.
6. **Shared free servers see leaked traffic.** VPN Gate nodes forward
   packets meant for other clients to us occasionally; you'll see them
   as "unknown TCP socket" drops in verbose logs. Harmless but noisy.

If you need a production-grade VPN client, use the official
[OpenVPN](https://openvpn.net/) binary. This project exists to explore
"how little you really need to speak OpenVPN", and as a building block
for tooling that can't rely on `tun`/`tap`.

---

## License

ISC.
