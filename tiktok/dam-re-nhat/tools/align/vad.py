"""Energy-based pause detection on the original recording."""
import numpy as np, soundfile as sf, sys, json

def ipus(path, frame=0.005, thr_db=-40.0, min_pause=0.10, min_speech=0.06):
    x, sr = sf.read(path, dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    n = int(sr * frame)
    win = int(sr * 0.020)
    # short-time RMS (20 ms window, 5 ms hop)
    pad = np.pad(x, (win // 2, win // 2))
    cs = np.cumsum(np.concatenate([[0.0], pad.astype(np.float64) ** 2]))
    centers = np.arange(0, len(x), n)
    e = (cs[centers + win] - cs[centers]) / win
    db = 10 * np.log10(e + 1e-12)
    peak = np.percentile(db, 99)
    speech = db > (peak + thr_db)
    # close short gaps (< min_pause) and drop short blips
    t = centers / sr
    segs = []
    i = 0
    N = len(speech)
    while i < N:
        if speech[i]:
            j = i
            while j < N and speech[j]: j += 1
            segs.append([t[i], t[min(j, N - 1)]])
            i = j
        else:
            i += 1
    merged = []
    for s in segs:
        if merged and s[0] - merged[-1][1] < min_pause:
            merged[-1][1] = s[1]
        else:
            merged.append(s)
    merged = [s for s in merged if s[1] - s[0] >= min_speech]
    return merged, db, t, peak

if __name__ == '__main__':
    segs, db, t, peak = ipus(sys.argv[1], thr_db=float(sys.argv[2]) if len(sys.argv) > 2 else -40.0,
                             min_pause=float(sys.argv[3]) if len(sys.argv) > 3 else 0.10)
    print('peak dB', round(float(peak), 1), 'noise floor dB (p5)', round(float(np.percentile(db, 5)), 1))
    prev = 0.0
    for k, (a, b) in enumerate(segs):
        print(f"{k:2d}  pause {a - prev:5.3f} | speech {a:7.3f} -> {b:7.3f}  ({b - a:5.3f})")
        prev = b
