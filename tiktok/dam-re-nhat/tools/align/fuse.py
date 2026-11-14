"""Fuse several forced alignments + snap word boundaries to the real pauses."""
import json, sys
import numpy as np, soundfile as sf
from vad import ipus
SP = sys.argv[1]
runs = [json.load(open(f'{SP}/work/align_{n}.json')) for n in ('turbo_big', 'turbo_small', 'large-v3_big')]
N = len(runs[0])
assert all(len(r) == N for r in runs) and all(r[i]['word'] == runs[0][i]['word'] for r in runs for i in range(N))
words = [w['word'] for w in runs[0]]
sent = [w['sent'] for w in runs[0]]
# internal boundaries b[i] = boundary between word i and i+1
est = np.array([[r[i]['end'] for r in runs] for i in range(N - 1)])
med = np.median(est, axis=1)
spread = est.max(1) - est.min(1)
print('boundary spread (max-min) percentiles 50/75/90/95/max:', np.round(np.percentile(spread, [50, 75, 90, 95, 100]), 3))
# speech IPUs (drop breaths: peak < -30 dB)
segs, db, t, peak = ipus(f'{SP}/audio_in/voice.wav', thr_db=-40, min_pause=0.10, min_speech=0.03)
sp = [(a, b) for a, b in segs if db[(t >= a) & (t <= b)].max() > -30]
print('speech IPUs:', len(sp))
gaps = [(sp[k][1], sp[k + 1][0]) for k in range(len(sp) - 1)]
# match each gap to a boundary (monotonic, nearest to the gap interval)
def dist(x, g):
    return 0.0 if g[0] <= x <= g[1] else min(abs(x - g[0]), abs(x - g[1]))
assign = []
lo = 0
for g in gaps:
    cand = [(dist(med[i], g), i) for i in range(lo, N - 1)]
    d, i = min(cand)
    assign.append((i, d))
    lo = i + 1
OVERRIDE = json.load(open(f'{SP}/work/gap_override.json')) if len(sys.argv) > 2 else {}
for gi, (i, d) in enumerate(assign):
    if str(gi) in OVERRIDE:
        assign[gi] = (OVERRIDE[str(gi)], -1)
print('\nGAP -> boundary matches')
for gi, (g, (i, d)) in enumerate(zip(gaps, assign)):
    flag = '' if d < 0.06 else '   <-- CHECK'
    print(f" gap{gi:2d} [{g[0]:7.3f},{g[1]:7.3f}] ({g[1]-g[0]:.3f})  after '{words[i]}' | before '{words[i+1]}'   est={np.round(est[i],2)} d={d:.3f}{flag}")
# final times
start = np.zeros(N); end = np.zeros(N)
b = med.copy()
gap_of = {i: g for g, (i, d) in zip(gaps, assign)}
ipu_idx = np.zeros(N, int)
k = 0
for i in range(N):
    ipu_idx[i] = k
    if i in gap_of: k += 1
for i in range(N):
    start[i] = sp[0][0] if i == 0 else (gap_of[i - 1][1] if (i - 1) in gap_of else b[i - 1])
    end[i] = sp[-1][1] if i == N - 1 else (gap_of[i][0] if i in gap_of else b[i])
# clamp internal boundaries inside their IPU and enforce monotonic min duration
MIN = 0.07
for k in range(len(sp)):
    idx = np.where(ipu_idx == k)[0]
    a, e = sp[k]
    n = len(idx)
    bs = [min(max(end[i], a), e) for i in idx[:-1]]
    # forward/backward passes for minimum word duration
    prev = a
    for j in range(len(bs)):
        bs[j] = max(bs[j], prev + MIN); prev = bs[j]
    nxt = e
    for j in range(len(bs) - 1, -1, -1):
        bs[j] = min(bs[j], nxt - MIN); nxt = bs[j]
    for j, i in enumerate(idx[:-1]):
        end[i] = bs[j]; start[i + 1] = bs[j]
out = [dict(i=i, word=words[i], start=round(float(start[i]), 3), end=round(float(end[i]), 3), sent=int(sent[i]), ipu=int(ipu_idx[i]),
            spread=round(float(spread[i]) if i < N - 1 else 0.0, 3)) for i in range(N)]
json.dump(dict(words=out, ipus=[[round(a, 3), round(b, 3)] for a, b in sp]), open(f'{SP}/work/timing_raw.json', 'w'), ensure_ascii=False, indent=1)
print('\nFINAL')
cur = -1
for w in out:
    if w['ipu'] != cur:
        cur = w['ipu']; print(f"-- IPU {cur} [{sp[cur][0]:.3f}-{sp[cur][1]:.3f}]")
    print(f"   {w['start']:7.3f} {w['end']:7.3f} ({w['end']-w['start']:.2f})  s{w['sent']:<2d} {w['word']:<10s} {'~%.2f' % w['spread'] if w['spread'] > 0.12 else ''}")
