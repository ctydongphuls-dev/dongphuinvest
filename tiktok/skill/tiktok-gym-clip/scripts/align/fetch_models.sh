#!/usr/bin/env bash
# Download the Whisper large-v3-turbo ONNX files (about 3.5 GB) and add the attention outputs.
#   fetch_models.sh <model_dir>
# Source: ONNX exports of the official OpenAI weights (MIT) hosted by the ailia-models project.
# If this host is blocked in your sandbox, see references/video-pipeline.md ("khi không tải được model").
set -euo pipefail
D="${1:?usage: fetch_models.sh <model_dir>}"
B=https://storage.googleapis.com/ailia-models/whisper
mkdir -p "$D"
for f in encoder_turbo.onnx decoder_turbo_fix_kv_cache.onnx encoder_turbo_weights.pb; do
  [ -s "$D/$f" ] && continue
  for i in 1 2 3 4; do curl -sS -f -C - --retry 3 -o "$D/$f" "$B/$f" && break || sleep $((i * 2)); done
  [ -s "$D/$f" ] || { echo "download failed: $f" >&2; exit 1; }
done
[ -s "$D/decoder_turbo_attn.onnx" ] || python3 "$(dirname "$0")/make_attn_decoder.py" "$D/decoder_turbo_fix_kv_cache.onnx" "$D/decoder_turbo_attn.onnx"
ls -la "$D"
