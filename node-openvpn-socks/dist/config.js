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
exports.parseConfig = parseConfig;
exports.readConfigFile = readConfigFile;
const fs = __importStar(require("fs"));
function parseConfig(configContent) {
    const lines = configContent.split('\n');
    const config = {
        remote: [],
        ca: '',
        cipher: 'AES-256-GCM', // Default if not specified, though typically it is
        auth: 'SHA1',
        dev: 'tun',
        proto: 'udp',
        compLzo: false,
    };
    let inInlineBlock = null;
    let inlineContent = [];
    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('#') || line.startsWith(';'))
            continue;
        // Handle inline blocks like <ca>...</ca>
        if (inInlineBlock) {
            if (line.startsWith(`</${inInlineBlock}>`)) {
                if (inInlineBlock === 'ca')
                    config.ca = inlineContent.join('\n');
                else if (inInlineBlock === 'cert')
                    config.cert = inlineContent.join('\n');
                else if (inInlineBlock === 'key')
                    config.key = inlineContent.join('\n');
                else if (inInlineBlock === 'tls-auth') {
                    // tls-auth might have direction in the tag opening line in some weird files, 
                    // but usually it's separate. The inline block is just the key.
                    // The direction extraction handles separately if it's outside.
                    // If tls-crypt is used, it's similar.
                    // For now assume simple tls-auth file content.
                    if (!config.tlsAuth)
                        config.tlsAuth = { key: '', direction: 0 }; // Default direction
                    config.tlsAuth.key = inlineContent.join('\n');
                }
                inInlineBlock = null;
                inlineContent = [];
            }
            else {
                inlineContent.push(line);
            }
            continue;
        }
        if (line.startsWith('<')) {
            const match = line.match(/^<([a-zA-Z0-9_-]+)>/);
            if (match) {
                inInlineBlock = match[1];
                inlineContent = [];
                // Check if inline block ends on same line (unlikely for certs but possible for logic)
                if (line.endsWith(`</${inInlineBlock}>`)) {
                    // One liner logic if needed, but usually certs are multi line
                    inInlineBlock = null;
                }
            }
            continue;
        }
        const parts = line.split(/\s+/);
        const cmd = parts[0];
        switch (cmd) {
            case 'remote':
                config.remote.push({
                    host: parts[1],
                    port: parseInt(parts[2] || '1194', 10),
                    proto: parts[3] || 'udp'
                });
                break;
            case 'proto':
                config.proto = parts[1].toLowerCase();
                break;
            case 'dev':
                config.dev = parts[1];
                break;
            case 'cipher':
                config.cipher = parts[1];
                break;
            case 'auth':
                config.auth = parts[1];
                break;
            case 'comp-lzo':
                config.compLzo = true;
                break;
            case 'key-direction':
                if (!config.tlsAuth)
                    config.tlsAuth = { key: '', direction: 0 };
                config.tlsAuth.direction = parseInt(parts[1], 10);
                break;
            case 'tls-auth':
                // Inline handled above, but sometimes it refers to a file: 'tls-auth ta.key 1'
                if (parts[1] && !parts[1].startsWith('[inline]')) {
                    // It's a file path. For this exercise we might assume inline or user provides content.
                    // But let's verify if user provided file content or path.
                    // We will leave it as TODO or just handle inline for now as it's cleaner for single-file config.
                    if (parts[2]) {
                        if (!config.tlsAuth)
                            config.tlsAuth = { key: '', direction: 0 };
                        config.tlsAuth.direction = parseInt(parts[2], 10);
                    }
                }
                break;
            case 'verify-x509-name':
                config.verifyX509Name = { name: parts[1], type: parts[2] || 'name' };
                break;
            case 'auth-user-pass':
                // Directive may be bare (`auth-user-pass`) or point at a
                // two-line file. In either case, just mark that creds are
                // required; the CLI/caller is responsible for populating
                // username/password before connect().
                if (!config.authUserPass)
                    config.authUserPass = { required: true };
                if (parts[1]) {
                    try {
                        const text = fs.readFileSync(parts[1], 'utf-8').split(/\r?\n/);
                        if (text[0])
                            config.authUserPass.username = text[0].trim();
                        if (text[1])
                            config.authUserPass.password = text[1].trim();
                    }
                    catch {
                        // file not readable right now — leave blank, CLI will fill.
                    }
                }
                break;
        }
    }
    // Fallback: if global proto is set but remote didn't specify, update remotes
    config.remote.forEach(r => {
        if (!r.proto && config.proto)
            r.proto = config.proto;
    });
    return config;
}
function readConfigFile(path) {
    const content = fs.readFileSync(path, 'utf-8');
    return parseConfig(content);
}
