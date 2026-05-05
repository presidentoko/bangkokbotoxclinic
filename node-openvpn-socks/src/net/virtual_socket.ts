import { EventEmitter } from 'events';
import { TcpPacket } from './tcp';
import * as net from 'net';

export enum TcpState {
    CLOSED,
    SYN_SENT,
    ESTABLISHED,
    FIN_WAIT_1,
    FIN_WAIT_2,
    CLOSE_WAIT,
    LAST_ACK,
}

// Modular 32-bit sequence-number comparison. TCP sequence numbers wrap at 2^32.
// Treat (a - b) as a signed 32-bit delta; negative means a is before b.
const seqLt = (a: number, b: number) => (((a - b) | 0) < 0);
const seqLe = (a: number, b: number) => a === b || seqLt(a, b);

// Conservative MSS. Actual tunnel path MTU is 1500 − IP (20) − TCP (20) = 1460,
// and OpenVPN adds its own overhead on top. Keeping this small trades a few
// extra packets for never getting clipped at the VPN server's egress.
const MSS = 1200;
const RTO_MS = 300;
const RTO_CHECK_MS = 100;
const MAX_RETRIES = 8;
const WINDOW = 65535;

interface UnackedSegment {
    seq: number;        // start seq
    end: number;        // end seq (exclusive; seq-space length = end − seq)
    data: Buffer;       // may be empty for pure-control segments
    flags: number;      // SYN / FIN / PSH|ACK
    sentAt: number;
    retries: number;
}

export class VirtualTcpSocket extends EventEmitter {
    public state: TcpState = TcpState.CLOSED;
    public srcPort: number;
    public dstPort: number;
    public srcIp: string;
    public dstIp: string;

    // Send side
    private sndUna: number;             // oldest unacked seq
    private sndNxt: number;             // next seq to assign
    private unacked: UnackedSegment[] = [];

    // Receive side
    private rcvNxt: number = 0;
    private readonly outOfOrder: Map<number, Buffer> = new Map();

    // App-side buffering: data written before ESTABLISHED gets queued.
    private pendingWrites: Buffer[] = [];

    private rtoTimer?: NodeJS.Timeout;
    private appSocket: net.Socket;
    private appEnded = false;

    constructor(srcIp: string, srcPort: number, dstIp: string, dstPort: number, appSocket: net.Socket) {
        super();
        this.srcIp = srcIp;
        this.srcPort = srcPort;
        this.dstIp = dstIp;
        this.dstPort = dstPort;
        this.appSocket = appSocket;
        const iss = Math.floor(Math.random() * 0xFFFFFFFF) >>> 0;
        this.sndUna = iss;
        this.sndNxt = iss;

        this.setupAppSocket();
    }

    private setupAppSocket() {
        this.appSocket.on('data', (data: Buffer) => {
            if (this.state === TcpState.ESTABLISHED) {
                this.sendAppData(data);
            } else if (this.state === TcpState.SYN_SENT || this.state === TcpState.CLOSED) {
                // Queue — SYN is in flight, or we haven't started yet.
                this.pendingWrites.push(data);
            }
            // else: already closing → drop
        });
        this.appSocket.on('end', () => {
            this.appEnded = true;
            this.close();
        });
        this.appSocket.on('error', () => {
            this.appEnded = true;
            this.abort();
        });
    }

    public connect() {
        this.state = TcpState.SYN_SENT;
        const iss = this.sndNxt;
        this.enqueueControl(iss, TcpPacket.Flags.SYN);
        this.sndNxt = (this.sndNxt + 1) >>> 0;
        this.ensureRtoTimer();
    }

