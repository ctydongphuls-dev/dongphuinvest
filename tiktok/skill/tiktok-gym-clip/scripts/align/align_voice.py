#!/usr/bin/env python3
"""Timing of a Vietnamese voice-over, accurate to the vowel onset of every syllable.

  1) see what was really said and where the pauses are
       python3 align_voice.py transcribe voice.wav --models MODELS --out work
  2) write spoken.txt (one sentence per line, exactly as spoken), then
       python3 align_voice.py align voice.wav spoken.txt --models MODELS --out work
     -> work/syllables.json, work/report.txt, work/plots/*.png
     (no recognizer available? put a stand-alone || in spoken.txt at every pause of the recording
      and run the same command: it then needs no --models content and no download)
  3) look at the plots; fix a wrong beat with a pin and re-run (fast, the recognizer results are cached)
       python3 align_voice.py align voice.wav spoken.txt --models MODELS --out work --pins pins.json
     pins.json: {"<sentence>:<token>:<syllable>": seconds, ...}   e.g. {"13:8:0": 35.325}

MODELS is a folder prepared by fetch_models.sh.
"""
import argparse
import difflib
import json
import os
import re
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import acoustic  # noqa: E402
from vi_text import norm_words, parse_spoken  # noqa: E402

MAX_WIN = 24.0


def make_windows(units, dur):
    """group speech units into recognizer windows (<= 24 s), cutting at the longest pause available"""
    wins, i = [], 0
    while i < len(units):
        j = i
        while j + 1 < len(units) and units[j + 1][1] - units[i][0] <= MAX_WIN:
            j += 1
        if j + 1 < len(units) and j > i:
            # prefer the biggest pause in the second half of the candidate window
            cands = [k for k in range(i, j + 1) if units[k][1] - units[i][0] >= MAX_WIN * 0.45] or [j]
            j = max(cands, key=lambda k: units[k + 1][0] - units[k][1])
        wins.append((i, j))
        i = j + 1
    out = []
    for (i, j) in wins:
        a = 0.0 if i == 0 else (units[i - 1][1] + units[i][0]) / 2
        b = dur if j == len(units) - 1 else (units[j][1] + units[j + 1][0]) / 2
        out.append(dict(first=i, last=j, a=round(max(a, units[i][0] - 0.4), 3), b=round(min(b, units[j][1] + 0.4), 3)))
    return out


def unit_clip(units, k, dur):
    a, b = units[k]
    lo = 0.0 if k == 0 else (units[k - 1][1] + a) / 2
    hi = dur if k == len(units) - 1 else (b + units[k + 1][0]) / 2
    return max(lo, a - 0.15), min(hi, b + 0.15)


def load_models(args):
    from aligner import Aligner
    from whisper_onnx import load_audio_16k
    return Aligner(args.models, "turbo", threads=args.threads), load_audio_16k(args.voice)


