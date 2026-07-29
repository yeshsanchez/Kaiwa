"""Managed Ollama engine — zero-manual-install local AI.

First-run users shouldn't have to visit a website or run an installer. Kaiwa can
fetch Ollama's official *standalone* binary and run `ollama serve` itself; the
rest of the app talks to the engine over HTTP (see llm.py) and doesn't care
whether it was installed system-wide or provisioned here.

Cross-platform: the macOS tarball is a universal binary (Intel + Apple Silicon),
so one download covers both Macs; Windows picks a per-arch asset. (Linux falls
back to the manual path — see _asset.) If a system Ollama is already installed
we reuse it, and its existing models, instead of downloading a second copy.
"""
import os
import platform
import shutil
import stat
import subprocess
import tarfile
import time
import zipfile
from pathlib import Path

import requests

from . import llm, paths

# Writable per-user location (inside the app bundle would be read-only when
# frozen); paths.DATA_DIR handles the dev-vs-installed split.
ENGINE_DIR = Path(os.environ.get("KAIWA_ENGINE_DIR", os.path.join(paths.DATA_DIR, "engine")))
DIST_DIR = ENGINE_DIR / "dist"        # extracted binary (+ runner libs) live here
MODELS_DIR = ENGINE_DIR / "models"    # keep pulled models inside Kaiwa's data dir

# GitHub's /releases/latest/download/<asset> redirects to the newest release, so
# we never have to pin or bump a version. Override for air-gapped/testing setups.
_BASE = os.environ.get(
    "KAIWA_OLLAMA_DOWNLOAD_BASE",
    "https://github.com/ollama/ollama/releases/latest/download",
)

_proc = None  # Popen handle for an engine we started in this process


def _asset() -> str | None:
    """Release asset name for this OS/arch, or None if we can't auto-manage it.

    Only Mac/Windows: their assets are .tgz/.zip (stdlib-extractable). Ollama's
    Linux builds are .tar.zst (needs a zstd dep we don't want), and Linux users
    install with a one-liner anyway — so Linux falls back to the manual path.
    """
    system = platform.system()
    arm = platform.machine().lower() in ("arm64", "aarch64")
    if system == "Darwin":
        return "ollama-darwin.tgz"                       # universal (Intel + ASi)
    if system == "Windows":
        return f"ollama-windows-{'arm64' if arm else 'amd64'}.zip"
    return None


def can_manage() -> bool:
    return _asset() is not None


def _find_binary(root: Path) -> Path | None:
    name = "ollama.exe" if platform.system() == "Windows" else "ollama"
    if not root.exists():
        return None
    return next((p for p in root.rglob(name) if p.is_file()), None)


def system_binary() -> str | None:
    """A system-wide `ollama` on PATH, if any."""
    return shutil.which("ollama")


def managed_binary() -> Path | None:
    """The binary we downloaded into the data dir, if present."""
    return _find_binary(DIST_DIR)


def binary() -> str | None:
    """Prefer a system install; fall back to the one we downloaded."""
    return system_binary() or (str(mb) if (mb := managed_binary()) else None)


def is_installed() -> bool:
    return binary() is not None


def status() -> dict:
    """What the wizard needs to decide between auto-setup and a manual fallback."""
    return {
        "running": llm.ollama_up(),
        "installed": is_installed(),
        "managed": managed_binary() is not None,
        "system": bool(system_binary()),
        "can_manage": can_manage(),
    }


# ------------------------------------------------------------------- download

def _extract(archive: Path, dest: Path):
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True, exist_ok=True)
    if archive.suffix == ".zip":
        with zipfile.ZipFile(archive) as z:
            z.extractall(dest)
    else:
        with tarfile.open(archive) as t:
            t.extractall(dest)


def _make_runnable(b: Path):
    b.chmod(b.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    if platform.system() == "Darwin":
        # Downloaded files carry a quarantine xattr; clear it across the tree so
        # Gatekeeper doesn't block `ollama serve` (the binary is Ollama-notarized).
        subprocess.run(["xattr", "-dr", "com.apple.quarantine", str(DIST_DIR)],
                       check=False, capture_output=True)


def download():
    """Download + extract the standalone binary.

    Yields progress dicts shaped like Ollama's own pull output so the wizard can
    render engine + model download through one code path:
        {"status": str}                              # phase label
        {"status": str, "completed": int, "total": int}   # bytes progress
        {"error": str}                               # terminal failure
    """
    asset = _asset()
    if not asset:
        yield {"error": f"No Ollama build for {platform.system()}/{platform.machine()}"}
        return
    ENGINE_DIR.mkdir(parents=True, exist_ok=True)
    archive = ENGINE_DIR / asset
    try:
        with requests.get(f"{_BASE}/{asset}", stream=True, timeout=60) as r:
            r.raise_for_status()
            total = int(r.headers.get("Content-Length") or 0)
            done = 0
            with open(archive, "wb") as f:
                for chunk in r.iter_content(chunk_size=1 << 20):
                    if not chunk:
                        continue
                    f.write(chunk)
                    done += len(chunk)
                    yield {"status": "downloading engine", "completed": done, "total": total}
        yield {"status": "installing engine"}
        _extract(archive, DIST_DIR)
        archive.unlink(missing_ok=True)
        b = managed_binary()
        if not b:
            yield {"error": "engine downloaded but no binary found after extract"}
            return
        _make_runnable(b)
        yield {"status": "engine installed"}
    except Exception as e:
        yield {"error": str(e)[:200]}


# ---------------------------------------------------------------------- serve

def start(wait: int = 30) -> bool:
    """Start `ollama serve` from the managed (or system) binary; True once the
    HTTP API answers."""
    global _proc
    if llm.ollama_up():
        return True
    b = binary()
    if not b:
        return False
    env = paths.system_env()  # clean env so a bundled/system binary loads its own libs
    if not system_binary():
        # Keep our managed engine's models inside Kaiwa's data dir; respect a
        # system install's existing ~/.ollama models.
        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        env.setdefault("OLLAMA_MODELS", str(MODELS_DIR))
    kwargs = {}
    if platform.system() == "Windows":
        kwargs["creationflags"] = 0x08000000  # CREATE_NO_WINDOW
    _proc = subprocess.Popen([b, "serve"], env=env,
                             stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                             **kwargs)
    for _ in range(wait):
        if llm.ollama_up():
            return True
        time.sleep(1)
    return llm.ollama_up()


def install_stream():
    """Wizard entry point: download the engine if needed, then start it. Emits a
    single terminal {"status": "success"} / {"error": ...}."""
    if not is_installed():
        for ev in download():
            yield ev
            if ev.get("error"):
                return
    yield {"status": "starting engine"}
    if start():
        yield {"status": "success"}
    else:
        yield {"error": "engine installed but did not start"}
