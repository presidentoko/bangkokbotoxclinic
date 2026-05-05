"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UdpPacket = void 0;
class UdpPacket {
    static parse(buffer) {
        const srcPort = buffer.readUInt16BE(0);
        const dstPort = buffer.readUInt16BE(2);
        const length = buffer.readUInt16BE(4);
        const checksum = buffer.readUInt16BE(6);
        return {
            srcPort,
            dstPort,
            length,
            checksum,
            payload: buffer.slice(8)
        };
    }
    static create(srcPort, dstPort, data, srcIp, dstIp) {
        const header = Buffer.alloc(8);
        header.writeUInt16BE(srcPort, 0);
        header.writeUInt16BE(dstPort, 2);
        header.writeUInt16BE(8 + data.length, 4);
        header.writeUInt16BE(0, 6); // Checksum 0 (optional for IPv4, but good to have)
        // Checksum calculation (Pseudo-header + Header + Data)
        // Similar to TCP
        const udpLen = 8 + data.length;
        const pseudoHeader = Buffer.alloc(12);
        const srcParts = srcIp.split('.').map(Number);
        const dstParts = dstIp.split('.').map(Number);
        pseudoHeader[0] = srcParts[0];
        pseudoHeader[1] = srcParts[1];
        pseudoHeader[2] = srcParts[2];
        pseudoHeader[3] = srcParts[3];
        pseudoHeader[4] = dstParts[0];
        pseudoHeader[5] = dstParts[1];
        pseudoHeader[6] = dstParts[2];
        pseudoHeader[7] = dstParts[3];
        pseudoHeader[8] = 0;
        pseudoHeader[9] = 17; // Protocol UDP
        pseudoHeader.writeUInt16BE(udpLen, 10);
        const checksum = UdpPacket.calculateChecksum(Buffer.concat([pseudoHeader, header, data]));
        // If checksum is 0, set to 0xFFFF (UDP spec)
        header.writeUInt16BE(checksum === 0 ? 0xFFFF : checksum, 6);
        return Buffer.concat([header, data]);
    }
    static calculateChecksum(buffer) {
        let sum = 0;
        for (let i = 0; i < buffer.length - 1; i += 2) {
            sum += buffer.readUInt16BE(i);
        }
        if (buffer.length % 2 === 1) {
            sum += buffer[buffer.length - 1] << 8;
        }
        while (sum >> 16) {
            sum = (sum & 0xFFFF) + (sum >> 16);
        }
        return ~sum & 0xFFFF;
    }
}
exports.UdpPacket = UdpPacket;
