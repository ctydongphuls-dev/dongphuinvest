"""Per-IPU forced alignment (each pause-delimited unit aligned on its own short clip)."""
import sys, json, time
sys.path.insert(0, '.')
from align import Aligner
from whisper_onnx import load_audio_16k
SP = sys.argv[1]; name = sys.argv[2]
audio = load_audio_16k(SP + '/audio_in/voice.wav')
T = json.load(open(SP + '/work/timing_raw.json'))
words, ipus = T['words'], T['ipus']
K = len(ipus)
A = Aligner(SP + '/models', name)
if name == 'turbo':
    for txt in ["Mỗi gam chỉ khoảng 100 đồng, rẻ hơn trứng 4 lần,", "Mỗi gam chỉ khoảng 100 đồng, rẻ hơn 4 lần,"]:
        print('score', round(A.score(audio, 54.2, 57.34, txt)[0], 2), txt, flush=True)
out = []
for k in range(K):
    a, b = ipus[k]
    lo = 0.0 if k == 0 else (ipus[k - 1][1] + a) / 2
    hi = len(audio) / 16000 if k == K - 1 else (b + ipus[k + 1][0]) / 2
    ca, cb = max(lo, a - 0.15), min(hi, b + 0.15)
    ws = [w for w in words if w['ipu'] == k]
    al, _ = A.align(audio, ca, cb, ' '.join(w['word'] for w in ws))
    assert len(al) == len(ws), (k, len(al), len(ws))
    for w, x in zip(ws, al):
        out.append(dict(i=w['i'], word=w['word'], ipu=k, start=x['start'], end=x['end']))
    print(k, ' '.join(f"{x['word']}[{x['start']:.2f}]" for x in al), flush=True)
json.dump(out, open(SP + f'/work/ipu_align_{name}.json', 'w'), ensure_ascii=False, indent=1)