    public handlePacket(packet: any) {
        // RST: immediate abort
        if (packet.flags & TcpPacket.Flags.RST) {
            this.abort();
            return;
        }

        // ACK processing first — retires any segments in the unacked queue
        if (packet.flags & TcpPacket.Flags.ACK) {
            this.processAck(packet.ackNum);
        }

        switch (this.state) {
            case TcpState.SYN_SENT:
                if ((packet.flags & TcpPacket.Flags.SYN) && (packet.flags & TcpPacket.Flags.ACK)) {
                    this.rcvNxt = (packet.seqNum + 1) >>> 0;
                    this.state = TcpState.ESTABLISHED;
                    this.sendPureAck();
                    this.emit('connected');
                    // Flush queued app writes now that we have a channel.
                    if (this.pendingWrites.length) {
                        const pending = this.pendingWrites;
                        this.pendingWrites = [];
                        for (const buf of pending) this.sendAppData(buf);
                    }
                    if (this.appEnded) this.close();
                }
                break;

            case TcpState.ESTABLISHED:
                this.handleDataAndFin(packet);
                break;

            case TcpState.FIN_WAIT_1:
                this.handleDataAndFin(packet);
                // Our FIN was acked if nothing remains unacked
                if (this.unacked.length === 0) {
                    this.state = (this.state === TcpState.FIN_WAIT_1) ? TcpState.FIN_WAIT_2 : this.state;
                }
                break;

            case TcpState.FIN_WAIT_2:
                this.handleDataAndFin(packet);
                break;

            case TcpState.CLOSE_WAIT:
                // Already got peer's FIN; waiting for app to close so we send our FIN.
                break;

            case TcpState.LAST_ACK:
                if (this.unacked.length === 0) {
                    this.state = TcpState.CLOSED;
                    this.clearRtoTimer();
                    this.emit('close');
                }
                break;
        }
    }

    private handleDataAndFin(packet: any) {
        if (packet.payload && packet.payload.length > 0) {
            this.receiveData(packet.seqNum, packet.payload);
        }
        if (packet.flags & TcpPacket.Flags.FIN) {
            const finSeq = ((packet.seqNum + (packet.payload ? packet.payload.length : 0)) >>> 0);
            if (finSeq === this.rcvNxt) {
                this.rcvNxt = (this.rcvNxt + 1) >>> 0;
                this.sendPureAck();

                if (this.state === TcpState.ESTABLISHED) {
                    try { this.appSocket.end(); } catch {}
                    // Passive close: send our FIN immediately (simplified). No more app data expected.
                    this.state = TcpState.CLOSE_WAIT;
                    this.enqueueControl(this.sndNxt, TcpPacket.Flags.FIN | TcpPacket.Flags.ACK);
                    this.sndNxt = (this.sndNxt + 1) >>> 0;
                    this.state = TcpState.LAST_ACK;
                } else if (this.state === TcpState.FIN_WAIT_2 || this.state === TcpState.FIN_WAIT_1) {
                    this.state = TcpState.CLOSED;
                    this.clearRtoTimer();
                    try { this.appSocket.end(); } catch {}
                    this.emit('close');
                }
            }
            // else: out-of-order FIN — we'll process it once contiguous data catches up.
        }
    }

    private receiveData(seq: number, data: Buffer) {
        // Fully covered by what we've already delivered?
        const end = (seq + data.length) >>> 0;
        if (seqLe(end, this.rcvNxt)) {
            // Pure duplicate → still ACK so sender can advance.
            this.sendPureAck();
            return;
        }

        if (seq === this.rcvNxt) {
            // In-order: deliver.
            this.deliverToApp(data);
            this.rcvNxt = end;
            this.drainReorderBuffer();
            this.sendPureAck();
            return;
        }

        if (seqLt(seq, this.rcvNxt)) {
            // Overlaps the left edge — trim and deliver the new tail.
            const trimBy = ((this.rcvNxt - seq) | 0);
            const tail = data.slice(trimBy);
            if (tail.length > 0) {
                this.deliverToApp(tail);
                this.rcvNxt = end;
                this.drainReorderBuffer();
            }
            this.sendPureAck();
            return;
        }

        // Future segment — buffer it. Use a key we can look up later when contiguous data arrives.
        // De-duplicate: if the same seq is already buffered with >= length, ignore.
        const existing = this.outOfOrder.get(seq);
        if (!existing || existing.length < data.length) {
            this.outOfOrder.set(seq, data);
        }
        // Dup-ACK (ACK with current rcvNxt) prompts sender to retransmit the missing piece.
        this.sendPureAck();
    }

    private drainReorderBuffer() {
        let progress = true;
        while (progress) {
            progress = false;
            for (const [bSeq, bData] of this.outOfOrder) {
                const bEnd = (bSeq + bData.length) >>> 0;
                if (seqLe(bEnd, this.rcvNxt)) {
                    this.outOfOrder.delete(bSeq);
                    progress = true;
                    continue;
                }
                if (seqLe(bSeq, this.rcvNxt)) {
                    const trimBy = ((this.rcvNxt - bSeq) | 0);
                    const tail = bData.slice(trimBy);
                    this.deliverToApp(tail);
                    this.rcvNxt = bEnd;
                    this.outOfOrder.delete(bSeq);
                    progress = true;
                    break;
                }
            }
        }
    }

