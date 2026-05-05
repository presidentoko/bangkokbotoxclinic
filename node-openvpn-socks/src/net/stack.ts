import { EventEmitter } from 'events';
import { VirtualTcpSocket } from './virtual_socket';
import { IpPacket } from './ip';
import { TcpPacket } from './tcp';
import { UdpPacket } from './udp';

export class NetworkStack extends EventEmitter {
    // NAT Table: Key = "srcPort" (since we only have one srcIP usually) -> Socket
    // Or better: Key = "dstIp:dstPort:srcPort"
    private sockets: Map<string, VirtualTcpSocket> = new Map();
    private nextPort: number = 10000;

    constructor(private localIp: string = '10.8.0.2') {
        super();
    }

    public setLocalIp(ip: string) {
        this.localIp = ip;
    }

    public getLocalIp(): string {
        return this.localIp;
    }

    public createConnection(dstIp: string, dstPort: number, appSocket: any): VirtualTcpSocket {
        const srcPort = this.nextPort++;
        if (this.nextPort > 60000) this.nextPort = 10000;

        const socket = new VirtualTcpSocket(this.localIp, srcPort, dstIp, dstPort, appSocket);

        const key = this.getHash(dstIp, dstPort, srcPort);
        this.sockets.set(key, socket);

        socket.on('output', (tcpBuffer: Buffer) => {
            // Wrap in IP
            const ipPacket = IpPacket.create(IpPacket.Protocol.TCP, this.localIp, dstIp, tcpBuffer);
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

    public sendUdp(srcPort: number, dstIp: string, dstPort: number, data: Buffer) {
        const udpPacket = UdpPacket.create(srcPort, dstPort, data, this.localIp, dstIp);
        const ipPacket = IpPacket.create(IpPacket.Protocol.UDP, this.localIp, dstIp, udpPacket);
        this.emit('output', ipPacket);
    }

    public handleIpPacket(buffer: Buffer) {
        try {
            const ip = IpPacket.parse(buffer);
            if (ip.dstIp !== this.localIp) {
                console.log(`  [netStack] drop: dst=${ip.dstIp} localIp=${this.localIp} proto=${ip.protocol} src=${ip.srcIp}`);
                return;
            }

            if (ip.protocol === IpPacket.Protocol.TCP) {
                const tcp = TcpPacket.parse(ip.payload);
                const key = this.getHash(ip.srcIp, tcp.srcPort, tcp.dstPort);
                const socket = this.sockets.get(key);
                if (socket) {
                    socket.handlePacket(tcp);
                } else {
                    console.log(`  [netStack] unknown TCP socket key=${key}`);
                }
            } else if (ip.protocol === IpPacket.Protocol.UDP) {
                const udp = UdpPacket.parse(ip.payload);
                console.log(`  [netStack] UDP ${ip.srcIp}:${udp.srcPort} -> ${ip.dstIp}:${udp.dstPort} len=${udp.payload.length}`);
                this.emit('udp', udp.payload, udp.srcPort, udp.dstPort, ip.srcIp);
            }
        } catch (e) {
            console.error('Error parsing IP packet', e);
        }
    }

    private getHash(remoteIp: string, remotePort: number, localPort: number): string {
        return `${remoteIp}:${remotePort}:${localPort}`;
    }
}
