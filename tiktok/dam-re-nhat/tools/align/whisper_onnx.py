"""Minimal Whisper (ONNX) inference in numpy: transcription with timestamps,
forced scoring of a known transcript, and timestamp probing.

Models: ONNX exports of the official OpenAI Whisper weights.
"""
import base64
import json
import os
import sys
import time

import numpy as np
import onnxruntime as ort
import tiktoken

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "assets")

SR = 16000
N_FFT = 400
HOP = 160
N_SAMPLES = 30 * SR
N_FRAMES = 3000


# ---------------------------------------------------------------- tokenizer
class Tok:
    def __init__(self, num_languages=100):
        langs = json.load(open(os.path.join(ASSETS, "languages.json")))[:num_languages]
        ranks = {}
        with open(os.path.join(ASSETS, "multilingual.tiktoken")) as f:
            for line in f:
                if line.strip():
                    tok, rank = line.split()
                    ranks[base64.b64decode(tok)] = int(rank)
        n_vocab = len(ranks)
        specials = [
            "<|endoftext|>",
            "<|startoftranscript|>",
            *[f"<|{l}|>" for l in langs],
            "<|translate|>",
            "<|transcribe|>",
            "<|startoflm|>",
            "<|startofprev|>",
            "<|nospeech|>",
            "<|notimestamps|>",
            *[f"<|{i * 0.02:.2f}|>" for i in range(1501)],
        ]
        special_tokens = {}
        for s in specials:
            special_tokens[s] = n_vocab
            n_vocab += 1
        self.enc = tiktoken.Encoding(
            name="multilingual",
            explicit_n_vocab=n_vocab,
            pat_str=r"""'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+""",
            mergeable_ranks=ranks,
            special_tokens=special_tokens,
        )
        self.n_vocab = n_vocab
        self.sp = special_tokens
        self.eot = special_tokens["<|endoftext|>"]
        self.sot = special_tokens["<|startoftranscript|>"]
        self.transcribe = special_tokens["<|transcribe|>"]
        self.translate = special_tokens["<|translate|>"]
        self.sot_lm = special_tokens["<|startoflm|>"]
        self.sot_prev = special_tokens["<|startofprev|>"]
        self.no_speech = special_tokens["<|nospeech|>"]
        self.no_timestamps = special_tokens["<|notimestamps|>"]
        self.ts_begin = special_tokens["<|0.00|>"]
        self.langs = langs

    def lang(self, code):
        return self.sp[f"<|{code}|>"]

    def encode(self, text):
        return self.enc.encode(text)

    def decode(self, tokens):
        return self.enc.decode([t for t in tokens if t < self.eot])

    def non_speech_tokens(self):
        symbols = list('"#()*+/:;<=>@[\\]^_`{|}~「」『』')
        symbols += "<< >> <<< >>> -- --- -( -[ (' (\" (( )) ((( ))) [[ ]] {{ }} ♪♪ ♪♪♪".split()
        misc = set("♩♪♫♬♭♮♯")
        result = {self.enc.encode(" -")[0], self.enc.encode(" '")[0]}
        for s in symbols + list(misc):
            for toks in [self.enc.encode(s), self.enc.encode(" " + s)]:
                if len(toks) == 1 or s in misc:
                    result.add(toks[0])
        return sorted(result)


# ---------------------------------------------------------------- audio
def load_audio_16k(path):
    """Decode any audio file to mono float32 16 kHz via ffmpeg."""
    import subprocess

    cmd = ["ffmpeg", "-nostdin", "-v", "error", "-i", path, "-f", "s16le", "-ac", "1",
           "-acodec", "pcm_s16le", "-ar", str(SR), "-"]
    out = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(out, np.int16).astype(np.float32) / 32768.0


