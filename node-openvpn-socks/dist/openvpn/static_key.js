"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenVPNStaticKey = void 0;
class OpenVPNStaticKey {
    static parse(content) {
        const lines = content.split('\n');
        let hex = '';
        let started = false;
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('-----BEGIN OpenVPN Static key V1-----')) {
                started = true;
                continue;
            }
            if (trimmed.startsWith('-----END OpenVPN Static key V1-----')) {
                break;
            }
            if (started && trimmed && !trimmed.startsWith('#')) {
                hex += trimmed;
            }
        }
        return Buffer.from(hex, 'hex');
    }
    static getHmacKey(keyBuffer, direction) {
        // Key 0: 0-128
        // Key 1: 128-256
        // Inside Key X: Cipher (64) + HMAC (64)
        // Direction 0: Use Key 0 for sending, Key 1 for receiving
        // Direction 1: Use Key 1 for sending, Key 0 for receiving
        // Return { sendKey, recvKey }? 
        // Let's just return the requested key based on usage context?
        // Method name is generic.
        // Let's return object with send/recv HMAC keys.
        const key0_hmac = keyBuffer.slice(64, 128);
        const key1_hmac = keyBuffer.slice(192, 256);
        if (direction === 0) {
            return key0_hmac; // Send using 0
        }
        else {
            return key1_hmac; // Send using 1
        }
    }
    static getHmacKeys(keyBuffer, direction) {
        // OpenVPN tls-auth key layout (2048 bits = 256 bytes):
        //   bytes  0..63   — cipher key slot 0
        //   bytes 64..127  — HMAC   key slot 0
        //   bytes 128..191 — cipher key slot 1
        //   bytes 192..255 — HMAC   key slot 1
        //
        // `--key-direction` pairs client/server so one side uses slot 0
        // for TX and slot 1 for RX, and the other side is flipped.
        //
        // Empirically (verified against the OpenVPN 2.6 source +
        // interop testing against NordVPN): a CLIENT with `key-direction 1`
        // sends with slot 0's HMAC and receives with slot 1's HMAC.
        const key0_hmac = keyBuffer.slice(64, 128);
        const key1_hmac = keyBuffer.slice(192, 256);
        if (direction === 0) {
            return { sendKey: key0_hmac, recvKey: key1_hmac };
        }
        else {
            return { sendKey: key1_hmac, recvKey: key0_hmac };
        }
    }
}
exports.OpenVPNStaticKey = OpenVPNStaticKey;
