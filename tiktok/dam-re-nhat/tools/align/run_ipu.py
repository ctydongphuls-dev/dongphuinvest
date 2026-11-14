"""Per-IPU verification + per-IPU alignment.
1) free transcription of every IPU clip (turbo only)  2) boundary word-shift test  3) per-IPU forced alignment."""
import sys, json, time, re
sys.path.insert(0, '.')
from align import Aligner
from whisper_onnx import load_audio_16k
SP = sys.argv[1]; name = sys.argv[2]; do_free = len(sys.argv) > 3 and sys.argv[3] == 'free'
audio = load_audio_16k(SP + '/audio_in/voice.wav')
T = json.load(open(SP + '/work/timing_raw.json'))
words, ipus = T['words'], T['ipus']
K = len(ipus)
A = Aligner(SP + '/models', name)
def clip_bounds(k):
    a, b = ipus[k]
    lo = 0.0 if k == 0 else (ipus[k - 1][1] + a) / 2
    hi = len(audio) / 16000 if k == K - 1 else (b + ipus[k + 1][0]) / 2
    return max(lo, a - 0.15), min(hi, b + 0.15)
grp = [[w for w in words if w['ipu'] == k] for k in range(K)]
txt = lambda ws: ' '.join(w['word'] for w in ws)
res = dict(free=[], shift=[], align=[])
if do_free:
    for k in range(K):
        a, b = clip_bounds(k)
        r = A.w.transcribe_clip(audio, a, b)
        res['free'].append(r['text'])
        print(f"IPU{k:2d} [{ipus[k][0]:7.3f}-{ipus[k][1]:7.3f}]  ASR: {r['text'].strip()!r:60s} | assigned: {txt(grp[k])!r}", flush=True)
# boundary shift test
print('--- shift test (A=current, B=last word of k moves right, C=first word of k+1 moves left)')
for k in range(K - 1):
    L, R = grp[k], grp[k + 1]
    opts = {'A': (L, R)}
    if len(L) > 1: opts['B'] = (L[:-1], [L[-1]] + R)
    if len(R) > 1: opts['C'] = (L + [R[0]], R[1:])
    sc = {}
    for o, (l, r) in opts.items():
        a0, b0 = clip_bounds(k); a1, b1 = clip_bounds(k + 1)
        sc[o] = A.score(audio, a0, b0, txt(l))[0] + A.score(audio, a1, b1, txt(r))[0]
    best = max(sc, key=sc.get)
    res['shift'].append(sc)
    flag = '' if best == 'A' else f'   <-- prefers {best}'
    print(f" gap{k:2d} '{L[-1]['word']}' | '{R[0]['word']}'  " + '  '.join(f"{o}={v:7.2f}" for o, v in sc.items()) + flag, flush=True)
json.dump(res, open(SP + f'/work/ipu_check_{name}.json', 'w'), ensure_ascii=False, indent=1)
