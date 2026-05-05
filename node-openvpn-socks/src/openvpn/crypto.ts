import * as crypto from 'crypto';

export interface KeySet {
    cipherKey: Buffer;
    hmacKey: Buffer;
    iv: Buffer;
}

export class OpenVPNCrypto {

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
    static prf(secret: Buffer, label: string, seed: Buffer, length: number): Buffer {
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

    private static p_hash(alg: string, secret: Buffer, seed: Buffer, length: number): Buffer {
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
    static encryptGcm(data: Buffer, key: Buffer, ivImplicit: Buffer, packetId: number, aad: Buffer): { ciphertext: Buffer, tag: Buffer, ivExplicit: Buffer } {
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

    static decryptGcm(encrypted: Buffer, key: Buffer, ivImplicit: Buffer, packetId: number, tag: Buffer, aad: Buffer): Buffer {
        const pidBuf = Buffer.alloc(4);
        pidBuf.writeUInt32BE(packetId, 0);

        const nonce = Buffer.concat([pidBuf, ivImplicit]);

        const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
        decipher.setAuthTag(tag);
        decipher.setAAD(aad);

        return Buffer.concat([decipher.update(encrypted), decipher.final()]);
    }

    static encryptCbc(data: Buffer, key: Buffer, iv: Buffer, alg: string): Buffer {
        const cipher = crypto.createCipheriv(alg.toLowerCase(), key, iv);
        return Buffer.concat([cipher.update(data), cipher.final()]);
    }

    static decryptCbc(encrypted: Buffer, key: Buffer, iv: Buffer, alg: string): Buffer {
        const decipher = crypto.createDecipheriv(alg.toLowerCase(), key, iv);
        return Buffer.concat([decipher.update(encrypted), decipher.final()]);
    }

    static calculateHmac(data: Buffer, key: Buffer, alg: string): Buffer {
        return crypto.createHmac(alg.toLowerCase(), key).update(data).digest();
    }
}
