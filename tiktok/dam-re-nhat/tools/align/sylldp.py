"""Syllable-level acoustic alignment.
Vietnamese words are single syllables, so inside every pause-delimited unit we place the known syllable
sequence on the acoustic onset function with dynamic programming, using the Whisper times as a loose prior."""
import json, sys, re
import numpy as np
from acoustic import features

NUM = {'1': ['một'], '2': ['hai'], '3': ['ba'], '4': ['bốn'], '5': ['năm'], '6': ['sáu'], '10': ['mười'],
       '150': ['một', 'trăm', 'năm', 'mươi'], '1.000': ['một', 'nghìn'], '3.000': ['ba', 'nghìn'],
       '460': ['bốn', 'trăm', 'sáu', 'mươi'], '370': ['ba', 'trăm', 'bảy', 'mươi'], '75.000': ['bảy', 'mươi', 'lăm', 'nghìn'],
       '330': ['ba', 'trăm', 'ba', 'mươi'], '240': ['hai', 'trăm', 'bốn', 'mươi'], '100': ['một', 'trăm'],
       '570': ['năm', 'trăm', 'bảy', 'mươi'], '35': ['ba', 'mươi', 'lăm'], '36': ['ba', 'mươi', 'sáu'],
       'calo': ['ca', 'lo'], 'video': ['vi', 'đê', 'ô'], 'comment': ['com', 'men']}

def syllables(word):
    k = re.sub(r'[,.?!:…]+$', '', word).lower()
    return NUM.get(k, [k])

def align_ipu(t, F, a, e, prior, hop=0.005, bias=0.05, w_prior=1.0, beta=3.2, sig_p=0.13):
    """prior: list of prior onset times (first one is forced to `a`). Returns onset times."""
    n = len(prior)
    i0, i1 = int(round(a / hop)), int(round(e / hop))
    T = i1 - i0
    f = F[i0:i1].copy()
    mu = (e - a) / n
    dmin = max(8, int(0.07 / hop)); dmax = int(min(0.9, 3.2 * mu) / hop)
    INF = 1e18
    cost = np.full((n, T), INF); back = np.zeros((n, T), int)
    cost[0, 0] = 0
    tt = a + np.arange(T) * hop
    for j in range(1, n):
        local = -beta * f + w_prior * ((tt - (prior[j] + bias)) / sig_p) ** 2
        prev = cost[j - 1]
        for x in range(j * dmin, T - (n - 1 - j) * dmin):
            lo, hi = max(0, x - dmax), x - dmin
            if hi < lo: continue
            seg = prev[lo:hi + 1]
            d = (x - np.arange(lo, hi + 1)) * hop
            c = seg + 0.6 * ((d - mu) / (0.5 * mu)) ** 2
            k = int(np.argmin(c))
            if c[k] < INF / 2:
                cost[j, x] = c[k] + local[x]; back[j, x] = lo + k
    # last syllable: must leave at least dmin before the end
    x = int(np.argmin(cost[n - 1, :max(1, T - dmin)] if n > 1 else cost[0]))
    on = [0] * n
    for j in range(n - 1, 0, -1):
        on[j] = x; x = back[j, x]
    return [a + o * hop for o in on]

if __name__ == '__main__':
    SP = sys.argv[1]
    Fe = features(SP + '/audio_in/voice.wav')
    t = Fe['t']; flux = Fe['flux']
    F = np.clip(flux / np.percentile(flux, 99.3), 0, 1.3)
    T = json.load(open(SP + '/work/timing_final.json'))
    words, ipus = T['words'], T['ipus']
    OV = json.load(open(SP + '/work/syll_override.json')) if len(sys.argv) > 2 else {}
    out = []
    for k, (a, e) in enumerate(ipus):
        ws = [w for w in words if w['ipu'] == k]
        prior, owner = [], []
        for w in ws:
            sy = OV.get(str(w['i']), syllables(w['word']))
            dur = w['end'] - w['start']
            for q in range(len(sy)):
                prior.append(w['start'] + dur * q / len(sy)); owner.append((w['i'], q, sy[q]))
        on = align_ipu(t, F, a, e, prior)
        for (wi, q, lab), o in zip(owner, on):
            out.append(dict(i=wi, q=q, syl=lab, t=round(o, 3), ipu=k))
    # word-level
    first = {}
    for s in out:
        if s['q'] == 0: first[s['i']] = s['t']
    res = []
    for n, w in enumerate(words):
        w2 = dict(w); w2['whisper'] = w['start']; w2['start'] = first[w['i']]
        nxt_same = n + 1 < len(words) and words[n + 1]['ipu'] == w['ipu']
        w2['end'] = first[words[n + 1]['i']] if nxt_same else ipus[w['ipu']][1]
        res.append(w2)
    d = np.array([w['start'] - w['whisper'] for w in res])
    print('acoustic onset - whisper start: mean %.3f median %.3f p5 %.3f p95 %.3f' % (d.mean(), np.median(d), np.percentile(d, 5), np.percentile(d, 95)))
    json.dump(dict(words=res, syll=out, ipus=ipus, duration=T['duration']), open(SP + '/work/timing_dp.json', 'w'), ensure_ascii=False, indent=1)
