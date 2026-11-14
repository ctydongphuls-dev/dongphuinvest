import json, sys
import numpy as np
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from acoustic import features
SP = sys.argv[1]; t0 = float(sys.argv[2]); t1 = float(sys.argv[3]); out = sys.argv[4]
rows = int(sys.argv[5]) if len(sys.argv) > 5 else 3
F = features(SP + '/audio_in/voice.wav')
T = json.load(open(SP + '/work/timing_dp.json'))
span = (t1 - t0) / rows
fig, axes = plt.subplots(rows, 1, figsize=(17, 3.4 * rows), dpi=100)
if rows == 1: axes = [axes]
t = F['t']
for r, ax in enumerate(axes):
    a, b = t0 + r * span, t0 + (r + 1) * span
    m = (t >= a) & (t <= b)
    ax.imshow(F['M'][m].T, origin='lower', aspect='auto', extent=[a, b, 0, 48], cmap='magma', vmin=np.percentile(F['M'], 30), vmax=F['M'].max())
    fl = F['lflux'][m]; ax.plot(t[m], 48 + 12 * np.clip(fl / np.percentile(F['lflux'], 99.3), 0, 1.3), color='c', lw=1.1)
    le = F['lowE'][m]; ax.plot(t[m], 48 + 12 * np.clip((le - (np.percentile(F['lowE'], 99) - 40)) / 40, 0, 1), color='w', lw=0.8)
    he = F['highE'][m]; ax.plot(t[m], 48 + 12 * np.clip((he - (np.percentile(F['highE'], 99.5) - 35)) / 35, 0, 1), color='orange', lw=0.7)
    ax.set_ylim(0, 72); ax.set_xlim(a, b)
    ax.set_xticks(np.arange(np.ceil(a * 10) / 10, b, 0.1)); ax.tick_params(axis='x', labelsize=7, rotation=90)
    ax.set_facecolor('k')
    for w in T['words']:
        if a - 0.01 <= w['whisper'] <= b: ax.axvline(w['whisper'], color='yellow', lw=0.8, ls=':', ymax=0.66)
    for n, s in enumerate(T['syll']):
        if s['t'] < a - 0.01 or s['t'] > b: continue
        col = 'lime' if s['q'] == 0 else 'deepskyblue'
        ax.axvline(s['t'], color=col, lw=1.5)
        ax.text(s['t'] + 0.006, 66 if n % 2 == 0 else 60, s['syl'], color=col, fontsize=10, va='center', fontweight='bold')
plt.tight_layout(); plt.savefig(out); print('wrote', out)
