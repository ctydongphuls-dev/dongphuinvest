"""Forced alignment and forced scoring with the Whisper ONNX decoder
(cross-attention + DTW, a numpy port of whisper.timing.find_alignment)."""
import os
import string
import sys

import numpy as np
import onnxruntime as ort
from scipy.ndimage import median_filter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from whisper_onnx import SR, HOP, N_SAMPLES, Whisper, log_mel, log_softmax, pad_or_trim  # noqa: E402

# (layer, head) pairs whose cross-attention tracks time, from openai-whisper's _ALIGNMENT_HEADS
HEADS = {
    "turbo": [(2, 4), (2, 11), (3, 3), (3, 6), (3, 11), (3, 14)],
    "large-v3": [(7, 0), (10, 17), (12, 18), (13, 12), (16, 1), (17, 14), (19, 11), (21, 4), (24, 1), (25, 6)],
}
ATTN_DEC = {"turbo": "decoder_turbo_attn.onnx", "large-v3": "decoder_large_v3_attn.onnx"}


def dtw(x):
    N, M = x.shape
    cost = np.full((N + 1, M + 1), np.inf)
    trace = -np.ones((N + 1, M + 1), np.int8)
    cost[0, 0] = 0
    for j in range(1, M + 1):
        cj, cp = cost[:, j], cost[:, j - 1]
        for i in range(1, N + 1):
            c0, c1, c2 = cp[i - 1], cj[i - 1], cp[i]
            if c0 < c1 and c0 < c2:
                c, t = c0, 0
            elif c1 < c0 and c1 < c2:
                c, t = c1, 1
            else:
                c, t = c2, 2
            cj[i] = x[i - 1, j - 1] + c
            trace[i, j] = t
    i, j = N, M
    trace[0, :] = 2
    trace[:, 0] = 1
    res = []
    while i > 0 or j > 0:
        res.append((i - 1, j - 1))
        if trace[i, j] == 0:
            i -= 1
            j -= 1
        elif trace[i, j] == 1:
            i -= 1
        else:
            j -= 1
    res = np.array(res)[::-1]
    return res[:, 0], res[:, 1]


class Aligner:
    def __init__(self, model_dir, name="turbo", threads=4):
        self.w = Whisper(model_dir, name, threads)
        so = ort.SessionOptions()
        so.intra_op_num_threads = threads
        so.log_severity_level = 3
        self.dec_attn = ort.InferenceSession(os.path.join(model_dir, ATTN_DEC[name]), so, providers=["CPUExecutionProvider"])
        self.heads = HEADS[name]
        self._feat = {}

    def feats(self, audio, start, end):
        key = (round(start, 3), round(end, 3))
        if key not in self._feat:
            a = audio[int(start * SR):int(end * SR)]
            self._feat[key] = (self.w.encode(pad_or_trim(log_mel(a, self.w.n_mels, pad_samples=N_SAMPLES))), len(a) // HOP)
        return self._feat[key]

    def transcribe(self, audio, start, end):
        feats, _ = self.feats(audio, start, end)
        toks, _, _ = self.w.decode_window(feats)
        return self.w.tok.decode(toks).strip()

    def score(self, audio, start, end, text):
        """log-likelihood of `text` for audio[start:end]; used to decide between wordings / word placements"""
        t = self.w.tok
        feats, _ = self.feats(audio, start, end)
        tt = t.encode(" " + text.strip())
        tokens = self.w.sot_seq + [t.no_timestamps] + tt + [t.eot]
        logits, _ = self.w.dec_full(tokens, feats)
        lp = log_softmax(logits[len(self.w.sot_seq):-1].astype(np.float64))
        tgt = tt + [t.eot]
        return float(lp[np.arange(len(tgt)), tgt].sum())

    def _split_words(self, text_tokens):
        t = self.w.tok
        subs, cur = [], []
        for tk in text_tokens:
            cur.append(tk)
            s = t.enc.decode(cur)
            if "�" not in s:
                subs.append((s, cur))
                cur = []
        words = []
        for s, toks in subs:
            punct = s.strip() != "" and all(ch in string.punctuation + "…“”‘’" for ch in s.strip())
            if not words or (s.startswith(" ") and not punct):
                words.append([s, list(toks)])
            else:
                words[-1][0] += s
                words[-1][1] += toks
        return words

    def align(self, audio, start, end, text, medfilt=7):
        """word start/end times (absolute seconds) for `text` inside audio[start:end] (max 30 s)"""
        t = self.w.tok
        feats, num_frames = self.feats(audio, start, end)
        tt = t.encode(" " + text.strip())
        tokens = self.w.sot_seq + [t.no_timestamps] + tt + [t.eot]
        out = self.dec_attn.run(None, {"tokens": np.asarray(tokens, np.int64)[None], "audio_features": feats,
                                       "kv_cache": self.w._new_kv(), "offset": np.array(0, np.int64)})
        attns = out[2:]
        W = np.stack([attns[l][0, h] for l, h in self.heads]).astype(np.float64)
        nf = max(1, num_frames // 2)
        W = W[:, :, :nf]
        W = W / W.sum(-1, keepdims=True)
        W = (W - W.mean(-2, keepdims=True)) / W.std(-2, keepdims=True)
        W = median_filter(W, size=(1, 1, medfilt), mode="mirror")
        M = W.mean(0)[len(self.w.sot_seq):-1]
        ti, fi = dtw(-M)
        jumps = np.pad(np.diff(ti), (1, 0), constant_values=1).astype(bool)
        jt = np.append(fi[jumps] / 50.0, nf / 50.0)
        words = self._split_words(tt)
        bounds = np.pad(np.cumsum([len(w[1]) for w in words]), (1, 0))
        res = []
        for k, (s, _) in enumerate(words):
            res.append(dict(word=s.strip(), start=float(start + jt[bounds[k]]), end=float(start + jt[min(bounds[k + 1], len(jt) - 1)])))
        return res
