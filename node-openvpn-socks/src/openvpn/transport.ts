import { Duplex } from 'stream';
import { ControlChannel } from './control';

export class VirtualTransport extends Duplex {
    private incomingBuffer: Buffer = Buffer.alloc(0);

    constructor(private controlChannel: ControlChannel) {
        super();

        this.controlChannel.on('data', (data: Buffer) => {
            console.log(`VirtualTransport: Received ${data.length} bytes from ControlChannel`);
            this.incomingBuffer = Buffer.concat([this.incomingBuffer, data]);
            this.processBuffer();
        });

        // Signal that the stream is ready/connected
        process.nextTick(() => {
            this.emit('connect');
        });
    }

    private processBuffer(): void {
        while (this.incomingBuffer.length >= 5) {
            // TLS Record Header: [Type (1)] [Ver (2)] [Len (2)]
            const len = this.incomingBuffer.readUInt16BE(3);
            if (this.incomingBuffer.length >= 5 + len) {
                const record = this.incomingBuffer.slice(0, 5 + len);
                this.incomingBuffer = this.incomingBuffer.slice(5 + len);

                console.log(`VirtualTransport: Pushing COMPLETE TLS Record (Len=${record.length}) head=${record.slice(0, Math.min(16, record.length)).toString('hex')}`);
                const ok = this.push(record);
                console.log(`VirtualTransport: push() returned ${ok}`);
            } else {
                // Not enough data for full record
                break;
            }
        }
    }

    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
        console.log(`VirtualTransport: Writing ${chunk.length} bytes to ControlChannel`);
        this.controlChannel.send(chunk);
        callback();
    }
    _read(size: number): void {
        // No-op, we push when data arrives
    }
}
