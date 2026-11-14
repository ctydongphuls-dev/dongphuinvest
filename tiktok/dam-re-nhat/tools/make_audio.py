#!/usr/bin/env python3
"""Build the final soundtrack: mastered voice-over + synthesized sound effects.

usage: make_audio.py <voice.wav> <sfx.json> <out_dir>
writes: <out_dir>/voice_master.wav (voice only), <out_dir>/sfx.wav (effects only), <out_dir>/mix.wav

The voice timing is never touched (only level / dynamics), so picture sync stays exact.
All sound effects are synthesized here with numpy - no third-party samples.
"""
import json
import os
import subprocess
import sys

import numpy as np
import soundfile as sf
from scipy import signal

SR = 48000
rng = np.random.default_rng(7)


def db(x):
    return 10 ** (x / 20)


def env_exp(n, tau, attack=0.002):
    t = np.arange(n) / SR
    e = np.exp(-t / tau)
    a = int(attack * SR)
    if a > 1:
        e[:a] *= np.linspace(0, 1, a) ** 2
    return e


def fade_tail(x, ms=8):
    n = min(len(x), int(ms / 1000 * SR))
    x[-n:] *= np.linspace(1, 0, n) ** 2
    return x


def sweep(f0, f1, dur, curve=1.0):
    n = int(dur * SR)
    p = np.linspace(0, 1, n) ** curve
    f = f0 * (f1 / f0) ** p
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def bp_noise(n, lo, hi, order=2):
    x = rng.standard_normal(n)
    sos = signal.butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return signal.sosfilt(sos, x)


def swept_noise(dur, f_path, q=1.4):
    """noise through a band-pass whose centre follows f_path (list of (pos 0..1, Hz))"""
    n = int(dur * SR)
    x = rng.standard_normal(n)
    out = np.zeros(n)
    blk = 256
    pos = np.array([p for p, _ in f_path])
    frq = np.array([f for _, f in f_path])
    zi = None
    for s in range(0, n, blk):
        fc = float(np.exp(np.interp(s / n, pos, np.log(frq))))
        lo, hi = fc / (2 ** (1 / (2 * q))), min(fc * (2 ** (1 / (2 * q))), SR / 2 - 200)
        sos = signal.butter(2, [lo, hi], btype="band", fs=SR, output="sos")
        if zi is None:
            zi = np.zeros((sos.shape[0], 2))
        out[s:s + blk], zi = signal.sosfilt(sos, x[s:s + blk], zi=zi)
    return out


def stereo(mono, pan=0.0):
    """equal-power pan, -1..1"""
    a = (pan + 1) * np.pi / 4
    return np.stack([mono * np.cos(a), mono * np.sin(a)], axis=1)


# ------------------------------------------------------------------ effect recipes (peak-normalised, then scaled)
def fx_pop():
    y = sweep(480, 900, 0.11, 0.6) * env_exp(int(0.11 * SR), 0.03)
    return stereo(fade_tail(y)), -21


def fx_tick():
    n = int(0.035 * SR)
    y = np.sin(2 * np.pi * 2300 * np.arange(n) / SR) * env_exp(n, 0.007, 0.0005)
    return stereo(fade_tail(y, 4)), -27


def fx_ding(f0=1318.5):
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for k, (m, a, tau) in enumerate([(1, 1, 0.32), (2.0, 0.45, 0.2), (2.76, 0.22, 0.14), (4.07, 0.1, 0.09)]):
        y += a * np.sin(2 * np.pi * f0 * m * t + k) * np.exp(-t / tau)
    y[:int(0.003 * SR)] *= np.linspace(0, 1, int(0.003 * SR))
    return stereo(fade_tail(y, 30)), -22


def fx_swish():
    d = 0.2
    y = swept_noise(d, [(0, 1400), (0.6, 5200), (1, 3000)], q=1.2)
    y *= np.hanning(len(y)) ** 1.5
    n = len(y)
    pan = np.linspace(-0.5, 0.5, n)
    a = (pan + 1) * np.pi / 4
    return np.stack([y * np.cos(a), y * np.sin(a)], axis=1), -25


def fx_whoosh():
    d = 0.42
    y = swept_noise(d, [(0, 350), (0.55, 2600), (1, 700)], q=1.0)
    n = len(y)
    p = np.arange(n) / n
    e = np.where(p < 0.58, (p / 0.58) ** 2.2, ((1 - p) / 0.42) ** 1.6)
    y *= e
    pan = np.linspace(-0.75, 0.75, n)
    a = (pan + 1) * np.pi / 4
    return np.stack([y * np.cos(a), y * np.sin(a)], axis=1), -20


