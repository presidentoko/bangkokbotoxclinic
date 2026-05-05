"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlChannel = void 0;
const events_1 = require("events");
const packet_1 = require("./packet");
const crypto = __importStar(require("crypto"));
class ControlChannel extends events_1.EventEmitter {
    constructor() {
        super();
        this.packetId = 0; // Next packet ID to send
        this.expectedPacketId = 0; // Next packet ID expected from remote
        // Simplistic retransmission queue: Map<PacketID, {packet: Buffer, timestamp: number}>
        this.sentPackets = new Map();
        // State Machine
        this.state = 'INITIAL';
        this.outgoingQueue = [];
        // HMAC algorithm for the tls-auth wrap. OpenVPN wires this to the
        // `--auth` directive's digest (SHA1 by default, SHA512 for NordVPN, etc.).
        this.tlsAuthDigest = 'sha1';
        this.tlsAuthHmacLen = 20;
        // Matches OpenVPN's `packet_id_init` which starts at 0 and pre-increments
        // on first use, so the first emitted tls-auth pid is 1. Real servers
        // (NordVPN) see pid=0 as a replay and silently drop the packet.
        this.tlsAuthPid = 0;
        this.localSessionId = Buffer.alloc(8);
        // Random session ID
        for (let i = 0; i < 8; i++)
            this.localSessionId[i] = Math.floor(Math.random() * 256);
    }
    setTlsAuth(sendKey, recvKey, authDigest = 'SHA1') {
        this.tlsAuthSendKey = sendKey;
        this.tlsAuthRecvKey = recvKey;
        const dg = authDigest.toLowerCase();
        this.tlsAuthDigest = dg;
        // Length of the resulting HMAC for the wrapping — needed for RX parsing.
        this.tlsAuthHmacLen =
            dg === 'sha512' ? 64 :
                dg === 'sha384' ? 48 :
                    dg === 'sha256' ? 32 :
                        dg === 'md5' ? 16 :
                            20; // sha1 / default
        console.log(`ControlChannel: TLS-Auth enabled (digest=${dg}, hmacLen=${this.tlsAuthHmacLen}).`);
    }
    getLocalSessionId() { return this.localSessionId; }
    getRemoteSessionId() { return this.remoteSessionId; }
    stop() {
        if (this.retransmitTimer) {
            clearInterval(this.retransmitTimer);
            this.retransmitTimer = undefined;
        }
    }
    // Call this when we receive a packet from Transport
    handlePacket(buffer) {
        try {
            let payload = buffer;
            // TLS-Auth wrap verification. OpenVPN 2.6 wire format:
            //   [opcode(1)] [session_id(8)] [HMAC(N)] [pid(4)] [pid_time(4)]
            //   [ack_count(1)] [acks(4*n)] [remote_sid(8) if n>0] [msg_id(4)]
            //   [payload]
            // HMAC is computed over: [pid][pid_time][opcode][session_id][rest]
            // (per openvpn src/openvpn/ssl_pkt.c:tls_wrap_control)
            if (this.tlsAuthRecvKey) {
                const hmacLen = this.tlsAuthHmacLen;
                const pidLen = 8; // long-form packet ID (id + time)
                const headerLen = 9; // opcode + session_id
                if (buffer.length < headerLen + hmacLen + pidLen) {
                    console.error(`Packet too short for TLS-Auth (len=${buffer.length}, need >${headerLen + hmacLen + pidLen})`);
                    return;
                }
                const opcodeAndSid = buffer.slice(0, headerLen);
                const receivedHmac = buffer.slice(headerLen, headerLen + hmacLen);
                const pidBuf = buffer.slice(headerLen + hmacLen, headerLen + hmacLen + pidLen);
                const rest = buffer.slice(headerLen + hmacLen + pidLen);
                const dataToSign = Buffer.concat([pidBuf, opcodeAndSid, rest]);
                const calculatedHmac = crypto.createHmac(this.tlsAuthDigest, this.tlsAuthRecvKey).update(dataToSign).digest();
                if (!calculatedHmac.equals(receivedHmac)) {
                    console.error('TLS-Auth HMAC Verification Failed!');
                    return;
                }
                // Unwrapped packet for parser: [opcode][session_id][rest]
                payload = Buffer.concat([opcodeAndSid, rest]);
            }
            const packet = packet_1.PacketParser.parse(payload);
            console.log(`RX Hex: ${payload.toString('hex')}`);
            console.log(`Parsed: Op=${packet.opcode} Sess=${packet.sessionId?.toString('hex')} AckCnt=${packet.packetIdArray?.length || 0} MsgId=${packet.messageId}`);
            // 1. Handle ACKs
            if (packet.packetIdArray && packet.packetIdArray.length > 0) {
                console.log(`Received ACKs for: ${packet.packetIdArray.join(', ')}`);
                packet.packetIdArray.forEach((ackId) => {
                    if (this.sentPackets.has(ackId)) {
                        console.log(`Packet ${ackId} Acknowledged.`);
                        this.sentPackets.delete(ackId);
                    }
                });
            }
            // 2. Handle Data (Control channel or Ack)
            // Use explicit checks to avoid TS narrowing issues
            const isControl = (packet.opcode === packet_1.Opcode.P_CONTROL_V1 ||
                packet.opcode === packet_1.Opcode.P_CONTROL_HARD_RESET_SERVER_V2);
            if (isControl) {
                // Heuristic for Malformed Packet 1 (ServerHello) - Junk insertion
                // It seems the server prepends 12 bytes of junk (8 byte echoed session ID + 4 bytes)
                // before the actual MessageID and Payload in the first P_CONTROL_V1 packet.
                // Heuristic removed: PacketParser now handles 12-byte ACKs correctly.
                if (packet.sessionId && !this.remoteSessionId) {
                    this.remoteSessionId = packet.sessionId;
                    // console.log('Remote Session ID set:', this.remoteSessionId.toString('hex'));
                }
                // State Transition: If we get Server Reset, we are established (Control Channel wise)
                if (packet.opcode === packet_1.Opcode.P_CONTROL_HARD_RESET_SERVER_V2) {
                    if (this.state === 'CONNECTING') {
                        console.log('ControlChannel: Established (Got Server Hard Reset)');
                        this.state = 'READY';
                        this.flushOutgoingQueue();
                    }
                }
                // Send ACK for this packet.
                // Note: `remote_sid` in our ACK is the server's session_id
                // (the sender of the msg we are acking). The server echoes
                // OUR sid in its own packets' `remoteSessionId`, which is
                // *not* what we want here.
                if (packet.messageId !== undefined) {
                    const serverSid = packet.sessionId || this.remoteSessionId;
                    if (serverSid)
                        this.sendAck(packet.messageId, serverSid);
                    if (packet.messageId === this.expectedPacketId) {
                        this.expectedPacketId++;
                        // Only emit P_CONTROL_V1 payloads (TLS Data)
                        if (packet.opcode === packet_1.Opcode.P_CONTROL_V1 && packet.payload && packet.payload.length > 0) {
                            const byte0 = packet.payload[0];
                            const len = packet.payload.length;
                            console.log(`[Transport] Emitting Data to TLS (MsgId=${packet.messageId}, Len=${len}, Byte0=${byte0.toString(16)})`);
                            // Debug: Log boundaries for continuity check
                            if (len > 20) {
                                console.log(`[Transport] MsgId=${packet.messageId} Head: ${packet.payload.slice(0, 20).toString('hex')}`);
                                console.log(`[Transport] MsgId=${packet.messageId} Tail: ${packet.payload.slice(len - 20).toString('hex')}`);
                            }
                            this.emit('data', Buffer.from(packet.payload));
                        }
                    }
                    else if (packet.messageId < this.expectedPacketId) {
                        // Duplicate
                    }
                    else {
                        console.warn(`Got Out-of-Order Packet ${packet.messageId}, expected ${this.expectedPacketId}`);
                    }
                }
            }
        }
        catch (e) {
            console.error('Error parsing packet in ControlChannel', e);
        }
    }
    send(data) {
        if (this.state !== 'READY') {
            this.outgoingQueue.push(data);
            return;
        }
        const pid = this.packetId++;
        const packet = this.createPacket(packet_1.Opcode.P_CONTROL_V1, pid, this.localSessionId, data);
        this.sendPacketReliable(pid, packet);
    }
    flushOutgoingQueue() {
        if (this.outgoingQueue.length > 0) {
            console.log(`ControlChannel: Flushing ${this.outgoingQueue.length} queued packets...`);
            while (this.outgoingQueue.length > 0) {
                const data = this.outgoingQueue.shift();
                if (data) {
                    const pid = this.packetId++;
                    const packet = this.createPacket(packet_1.Opcode.P_CONTROL_V1, pid, this.localSessionId, data);
                    this.sendPacketReliable(pid, packet);
                }
            }
        }
    }
    start() {
        console.log('ControlChannel: Starting Handshake (V3)...');
        this.state = 'CONNECTING';
        this.packetId = 0;
        this.expectedPacketId = 0;
        this.tlsAuthPid = 0;
        this.sentPackets.clear();
        // Do NOT clear outgoingQueue here, as ClientHello might be pending
        // this.outgoingQueue = []; 
        // V2 is the standard client-hello opcode. V3 is reserved for
        // tls-crypt-v2. VPN Gate's SoftEther implementation quirkily needs
        // V3 too, but real OpenVPN (NordVPN et al.) only answers V2.
        // Try V2 first; on no-reply within a short window, retry as V3.
        const pid = this.packetId++;
        const packet = this.createPacket(packet_1.Opcode.P_CONTROL_HARD_RESET_CLIENT_V2, pid, this.localSessionId, Buffer.alloc(0));
        this.sendPacketReliable(pid, packet);
        // Fallback: if we're still in CONNECTING after 4 seconds, re-seed
        // with V3 (SoftEther path).
        setTimeout(() => {
            if (this.state === 'CONNECTING' && this.sentPackets.has(0)) {
                console.log('ControlChannel: no V2 response yet, re-trying with V3 (SoftEther fallback)');
                this.sentPackets.delete(0);
                const v3pid = this.packetId++;
                const v3packet = this.createPacket(packet_1.Opcode.P_CONTROL_HARD_RESET_CLIENT_V3, v3pid, this.localSessionId, Buffer.alloc(0));
                this.sendPacketReliable(v3pid, v3packet);
            }
        }, 4000);
        this.retransmitTimer = setInterval(() => this.checkRetransmissions(), 1000);
    }
    sendAck(packetIdToAck, remoteSessionId) {
        // Use P_ACK_V1 (Opcode 5) for standalone ACKs
        // This does NOT consume a Packet ID and does NOT require an ACK from remote.
        const opcode = packet_1.Opcode.P_ACK_V1;
        const header = Buffer.alloc(1);
        header.writeUInt8((opcode << 3), 0);
        const session = this.localSessionId;
        // ACK Array: 1 Ack
        // OpenVPN expects [PacketID (4)] [RemoteSessionID (8)] per ACK
        const ackPayload = Buffer.alloc(1 + 12);
        ackPayload.writeUInt8(1, 0); // Count = 1
        ackPayload.writeUInt32BE(packetIdToAck, 1);
        remoteSessionId.copy(ackPayload, 5);
        // P_ACK_V1 does NOT have a Message ID (Sequence Number)
        // It also does not have a dummy payload.
        const packet = Buffer.concat([header, session, ackPayload]);
        // console.log(`[Control] Sending ACK for ${packetIdToAck} using P_ACK_V1`);
        this.emitSend(packet);
    }
    createPacket(opcode, packetId, sessionId, payload) {
        const header = Buffer.alloc(1);
        header.writeUInt8((opcode << 3), 0);
        const ackCount = 0;
        const ackBuf = Buffer.alloc(1);
        ackBuf.writeUInt8(ackCount, 0);
        const pidBuf = Buffer.alloc(4);
        pidBuf.writeUInt32BE(packetId, 0);
        return Buffer.concat([header, sessionId, ackBuf, pidBuf, payload]);
    }
    sendPacketReliable(pid, buffer) {
        console.log(`Reliable Send: Storing Packet ${pid} for retransmission.`);
        this.sentPackets.set(pid, {
            buffer: buffer,
            retryCount: 0,
            lastSent: Date.now()
        });
        this.emitSend(buffer);
    }
    // Fix: emitSend in replace block was incomplete/wrong context. Overwriting flush/send logic better.
    emitSend(packet) {
        if (this.tlsAuthSendKey) {
            // OpenVPN 2.6 tls-auth wire format:
            //   [opcode(1)] [session_id(8)] [HMAC(N)] [pid(4)] [pid_time(4)] [rest]
            // HMAC input order (per ssl_pkt.c:tls_wrap_control):
            //   [pid][pid_time][opcode][session_id][rest]
            // `packet` here is the un-wrapped OpenVPN packet built by
            // createPacket/sendAck: [opcode][sid][ack_count][...][msg_id?][payload]
            const headerLen = 9;
            const opcodeAndSid = packet.slice(0, headerLen);
            const rest = packet.slice(headerLen);
            const pidBuf = Buffer.alloc(8);
            pidBuf.writeUInt32BE(++this.tlsAuthPid, 0); // first emit = 1
            pidBuf.writeUInt32BE(Math.floor(Date.now() / 1000), 4);
            const dataToSign = Buffer.concat([pidBuf, opcodeAndSid, rest]);
            const hmac = crypto.createHmac(this.tlsAuthDigest, this.tlsAuthSendKey).update(dataToSign).digest();
            const signedPacket = Buffer.concat([opcodeAndSid, hmac, pidBuf, rest]);
            this.emit('send', signedPacket);
        }
        else {
            this.emit('send', packet);
        }
    }
    checkRetransmissions() {
        const now = Date.now();
        for (const [pid, entry] of this.sentPackets) {
            if (now - entry.lastSent > 2000) {
                if (entry.retryCount < 5) {
                    console.log(`Retransmitting packet ${pid}`);
                    entry.lastSent = now;
                    entry.retryCount++;
                    this.emitSend(entry.buffer);
                }
            }
        }
    }
}
exports.ControlChannel = ControlChannel;
