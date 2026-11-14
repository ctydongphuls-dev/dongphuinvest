"""Spectrogram pages with the placed beats, for checking the alignment by eye.

Reading a page: bright blobs are vowels; a beat line should sit at the left edge of its blob.
White curve = low-band (voiced) energy, cyan = vowel-onset strength, orange = high band (s, x, kh, ch...).
Weak horizontal bands with no energy at the bottom are breaths: no beat belongs there."""
import os

import numpy as np


def pages(F, result, out_dir, span=7.2, rows=3):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    os.makedirs(out_dir, exist_ok=True)
    t, M = F["t"], F["M"]
    lf = np.clip(F["lflux"] / np.percentile(F["lflux"], 99.3), 0, 1.3)
    le = np.clip((F["lowE"] - (np.percentile(F["lowE"], 99) - 40)) / 40, 0, 1)
    he = np.clip((F["highE"] - (np.percentile(F["highE"], 99.5) - 35)) / 35, 0, 1)
    vmin, vmax = np.percentile(M, 30), M.max()
    dur = result["duration"]
    n_pages = int(np.ceil(dur / span))
    row = span / rows
    for p in range(n_pages):
        fig, axes = plt.subplots(rows, 1, figsize=(17, 3.4 * rows), dpi=100)
        for r, ax in enumerate(np.atleast_1d(axes)):
            a, b = p * span + r * row, p * span + (r + 1) * row
            m = (t >= a) & (t <= b)
            if m.sum() < 2:
                ax.axis("off")
                continue
            ax.imshow(M[m].T, origin="lower", aspect="auto", extent=[a, b, 0, 48], cmap="magma", vmin=vmin, vmax=vmax)
            ax.plot(t[m], 48 + 12 * lf[m], color="c", lw=1.1)
            ax.plot(t[m], 48 + 12 * le[m], color="w", lw=0.8)
            ax.plot(t[m], 48 + 12 * he[m], color="orange", lw=0.7)
            ax.set_ylim(0, 72)
            ax.set_xlim(a, b)
            ax.set_xticks(np.arange(np.ceil(a * 10) / 10, b, 0.1))
            ax.tick_params(axis="x", labelsize=7, rotation=90)
            ax.set_facecolor("k")
            n = 0
            for tk in result["tokens"]:
                if a - 0.01 <= tk["whisper"] <= b:
                    ax.axvline(tk["whisper"], color="yellow", lw=0.8, ls=":", ymax=0.66)
                for q, bt in enumerate(tk["sub"]):
                    if bt < a - 0.01 or bt > b:
                        continue
                    col = "lime" if q == 0 else "deepskyblue"
                    ax.axvline(bt, color=col, lw=1.5)
                    label = f"{tk['s']}:{tk['k']} {tk['text']}" if q == 0 else f"+{q}"
                    ax.text(bt + 0.006, 66 if n % 2 == 0 else 60, label, color=col, fontsize=9, va="center", fontweight="bold")
                    n += 1
        plt.tight_layout()
        plt.savefig(os.path.join(out_dir, f"page_{p:02d}_{p * span:05.1f}s.png"))
        plt.close(fig)
    return n_pages