def _boom(f0, f1, tau, dur):
    n = int(dur * SR)
    return sweep(f0, f1, dur, 0.5) * env_exp(n, tau, 0.003)


def fx_thud():
    y = _boom(120, 52, 0.085, 0.4)
    c = bp_noise(int(0.03 * SR), 300, 1400) * env_exp(int(0.03 * SR), 0.008, 0.0005) * 0.35
    y[:len(c)] += c
    return stereo(fade_tail(y, 20)), -17


def fx_hit():
    y = _boom(140, 50, 0.075, 0.4)
    c = bp_noise(int(0.08 * SR), 500, 2600) * env_exp(int(0.08 * SR), 0.018, 0.0005) * 0.6
    y[:len(c)] += c
    return stereo(fade_tail(y, 20)), -15


def fx_stamp():
    y = _boom(110, 40, 0.13, 0.6)
    slap = bp_noise(int(0.12 * SR), 900, 6000) * env_exp(int(0.12 * SR), 0.022, 0.0005) * 0.7
    y[:len(slap)] += slap
    tail = bp_noise(int(0.35 * SR), 200, 1800) * env_exp(int(0.35 * SR), 0.09, 0.01) * 0.12
    y[:len(tail)] += tail
    return stereo(fade_tail(y, 30)), -13


def fx_alarm():
    out = np.zeros(int(0.36 * SR))
    for k, f in enumerate([740, 740]):
        n = int(0.11 * SR)
        t = np.arange(n) / SR
        tone = np.sin(2 * np.pi * f * t) + 0.33 * np.sin(2 * np.pi * 3 * f * t) + 0.2 * np.sin(2 * np.pi * 5 * f * t)
        tone *= np.hanning(n) ** 0.5
        s = int(k * 0.17 * SR)
        out[s:s + n] += tone
    return stereo(out), -23


def fx_riser(dur):
    n = int(dur * SR)
    p = np.arange(n) / n
    noise = swept_noise(dur, [(0, 500), (1, 6500)], q=0.9)
    tone = sweep(160, 1250, dur, 1.6) * 0.5
    y = (noise + tone) * (p ** 2.4)
    # tremolo that speeds up -> tension
    y *= 0.75 + 0.25 * np.sin(2 * np.pi * np.cumsum(6 + 26 * p ** 2) / SR)
    y = fade_tail(y, 6)
    return stereo(y), -14


def fx_reveal():
    n = int(1.6 * SR)
    y = np.zeros(n)
    b = _boom(95, 34, 0.24, 1.0)
    y[:len(b)] += b
    cy = bp_noise(int(1.2 * SR), 3500, 11000) * env_exp(int(1.2 * SR), 0.3, 0.002) * 0.4
    y[:len(cy)] += cy
    L = y.copy(); R = y.copy()
    # bright rising arpeggio (C6 E6 G6 C7)
    for k, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0]):
        d, _ = fx_ding(f)
        s = int((0.02 + 0.055 * k) * SR)
        m = min(len(d), n - s)
        L[s:s + m] += d[:m, 0] * 0.42 * (1.2 - 0.25 * k % 2)
        R[s:s + m] += d[:m, 1] * 0.42 * (0.95 + 0.25 * k % 2)
    out = np.stack([L, R], axis=1)
    return out, -8


RECIPES = dict(pop=fx_pop, tick=fx_tick, ding=fx_ding, swish=fx_swish, whoosh=fx_whoosh, thud=fx_thud,
               hit=fx_hit, stamp=fx_stamp, alarm=fx_alarm, reveal=fx_reveal)
# where the transient should sit relative to the cue (the picture "lands" ~2 frames after an animation starts)
OFFSET = dict(pop=0.03, tick=0.0, ding=0.0, swish=0.0, whoosh=0.0, thud=0.045, hit=0.045, stamp=0.045, alarm=0.0, reveal=0.03, riser=0.0)


def lufs_of(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True).stderr.splitlines()
    tail = r[-14:]
    i = float([ln for ln in tail if ln.strip().startswith("I:")][-1].split()[1])
    tp = float([ln for ln in tail if ln.strip().startswith("Peak:")][-1].split()[1])
    return i, tp


def latency(ref, x, span=2400):
    """lag (samples) of x behind ref, by cross-correlation over a 30 s stretch"""
    a = ref[SR * 5:SR * 35]
    best, arg = -1e30, 0
    for lag in range(0, span):
        c = float(np.dot(a, x[SR * 5 + lag:SR * 35 + lag]))
        if c > best:
            best, arg = c, lag
    return arg


