#!/usr/bin/env python3
"""Proof that picture and voice agree: for every word used as a visual cue, the 7 rendered frames around its beat.

usage: sync_sheet.py <frames_dir> <timing/sfx.json> <timing/timing.json> <out_dir> [--only 0:1,6:2] [--fps 30]

Read a strip left to right: the effect should start 1-2 frames before the yellow frame (+0, the beat)
and be fully landed on it. An effect that is still missing at +1 is late; one already settled at -3 is early.
"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

args = [a for a in sys.argv[1:] if not a.startswith("--")]
frames, sfx_path, timing_path, out_dir = args[:4]
fps = int(sys.argv[sys.argv.index("--fps") + 1]) if "--fps" in sys.argv else 30
only = set(sys.argv[sys.argv.index("--only") + 1].split(",")) if "--only" in sys.argv else None
cues = json.load(open(sfx_path, encoding="utf-8"))["cues"]
W = {(w["s"], w["k"]): w for w in json.load(open(timing_path, encoding="utf-8"))["words"]}
if only:
    cues = [c for c in cues if f"{c['s']}:{c['k']}" in only]
os.makedirs(out_dir, exist_ok=True)
fp = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "fonts", "BeVietnamPro-Bold.ttf")
font = ImageFont.truetype(fp, 15) if os.path.exists(fp) else ImageFont.load_default()
fw, fh, offs, ROWS = 144, 256, [-3, -2, -1, 0, 1, 2, 3], 6
n_frames = len([f for f in os.listdir(frames) if f.endswith(".png")])
for p in range(0, len(cues), ROWS):
    part = cues[p:p + ROWS]
    im = Image.new("RGB", (len(offs) * (fw + 3) + 250, len(part) * (fh + 4)), (40, 40, 40))
    d = ImageDraw.Draw(im)
    for r, c in enumerate(part):
        w = W[(c["s"], c["k"])]
        f = round(c["t"] * fps)
        d.text((6, r * (fh + 4) + 8), f"{c['s']}:{c['k']}" + (f" (+{c['q']})" if c["q"] else "") + f"\n{w['w']}\nbeat {c['t']:.3f}s\nframe {f}", fill=(255, 255, 255), font=font)
        for col, o in enumerate(offs):
            path = os.path.join(frames, f"f_{f + o:05d}.png")
            if not os.path.exists(path):
                continue
            fr = Image.open(path).resize((fw, fh), Image.LANCZOS)
            x = 250 + col * (fw + 3)
            im.paste(fr, (x, r * (fh + 4)))
            d.rectangle([x, r * (fh + 4), x + 34, r * (fh + 4) + 18], fill=(0, 0, 0))
            d.text((x + 3, r * (fh + 4)), f"{o:+d}", fill=(255, 255, 0) if o == 0 else (255, 255, 255), font=font)
            if o == 0:
                d.rectangle([x, r * (fh + 4), x + fw - 1, r * (fh + 4) + fh - 1], outline=(255, 255, 0), width=2)
    out = os.path.join(out_dir, f"sync_{p // ROWS:02d}.png")
    im.save(out)
    print(out)
