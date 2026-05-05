"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsResolver = void 0;
const events_1 = require("events");
const dns_packet_1 = require("./dns_packet");
class DnsResolver extends events_1.EventEmitter {
    constructor(stack) {
        super();
        this.dnsServer = '8.8.8.8'; // Default, should be configurable
        this.pendingQueries = new Map();
        this.stack = stack;
    }
    async resolve(hostname) {
        return new Promise((resolve) => {
            const id = Math.floor(Math.random() * 65535);
            const query = dns_packet_1.DnsPacket.createQuery(id, hostname);
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
    handleIncomingDns(buffer) {
        try {
            const { id, answers } = dns_packet_1.DnsPacket.parseResponse(buffer);
            if (this.pendingQueries.has(id)) {
                const callback = this.pendingQueries.get(id);
                // Don't delete immediately if multiple answers?
                // Actually standard DNS query/response maps 1-to-1 usually 
                this.pendingQueries.delete(id);
                callback(answers.length > 0 ? answers[0] : null);
            }
        }
        catch (e) {
            console.error('Error parsing DNS response', e);
        }
    }
}
exports.DnsResolver = DnsResolver;
