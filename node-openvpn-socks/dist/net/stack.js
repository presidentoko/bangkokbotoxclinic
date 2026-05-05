"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkStack = void 0;
const events_1 = require("events");
const virtual_socket_1 = require("./virtual_socket");
const ip_1 = require("./ip");
const tcp_1 = require("./tcp");
const udp_1 = require("./udp");
class NetworkStack extends events_1.EventEmitter {
    constructor(localIp = '10.8.0.2') {
        super();
        this.localIp = localIp;
        // NAT Table: Key = "srcPort" (since we only have one srcIP usually) -> Socket
        // Or better: Key = "dstIp:dstPort:srcPort"
        this.sockets = new Map();
        this.nextPort = 10000;
    }
    setLocalIp(ip) {
        this.localIp = ip;
    }
    getLocalIp() {
        return this.localIp;
    }
    createConnection(dstIp, dstPort, appSocket) {
        const srcPort = this.nextPort++;
        if (this.nextPort > 60000)
            this.nextPort = 10000;
        const socket = new virtual_socket_1.VirtualTcpSocket(this.localIp, srcPort, dstIp, dstPort, appSocket);
        const key = this.getHash(dstIp, dstPort, srcPort);
        this.sockets.set(key, socket);
        socket.on('output', (tcpBuffer) => {
            // Wrap in IP
            const ipPacket = ip_1.IpPacket.create(ip_1.IpPacket.Protocol.TCP, this.localIp, dstIp, tcpBuffer);
            this.emit('output', ipPacket);
        });
        socket.on('close', () => {
            this.sockets.delete(key);
        });
        socket.on('connected', () => {
            // SOCKS5 might need to know when connected
            // But we handle that in appSocket logic probably or via callback
        });
        socket.connect();
        return socket;
    }
    sendUdp(srcPort, dstIp, dstPort, data) {
        const udpPacket = udp_1.UdpPacket.create(srcPort, dstPort, data, this.localIp, dstIp);
        const ipPacket = ip_1.IpPacket.create(ip_1.IpPacket.Protocol.UDP, this.localIp, dstIp, udpPacket);
        this.emit('output', ipPacket);
    }
    handleIpPacket(buffer) {
        try {
            const ip = ip_1.IpPacket.parse(buffer);
            if (ip.dstIp !== this.localIp) {
                console.log(`  [netStack] drop: dst=${ip.dstIp} localIp=${this.localIp} proto=${ip.protocol} src=${ip.srcIp}`);
                return;
            }
            if (ip.protocol === ip_1.IpPacket.Protocol.TCP) {
                const tcp = tcp_1.TcpPacket.parse(ip.payload);
                const key = this.getHash(ip.srcIp, tcp.srcPort, tcp.dstPort);
                const socket = this.sockets.get(key);
                if (socket) {
                    socket.handlePacket(tcp);
                }
                else {
                    console.log(`  [netStack] unknown TCP socket key=${key}`);
                }
            }
            else if (ip.protocol === ip_1.IpPacket.Protocol.UDP) {
                const udp = udp_1.UdpPacket.parse(ip.payload);
                console.log(`  [netStack] UDP ${ip.srcIp}:${udp.srcPort} -> ${ip.dstIp}:${udp.dstPort} len=${udp.payload.length}`);
                this.emit('udp', udp.payload, udp.srcPort, udp.dstPort, ip.srcIp);
            }
        }
        catch (e) {
            console.error('Error parsing IP packet', e);
        }
    }
    getHash(remoteIp, remotePort, localPort) {
        return `${remoteIp}:${remotePort}:${localPort}`;
    }
}
exports.NetworkStack = NetworkStack;
