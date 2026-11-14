"""Acoustic landmarks: mel spectrogram, envelope and onset-strength; refine word starts to the nearest syllable onset."""
import json, sys
import numpy as np, soundfile as sf

def features(path, hop=0.005, win=0.025, n_mels=48):
    x, sr = sf.read(path, dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    H = int(sr * hop); Wn = int(sr * win); nfft = 1024
    pad = np.pad(x, (Wn // 2, Wn // 2))
    n = 1 + (len(pad) - Wn) // H
    idx = np.arange(Wn)[None, :] + H * np.arange(n)[:, None]
    fr = pad[idx] * np.hanning(Wn)
    S = np.abs(np.fft.rfft(fr, nfft, axis=1)) ** 2
    f = np.fft.rfftfreq(nfft, 1 / sr)
    mel = lambda hz: 2595 * np.log10(1 + hz / 700)
    edges = 700 * (10 ** (np.linspace(mel(80), mel(8000), n_mels + 2) / 2595) - 1)
    fb = np.zeros((n_mels, len(f)))
    for m in range(n_mels):
        lo, c, hi = edges[m], edges[m + 1], edges[m + 2]
        fb[m] = np.clip(np.minimum((f - lo) / (c - lo), (hi - f) / (hi - c)), 0, None)
    M = np.log(S @ fb.T + 1e-9)
    t = np.arange(n) * hop
    env = np.log(S[:, (f > 250) & (f < 4000)].sum(1) + 1e-9)
    k = np.ones(5) / 5
    env_s = np.convolve(env, k, mode='same')
    Ms = np.apply_along_axis(lambda v: np.convolve(v, np.ones(3) / 3, mode='same'), 0, M)
    flux = np.maximum(Ms[2:] - Ms[:-2], 0).sum(1)
    flux = np.concatenate([[0], flux, [0]])
    flux = np.convolve(flux, np.ones(3) / 3, mode='same')
    # voiced / vowel onsets: flux restricted to the low band (< ~1.1 kHz) - ignores breaths and fricative noise
    centers = edges[1:-1]
    lowb = centers < 1100
    lflux = np.maximum(Ms[2:, lowb] - Ms[:-2, lowb], 0).sum(1)
    lflux = np.concatenate([[0], lflux, [0]])
    lflux = np.convolve(lflux, np.ones(3) / 3, mode='same')
    # low-band energy (dB) for voicing, high-band energy for sibilants
    lowE = 10 * np.log10(S[:, (f > 90) & (f < 1000)].sum(1) + 1e-12)
    highE = 10 * np.log10(S[:, (f > 4000) & (f < 9000)].sum(1) + 1e-12)
    lowE = np.convolve(lowE, np.ones(4) / 4, mode='same'); highE = np.convolve(highE, np.ones(4) / 4, mode='same')
    return dict(t=t, M=M, env=env_s, flux=flux, lflux=lflux, lowE=lowE, highE=highE, sr=sr)

if __name__ == '__main__':
    SP = sys.argv[1]
    F = features(SP + '/audio_in/voice.wav')
    T = json.load(open(SP + '/work/timing_final.json'))
    A = {n: {w['i']: w for w in json.load(open(f'{SP}/work/ipu_align_{n}.json'))} for n in ('turbo', 'large-v3')}
    W0 = {w['i']: w for w in json.load(open(SP + '/work/timing_raw.json'))['words']}
    words, ipus = T['words'], T['ipus']
    t, flux = F['t'], F['flux']
    out = []
    moved = []
    for w in words:
        i = w['i']
        first = i == 0 or words[i - 1]['ipu'] != w['ipu']
        w = dict(w)
        if not first:
            c = [A['turbo'][i]['start'], A['large-v3'][i]['start'], W0[i]['start']]
            lo, hi = min(c) - 0.04, max(c) + 0.06
            a, e = ipus[w['ipu']]
            lo, hi = max(lo, a + 0.05), min(hi, e - 0.05)
            m = (t >= lo) & (t <= hi)
            if m.sum() > 2:
                seg = flux[m]; tt = t[m]
                # prefer onsets near the fused estimate: weight by a broad triangle around it
                wgt = 1 - 0.5 * np.abs(tt - w['start']) / max(1e-3, (hi - lo))
                j = int(np.argmax(seg * wgt))
                # onset time = where the flux peak begins to rise (walk back to 35% of the peak)
                pk = seg[j]; jj = j
                while jj > 0 and seg[jj - 1] > 0.35 * pk and seg[jj - 1] <= seg[jj] + 1e-9: jj -= 1
                w['onset'] = round(float(tt[jj]), 3); w['peak'] = round(float(tt[j]), 3); w['pk'] = round(float(pk), 2)
                moved.append(w['onset'] - w['start'])
        else:
            w['onset'] = w['start']
        out.append(w)
    moved = np.array(moved)
    print('onset - fused start: mean %.3f  median %.3f  p10 %.3f p90 %.3f' % (moved.mean(), np.median(moved), np.percentile(moved, 10), np.percentile(moved, 90)))
    json.dump(dict(words=out, ipus=ipus, duration=T['duration']), open(SP + '/work/timing_onset.json', 'w'), ensure_ascii=False, indent=1)
