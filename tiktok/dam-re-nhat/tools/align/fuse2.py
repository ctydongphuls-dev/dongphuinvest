"""Final word timing: per-unit alignments (turbo + large-v3) + window alignment, locked to the measured pauses."""
import json, sys
import numpy as np
SP = sys.argv[1]
T = json.load(open(f'{SP}/work/timing_raw.json'))
words, ipus = T['words'], T['ipus']
A = {n: {w['i']: w for w in json.load(open(f'{SP}/work/ipu_align_{n}.json'))} for n in ('turbo', 'large-v3')}
N = len(words)
out = []
diffs = []
for k, (a, e) in enumerate(ipus):
    idx = [w['i'] for w in words if w['ipu'] == k]
    n = len(idx)
    bs = []
    for j in range(n - 1):
        i = idx[j]
        c = [A['turbo'][i]['end'], A['large-v3'][i]['end'], words[i]['end']]
        diffs.append(abs(c[0] - c[1]))
        b = float(np.mean(c[:2])) if abs(c[0] - c[1]) <= 0.08 else float(np.median(c))
        bs.append(min(max(b, a), e))
    MIN = 0.08
    prev = a
    for j in range(len(bs)):
        bs[j] = max(bs[j], prev + MIN); prev = bs[j]
    nxt = e
    for j in range(len(bs) - 1, -1, -1):
        bs[j] = min(bs[j], nxt - MIN); nxt = bs[j]
    edges = [a] + bs + [e]
    for j, i in enumerate(idx):
        w = dict(words[i]); w['start'] = round(edges[j], 3); w['end'] = round(edges[j + 1], 3)
        w['d2'] = round(abs(A['turbo'][i]['end'] - A['large-v3'][i]['end']), 3) if j < n - 1 else 0.0
        out.append(w)
diffs = np.array(diffs)
print('turbo vs large-v3 per-unit boundary |diff| percentiles 50/75/90/95/max:', np.round(np.percentile(diffs, [50, 75, 90, 95, 100]), 3), 'n=', len(diffs))
json.dump(dict(words=out, ipus=ipus, duration=73.287), open(f'{SP}/work/timing_final.json', 'w'), ensure_ascii=False, indent=1)
cur = -1
for w in out:
    if w['ipu'] != cur:
        cur = w['ipu']; print(f"-- IPU {cur} [{ipus[cur][0]:.3f}-{ipus[cur][1]:.3f}]")
    old = words[w['i']]
    print(f"   {w['start']:7.3f} {w['end']:7.3f} ({w['end']-w['start']:.2f})  s{w['sent']:<2d} {w['word']:<10s} {'d=%.2f' % w['d2'] if w['d2'] > 0.08 else '':8s} {'(was %.2f)' % old['start'] if abs(old['start'] - w['start']) > 0.07 else ''}")