    private deliverToApp(data: Buffer) {
        if (!this.appSocket.writable) return;
        try { this.appSocket.write(data); } catch {}
    }

    private processAck(ackNum: number) {
        // Advance sndUna; retire segments whose end ≤ ackNum
        if (seqLt(this.sndUna, ackNum)) {
            this.sndUna = ackNum;
        }
        while (this.unacked.length > 0 && seqLe(this.unacked[0].end, ackNum)) {
            this.unacked.shift();
        }
        if (this.unacked.length === 0) {
            this.clearRtoTimer();
        }
    }

    private sendAppData(data: Buffer) {
        // Slice into MSS-sized segments and enqueue each.
        let off = 0;
        while (off < data.length) {
            const chunk = data.slice(off, off + MSS);
            this.enqueueData(chunk);
            off += chunk.length;
        }
    }

    private enqueueData(chunk: Buffer) {
        const seq = this.sndNxt;
        const end = (seq + chunk.length) >>> 0;
        this.sndNxt = end;
        const seg: UnackedSegment = {
            seq, end, data: chunk,
            flags: TcpPacket.Flags.PSH | TcpPacket.Flags.ACK,
            sentAt: Date.now(), retries: 0,
        };
        this.unacked.push(seg);
        this.ensureRtoTimer();
        this.transmit(seg);
    }

    private enqueueControl(seq: number, flags: number) {
        const end = (seq + 1) >>> 0; // SYN/FIN each take one seq
        const seg: UnackedSegment = {
            seq, end, data: Buffer.alloc(0), flags,
            sentAt: Date.now(), retries: 0,
        };
        this.unacked.push(seg);
        this.ensureRtoTimer();
        this.transmit(seg);
    }

    private transmit(seg: UnackedSegment) {
        const pkt = TcpPacket.create(
            this.srcPort, this.dstPort,
            seg.seq, this.rcvNxt, seg.flags, WINDOW, seg.data,
            this.srcIp, this.dstIp);
        this.emit('output', pkt);
    }

    private sendPureAck() {
        const pkt = TcpPacket.create(
            this.srcPort, this.dstPort,
            this.sndNxt, this.rcvNxt,
            TcpPacket.Flags.ACK, WINDOW, Buffer.alloc(0),
            this.srcIp, this.dstIp);
        this.emit('output', pkt);
    }

    private ensureRtoTimer() {
        if (this.rtoTimer) return;
        this.rtoTimer = setInterval(() => this.checkRto(), RTO_CHECK_MS);
    }

    private clearRtoTimer() {
        if (this.rtoTimer) {
            clearInterval(this.rtoTimer);
            this.rtoTimer = undefined;
        }
    }

    private checkRto() {
        if (this.unacked.length === 0) {
            this.clearRtoTimer();
            return;
        }
        const now = Date.now();
        for (const seg of this.unacked) {
            if (now - seg.sentAt >= RTO_MS) {
                if (seg.retries >= MAX_RETRIES) {
                    // Give up — peer is unresponsive.
                    this.abort();
                    return;
                }
                seg.sentAt = now;
                seg.retries += 1;
                this.transmit(seg);
            }
        }
    }

    public close() {
        if (this.state === TcpState.CLOSED) return;
        if (this.state === TcpState.ESTABLISHED) {
            this.state = TcpState.FIN_WAIT_1;
            this.enqueueControl(this.sndNxt, TcpPacket.Flags.FIN | TcpPacket.Flags.ACK);
            this.sndNxt = (this.sndNxt + 1) >>> 0;
        } else if (this.state === TcpState.SYN_SENT) {
            // Never got connected — just abandon.
            this.abort();
        }
        // Other states: let the state machine run its course.
    }

    public abort() {
        if (this.state === TcpState.CLOSED) return;
        this.state = TcpState.CLOSED;
        this.clearRtoTimer();
        this.unacked = [];
        this.outOfOrder.clear();
        this.pendingWrites = [];
        try { this.appSocket.destroy(); } catch {}
        this.emit('close');
    }
}
