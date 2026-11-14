# Video TikTok: “Bảng xếp hạng giá 1 gram đạm”

Video motion-graphics 9:16 (1080×1920, 30 fps, 74 giây) dựng trên bản thu âm `audio/voice.wav`.
Mọi hiệu ứng hình đều gắn vào mốc thời gian từng từ đo trực tiếp từ bản thu (`timing/timing.json`).

## Dựng lại video

Cần: Node.js + Playwright (Chromium), ffmpeg, Python 3 (`numpy`, `scipy`, `soundfile`).

```bash
node tools/export_sfx.cjs                                   # xuất danh sách hiệu ứng âm thanh -> timing/sfx.json
python3 tools/make_audio.py audio/voice.wav timing/sfx.json build/audio   # giọng đọc đã cân âm lượng + hiệu ứng
node tools/render.cjs build/frames workers=4                # render 2.220 khung hình PNG
tools/encode.sh build/frames build/audio/mix.wav out/dam-re-nhat_tiktok_9x16.mp4
```

Xem thử một khung hình bất kỳ: `node tools/shot.cjs src/index.html out.png t=27.9`
(hoặc mở `src/index.html?t=27.9` bằng trình duyệt).

## Sửa nội dung

| Muốn sửa | Sửa ở đâu |
|---|---|
| Chữ, bố cục, hiệu ứng từng cảnh | `src/scenes.js` (mỗi mốc là `hit(câu, từ)` = thời điểm từ đó được đọc) |
| Phụ đề (ngắt dòng, màu nhấn) | `tools/build_timing.py` rồi chạy lại để sinh `src/timing.js` |
| Hình minh họa | `src/art.js` (SVG tự vẽ) |
| Âm lượng / hiệu ứng âm thanh | `tools/make_audio.py` |

Nếu thu âm lại: cần căn lại mốc thời gian (`tools/align/`, dùng model Whisper bản ONNX — không kèm trong repo),
rồi chạy `python3 tools/build_timing.py timing/words_aligned.json src/timing.js timing/timing.json`.

## Ghi chú

- Giá trong video là số ước tính theo kịch bản; đổi giá thì sửa số trong `src/scenes.js` (và thu lại lời nếu thứ hạng đổi).
- Font: Anton, Be Vietnam Pro (giấy phép OFL, xem `fonts/*-OFL.txt`).
- File video xuất ra nằm trong `out/` và không đưa vào git (dung lượng lớn).
