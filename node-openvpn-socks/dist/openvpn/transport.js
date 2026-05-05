"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualTransport = void 0;
const stream_1 = require("stream");
class VirtualTransport extends stream_1.Duplex {
    constructor(controlChannel) {
        super();
        this.controlChannel = controlChannel;
        this.incomingBuffer = Buffer.alloc(0);
        this.controlChannel.on('data', (data) => {
            console.log(`VirtualTransport: Received ${data.length} bytes from ControlChannel`);
            this.incomingBuffer = Buffer.concat([this.incomingBuffer, data]);
            this.processBuffer();
        });
        // Signal that the stream is ready/connected
        process.nextTick(() => {
            this.emit('connect');
        });
    }
    processBuffer() {
        while (this.incomingBuffer.length >= 5) {
            // TLS Record Header: [Type (1)] [Ver (2)] [Len (2)]
            const len = this.incomingBuffer.readUInt16BE(3);
            if (this.incomingBuffer.length >= 5 + len) {
                const record = this.incomingBuffer.slice(0, 5 + len);
                this.incomingBuffer = this.incomingBuffer.slice(5 + len);
                console.log(`VirtualTransport: Pushing COMPLETE TLS Record (Len=${record.length}) head=${record.slice(0, Math.min(16, record.length)).toString('hex')}`);
                const ok = this.push(record);
                console.log(`VirtualTransport: push() returned ${ok}`);
            }
            else {
                // Not enough data for full record
                break;
            }
        }
    }
    _write(chunk, encoding, callback) {
        console.log(`VirtualTransport: Writing ${chunk.length} bytes to ControlChannel`);
        this.controlChannel.send(chunk);
        callback();
    }
    _read(size) {
        // No-op, we push when data arrives
    }
}
exports.VirtualTransport = VirtualTransport;
