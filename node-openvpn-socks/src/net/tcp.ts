export class TcpPacket {
    static Flags = {
        FIN: 0x01,
        SYN: 0x02,
        RST: 0x04,
        PSH: 0x08,
        ACK: 0x10,
        URG: 0x20
    };

    static parse(buffer: Buffer) {
        const srcPort = buffer.readUInt16BE(0);
        const dstPort = buffer.readUInt16BE(2);
        const seqNum = buffer.readUInt32BE(4);
        const ackNum = buffer.readUInt32BE(8);
        const offset = (buffer[12] >> 4) * 4;
        const flags = buffer[13];
        const windowSize = buffer.readUInt16BE(14);
        const checksum = buffer.readUInt16BE(16);
        const urgentPointer = buffer.readUInt16BE(18);

        return {
            srcPort, dstPort, seqNum, ackNum, offset, flags, windowSize, checksum, urgentPointer,
            payload: buffer.slice(offset)
        };
    }

    static create(srcPort: number, dstPort: number, seq: number, ack: number, flags: number, window: number, data: Buffer = Buffer.alloc(0), srcIp: string, dstIp: string): Buffer {
        const header = Buffer.alloc(20);
        header.writeUInt16BE(srcPort, 0);
        header.writeUInt16BE(dstPort, 2);
        header.writeUInt32BE(seq, 4);
        header.writeUInt32BE(ack, 8);
        header[12] = 0x50; // Data offset 5 words (20 bytes)
        header[13] = flags;
        header.writeUInt16BE(window, 14);

        // Checksum involves pseudo-header
        const tcpLen = 20 + data.length;
        const pseudoHeader = Buffer.alloc(12);
        const srcParts = srcIp.split('.').map(Number);
        const dstParts = dstIp.split('.').map(Number);

        pseudoHeader[0] = srcParts[0]; pseudoHeader[1] = srcParts[1]; pseudoHeader[2] = srcParts[2]; pseudoHeader[3] = srcParts[3];
        pseudoHeader[4] = dstParts[0]; pseudoHeader[5] = dstParts[1]; pseudoHeader[6] = dstParts[2]; pseudoHeader[7] = dstParts[3];
        pseudoHeader[8] = 0;
        pseudoHeader[9] = 6; // Protocol TCP
        pseudoHeader.writeUInt16BE(tcpLen, 10);

        const checksum = TcpPacket.calculateChecksum(Buffer.concat([pseudoHeader, header, data]));
        header.writeUInt16BE(checksum, 16);

        return Buffer.concat([header, data]);
    }

    static calculateChecksum(buffer: Buffer): number {
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
