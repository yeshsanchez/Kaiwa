#!/usr/bin/env bash
# Build the Kaiwa macOS installer (Kaiwa-macos.dmg) locally.
#
# Why this exists: GitHub's macos-13 (Intel) runners are effectively
# unschedulable — runs sit queued for hours and then cancel — so the macOS
# .dmg is built here on an Intel Mac instead of in CI. This mirrors, step for
# step, what the (now-removed) macOS job in .github/workflows/release.yml did.
#
# Usage (from anywhere):
#     ./packaging/build_macos.sh
#
# Requirements: an Intel Mac with Homebrew, and a Python that has the app's
# runtime deps + PyInstaller installed. If that isn't your `python3`, point
# PYTHON at it:
#     PYTHON=/path/to/.venv/bin/python ./packaging/build_macos.sh
#
# When it finishes, attach the dmg to a release with:
#     gh release upload <tag> Kaiwa-macos.dmg
set -euo pipefail

# Resolve the repo root (this script lives in packaging/) and work from there,
# because kaiwa.spec resolves all its paths relative to the root.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PYTHON="${PYTHON:-python3}"
# Some fetch scripts hit the GitHub API; reuse the gh CLI's token if present.
export GITHUB_TOKEN="${GITHUB_TOKEN:-$(gh auth token 2>/dev/null || true)}"

echo "==> Python: $PYTHON"
if ! "$PYTHON" -c "import PyInstaller" >/dev/null 2>&1; then
  echo "ERROR: PyInstaller isn't importable from '$PYTHON'." >&2
  echo "       Install the app deps + pyinstaller there, or point PYTHON at a" >&2
  echo "       venv that has them:  PYTHON=/path/to/.venv/bin/python $0" >&2
  exit 1
fi

# 1. Icon — build packaging/kaiwa.icns from the padded master (transparent
#    corners + macOS inset). Regenerated every run so icon tweaks always land.
#    NB: do NOT use web/icon-512.png here — that's the full-bleed favicon and
#    produces white corners + an oversized tile.
echo "==> Generating kaiwa.icns"
M=packaging/kaiwa-icon-1024.png
rm -rf packaging/kaiwa.iconset packaging/kaiwa.icns
mkdir -p packaging/kaiwa.iconset
sips -z 16   16   "$M" --out packaging/kaiwa.iconset/icon_16x16.png
sips -z 32   32   "$M" --out packaging/kaiwa.iconset/icon_16x16@2x.png
sips -z 32   32   "$M" --out packaging/kaiwa.iconset/icon_32x32.png
sips -z 64   64   "$M" --out packaging/kaiwa.iconset/icon_32x32@2x.png
sips -z 128  128  "$M" --out packaging/kaiwa.iconset/icon_128x128.png
sips -z 256  256  "$M" --out packaging/kaiwa.iconset/icon_128x128@2x.png
sips -z 256  256  "$M" --out packaging/kaiwa.iconset/icon_256x256.png
sips -z 512  512  "$M" --out packaging/kaiwa.iconset/icon_256x256@2x.png
sips -z 512  512  "$M" --out packaging/kaiwa.iconset/icon_512x512.png
cp "$M" packaging/kaiwa.iconset/icon_512x512@2x.png
iconutil -c icns packaging/kaiwa.iconset -o packaging/kaiwa.icns

# 2. Bundled resources (JMdict source + whisper weights) — skip if present.
ls models/jmdict-eng-*.json >/dev/null 2>&1 || "$PYTHON" packaging/fetch_jmdict.py
[ -f models/ggml-small.bin ] || "$PYTHON" packaging/fetch_whisper_model.py

# 3. whisper.cpp binary + libs staged into vendor/whisper/ — skip if present.
if [ ! -d vendor/whisper ]; then
  echo "==> Staging whisper.cpp"
  brew list whisper-cpp >/dev/null 2>&1 || brew install whisper-cpp
  bash packaging/stage_whisper.sh vendor/whisper
fi

# 4. Build the .app bundle.
echo "==> Building Kaiwa.app (PyInstaller)"
"$PYTHON" -m PyInstaller packaging/kaiwa.spec --noconfirm

# 5. VOICEVOX (best-effort, ~1.7 GB) — fetch if missing, then copy into the app.
#    Never fatal: without it macOS falls back to the built-in `say` voice.
if [ ! -d vendor/voicevox ]; then
  echo "==> Fetching VOICEVOX (best-effort)"
  brew list sevenzip >/dev/null 2>&1 || brew install sevenzip || true
  "$PYTHON" packaging/fetch_voicevox_mac.py || true
fi
if [ -d vendor/voicevox ]; then
  echo "==> Bundling VOICEVOX into the app"
  rm -rf "dist/Kaiwa.app/Contents/Frameworks/vendor/voicevox"
  cp -R vendor/voicevox "dist/Kaiwa.app/Contents/Frameworks/vendor/voicevox"
else
  echo "==> VOICEVOX not staged — skipping (app will use the macOS 'say' voice)"
fi

# 5b. Re-seal the bundle. VOICEVOX (and any vendored binaries) land inside
#     Contents/Frameworks *after* PyInstaller signed the app, which invalidates
#     the code-signature seal — the .dmg would otherwise open as "Kaiwa is
#     damaged and can't be opened" for everyone. codesign --deep chokes on
#     VOICEVOX's engine_internal/*.dist-info, so ad-hoc re-sign the nested
#     Mach-O binaries first, then reseal the top-level bundle (non-deep).
echo "==> Re-signing (ad-hoc) so the seal matches the bundled contents"
if [ -d "dist/Kaiwa.app/Contents/Frameworks/vendor" ]; then
  find "dist/Kaiwa.app/Contents/Frameworks/vendor" -type f \
    \( -name '*.dylib' -o -name '*.so' -o -perm -u+x \) -print0 \
    | while IFS= read -r -d '' f; do codesign --force --sign - "$f" 2>/dev/null || true; done
fi
codesign --force --sign - "dist/Kaiwa.app"
codesign --verify --strict --verbose=2 "dist/Kaiwa.app"

# 6. Package the compressed .dmg.
echo "==> Packaging Kaiwa-macos.dmg"
hdiutil create -volname Kaiwa -srcfolder "dist/Kaiwa.app" -ov -format UDZO "Kaiwa-macos.dmg"

echo
echo "Done: $ROOT/Kaiwa-macos.dmg"
echo "Attach it to a release with:  gh release upload <tag> Kaiwa-macos.dmg"
