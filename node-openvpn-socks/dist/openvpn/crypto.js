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
exports.OpenVPNCrypto = void 0;
const crypto = __importStar(require("crypto"));
class OpenVPNCrypto {
    /**
     * OpenVPN PRF (Pseudo-Random Function) implementation for Key Expansion.
     * Based on TLS 1.0 PRF but slightly different usage in OpenVPN Key Method 2.
     * OpenVPN < 2.4 uses a mix of MD5/SHA1.
     * Newer uses TLS-PRF with SHA256 usually.
     *
     * For 'Key Method 2':
     * Master Secret is sent by client (48 bytes pre-master).
     * Keys are derived using the expansion.
     */
    static prf(secret, label, seed, length) {
        // Simplified TLS 1.0 PRF (MD5/SHA1 XOR) for reference.
        // real OpenVPN modern setup uses TLS-EKM or negotiated PRF.
        // Let's implement the standard MD5/SHA1 expansion for compatibility with older/default profiles.
        const labelBuf = Buffer.from(label, 'ascii');
        const seedCombined = Buffer.concat([labelBuf, seed]);
        // Split secret
        const s_len = Math.ceil(secret.length / 2);
        const s1 = secret.slice(0, s_len);
        const s2 = secret.slice(secret.length - s_len);
        const b1 = OpenVPNCrypto.p_hash('md5', s1, seedCombined, length);
        const b2 = OpenVPNCrypto.p_hash('sha1', s2, seedCombined, length);
        const result = Buffer.alloc(length);
        for (let i = 0; i < length; i++) {
            result[i] = b1[i] ^ b2[i];
        }
        return result;
    }
    static p_hash(alg, secret, seed, length) {
        const out = Buffer.alloc(length);
        let offset = 0;
        let A = seed;
        while (offset < length) {
            A = crypto.createHmac(alg, secret).update(A).digest();
            const chunk = crypto.createHmac(alg, secret).update(A).update(seed).digest();
            const copyLen = Math.min(length - offset, chunk.length);
            chunk.copy(out, offset, 0, copyLen);
            offset += copyLen;
        }
        return out;
    }
    /**
     * AES-256-GCM Encrypt
     * PacketID is used as part of the Nonce.
     * Nonce (12 bytes) = [PacketID (4 bytes)] [Implicit IV (8 bytes usually)]
     * Actually, standard OpenVPN AEAD Nonce is 12 bytes:
     * [Packet ID (4 bytes)] [IV from Key Struct (8 bytes)]
     */
    static encryptGcm(data, key, ivImplicit, packetId, aad) {
        const pidBuf = Buffer.alloc(4);
        pidBuf.writeUInt32BE(packetId, 0);
        const nonce = Buffer.concat([pidBuf, ivImplicit]);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
        cipher.setAAD(aad);
        const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
        const tag = cipher.getAuthTag();
        return {
            ciphertext: encrypted,
            tag: tag,
            ivExplicit: pidBuf // The PacketID acts as the explicit IV part
        };
    }
    static decryptGcm(encrypted, key, ivImplicit, packetId, tag, aad) {
        const pidBuf = Buffer.alloc(4);
        pidBuf.writeUInt32BE(packetId, 0);
        const nonce = Buffer.concat([pidBuf, ivImplicit]);
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
        decipher.setAuthTag(tag);
        decipher.setAAD(aad);
        return Buffer.concat([decipher.update(encrypted), decipher.final()]);
    }
    static encryptCbc(data, key, iv, alg) {
        const cipher = crypto.createCipheriv(alg.toLowerCase(), key, iv);
        return Buffer.concat([cipher.update(data), cipher.final()]);
    }
    static decryptCbc(encrypted, key, iv, alg) {
        const decipher = crypto.createDecipheriv(alg.toLowerCase(), key, iv);
        return Buffer.concat([decipher.update(encrypted), decipher.final()]);
    }
    static calculateHmac(data, key, alg) {
        return crypto.createHmac(alg.toLowerCase(), key).update(data).digest();
    }
}
exports.OpenVPNCrypto = OpenVPNCrypto;
