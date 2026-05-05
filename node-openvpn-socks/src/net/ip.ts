export class IpPacket {
    static Protocol = {
        ICMP: 1,
        TCP: 6,
        UDP: 17,
    };

    static parse(buffer: Buffer) {
        const version = (buffer[0] >> 4) & 0xF;
        const ihl = buffer[0] & 0xF;
        const headerLen = ihl * 4;
        const totalLength = buffer.readUInt16BE(2);
        const protocol = buffer[9];
        const srcIp = buffer.slice(12, 16);
        const dstIp = buffer.slice(16, 20);
        
        return {
            version,
            headerLen,
            totalLength,
            protocol,
            srcIp: IpPacket.formatIp(srcIp),
            dstIp: IpPacket.formatIp(dstIp),
            payload: buffer.slice(headerLen, totalLength)
        };
    }
    
    static formatIp(buf: Buffer): string {
        return `${buf[0]}.${buf[1]}.${buf[2]}.${buf[3]}`;
    }
    
    static create(protocol: number, srcIp: string, dstIp: string, payload: Buffer): Buffer {
        // Minimal IPv4 header creation
        const header = Buffer.alloc(20);
        header[0] = 0x45; // Version 4, IHL 5
        header.writeUInt16BE(20 + payload.length, 2); // Total Length
        header.writeUInt16BE(Math.floor(Math.random() * 65535), 4); // ID
        header[8] = 64; // TTL
        header[9] = protocol;
        
        const srcParts = srcIp.split('.').map(Number);
        const dstParts = dstIp.split('.').map(Number);
        
        header[12] = srcParts[0]; header[13] = srcParts[1]; header[14] = srcParts[2]; header[15] = srcParts[3];
        header[16] = dstParts[0]; header[17] = dstParts[1]; header[18] = dstParts[2]; header[19] = dstParts[3];
        
        // Checksum calculation (Header only)
        const checksum = IpPacket.calculateChecksum(header);
        header.writeUInt16BE(checksum, 10);
        
        return Buffer.concat([header, payload]);
    }
    
    static calculateChecksum(buffer: Buffer): number {
        let sum = 0;
        for (let i = 0; i < buffer.length; i += 2) {
            if (i === 10) continue; // Skip checksum field itself
            sum += buffer.readUInt16BE(i);
        }
        while (sum >> 16) {
            sum = (sum & 0xFFFF) + (sum >> 16);
        }
        return ~sum & 0xFFFF;
    }
}
