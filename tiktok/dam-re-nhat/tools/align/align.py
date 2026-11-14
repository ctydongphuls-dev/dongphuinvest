"""Forced alignment + forced scoring with the Whisper ONNX decoder
(port of whisper.timing.find_alignment using cross-attention + DTW)."""
import os
import string
import sys

import numpy as np
import onnxruntime as ort
from scipy.ndimage import median_filter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from whisper_onnx import SR, HOP, N_SAMPLES, Whisper, log_mel, log_softmax, pad_or_trim  # noqa: E402

HEADS = {
    "turbo": [(2, 4), (2, 11), (3, 3), (3, 6), (3, 11), (3, 14)],
    "large-v3": [(7, 0), (10, 17), (12, 18), (13, 12), (16, 1), (17, 14), (19, 11), (21, 4), (24, 1), (25, 6)],
}
ATTN_DEC = {"turbo": "decoder_turbo_attn.onnx", "large-v3": "decoder_large_v3_attn.onnx"}


def dtw(x):
    N, M = x.shape
    cost = np.full((N + 1, M + 1), np.inf, np.float64)
    trace = -np.ones((N + 1, M + 1), np.int8)
    cost[0, 0] = 0
    for j in range(1, M + 1):
        cj = cost[:, j]
        cp = cost[:, j - 1]
        for i in range(1, N + 1):
            c0 = cp[i - 1]
            c1 = cj[i - 1]
            c2 = cp[i]
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
        self.dec_attn = ort.InferenceSession(os.path.join(model_dir, ATTN_DEC[name]), so,
                                             providers=["CPUExecutionProvider"])
        self.heads = HEADS[name]
        self.name = name
        self._feat_cache = {}

    def feats(self, audio, start, end):
        key = (round(start, 3), round(end, 3))
        if key not in self._feat_cache:
            a = audio[int(start * SR):int(end * SR)]
            mel = pad_or_trim(log_mel(a, self.w.n_mels, pad_samples=N_SAMPLES))
            self._feat_cache[key] = (self.w.encode(mel), len(a) // HOP)
        return self._feat_cache[key]

    def _run(self, tokens, feats):
        out = self.dec_attn.run(None, {
            "tokens": np.asarray(tokens, np.int64)[None],
            "audio_features": feats,
            "kv_cache": self.w._new_kv(),
            "offset": np.array(0, np.int64)})
        return out[0][0], out[2:]

    def score(self, audio, start, end, text):
        """Log-likelihood of `text` for audio[start:end] (forced decoding, no timestamps)."""
        t = self.w.tok
        feats, _ = self.feats(audio, start, end)
        tt = t.encode(" " + text.strip())
        tokens = self.w.sot_seq + [t.no_timestamps] + tt + [t.eot]
        logits, _ = self.w.dec_full(tokens, feats)
        lp = log_softmax(logits[len(self.w.sot_seq):-1].astype(np.float64))
        tgt = tt + [t.eot]
        per = lp[np.arange(len(tgt)), tgt]
        return float(per.sum()), [(t.enc.decode([x]) if x < t.eot else "<eot>", float(p)) for x, p in zip(tgt, per)]

    def split_words(self, text_tokens):
        """Group tokens into space-separated words (punctuation merged into the previous word)."""
        t = self.w.tok
        # unicode-safe subwords
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
        """Word-level alignment of `text` within audio[start:end]. Times are absolute seconds."""
        t = self.w.tok
        feats, num_frames = self.feats(audio, start, end)
        tt = t.encode(" " + text.strip())
        tokens = self.w.sot_seq + [t.no_timestamps] + tt + [t.eot]
        logits, attns = self._run(tokens, feats)
        lp = log_softmax(logits[len(self.w.sot_seq):-1].astype(np.float64))
        tok_lp = lp[np.arange(len(tt)), tt]
        W = np.stack([attns[l][0, h] for l, h in self.heads]).astype(np.float64)  # H, T, 1500
        nf = max(1, num_frames // 2)
        W = W[:, :, :nf]
        W = W / W.sum(-1, keepdims=True)
        W = (W - W.mean(-2, keepdims=True)) / W.std(-2, keepdims=True)
        W = median_filter(W, size=(1, 1, medfilt), mode="mirror")
        M = W.mean(0)[len(self.w.sot_seq):-1]
        ti, fi = dtw(-M)
        jumps = np.pad(np.diff(ti), (1, 0), constant_values=1).astype(bool)
        jump_times = fi[jumps] / 50.0
        words = self.split_words(tt)
        bounds = np.pad(np.cumsum([len(w[1]) for w in words]), (1, 0))
        # sentinel for the eot row
        jt = np.append(jump_times, nf / 50.0)
        out = []
        for k, (s, toks) in enumerate(words):
            b0, b1 = bounds[k], bounds[k + 1]
            st, en = jt[b0], jt[min(b1, len(jt) - 1)]
            out.append(dict(word=s.strip(), start=float(start + st), end=float(start + en),
                            logprob=float(tok_lp[b0:b1].mean())))
        return out, M
