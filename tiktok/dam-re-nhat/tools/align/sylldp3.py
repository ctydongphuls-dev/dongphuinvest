"""Final syllable-beat alignment (vowel onsets) with optional manual pins from visual spectrogram review."""
import json, sys
import numpy as np
from acoustic import features
from sylldp import syllables

def align_ipu(tgrid, F, voiced, a, e, prior, sig, hop=0.005, beta=3.4):
    n = len(prior)
    i0 = max(0, int(round((a - 0.03) / hop))); i1 = int(round(e / hop))
    T = i1 - i0
    f = F[i0:i1]; v = voiced[i0:i1]; tt = tgrid[i0:i1]
    mu = (e - a) / n
    dmin = max(9, int(0.075 / hop)); dmax = int(min(1.0, 3.4 * mu + 0.15) / hop)
    INF = 1e18
    cost = np.full((n, T), INF); back = np.zeros((n, T), int)
    local = lambda j: -beta * f + ((tt - prior[j]) / sig[j]) ** 2 + np.where(v, 0, 4.0)
    first_max = int(0.5 / hop)
    cost[0, :first_max] = local(0)[:first_max]
    for j in range(1, n):
        lj = local(j); prev = cost[j - 1]
        for x in range(j * dmin, T - (n - 1 - j) * dmin):
            lo, hi = max(0, x - dmax), x - dmin
            if hi < lo: continue
            d = (x - np.arange(lo, hi + 1)) * hop
            c = prev[lo:hi + 1] + 0.5 * ((d - mu) / (0.55 * mu)) ** 2
            k = int(np.argmin(c))
            if c[k] < INF / 2:
                cost[j, x] = c[k] + lj[x]; back[j, x] = lo + k
    x = int(np.argmin(cost[n - 1, :max(1, T - 8)]))
    on = [0] * n
    for j in range(n - 1, 0, -1):
        on[j] = x; x = back[j, x]
    on[0] = x
    return [float(tt[o]) for o in on]

if __name__ == '__main__':
    SP = sys.argv[1]
    Fe = features(SP + '/audio_in/voice.wav')
    t = Fe['t']
    F = np.clip(Fe['lflux'] / np.percentile(Fe['lflux'], 99.3), 0, 1.3)
    lowE = Fe['lowE']; vz = lowE > np.percentile(lowE, 99) - 22
    voiced = vz.copy()
    for s in range(1, 7): voiced[:-s] |= vz[s:]
    T = json.load(open(SP + '/work/timing_final.json'))
    words, ipus = T['words'], T['ipus']
    PINS = json.load(open(SP + '/work/pins.json'))          # {"s:k:q": seconds}
    sk = {}
    cnt = {}
    for w in words:
        k = cnt.get(w['sent'], 0); cnt[w['sent']] = k + 1; sk[w['i']] = (w['sent'], k)
    out = []
    for k, (a, e) in enumerate(ipus):
        ws = [w for w in words if w['ipu'] == k]
        prior, sig, owner = [], [], []
        for w in ws:
            sy = syllables(w['word']); dur = w['end'] - w['start']
            for q in range(len(sy)):
                key = f"{sk[w['i']][0]}:{sk[w['i']][1]}:{q}"
                if key in PINS: prior.append(PINS[key]); sig.append(0.012)
                else: prior.append(w['start'] + dur * q / len(sy) + 0.08); sig.append(0.14)
                owner.append((w['i'], q, sy[q]))
        on = align_ipu(t, F, voiced, a, e, prior, sig)
        for (wi, q, lab), o in zip(owner, on):
            out.append(dict(i=wi, q=q, syl=lab, t=round(o, 3), ipu=k))
    first = {s['i']: s['t'] for s in out if s['q'] == 0}
    res = []
    for n, w in enumerate(words):
        w2 = dict(w); w2['whisper'] = w['start']; w2['start'] = first[w['i']]
        nxt_same = n + 1 < len(words) and words[n + 1]['ipu'] == w['ipu']
        w2['end'] = first[words[n + 1]['i']] if nxt_same else ipus[w['ipu']][1]
        res.append(w2)
    d = np.array([w['start'] - w['whisper'] for w in res])
    print('beat - whisper start: mean %.3f median %.3f p5 %.3f p95 %.3f' % (d.mean(), np.median(d), np.percentile(d, 5), np.percentile(d, 95)))
    json.dump(dict(words=res, syll=out, ipus=ipus, duration=T['duration']), open(SP + '/work/timing_dp.json', 'w'), ensure_ascii=False, indent=1)