def log_mel(audio, n_mels, pad_samples=N_SAMPLES):
    """Whisper log-mel spectrogram (matches whisper.audio.log_mel_spectrogram)."""
    filters = np.load(os.path.join(ASSETS, "mel_filters.npz"))[f"mel_{n_mels}"]
    if pad_samples:
        audio = np.concatenate([audio, np.zeros(pad_samples, np.float32)])
    window = (0.5 - 0.5 * np.cos(2 * np.pi * np.arange(N_FFT) / N_FFT)).astype(np.float32)
    x = np.pad(audio, (N_FFT // 2, N_FFT // 2), mode="reflect")
    n = 1 + (len(x) - N_FFT) // HOP
    idx = np.arange(N_FFT)[None, :] + HOP * np.arange(n)[:, None]
    mags = np.empty((n, N_FFT // 2 + 1), np.float32)
    step = 4096
    for s in range(0, n, step):
        fr = x[idx[s:s + step]] * window
        mags[s:s + step] = np.abs(np.fft.rfft(fr, axis=1)) ** 2
    mags = mags[:-1].T  # (201, T)
    mel = filters @ mags
    log_spec = np.log10(np.maximum(mel, 1e-10))
    log_spec = np.maximum(log_spec, log_spec.max() - 8.0)
    log_spec = (log_spec + 4.0) / 4.0
    return log_spec.astype(np.float32)


def pad_or_trim(mel, length=N_FRAMES):
    if mel.shape[1] > length:
        return mel[:, :length]
    if mel.shape[1] < length:
        return np.pad(mel, ((0, 0), (0, length - mel.shape[1])))
    return mel


def log_softmax(x):
    x = x - x.max(axis=-1, keepdims=True)
    return x - np.log(np.exp(x).sum(axis=-1, keepdims=True))


# ---------------------------------------------------------------- model
MODELS = {
    "turbo": dict(enc="encoder_turbo.onnx", dec="decoder_turbo_fix_kv_cache.onnx",
                  n_mels=128, kv=(8, 1280), nlang=100),
    "large-v3": dict(enc="encoder_large_v3.onnx", dec="decoder_large_v3_fix_kv_cache.onnx",
                     n_mels=128, kv=(64, 1280), nlang=100),
    "medium": dict(enc="encoder_medium.onnx", dec="decoder_medium_fix_kv_cache.onnx",
                   n_mels=80, kv=(48, 1024), nlang=99),
    "small": dict(enc="encoder_small.onnx", dec="decoder_small_fix_kv_cache.onnx",
                  n_mels=80, kv=(24, 768), nlang=99),
}


class Whisper:
    def __init__(self, model_dir, name="turbo", threads=4, language="vi"):
        cfg = MODELS[name]
        self.cfg = cfg
        self.name = name
        so = ort.SessionOptions()
        so.intra_op_num_threads = threads
        so.log_severity_level = 3
        t0 = time.time()
        self.enc = ort.InferenceSession(os.path.join(model_dir, cfg["enc"]), so,
                                        providers=["CPUExecutionProvider"])
        self.dec = ort.InferenceSession(os.path.join(model_dir, cfg["dec"]), so,
                                        providers=["CPUExecutionProvider"])
        self.tok = Tok(cfg["nlang"])
        self.n_mels = cfg["n_mels"]
        self.language = language
        t = self.tok
        self.sot_seq = [t.sot, t.lang(language), t.transcribe]
        sup = set(t.non_speech_tokens())
        sup.update([t.transcribe, t.translate, t.sot, t.sot_prev, t.sot_lm, t.no_speech])
        self.suppress = np.array(sorted(sup), np.int64)
        self.blank_suppress = np.array(t.encode(" ") + [t.eot], np.int64)
        print(f"[whisper] loaded {name} in {time.time() - t0:.1f}s", file=sys.stderr)

    # -- raw calls
    def encode(self, mel_seg):
        return self.enc.run(None, {"mel": mel_seg[None].astype(np.float32)})[0]

    def _new_kv(self):
        n, d = self.cfg["kv"]
        return np.zeros((n, 1, 451, d), np.float32)

    def dec_full(self, tokens, feats):
        """One pass over a whole token sequence -> logits for every position."""
        tokens = np.asarray(tokens, np.int64)[None]
        logits, kv = self.dec.run(None, {"tokens": tokens, "audio_features": feats,
                                         "kv_cache": self._new_kv(),
                                         "offset": np.array(0, np.int64)})
        return logits[0], kv

    def dec_step(self, token, feats, kv, offset):
        logits, kv = self.dec.run(None, {"tokens": np.array([[token]], np.int64),
                                         "audio_features": feats, "kv_cache": kv,
                                         "offset": np.array(offset, np.int64)})
        return logits[0, -1], kv

    # -- timestamp rules (port of whisper.decoding.ApplyTimestampRules)
    def _apply_rules(self, logits, sampled, at_begin, max_initial_ts=1.0):
        t = self.tok
        logits = logits.copy()
        logits[self.suppress] = -np.inf
        logits[t.no_timestamps] = -np.inf
        if at_begin:
            logits[self.blank_suppress] = -np.inf
        last_ts = len(sampled) >= 1 and sampled[-1] >= t.ts_begin
        pen_ts = len(sampled) < 2 or sampled[-2] >= t.ts_begin
        if last_ts:
            if pen_ts:
                logits[t.ts_begin:] = -np.inf
            else:
                logits[:t.eot] = -np.inf
        tss = [x for x in sampled if x >= t.ts_begin]
        if tss:
            ts_last = tss[-1] if (last_ts and not pen_ts) else tss[-1] + 1
            logits[t.ts_begin:ts_last] = -np.inf
        if at_begin:
            logits[:t.ts_begin] = -np.inf
            if max_initial_ts is not None:
                last_allowed = t.ts_begin + int(round(max_initial_ts / 0.02))
                logits[last_allowed + 1:] = -np.inf
        lp = log_softmax(logits)
        ts_lp = np.logaddexp.reduce(lp[t.ts_begin:])
        if ts_lp > lp[:t.ts_begin].max():
            logits[:t.ts_begin] = -np.inf
        return logits

    def decode_window(self, feats, prompt=None, max_new=224, max_initial_ts=1.0):
        """Greedy decode of one 30 s window with timestamp tokens."""
        t = self.tok
        init = []
        if prompt:
            init = [t.sot_prev] + list(prompt)[-200:]
        init = init + self.sot_seq
        logits_all, kv = self.dec_full(init, feats)
        logits = logits_all[-1]
        offset = len(init)
        kvb = kv
        sampled = []
        sum_lp = 0.0
        no_speech_prob = float(np.exp(log_softmax(logits_all[len(init) - len(self.sot_seq)])[t.no_speech]))
        for i in range(max_new):
            lg = self._apply_rules(logits, sampled, at_begin=(i == 0), max_initial_ts=max_initial_ts)
            lp = log_softmax(lg)
            nxt = int(np.argmax(lg))
            sum_lp += float(lp[nxt])
            if nxt == t.eot:
                break
            sampled.append(nxt)
            if offset >= 447:
                break
            logits, kvb = self.dec_step(nxt, feats, kvb, offset)
            offset += 1
        avg_lp = sum_lp / (len(sampled) + 1)
        return sampled, avg_lp, no_speech_prob

    def transcribe(self, audio, verbose=True, condition=True, max_initial_ts=1.0):
        """Sliding-window transcription (port of whisper.transcribe seek logic)."""
        t = self.tok
        mel = log_mel(audio, self.n_mels)
        content_frames = mel.shape[1] - N_FRAMES
        seek = 0
        segments = []
        prompt = []
        while seek < content_frames:
            seg = pad_or_trim(mel[:, seek:seek + N_FRAMES])
            seg_frames = min(N_FRAMES, content_frames - seek)
            time_offset = seek * HOP / SR
            feats = self.encode(seg)
            toks, avg_lp, nsp = self.decode_window(feats, prompt if condition else None,
                                                   max_initial_ts=max_initial_ts)
            is_ts = [x >= t.ts_begin for x in toks]
            single_end = len(toks) >= 2 and (not is_ts[-2]) and is_ts[-1]
            consecutive = [i + 1 for i in range(len(toks) - 1) if is_ts[i] and is_ts[i + 1]]
            new = []
            if consecutive:
                slices = list(consecutive)
                if single_end:
                    slices.append(len(toks))
                last = 0
                for cur in slices:
                    sl = toks[last:cur]
                    st = (sl[0] - t.ts_begin) * 0.02
                    en = (sl[-1] - t.ts_begin) * 0.02
                    new.append(dict(start=time_offset + st, end=time_offset + en, tokens=sl))
                    last = cur
                if single_end:
                    seek += seg_frames
                else:
                    last_pos = toks[last - 1] - t.ts_begin
                    seek += last_pos * 2
            else:
                dur = seg_frames * HOP / SR
                tss = [x for x in toks if x >= t.ts_begin]
                if tss and tss[-1] != t.ts_begin:
                    dur = (tss[-1] - t.ts_begin) * 0.02
                new.append(dict(start=time_offset, end=time_offset + dur, tokens=toks))
                seek += seg_frames
            for s in new:
                s["text"] = t.decode(s["tokens"])
                s["avg_logprob"] = avg_lp
                s["no_speech_prob"] = nsp
                if verbose:
                    print(f"[{s['start']:7.2f} -> {s['end']:7.2f}] {s['text']}", flush=True)
            segments.extend(new)
            prompt.extend([x for s in new for x in s["tokens"] if x < t.eot])
        return segments

    def transcribe_clip(self, audio, start, end, prompt_text=None, lead=0.0, max_initial_ts=1.0):
        """Transcribe audio[start:end] (seconds) as a single window. Returns text + raw tokens."""
        a = audio[int(max(0, start - lead) * SR):int(end * SR)]
        mel = pad_or_trim(log_mel(a, self.n_mels, pad_samples=N_SAMPLES))
        feats = self.encode(mel)
        prompt = self.tok.encode(" " + prompt_text.strip()) if prompt_text else None
        toks, avg_lp, nsp = self.decode_window(feats, prompt, max_initial_ts=max_initial_ts)
        return dict(text=self.tok.decode(toks), tokens=toks, avg_logprob=avg_lp, no_speech_prob=nsp)
