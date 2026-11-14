#!/usr/bin/env python3
"""Read a voice-over text with OmniVoice Studio (VoiceStudio) running on THIS computer.

  python3 omnivoice_tts.py --check                     is the app reachable? which version?
  python3 omnivoice_tts.py --voices                    list the voices the app offers
  python3 omnivoice_tts.py ban-doc.txt -o voice.wav --voice <voice>
  python3 omnivoice_tts.py ban-doc.txt -o voice.wav --voice <voice> --split      one request per scene (blank line)

The desktop app serves a local API on http://localhost:3900 while it is open (loopback, no key).
This script only works on the machine where the app runs: a cloud session cannot reach "localhost"
of the user's computer.

Written from the project's documentation (OpenAI-compatible POST /v1/audio/speech, GET /v1/audio/voices,
GET /health). Field names can differ between app versions: when a call fails the server's answer is printed
in full - read it and adjust --model / --voice / --extra instead of guessing.
Only the Python standard library is used, so it runs on Windows, macOS and Linux as is.
"""
import argparse
import io
import json
import os
import sys
import urllib.error
import urllib.request
import wave


def call(base, path, payload=None, timeout=600):
    headers = {"Accept": "*/*"}
    key = os.environ.get("OMNIVOICE_API_KEY")
    if key:
        headers["Authorization"] = "Bearer " + key
    data = None
    if payload is not None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(base.rstrip("/") + path, data=data, headers=headers, method="POST" if data else "GET")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.headers.get("Content-Type", ""), r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("Content-Type", ""), e.read()
    except (urllib.error.URLError, OSError) as e:
        sys.exit(f"Không kết nối được {base}{path}: {e}\n"
                 "-> Mở app OmniVoice Studio trên máy này rồi chạy lại (mặc định cổng 3900; đổi bằng --url).")


def show(status, ctype, body):
    text = body.decode("utf-8", "replace")
    try:
        text = json.dumps(json.loads(text), ensure_ascii=False, indent=1)
    except ValueError:
        pass
    print(f"HTTP {status} ({ctype})\n{text[:4000]}")


def speak(base, text, args):
    payload = {"model": args.model, "input": text, "response_format": args.format}
    if args.voice:
        payload["voice"] = args.voice
    if args.speed:
        payload["speed"] = args.speed
    if args.extra:
        payload.update(json.loads(args.extra))
    status, ctype, body = call(base, "/v1/audio/speech", payload)
    if status != 200 or ctype.startswith("application/json") or len(body) < 1000:
        print("Máy chủ không trả về âm thanh. Trả lời của nó:", file=sys.stderr)
        show(status, ctype, body)
        sys.exit(1)
    return body


def join_wavs(chunks, gap):
    params, frames = None, []
    for b in chunks:
        with wave.open(io.BytesIO(b)) as w:
            p = (w.getnchannels(), w.getsampwidth(), w.getframerate())
            if params and p != params:
                sys.exit(f"Các đoạn có định dạng khác nhau ({params} vs {p}); bỏ --split hoặc ghép bằng ffmpeg.")
            params = p
            frames.append(w.readframes(w.getnframes()))
    silence = b"\x00" * (int(params[2] * gap) * params[0] * params[1])
    out = io.BytesIO()
    with wave.open(out, "wb") as w:
        w.setnchannels(params[0]); w.setsampwidth(params[1]); w.setframerate(params[2])
        w.writeframes(silence.join(frames))
    return out.getvalue()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("text", nargs="?", help="file văn bản đọc (UTF-8); '-' để đọc từ stdin")
    ap.add_argument("-o", "--out", default="voice.wav")
    ap.add_argument("--url", default=os.environ.get("OMNIVOICE_URL") or os.environ.get("VOICESTUDIO_URL") or "http://localhost:3900")
    ap.add_argument("--voice", help="tên hoặc id giọng (xem --voices)")
    ap.add_argument("--model", default="tts-1")
    ap.add_argument("--format", default="wav")
    ap.add_argument("--speed", type=float)
    ap.add_argument("--extra", help="JSON thêm vào yêu cầu, ví dụ '{\"language\":\"vi\"}'")
    ap.add_argument("--split", action="store_true", help="mỗi cảnh (cách nhau một dòng trống) một lần đọc, rồi ghép lại")
    ap.add_argument("--gap", type=float, default=0.35, help="khoảng lặng giữa các cảnh khi --split (giây)")
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--voices", action="store_true")
    a = ap.parse_args()
    if a.check:
        show(*call(a.url, "/health", timeout=10))
        return
    if a.voices:
        show(*call(a.url, "/v1/audio/voices", timeout=30))
        return
    if not a.text:
        ap.error("thiếu file văn bản")
    raw = sys.stdin.read() if a.text == "-" else open(a.text, encoding="utf-8").read()
    raw = raw.strip()
    if not raw:
        sys.exit("File văn bản trống.")
    if a.split:
        parts = [p.strip() for p in raw.split("\n\n") if p.strip()]
        if a.format != "wav":
            sys.exit("--split chỉ ghép được định dạng wav.")
        audio = join_wavs([speak(a.url, p, a) for p in parts], a.gap)
        note = f"{len(parts)} cảnh"
    else:
        audio = speak(a.url, raw, a)
        note = "1 lần đọc"
    with open(a.out, "wb") as f:
        f.write(audio)
    dur = ""
    try:
        with wave.open(a.out) as w:
            dur = f", {w.getnframes() / w.getframerate():.1f} giây, {w.getframerate()} Hz"
    except (wave.Error, EOFError):
        pass
    print(f"Đã lưu {a.out} ({len(audio) / 1e6:.1f} MB{dur}; {note})")


if __name__ == "__main__":
    main()