def master_voice(path, out_path, target_lufs_mono=-16.5):
    """Level + gentle dynamics for the voice-over (timing untouched).
    Mono target -16.5 LUFS == about -13.5 LUFS once the voice is on both stereo channels."""
    chain = ("aresample=48000:resampler=soxr,highpass=f=70,"
             "acompressor=threshold=-20dB:ratio=2:attack=8:release=120:knee=6:makeup=1,"
             "acompressor=threshold=-10dB:ratio=4:attack=2:release=80:knee=3:makeup=1")
    tmp = out_path + ".tmp.wav"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", path, "-af", chain, "-ar", "48000", "-ac", "1", "-c:a", "pcm_s24le", tmp], check=True)
    lufs, _ = lufs_of(tmp)
    gain = target_lufs_mono - lufs
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-af",
                    f"volume={gain:.2f}dB,alimiter=limit=0.82:attack=5:release=50:level=disabled", "-ar", "48000",
                    "-c:a", "pcm_s24le", out_path], check=True)
    subprocess.run(["rm", "-f", tmp])
    x, sr = sf.read(out_path, dtype="float32")
    assert sr == SR
    return x


def main():
    voice_path, sfx_path, out_dir = sys.argv[1:4]
    cues = json.load(open(sfx_path))
    os.makedirs(out_dir, exist_ok=True)
    total = int(round(cues["duration"] * SR))
    voice = master_voice(voice_path, f"{out_dir}/voice_master.wav")
    v = np.zeros((total, 2), np.float32)
    n = min(len(voice), total)
    v[:n, 0] = voice[:n]; v[:n, 1] = voice[:n]

    bus = np.zeros((total, 2), np.float64)
    cache = {}
    for e in cues["sfx"]:
        typ = e["type"]
        if typ == "riser":
            y, lvl = fx_riser(e["dur"])
        else:
            if typ not in cache:
                y, lvl = RECIPES[typ]()
                y = y / (np.abs(y).max() + 1e-9)
                cache[typ] = (y, lvl)
            y, lvl = cache[typ]
        if typ == "riser":
            y = y / (np.abs(y).max() + 1e-9)
        g = db(lvl) * float(e.get("gain", 1.0))
        s = int(round((e["t"] + OFFSET.get(typ, 0)) * SR))
        if s < 0:
            y = y[-s:]; s = 0
        m = min(len(y), total - s)
        if m > 0:
            bus[s:s + m] += y[:m] * g
    # effects never louder than -9 dBFS; soft clip for safety
    bus = np.tanh(bus / db(-7)) * db(-7)
    sfx = bus.astype(np.float32)
    mix = v + sfx
    sf.write(f"{out_dir}/sfx.wav", sfx, SR, subtype="PCM_24")
    sf.write(f"{out_dir}/voice_master.wav", v, SR, subtype="PCM_24")
    # mix bus: catch the few peaks where an effect lands on a loud syllable (no overall gain change)
    sf.write(f"{out_dir}/mix_pre.wav", mix, SR, subtype="PCM_24")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f"{out_dir}/mix_pre.wav", "-af",
                    "alimiter=limit=0.82:attack=3:release=50:level=disabled", "-c:a", "pcm_s24le", f"{out_dir}/mix.wav"], check=True)
    subprocess.run(["rm", "-f", f"{out_dir}/mix_pre.wav"])
    # the limiters add a few ms of look-ahead latency: measure it against the untouched recording and remove it,
    # so the voice sits exactly where it is in the original file
    orig, osr = sf.read(voice_path, dtype="float32")
    if orig.ndim > 1:
        orig = orig.mean(1)
    ref = signal.resample_poly(orig, SR, osr)
    for name in ("mix", "voice_master"):
        x, _ = sf.read(f"{out_dir}/{name}.wav", dtype="float32")
        lat = latency(ref, x.mean(1))
        if lat > 0:
            x = np.concatenate([x[lat:], np.zeros((lat, 2), np.float32)])
        sf.write(f"{out_dir}/{name}.wav", x, SR, subtype="PCM_24")
        print(f"{name}: removed processing latency of {lat} samples ({lat / SR * 1000:.1f} ms)")
    for name in ("voice_master", "mix", "sfx"):
        i, tp = lufs_of(f"{out_dir}/{name}.wav")
        print(f"{name:13s} I = {i:6.1f} LUFS   true peak = {tp:5.1f} dBTP")
    print(f"length {total/SR:.2f}s  ({len(cues['sfx'])} effect cues)")


if __name__ == "__main__":
    main()
