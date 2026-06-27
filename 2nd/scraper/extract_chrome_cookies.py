#!/usr/bin/env python3
"""
Extract cookies from your real Chrome browser for use in scrapers.
Chrome must be CLOSED before running (or use --copy-profile to work around).

Usage:
  python scraper/extract_chrome_cookies.py

Saves:
  scraper/cookies_carousell.json
  scraper/cookies_shopee.json   (3rd site only)
  scraper/cookies_ebay.json     (2nd site only)
"""
import json
import os
import shutil
import sqlite3
import sys
import tempfile
from base64 import b64decode
from pathlib import Path

SCRAPER_DIR = Path(__file__).parent

# Chrome paths on Windows
CHROME_USER_DATA = Path(os.environ.get('LOCALAPPDATA', '')) / 'Google' / 'Chrome' / 'User Data'
LOCAL_STATE_PATH = CHROME_USER_DATA / 'Local State'
COOKIES_PATH = CHROME_USER_DATA / 'Default' / 'Network' / 'Cookies'
COOKIES_PATH_OLD = CHROME_USER_DATA / 'Default' / 'Cookies'


def get_chrome_key() -> bytes:
    """Decrypt Chrome's AES key using Windows DPAPI."""
    try:
        import win32crypt
    except ImportError:
        print('[error] Install pywin32: pip install pywin32')
        sys.exit(1)

    with open(LOCAL_STATE_PATH, 'r', encoding='utf-8') as f:
        local_state = json.load(f)

    encrypted_key_b64 = local_state['os_crypt']['encrypted_key']
    encrypted_key = b64decode(encrypted_key_b64)
    # Remove the DPAPI prefix 'DPAPI' (5 bytes)
    encrypted_key = encrypted_key[5:]
    decrypted_key = win32crypt.CryptUnprotectData(encrypted_key, None, None, None, 0)[1]
    return decrypted_key


def decrypt_cookie_value(encrypted_value: bytes, key: bytes) -> str:
    """Decrypt AES-256-GCM encrypted cookie value."""
    try:
        from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    except ImportError:
        print('[error] Install cryptography: pip install cryptography')
        sys.exit(1)

    if encrypted_value[:3] == b'v10' or encrypted_value[:3] == b'v11':
        nonce = encrypted_value[3:15]
        ciphertext = encrypted_value[15:]
        aesgcm = AESGCM(key)
        try:
            return aesgcm.decrypt(nonce, ciphertext, None).decode('utf-8')
        except Exception:
            return ''
    else:
        # Old DPAPI-only (no AES) - rare
        try:
            import win32crypt
            return win32crypt.CryptUnprotectData(encrypted_value, None, None, None, 0)[1].decode('utf-8')
        except Exception:
            return ''


def extract_cookies_for_domains(domains: list[str]) -> list[dict]:
    """Read Chrome cookies SQLite for given domains."""
    # Copy the cookies file (Chrome may lock it)
    cookies_file = COOKIES_PATH if COOKIES_PATH.exists() else COOKIES_PATH_OLD
    if not cookies_file.exists():
        print(f'[error] Chrome cookies not found at {cookies_file}')
        sys.exit(1)

    key = get_chrome_key()

    # Copy to temp to avoid SQLite lock
    tmp = tempfile.mktemp(suffix='.db')
    shutil.copy2(str(cookies_file), tmp)

    results = []
    try:
        conn = sqlite3.connect(tmp)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()

        domain_placeholders = ','.join(['?' for _ in domains])
        # Match host_key against domains (with or without leading dot)
        rows = cur.execute(
            f'''SELECT host_key, name, encrypted_value, path, expires_utc, is_secure, is_httponly
                FROM cookies
                WHERE {" OR ".join(["host_key LIKE ?" for _ in domains])}''',
            [f'%{d}%' for d in domains]
        ).fetchall()

        for row in rows:
            value = decrypt_cookie_value(row['encrypted_value'], key)
            if not value:
                continue
            results.append({
                'name': row['name'],
                'value': value,
                'domain': row['host_key'],
                'path': row['path'],
                'expires': row['expires_utc'],
                'secure': bool(row['is_secure']),
                'httpOnly': bool(row['is_httponly']),
                'sameSite': 'Lax',
            })
        conn.close()
    finally:
        os.unlink(tmp)

    return results


def save(filename: str, domains: list[str]):
    cookies = extract_cookies_for_domains(domains)
    out = SCRAPER_DIR / filename
    out.write_text(json.dumps(cookies, indent=2))
    print(f'Saved {len(cookies)} cookies → {out}')


if __name__ == '__main__':
    print('Extracting Chrome cookies...')
    print('(Make sure you are logged in to these sites in Chrome)')
    print()

    # Detect which site we're in (2nd or 3rd)
    is_3rd = '3rd' in str(SCRAPER_DIR)
    is_2nd = '2nd' in str(SCRAPER_DIR)

    save('cookies_carousell.json', ['carousell.com'])

    if is_3rd:
        save('cookies_shopee.json', ['shopee.co.th', 'shopee.com'])

    if is_2nd:
        save('cookies_ebay.json', ['ebay.com'])

    print()
    print('Done! Now run the scraper normally (without --login).')
