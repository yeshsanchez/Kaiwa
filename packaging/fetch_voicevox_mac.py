"""Download + trim the VOICEVOX macOS CPU engine into vendor/voicevox (CI only).

Mirrors fetch_voicevox_win.py so the macOS .dmg bundles VOICEVOX without a ~2 GB
engine having to live in the CI checkout (it doesn't — the repo's macos-x64
engine is git-ignored). Best-effort: CI wraps this so it can never fail the
build — if it's skipped, macOS just falls back to the `say` voice. Reuses the
trim + ad-hoc-codesign logic in stage_voicevox.py so both platforms keep the
same voices.
"""
import os
import platform
import shutil
import subprocess
import sys
import tempfile

import requests

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from stage_voicevox import ROOT, stage  # noqa: E402

# Pinned to the same engine version as the Windows build (matching .vvm names).
VERSION = "0.25.2"
ARCH = "arm64" if platform.machine().lower() in ("arm64", "aarch64") else "x64"
URL = ("https://github.com/VOICEVOX/voicevox_engine/releases/download/"
       f"{VERSION}/voicevox_engine-macos-{ARCH}-{VERSION}.7z.001")
DEST = os.path.join(ROOT, "vendor", "voicevox")


def _seven_zip() -> str | None:
    return shutil.which("7zz") or shutil.which("7z")  # sevenzip / p7zip


def main() -> None:
    sz = _seven_zip()
    if not sz:
        raise RuntimeError("7-Zip not found — `brew install sevenzip` first")
    tmp = tempfile.mkdtemp()
    archive = os.path.join(tmp, "vv.7z.001")
    print(f"downloading VOICEVOX macOS engine ({ARCH}, ~1.7 GB)…")
    with requests.get(URL, stream=True, timeout=300) as r:
        r.raise_for_status()
        with open(archive, "wb") as f:
            for block in r.iter_content(chunk_size=1 << 20):
                f.write(block)
    extract = os.path.join(tmp, "engine")
    subprocess.run([sz, "x", archive, f"-o{extract}", "-y"], check=True)
    src = next((root for root, _, files in os.walk(extract) if "run" in files), None)
    if not src:
        raise RuntimeError("`run` binary not found in extracted VOICEVOX engine")
    stage(src, DEST)
    print("staged trimmed VOICEVOX (macOS) into", DEST)


if __name__ == "__main__":
    main()
