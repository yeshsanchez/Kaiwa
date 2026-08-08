"""Speech-to-text via whisper.cpp (whisper-cli). Expects 16kHz mono WAV input."""
import os
import re
import shutil
import subprocess
import tempfile

from . import paths

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_EXE = ".exe" if os.name == "nt" else ""
# The parent app is windowed (no console), so a console child like whisper-cli
# would pop its own window on Windows unless we suppress it.
_NO_WINDOW = getattr(subprocess, "CREATE_NO_WINDOW", 0)

# Whisper weights download to the writable data dir on first run, but a build may
# also bundle them next to the app (frozen onedir: _internal/models). Check both
# so voice input works whichever way the installer shipped the model.
_MODEL_NAME = "ggml-small.bin"
_MODEL_DIRS = [paths.MODELS_DIR, os.path.join(paths.APP_ROOT, "models")]


def _model() -> str | None:
    for d in _MODEL_DIRS:
        p = os.path.join(d, _MODEL_NAME)
        if os.path.exists(p):
            return p
    return None


def _bin() -> str | None:
    """whisper.cpp CLI: env override → PATH → binaries dropped in vendor/whisper/."""
    env = os.environ.get("KAIWA_WHISPER_BIN")
    if env and (os.path.exists(env) or shutil.which(env)):
        return env
    for name in ("whisper-cli", "whisper-cpp"):
        p = shutil.which(name)
        if p:
            return p
    for name in (f"whisper-cli{_EXE}", f"main{_EXE}"):
        for sub in ("", "Release"):  # windows release zips sometimes nest a Release/ dir
            cand = os.path.join(ROOT, "vendor", "whisper", sub, name)
            if os.path.exists(cand):
                return cand
    return None


def available() -> bool:
    return _bin() is not None and _model() is not None


def transcribe(wav_bytes: bytes, language: str = "ja") -> str:
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        f.write(wav_bytes)
        path = f.name
    try:
        proc = subprocess.run(
            [_bin(), "-m", _model(), "-f", path, "-l", language,
             "-t", "6", "-nt", "--no-prints"],
            capture_output=True, text=True, timeout=120,
            creationflags=_NO_WINDOW,
        )
        text = proc.stdout.strip()
        # strip bracketed non-speech artifacts like [音楽], (笑い)
        text = re.sub(r"[\[(（【][^\])）】]*[\])）】]", "", text).strip()
        return text
    finally:
        os.unlink(path)
