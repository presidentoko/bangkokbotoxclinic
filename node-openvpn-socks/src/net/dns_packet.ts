export class DnsPacket {
    static Type = {
        A: 1,
        CNAME: 5,
        TXT: 16,
        AAAA: 28,
    };

    static Class = {
        IN: 1,
    };

    static createQuery(id: number, hostname: string): Buffer {
        const header = Buffer.alloc(12);
        header.writeUInt16BE(id, 0); // ID
        header.writeUInt16BE(0x0100, 2); // Flags: RD (Recursion Desired)
        header.writeUInt16BE(1, 4); // QDCOUNT: 1
        header.writeUInt16BE(0, 6); // ANCOUNT
        header.writeUInt16BE(0, 8); // NSCOUNT
        header.writeUInt16BE(0, 10); // ARCOUNT

        const question = DnsPacket.encodeName(hostname);
        const typeClass = Buffer.alloc(4);
        typeClass.writeUInt16BE(DnsPacket.Type.A, 0);
        typeClass.writeUInt16BE(DnsPacket.Class.IN, 2);

        return Buffer.concat([header, question, typeClass]);
    }

    static parseResponse(buffer: Buffer) {
        const id = buffer.readUInt16BE(0);
        const flags = buffer.readUInt16BE(2);
        const qdcount = buffer.readUInt16BE(4);
        const ancount = buffer.readUInt16BE(6);

        let offset = 12;

        // Skip Questions
        for (let i = 0; i < qdcount; i++) {
            const { length } = DnsPacket.decodeName(buffer, offset);
            offset += length;
            offset += 4; // Type + Class
        }

        const answers: string[] = [];

        // Parse Answers
        for (let i = 0; i < ancount; i++) {
            // Name (pointer or label)
            const { length: nameLen } = DnsPacket.decodeName(buffer, offset);
            offset += nameLen;

            const type = buffer.readUInt16BE(offset);
            offset += 2;
            const cls = buffer.readUInt16BE(offset);
            offset += 2;
            const ttl = buffer.readUInt32BE(offset);
            offset += 4;
            const dataLen = buffer.readUInt16BE(offset);
            offset += 2;

            if (type === DnsPacket.Type.A && dataLen === 4) {
                const ip = `${buffer[offset]}.${buffer[offset + 1]}.${buffer[offset + 2]}.${buffer[offset + 3]}`;
                answers.push(ip);
            }

            offset += dataLen;
        }

        return { id, answers };
    }

    private static encodeName(name: string): Buffer {
        const parts = name.split('.');
        const buffers: Buffer[] = [];
        for (const part of parts) {
            const buf = Buffer.alloc(1 + part.length);
            buf.writeUInt8(part.length, 0);
            buf.write(part, 1);
            buffers.push(buf);
        }
        buffers.push(Buffer.from([0])); // Root label
        return Buffer.concat(buffers);
    }

    private static decodeName(buffer: Buffer, offset: number): { name: string, length: number } {
        // Simplified decoder (doesn't fully handle pointers yet for questions, but usually pointer is 0xC0)
        // For standard query response, question is usually plain labels.
        // Pointers are common in Answers.

        let current = offset;
        let labels: string[] = [];
        let jumped = false;
        let length = 0; // Length in linear bytes consumed (if jumped, stops counting there)

        while (true) {
            const len = buffer.readUInt8(current);
            if (len === 0) {
                if (!jumped) length++;
                break;
            }

            if ((len & 0xC0) === 0xC0) {
                // Pointer
                if (!jumped) length += 2;
                jumped = true;
                const jumpOffset = buffer.readUInt16BE(current) & 0x3FFF;
                current = jumpOffset;
                continue;
            }

            if (!jumped) length += 1 + len;
            current++;
            labels.push(buffer.toString('utf8', current, current + len));
            current += len;
        }

        return { name: labels.join('.'), length };
    }
}
