#!/usr/bin/env bash
# encode.sh <framesDir> <audio.wav> <out.mp4>   -> 1080x1920, 30 fps, H.264 High + AAC, tagged BT.709, fast-start
set -euo pipefail
ffmpeg -y -v error -framerate 30 -start_number 0 -i "$1/f_%05d.png" -i "$2" \
  -vf "scale=1080:1920:out_color_matrix=bt709:out_range=tv:flags=accurate_rnd+full_chroma_int,format=yuv420p" \
  -c:v libx264 -preset slow -crf 16 -profile:v high -level 4.2 -g 60 -bf 2 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart -shortest "$3"
