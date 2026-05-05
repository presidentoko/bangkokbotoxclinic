import { EventEmitter } from 'events';
import { NetworkStack } from './stack';
import { IpPacket } from './ip';
import { UdpPacket } from './udp';
import { DnsPacket } from './dns_packet';

export class DnsResolver extends EventEmitter {
    private stack: NetworkStack;
    private dnsServer: string = '8.8.8.8'; // Default, should be configurable
    private pendingQueries: Map<number, (ip: string | null) => void> = new Map();

    constructor(stack: NetworkStack) {
        super();
        this.stack = stack;
    }

    public async resolve(hostname: string): Promise<string | null> {
        return new Promise((resolve) => {
            const id = Math.floor(Math.random() * 65535);
            const query = DnsPacket.createQuery(id, hostname);

            // Timeout
            const timeout = setTimeout(() => {
                if (this.pendingQueries.has(id)) {
                    this.pendingQueries.delete(id);
                    console.error('DNS Timeout for ' + hostname);
                    resolve(null);
                }
            }, 5000);

            this.pendingQueries.set(id, (ip) => {
                clearTimeout(timeout);
                resolve(ip);
            });

            // Send UDP Packet via Stack
            // Destination: 8.8.8.8:53
            // Source Ports: 12345 + (id % 1000)
            const srcPort = 12345 + (id % 1000);

            this.stack.sendUdp(srcPort, this.dnsServer, 53, query);
        });
    }

    public handleIncomingDns(buffer: Buffer) {
        try {
            const { id, answers } = DnsPacket.parseResponse(buffer);
            if (this.pendingQueries.has(id)) {
                const callback = this.pendingQueries.get(id)!;
                // Don't delete immediately if multiple answers?
                // Actually standard DNS query/response maps 1-to-1 usually 
                this.pendingQueries.delete(id);
                callback(answers.length > 0 ? answers[0] : null);
            }
        } catch (e) {
            console.error('Error parsing DNS response', e);
        }
    }
}
