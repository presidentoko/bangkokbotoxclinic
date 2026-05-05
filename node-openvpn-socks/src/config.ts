import * as fs from 'fs';

export interface OpenVPNConfig {
    remote: { host: string; port: number; proto: string }[];
    ca: string;
    cert?: string;
    key?: string; // Private key
    tlsAuth?: { key: string; direction: number }; // Direction 0 or 1
    cipher: string;
    auth: string; // HMAC digest algorithm
    dev: string; // tun/tap, though we don't open it, we need to know for framing maybe
    proto: string;
    compLzo: boolean;
    mssFix?: number;
    mtu?: number;
    verifyX509Name?: { name: string; type: string };
    // User/password auth. When the .ovpn has `auth-user-pass`, the directive
    // marks the flag true with empty creds; callers (CLI, API) fill the
    // username/password before calling OpenVPNClient.connect().
    authUserPass?: { required: boolean; username?: string; password?: string };
}

export function parseConfig(configContent: string): OpenVPNConfig {
    const lines = configContent.split('\n');
    const config: OpenVPNConfig = {
        remote: [],
        ca: '',
        cipher: 'AES-256-GCM', // Default if not specified, though typically it is
        auth: 'SHA1',
        dev: 'tun',
        proto: 'udp',
        compLzo: false,
    };

    let inInlineBlock: string | null = null;
    let inlineContent: string[] = [];

    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('#') || line.startsWith(';')) continue;

        // Handle inline blocks like <ca>...</ca>
        if (inInlineBlock) {
            if (line.startsWith(`</${inInlineBlock}>`)) {
                if (inInlineBlock === 'ca') config.ca = inlineContent.join('\n');
                else if (inInlineBlock === 'cert') config.cert = inlineContent.join('\n');
                else if (inInlineBlock === 'key') config.key = inlineContent.join('\n');
                else if (inInlineBlock === 'tls-auth') {
                    // tls-auth might have direction in the tag opening line in some weird files, 
                    // but usually it's separate. The inline block is just the key.
                    // The direction extraction handles separately if it's outside.
                    // If tls-crypt is used, it's similar.
                    // For now assume simple tls-auth file content.
                    if (!config.tlsAuth) config.tlsAuth = { key: '', direction: 0 }; // Default direction
                    config.tlsAuth.key = inlineContent.join('\n');
                }

                inInlineBlock = null;
                inlineContent = [];
            } else {
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
                    proto: (parts[3] as 'udp' | 'tcp') || 'udp'
                });
                break;
            case 'proto':
                config.proto = parts[1].toLowerCase() as 'udp' | 'tcp';
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
                if (!config.tlsAuth) config.tlsAuth = { key: '', direction: 0 };
                config.tlsAuth.direction = parseInt(parts[1], 10);
                break;
            case 'tls-auth':
                // Inline handled above, but sometimes it refers to a file: 'tls-auth ta.key 1'
                if (parts[1] && !parts[1].startsWith('[inline]')) {
                    // It's a file path. For this exercise we might assume inline or user provides content.
                    // But let's verify if user provided file content or path.
                    // We will leave it as TODO or just handle inline for now as it's cleaner for single-file config.
                    if (parts[2]) {
                        if (!config.tlsAuth) config.tlsAuth = { key: '', direction: 0 };
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
                if (!config.authUserPass) config.authUserPass = { required: true };
                if (parts[1]) {
                    try {
                        const text = fs.readFileSync(parts[1], 'utf-8').split(/\r?\n/);
                        if (text[0]) config.authUserPass.username = text[0].trim();
                        if (text[1]) config.authUserPass.password = text[1].trim();
                    } catch {
                        // file not readable right now — leave blank, CLI will fill.
                    }
                }
                break;
        }
    }

    // Fallback: if global proto is set but remote didn't specify, update remotes
    config.remote.forEach(r => {
        if (!r.proto && config.proto) r.proto = config.proto;
    });

    return config;
}

export function readConfigFile(path: string): OpenVPNConfig {
    const content = fs.readFileSync(path, 'utf-8');
    return parseConfig(content);
}
