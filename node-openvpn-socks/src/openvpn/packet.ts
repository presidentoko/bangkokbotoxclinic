// OpenVPN protocol opcodes (5-bit values, packed into the high 5 bits of the
// 1-byte header, low 3 bits = key_id). Values come from openvpn/src/openvpn/ssl_pkt.h.
export enum Opcode {
    P_CONTROL_HARD_RESET_CLIENT_V1 = 1,
    P_CONTROL_HARD_RESET_SERVER_V1 = 2,
    P_CONTROL_SOFT_RESET_V1        = 3,
    P_CONTROL_V1                   = 4,
    P_ACK_V1                       = 5,
    P_DATA_V1                      = 6,
    P_CONTROL_HARD_RESET_CLIENT_V2 = 7,
    P_CONTROL_HARD_RESET_SERVER_V2 = 8,
    P_DATA_V2                      = 9,
    P_CONTROL_HARD_RESET_CLIENT_V3 = 10,
    P_CONTROL_WKC_V1               = 11,
    // NOTE: there is no P_CONTROL_HARD_RESET_SERVER_V3 — server always
    // replies with SERVER_V2 even to a V3 client reset.
    P_CONTROL_HARD_RESET_SERVER_V3 = 8, // alias for SERVER_V2 (kept for call sites)
}

export interface OpenVPNPacket {
    opcode: Opcode;
    keyId: number;
    sessionId?: Buffer; // 8 bytes
    packetIdArray?: number[]; // Ack packet IDs
    remoteSessionId?: Buffer; // If we know it
    messageId?: number; // Sequence number for reliability
    payload?: Buffer;
}

export function isControlOpcode(opcode: number): boolean {
    // All control-channel opcodes (have session_id + acks). Excludes P_DATA_V1/V2.
    return opcode === Opcode.P_CONTROL_HARD_RESET_CLIENT_V1 ||
           opcode === Opcode.P_CONTROL_HARD_RESET_SERVER_V1 ||
           opcode === Opcode.P_CONTROL_SOFT_RESET_V1 ||
           opcode === Opcode.P_CONTROL_V1 ||
           opcode === Opcode.P_ACK_V1 ||
           opcode === Opcode.P_CONTROL_HARD_RESET_CLIENT_V2 ||
           opcode === Opcode.P_CONTROL_HARD_RESET_SERVER_V2 ||
           opcode === Opcode.P_CONTROL_HARD_RESET_CLIENT_V3 ||
           opcode === Opcode.P_CONTROL_WKC_V1;
}

export class PacketParser {
    static parse(buffer: Buffer): OpenVPNPacket {
        const firstByte = buffer.readUInt8(0);
        const opcode = firstByte >> 3;
        const keyId = firstByte & 0x07;

        let offset = 1;
        const packet: OpenVPNPacket = { opcode, keyId };

        if (!isControlOpcode(opcode)) {
            // Data packet — nothing else to parse in the control framing.
            return packet;
        }

        // Session ID (8 bytes)
        if (buffer.length >= offset + 8) {
            packet.sessionId = buffer.slice(offset, offset + 8);
            offset += 8;
        }

        // ACKs: [1-byte count] [count × 4-byte ack_msg_id] [remote_sid(8) if count>0]
        if (offset < buffer.length) {
            const nAcks = buffer.readUInt8(offset);
            offset += 1;

            if (nAcks > 0) {
                packet.packetIdArray = [];
                for (let i = 0; i < nAcks; i++) {
                    if (offset + 4 <= buffer.length) {
                        packet.packetIdArray.push(buffer.readUInt32BE(offset));
                        offset += 4;
                    } else {
                        console.warn(`[PacketParser] Not enough data for ACK (Offset=${offset}, Len=${buffer.length})`);
                        break;
                    }
                }
                // Remote session_id, present once after the ack array
                if (offset + 8 <= buffer.length) {
                    packet.remoteSessionId = buffer.slice(offset, offset + 8);
                    offset += 8;
                }
            }
        }

        // Non-ACK packets carry their own msg_id (4 bytes) then payload.
        if (opcode !== Opcode.P_ACK_V1) {
            if (offset + 4 <= buffer.length) {
                packet.messageId = buffer.readUInt32BE(offset);
                offset += 4;
            }
            if (offset < buffer.length) {
                packet.payload = buffer.slice(offset);
            }
        }

        return packet;
    }

    static encode(packet: OpenVPNPacket): Buffer {
        const opcodeByte = (packet.opcode << 3) | (packet.keyId & 0x07);
        const parts: Buffer[] = [Buffer.from([opcodeByte])];

        if (packet.sessionId) {
            parts.push(packet.sessionId);
        }

        if (isControlOpcode(packet.opcode)) {
            const nAcks = packet.packetIdArray ? packet.packetIdArray.length : 0;
            parts.push(Buffer.from([nAcks]));
            if (packet.packetIdArray && nAcks > 0) {
                const buf = Buffer.alloc(nAcks * 4);
                packet.packetIdArray.forEach((pid, i) => buf.writeUInt32BE(pid, i * 4));
                parts.push(buf);
                if (packet.remoteSessionId) parts.push(packet.remoteSessionId);
            }

            if (packet.opcode !== Opcode.P_ACK_V1 && packet.messageId !== undefined) {
                const buf = Buffer.alloc(4);
                buf.writeUInt32BE(packet.messageId, 0);
                parts.push(buf);
            }
        }

        if (packet.payload) {
            parts.push(packet.payload);
        }

        return Buffer.concat(parts);
    }
}
