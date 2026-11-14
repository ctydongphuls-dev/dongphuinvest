"""Acoustic side of the aligner: pause detection, onset functions, and the syllable DP.

Why this exists: speech-recognition word timestamps are systematically early (they mark where the
previous word ended, consonant included) and get confused by breaths. The beat a viewer perceives is
the vowel onset, so syllables are placed on the low-band onset function of the recording itself and
the recognizer's times are only a loose prior."""
import numpy as np
import soundfile as sf

HOP = 0.005


def features(path, hop=HOP, win=0.025, n_mels=48):
    x, sr = sf.read(path, dtype="float32")
    if x.ndim > 1:
        x = x.mean(1)
    H = int(sr * hop)
    Wn = int(sr * win)
    nfft = 1024
    pad = np.pad(x, (Wn // 2, Wn // 2))
    n = 1 + (len(pad) - Wn) // H
    idx = np.arange(Wn)[None, :] + H * np.arange(n)[:, None]
    S = np.abs(np.fft.rfft(pad[idx] * np.hanning(Wn), nfft, axis=1)) ** 2
    f = np.fft.rfftfreq(nfft, 1 / sr)
    mel = lambda hz: 2595 * np.log10(1 + hz / 700)
    top = min(8000, sr / 2 - 100)
    edges = 700 * (10 ** (np.linspace(mel(80), mel(top), n_mels + 2) / 2595) - 1)
    fb = np.zeros((n_mels, len(f)))
    for m in range(n_mels):
        lo, c, hi = edges[m], edges[m + 1], edges[m + 2]
        fb[m] = np.clip(np.minimum((f - lo) / (c - lo), (hi - f) / (hi - c)), 0, None)
    M = np.log(S @ fb.T + 1e-9)
    t = np.arange(n) * hop
    Ms = np.apply_along_axis(lambda v: np.convolve(v, np.ones(3) / 3, mode="same"), 0, M)
    sm = lambda v, k: np.convolve(v, np.ones(k) / k, mode="same")
    # vowel onsets: positive spectral flux below ~1.1 kHz (ignores breaths and fricative noise)
    low = edges[1:-1] < 1100
    lflux = sm(np.concatenate([[0], np.maximum(Ms[2:, low] - Ms[:-2, low], 0).sum(1), [0]]), 3)
    lowE = sm(10 * np.log10(S[:, (f > 90) & (f < 1000)].sum(1) + 1e-12), 4)
    highE = sm(10 * np.log10(S[:, (f > 4000) & (f < min(9000, sr / 2))].sum(1) + 1e-12), 4)
    # short-time level for pause detection (20 ms RMS)
    w2 = int(sr * 0.020)
    p2 = np.pad(x, (w2 // 2, w2 // 2))
    cs = np.cumsum(np.concatenate([[0.0], p2.astype(np.float64) ** 2]))
    centers = np.arange(n) * H
    centers = np.minimum(centers, len(x) - 1)
    level = 10 * np.log10((cs[centers + w2] - cs[centers]) / w2 + 1e-12)
    return dict(t=t, M=M, lflux=lflux, lowE=lowE, highE=highE, level=level, sr=sr, dur=len(x) / sr)


def speech_units(F, thr_db=-40.0, min_pause=0.10, min_speech=0.03, breath_db=-18.0):
    """Stretches of speech between pauses. Units whose loudest frame stays 18 dB under the voice
    are breaths or lip clicks and are dropped (they would otherwise be mistaken for words)."""
    t, db = F["t"], F["level"]
    peak = np.percentile(db, 99)
    on = db > peak + thr_db
    segs, i, N = [], 0, len(on)
    while i < N:
        if on[i]:
            j = i
            while j < N and on[j]:
                j += 1
            segs.append([float(t[i]), float(t[min(j, N - 1)])])
            i = j
        else:
            i += 1
    merged = []
    for s in segs:
        if merged and s[0] - merged[-1][1] < min_pause:
            merged[-1][1] = s[1]
        else:
            merged.append(s)
    out = []
    for a, b in merged:
        if b - a < min_speech:
            continue
        if db[(t >= a) & (t <= b)].max() - peak < breath_db:
            continue
        out.append([round(a, 3), round(b, 3)])
    return out


def onset_strength(F):
    return np.clip(F["lflux"] / np.percentile(F["lflux"], 99.3), 0, 1.3)


def voiced_soon(F, look=6):
    lowE = F["lowE"]
    vz = lowE > np.percentile(lowE, 99) - 22
    v = vz.copy()
    for s in range(1, look + 1):
        v[:-s] |= vz[s:]
    return v


def place_syllables(F, a, e, prior, sig, beta=3.4, hop=HOP):
    """Dynamic programming: put n syllable beats inside the speech unit [a, e].
    prior[j] = expected time of beat j, sig[j] = how much to trust it (seconds).
    Cost = -onset strength + prior deviation + penalty for sitting on unvoiced sound + duration regularity."""
    n = len(prior)
    onset, voiced, tg = onset_strength(F), voiced_soon(F), F["t"]
    i0 = max(0, int(round((a - 0.03) / hop)))
    i1 = int(round(e / hop))
    T = i1 - i0
    f, v, tt = onset[i0:i1], voiced[i0:i1], tg[i0:i1]
    mu = (e - a) / n
    dmin = max(9, int(0.075 / hop))
    dmax = int(min(1.0, 3.4 * mu + 0.15) / hop)
    if T < n * dmin + 8:                       # unit too short for the DP: spread evenly
        return [float(a + (e - a) * j / n) for j in range(n)]
    INF = 1e18
    cost = np.full((n, T), INF)
    back = np.zeros((n, T), int)
    local = lambda j: -beta * f + ((tt - prior[j]) / sig[j]) ** 2 + np.where(v, 0, 4.0)
    first_max = min(T, int(0.5 / hop))
    cost[0, :first_max] = local(0)[:first_max]
    for j in range(1, n):
        lj, prev = local(j), cost[j - 1]
        for x in range(j * dmin, T - (n - 1 - j) * dmin):
            lo, hi = max(0, x - dmax), x - dmin
            if hi < lo:
                continue
            d = (x - np.arange(lo, hi + 1)) * hop
            c = prev[lo:hi + 1] + 0.5 * ((d - mu) / (0.55 * mu)) ** 2
            k = int(np.argmin(c))
            if c[k] < INF / 2:
                cost[j, x] = c[k] + lj[x]
                back[j, x] = lo + k
    x = int(np.argmin(cost[n - 1, :max(1, T - 8)]))
    if cost[n - 1, x] >= INF / 2:
        return [float(a + (e - a) * j / n) for j in range(n)]
    on = [0] * n
    for j in range(n - 1, 0, -1):
        on[j] = x
        x = back[j, x]
    on[0] = x
    return [float(tt[o]) for o in on]
