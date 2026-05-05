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
exports.Socks5Server = void 0;
const net = __importStar(require("net"));
const events_1 = require("events");
class Socks5Server extends events_1.EventEmitter {
    constructor(port = 1080) {
        super();
        this.port = port;
        this.server = net.createServer((socket) => this.handleConnection(socket));
    }
    listen(host = '127.0.0.1') {
        this.server.listen(this.port, host, () => {
            console.log(`SOCKS5 Server listening on ${host}:${this.port}`);
        });
    }
    close() {
        return new Promise((resolve) => {
            this.server.close(() => resolve());
        });
    }
    handleConnection(socket) {
        socket.once('data', (data) => {
            // Version 5, and at least 1 auth method
            if (data[0] !== 0x05) {
                socket.end();
                return;
            }
            // We assume 'No Auth' (0x00) is supported
            // Send Server Choice: Version 5, Method 0 (No Auth)
            socket.write(Buffer.from([0x05, 0x00]));
            socket.once('data', (request) => {
                // Request details:
                // VER (1) | CMD (1) | RSV (1) | ATYP (1) | DST.ADDR (var) | DST.PORT (2)
                const cmd = request[1];
                if (cmd !== 0x01) { // CONNECT only
                    // Command not supported
                    this.sendReply(socket, 0x07);
                    return;
                }
                const atyp = request[3];
                let dstAddr = '';
                let dstPort = 0;
                let offset = 4;
                if (atyp === 0x01) { // IPv4
                    dstAddr = `${request[4]}.${request[5]}.${request[6]}.${request[7]}`;
                    offset += 4;
                }
                else if (atyp === 0x03) { // Domain Name
                    const len = request[4];
                    dstAddr = request.slice(5, 5 + len).toString();
                    offset += 1 + len;
                }
                else {
                    // IPv6 not supported
                    this.sendReply(socket, 0x08);
                    return;
                }
                dstPort = request.readUInt16BE(offset);
                // Now we have target (dstAddr, dstPort).
                // We need to ask Virtual Stack to open a connection.
                // For now, let's just emit an event to the main controller.
                this.emit('connect', { socket, dstAddr, dstPort });
            });
        });
        socket.on('error', (err) => {
            console.error('SOCKS5 Socket error:', err);
        });
    }
    sendReply(socket, rep, bindAddr = '0.0.0.0', bindPort = 0) {
        // Reply: VER | REP | RSV | ATYP | BND.ADDR | BND.PORT
        // ATYP 1 (IPv4)
        const response = Buffer.alloc(10);
        response[0] = 0x05;
        response[1] = rep;
        response[2] = 0x00;
        response[3] = 0x01; // IPv4
        // 0.0.0.0
        response[4] = 0;
        response[5] = 0;
        response[6] = 0;
        response[7] = 0;
        response.writeUInt16BE(bindPort, 8);
        if (socket.writable) {
            socket.write(response);
        }
    }
}
exports.Socks5Server = Socks5Server;