def cached_asr(args, A, audio, wins):
    path = os.path.join(args.out, "asr_windows.json")
    cache = json.load(open(path, encoding="utf-8")) if os.path.exists(path) else {}
    for w in wins:
        key = f"{w['a']:.3f}-{w['b']:.3f}"
        if key not in cache:
            cache[key] = A.transcribe(audio, w["a"], w["b"])
            json.dump(cache, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        w["asr"] = cache[key]
    return wins


def cmd_transcribe(args):
    os.makedirs(args.out, exist_ok=True)
    F = acoustic.features(args.voice)
    units = acoustic.speech_units(F)
    wins = make_windows(units, F["dur"])
    A, audio = load_models(args)
    cached_asr(args, A, audio, wins)
    lines = [f"# duration {F['dur']:.2f}s, {len(units)} speech units, {len(wins)} windows"]
    for w in wins:
        lines.append(f"[{w['a']:7.2f} - {w['b']:7.2f}]  {w['asr']}")
    lines.append("")
    lines.append("# speech units (pause before | start -> end)")
    prev = 0.0
    for k, (a, b) in enumerate(units):
        lines.append(f"{k:3d}  pause {a - prev:5.2f} | {a:7.3f} -> {b:7.3f}  ({b - a:.2f}s)")
        prev = b
    open(os.path.join(args.out, "asr.txt"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
    json.dump(dict(duration=F["dur"], units=units, windows=wins), open(os.path.join(args.out, "pauses.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("\n".join(lines))


def split_tokens_over_windows(tokens, wins):
    """decide which transcript tokens belong to which window by matching the recognizer text"""
    asr_words, asr_win = [], []
    for wi, w in enumerate(wins):
        ws = norm_words(w["asr"])
        asr_words += ws
        asr_win += [wi] * len(ws)
    tr_words, tr_tok = [], []
    for ti, tk in enumerate(tokens):
        ws = norm_words(tk["text"]) or ["?"]
        tr_words += ws
        tr_tok += [ti] * len(ws)
    sm = difflib.SequenceMatcher(None, asr_words, tr_words, autojunk=False)
    pairs = [(a + d, b + d) for a, b, n in sm.get_matching_blocks() for d in range(n)]
    ratio = sm.ratio()
    cuts = []
    for wi in range(len(wins) - 1):
        p = sum(1 for x in asr_win if x <= wi)                  # asr words before this boundary
        before = [b for a, b in pairs if a < p]
        after = [b for a, b in pairs if a >= p]
        q = (max(before) + 1) if before else 0
        if after and min(after) > q:                            # unmatched transcript words around the cut:
            q = (q + min(after) + 1) // 2                       # split them down the middle
        q = min(max(q, 0), len(tr_words) - 1)
        cuts.append(tr_tok[q])
    cuts = [0] + cuts + [len(tokens)]
    for i in range(1, len(cuts)):                               # keep at least one token per window
        cuts[i] = max(cuts[i], cuts[i - 1] + 1) if i < len(cuts) - 1 else cuts[i]
    return cuts, ratio


def clean(text):
    return re.sub(r"\{\d+\}", "", text)


def assign_units(tokens, units):
    """each pause between speech units sits on one word boundary: pick the nearest (monotonic)"""
    N = len(tokens)
    bnd = [tokens[i]["w_end"] for i in range(N - 1)]
    gaps = [(units[k][1], units[k + 1][0]) for k in range(len(units) - 1)]
    dist = lambda x, g: 0.0 if g[0] <= x <= g[1] else min(abs(x - g[0]), abs(x - g[1]))
    lo, at = 0, []
    for gi, g in enumerate(gaps):
        hi = (N - 1) - (len(gaps) - 1 - gi)                     # leave one boundary per remaining gap
        d, i = min((dist(bnd[i], g), i) for i in range(lo, max(lo + 1, hi)))
        at.append(i)
        lo = i + 1
    return at                                                    # at[g] = index of the last token before gap g


def unit_index(N, at):
    idx, k = [], 0
    cut = set(at)
    for i in range(N):
        idx.append(k)
        if i in cut:
            k += 1
    return idx


def verify_units(A, audio, tokens, units, at, dur, log):
    """move a word across a pause when the recognizer clearly prefers it there"""
    txt = lambda ids: " ".join(clean(tokens[i]["text"]) for i in ids)
    changed = True
    passes = 0
    while changed and passes < 3:
        changed = False
        passes += 1
        for g in range(len(at)):
            first = 0 if g == 0 else at[g - 1] + 1
            last = at[g]
            nxt_last = at[g + 1] if g + 1 < len(at) else len(tokens) - 1
            L = list(range(first, last + 1))
            R = list(range(last + 1, nxt_last + 1))
            opts = {"A": (L, R)}
            if len(L) > 1:
                opts["B"] = (L[:-1], [L[-1]] + R)
            if len(R) > 1:
                opts["C"] = (L + [R[0]], R[1:])
            sc = {}
            for o, (l, r) in opts.items():
                a0, b0 = unit_clip(units, g, dur)
                a1, b1 = unit_clip(units, g + 1, dur)
                sc[o] = A.score(audio, a0, b0, txt(l)) + A.score(audio, a1, b1, txt(r))
            best = max(sc, key=sc.get)
            if best != "A" and sc[best] - sc["A"] > 3.0:
                at[g] += -1 if best == "B" else 1
                changed = True
                log.append(f"pause {g} ({units[g][1]:.2f}-{units[g + 1][0]:.2f}s): moved a word across it -> now after '{tokens[at[g]]['text']}'  (scores {sc})")
    return at


def cmd_align(args):
    os.makedirs(args.out, exist_ok=True)
    tokens = parse_spoken(open(args.spoken, encoding="utf-8").read())
    if not tokens:
        sys.exit("spoken.txt is empty")
    F = acoustic.features(args.voice)
    dur = F["dur"]
    units = acoustic.speech_units(F)
    wins = make_windows(units, dur)
    log = []
    manual = any(t["brk"] for t in tokens)
    if manual:
        # no recognizer: the transcript says where the pauses fall ("||"), words are spread evenly inside each unit
        at = [i - 1 for i, t in enumerate(tokens) if t["brk"]]
        if len(at) != len(units) - 1:
            listing = "\n".join(f"  unit {k}: {a:.2f}-{b:.2f}s ({b - a:.2f}s)" for k, (a, b) in enumerate(units))
            sys.exit(f"spoken.txt has {len(at)} '||' marks but the recording has {len(units) - 1} pauses between {len(units)} speech units:\n{listing}")
        uid = unit_index(len(tokens), at)
        for k, (a, e) in enumerate(units):
            ids = [i for i in range(len(tokens)) if uid[i] == k]
            total, acc = sum(tokens[i]["nsyl"] for i in ids), 0
            for i in ids:
                tokens[i]["w_start"] = a + (e - a) * acc / total
                acc += tokens[i]["nsyl"]
                tokens[i]["w_end"] = a + (e - a) * acc / total
        log.append("manual mode: pauses taken from the '||' marks, no recognizer used - check every plot page")
    cache_path = os.path.join(args.out, "whisper_times.json")
    sig = json.dumps([[t["s"], t["k"], t["text"]] for t in tokens], ensure_ascii=False)
    cache = json.load(open(cache_path, encoding="utf-8")) if os.path.exists(cache_path) else {}
    if manual:
        pass
    elif cache.get("sig") == sig and cache.get("units") == units:
        for t, c in zip(tokens, cache["tokens"]):
            t.update(c)
        at = cache["at"]
        log += cache.get("log", [])
    else:
        A, audio = load_models(args)
        cached_asr(args, A, audio, wins)
        cuts, ratio = split_tokens_over_windows(tokens, wins)
        if ratio < 0.6:
            log.append(f"WARNING: spoken.txt matches the recognizer text poorly (similarity {ratio:.2f}); check the wording.")
        for wi, w in enumerate(wins):
            ids = list(range(cuts[wi], cuts[wi + 1]))
            if not ids:
                continue
            res = A.align(audio, w["a"], w["b"], " ".join(clean(tokens[i]["text"]) for i in ids))
            if len(res) != len(ids):
                sys.exit(f"window {wi}: {len(ids)} transcript tokens but the tokenizer made {len(res)} words; "
                         f"avoid tokens that contain spaces or stand-alone punctuation: {[r['word'] for r in res]}")
            for i, r in zip(ids, res):
                tokens[i]["w_start"], tokens[i]["w_end"] = round(r["start"], 3), round(r["end"], 3)
        if len(units) > len(tokens):
            sys.exit("more speech units than words: is spoken.txt complete?")
        at = assign_units(tokens, units)
        if not args.no_verify:
            at = verify_units(A, audio, tokens, units, at, dur, log)
        json.dump(dict(sig=sig, units=units, at=at, log=log, tokens=[dict(w_start=t["w_start"], w_end=t["w_end"]) for t in tokens]),
                  open(cache_path, "w", encoding="utf-8"), ensure_ascii=False)
    N = len(tokens)
    uidx = unit_index(N, at)
    pins = json.load(open(args.pins, encoding="utf-8")) if args.pins else {}
    onset = acoustic.onset_strength(F)
    for k, (a, e) in enumerate(units):
        ids = [i for i in range(N) if uidx[i] == k]
        # clamp the recognizer's boundaries into the unit
        edges = [a] + [min(max(tokens[i]["w_end"], a), e) for i in ids[:-1]] + [e]
        for j in range(1, len(edges) - 1):
            edges[j] = max(edges[j], edges[j - 1] + 0.08)
        for j in range(len(edges) - 2, 0, -1):
            edges[j] = min(edges[j], edges[j + 1] - 0.08)
        prior, sg, owner = [], [], []
        for j, i in enumerate(ids):
            st, en, n = edges[j], edges[j + 1], tokens[i]["nsyl"]
            tokens[i]["whisper"] = round(st, 3)
            for q in range(n):
                key = f"{tokens[i]['s']}:{tokens[i]['k']}:{q}"
                if key in pins:
                    prior.append(float(pins[key])); sg.append(0.012)
                elif manual:                      # even spacing is only a rough guess: trust the sound more
                    prior.append(st + (en - st) * q / n + 0.03); sg.append(0.3)
                else:
                    prior.append(st + (en - st) * q / n + 0.08); sg.append(0.14)
                owner.append((i, q))
        beats = acoustic.place_syllables(F, a, e, prior, sg)
        for (i, q), b in zip(owner, beats):
            tokens[i].setdefault("sub", []).append(round(b, 3))
    for n, t in enumerate(tokens):
        t["i"], t["unit"], t["t"] = n, uidx[n], t["sub"][0]
    for n, t in enumerate(tokens):
        t["end"] = tokens[n + 1]["t"] if n + 1 < N and uidx[n + 1] == uidx[n] else units[uidx[n]][1]
    # ---- report: where to look first on the plot pages
    rep = list(log)
    lowE, highE, tt = F["lowE"], F["highE"], F["t"]
    pk, hpk = np.percentile(lowE, 99), np.percentile(highE, 99.5)
    for k, (a, e) in enumerate(units):
        m = np.where((tt >= a + 0.05) & (tt <= e - 0.05))[0]
        run, start = 0, None
        for x in list(m) + [None]:
            q = x is not None and lowE[x] < pk - 32 and highE[x] < hpk - 18
            if q:
                start = tt[x] if run == 0 else start
                run += 1
            else:
                if run * acoustic.HOP >= 0.2:
                    rep.append(f"unit {k}: quiet gap {start:.2f}-{start + run * acoustic.HOP:.2f}s inside speech (breath or pause) - no beat should sit in it")
                run = 0
    for k in range(len(units)):
        ids = [i for i in range(N) if uidx[i] == k]
        per = [(tokens[i]["end"] - tokens[i]["t"]) / tokens[i]["nsyl"] for i in ids]
        med = float(np.median(per)) if per else 0.2
        for i, d in zip(ids, per):
            t = tokens[i]
            fr = int(round(t["t"] / acoustic.HOP))
            strength = float(onset[max(0, fr - 2):fr + 3].max())
            notes = []
            if strength < 0.15:
                notes.append(f"weak onset ({strength:.2f})")
            if d < 0.09:
                notes.append(f"very short ({d:.2f}s)")
            if i != ids[-1] and d > max(0.3, 1.7 * med):
                notes.append(f"long ({d:.2f}s) - a syllable may have been skipped right after it")
            if notes:
                rep.append(f"{t['s']}:{t['k']} '{clean(t['text'])}' at {t['t']:.2f}s - " + ", ".join(notes))
    open(os.path.join(args.out, "report.txt"), "w", encoding="utf-8").write("\n".join(rep) + "\n")
    out = dict(duration=round(dur, 3), units=units,
               tokens=[dict(i=t["i"], s=t["s"], k=t["k"], text=t["text"], nsyl=t["nsyl"], t=t["t"], end=round(t["end"], 3),
                            unit=t["unit"], sub=t["sub"], whisper=t["whisper"]) for t in tokens])
    json.dump(out, open(os.path.join(args.out, "syllables.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    # ---- human-readable listing
    cur = -1
    line = []
    for t in tokens:
        if t["s"] != cur:
            if line:
                print(" ".join(line))
            cur = t["s"]; line = [f"s{cur:<2d}"]
        line.append(f"{clean(t['text'])}[{t['t']:.2f}]")
    print(" ".join(line))
    print(f"\n{N} tokens, {len(units)} speech units -> {args.out}/syllables.json")
    print(f"{len(rep)} note(s) in {args.out}/report.txt" + (":" if rep else ""))
    for r in rep[:40]:
        print("  -", r)
    if not args.no_plots:
        from plot_pages import pages
        n = pages(F, out, os.path.join(args.out, "plots"))
        print(f"{n} plot page(s) in {args.out}/plots  (green = first syllable of a word, blue = later syllables, dotted = recognizer)")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    for name in ("transcribe", "align"):
        p = sub.add_parser(name)
        p.add_argument("voice")
        if name == "align":
            p.add_argument("spoken")
            p.add_argument("--pins")
            p.add_argument("--no-verify", action="store_true", help="skip the word-across-pause check (saves a few minutes)")
            p.add_argument("--no-plots", action="store_true")
        p.add_argument("--models", required=(name == "transcribe"), default="")
        p.add_argument("--out", default="work")
        p.add_argument("--threads", type=int, default=4)
    args = ap.parse_args()
    (cmd_transcribe if args.cmd == "transcribe" else cmd_align)(args)


if __name__ == "__main__":
    main()
