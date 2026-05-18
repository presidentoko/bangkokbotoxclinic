"""DBD DataWarehouse+ 응답 복호화 (HKDF-SHA256 + AES-256-GCM + gzip).

JS 번들 CptXCjuL.js 의 decryptEnvelope 알고리즘을 그대로 포팅.

알고리즘:
  1. base64url-decode encKey (from JWT) → IKM (32 bytes)
  2. base64url-decode salt, iv, ct (from envelope)
  3. info = utf8(`bdw|v{kid}|{pathname}`)
  4. key = HKDF-SHA256(IKM, salt, info, length=32)
  5. plaintext_gz = AES-256-GCM-Decrypt(key, nonce=iv, aad=info, ct=ct_with_tag)
  6. plaintext = gzip-inflate(plaintext_gz).decode("utf-8")
  7. JSON.parse
"""
from __future__ import annotations

import base64
import json
import sys
import zlib
from pathlib import Path
from urllib.parse import urlparse

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes


def b64url(s: str) -> bytes:
    s = s.replace("-", "+").replace("_", "/")
    return base64.b64decode(s + "=" * ((-len(s)) % 4))


def jwt_enc_key(jwt: str) -> bytes:
    payload = json.loads(b64url(jwt.split(".")[1]).decode("utf-8"))
    return b64url(payload["encKey"])


def decrypt_envelope(envelope: dict, url_or_path: str, jwt: str) -> dict:
    """Decrypt one {kid,salt,iv,ct} envelope. Returns the parsed JSON dict."""
    parsed = urlparse(url_or_path)
    pathname = parsed.path if parsed.scheme else (url_or_path.split("?")[0] or url_or_path)
    if not pathname.startswith("/"):
        pathname = "/" + pathname

    ikm = jwt_enc_key(jwt)
    salt = b64url(envelope["salt"])
    iv = b64url(envelope["iv"])
    ct = b64url(envelope["ct"])
    info = f"bdw|v{envelope['kid']}|{pathname}".encode("utf-8")

    key = HKDF(algorithm=hashes.SHA256(), length=32, salt=salt, info=info).derive(ikm)
    pt_gz = AESGCM(key).decrypt(iv, ct, info)
    pt = zlib.decompress(pt_gz, wbits=zlib.MAX_WBITS | 32)  # auto-detect gzip/zlib header
    return json.loads(pt.decode("utf-8"))


def _self_test() -> None:
    """probe 결과로 round-trip 테스트."""
    probe = json.loads(Path("scripts/dbd_deep_probe_result.json").read_text(encoding="utf-8"))

    jwt = None
    for r in probe["requests"]:
        auth = r["headers"].get("authorization", "")
        if auth.startswith("Bearer "):
            jwt = auth.split(" ", 1)[1]; break
    assert jwt

    ok, fail = 0, 0
    for resp in probe["responses"]:
        url = resp["url"]
        body = resp["body"] or ""
        if '"ct"' not in body[:200] or '"iv"' not in body[:200]:
            continue
        # body might be truncated — check
        if "...[truncated" in body:
            print(f"[SKIP truncated] {url}")
            continue
        try:
            envelope = json.loads(body)
            data = decrypt_envelope(envelope, url, jwt)
            preview = json.dumps(data, ensure_ascii=False)[:300]
            print(f"[OK] {url.replace('https://datawarehouse.dbd.go.th','')}")
            print(f"     {preview}")
            ok += 1
        except Exception as e:
            print(f"[FAIL] {url}  →  {type(e).__name__}: {e!s:.120}")
            fail += 1
    print(f"\nresult: {ok} OK, {fail} FAIL")


if __name__ == "__main__":
    _self_test()
