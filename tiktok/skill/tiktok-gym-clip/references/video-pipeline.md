# Dựng video từ bản thu: các bước chi tiết

Đây là quy trình đã dùng cho clip "Bảng xếp hạng giá 1 gram đạm" (74 giây, 230 từ, khớp tới từng khung hình).
`SKILL` = thư mục của kĩ năng này. `PROJ` = thư mục dự án video mới.

## 0. Chuẩn bị (một lần mỗi máy)

```bash
pip install onnxruntime tiktoken scipy soundfile matplotlib onnx numpy pillow
bash SKILL/scripts/align/fetch_models.sh MODELS        # ~3.5 GB, Whisper large-v3-turbo bản ONNX
```
Cần thêm ffmpeg và Playwright + Chromium (đã có sẵn trong máy cloud của Claude Code).

**Khi không tải được model** (mạng chặn): bỏ qua bước 2a, dùng chế độ thủ công ở 2c.

## 1. Tạo dự án

```bash
cp -r SKILL/assets/template PROJ
mkdir -p PROJ/audio PROJ/timing && cp voice.wav PROJ/audio/voice.wav
```
`SKILL/assets/example-gia-1-gram-dam/` là clip mẫu hoàn chỉnh (scenes.js, spoken.txt, captions.txt, pins.json): đọc `scenes.js` trước khi viết cảnh mới.

## 2. Căn thời gian (phần quyết định hình có khớp tiếng không)

Vì sao không dùng thẳng mốc của Whisper: mốc từ của máy nhận dạng sớm hơn tiếng thật 50–150 ms và hay lẫn với tiếng lấy hơi. Người xem cảm nhận nhịp ở **điểm bật nguyên âm**, nên script đặt từng âm tiết lên đường "bật âm" đo từ chính bản thu, mốc Whisper chỉ là gợi ý.

a. Nghe xem thực sự đã đọc gì:
```bash
cd PROJ && python3 SKILL/scripts/align/align_voice.py transcribe audio/voice.wav --models MODELS --out work
```
→ `work/asr.txt`: lời nhận dạng theo đoạn + danh sách khoảng lặng.

b. Viết `PROJ/spoken.txt`: **đúng lời đã đọc**, mỗi câu một dòng (câu = đơn vị bạn muốn gắn hình). So với kịch bản, ghi theo bản thu khi khác nhau (ví dụ người đọc nói "35 một cân" chứ không phải "35 nghìn").
- Số viết bằng chữ số (`150`, `1.000`, `75.000`) được tự đọc thành âm tiết ("một trăm năm mươi").
- Từ nhiều âm tiết không phải số thì ghi số âm tiết: `video{3}`, `comment{2}`, `calo{2}`.
- Mỗi từ là một token cách nhau bởi dấu cách; dấu câu dính vào từ.

```bash
python3 SKILL/scripts/align/align_voice.py align audio/voice.wav spoken.txt --models MODELS --out work
```
(~5 phút cho 75 giây trên 4 nhân; chạy lại sau đó chỉ vài giây vì có cache.)
Kết quả: `work/syllables.json`, `work/report.txt`, `work/plots/page_*.png`.

c. Chế độ thủ công (không có model): đặt `||` đứng riêng vào `spoken.txt` ở mỗi chỗ ngừng của bản thu (thứ tự theo danh sách khoảng lặng do lệnh in ra khi số dấu không khớp), rồi chạy `align` không cần `--models`. Kiểm tra kĩ mọi trang biểu đồ.

d. **Soát bằng mắt**: mở `work/plots/`. Vạch xanh lá = âm tiết đầu của từ, xanh dương = âm tiết sau, chấm vàng = mốc Whisper. Vạch phải nằm ở mép trái của khối sáng (nguyên âm). Ưu tiên xem những chỗ `report.txt` nêu và các từ sẽ gắn hiệu ứng. Sai thì ghim:
```json
{"13:8:0": 35.325}
```
(`câu:từ:âm tiết` → giây, đọc trên trục thời gian của biểu đồ) rồi chạy lại với `--pins pins.json`.

e. Phụ đề + file thời gian:
```bash
python3 tools/build_timing.py work/syllables.json captions.txt src/timing.js --json timing/timing.json
```
Lần đầu nó tự viết bản nháp `captions.txt` (chữ hoa, ngắt thẻ ở mỗi chỗ ngừng). Sửa: `/` xuống dòng, `|` sang thẻ mới, tiền tố `#` vàng, `!` đỏ, `+` xanh. Số từ mỗi dòng phải bằng `spoken.txt`; chữ hiển thị được phép khác (ví dụ "1" → "MỘT", "35" → "35K").

## 3. Viết cảnh (`src/scenes.js`)

API trong `src/main.js` (`APP`) và `src/engine.js` (`ENG`):
- `hit(câu, từ[, âm tiết])` = thời điểm hình phải "chạm" (bật âm trừ 0,06 s). Mọi hiệu ứng gắn vào `hit`, không gõ số giây tay.
- `ts / te` = đầu / cuối từ; `cutBefore(câu, 0)` = điểm cắt cảnh nằm trong khoảng lặng trước câu.
- Dựng: `scene(a,b)`, `group`, `art(parent,'egg',w,x,y)`, `hd` (tiêu đề tự co chữ), `chip`, `stamp`, `tag` (thẻ giá đếm số), `wipe`, `shake`, `flash`, `S(t,'pop')` (hiệu ứng âm thanh).
- Chuyển động: `.pop .slam .drop .slide .swing .out .fly .float .sway .pulse .shake .move .zoom`.
- Hình minh họa: `src/art.js` (SVG tự vẽ: egg, tray, whey, tofu, chicken, peanut, soy, cloth, pot, claypot, pan, milk, cross, check, warn, crown, coin, plus, bubble, bookmark, dumbbell...). Món mới thì vẽ thêm symbol cùng phong cách (viền đen dày, bóng trắng, nhãn dán).
- Thang xếp hạng phía trên: điền `LAD.data` (để trống nếu clip không có xếp hạng). Thanh tiến độ mỏng: `APP.progressBar = true`.
- Cuối cảnh trả `window.SCENES_END` (tổng thời lượng) và có thể `window.CUTS`.

Bố cục an toàn TikTok: nội dung chính trong y 150–1500, chừa ~130 px mép phải từ y 880 trở xuống (nút like/comment/lưu), phụ đề quanh y 1250.

## 4. Xem thử trước khi render

```bash
node tools/sheet.cjs src/index.html work/sheet.png t=1.0,5.9,18.9,27.6 cols=4 scale=0.3
node tools/shot.cjs src/index.html work/f.png t=27.9 scale=0.6
```
Xem khung đông nhất của mỗi cảnh, sửa chỗ chồng chữ, rồi mới render.

## 5. Âm thanh, render, xuất

```bash
node tools/export_sfx.cjs                                   # timing/sfx.json: hiệu ứng âm + các từ dùng làm mốc hình
python3 tools/make_audio.py audio/voice.wav timing/sfx.json build/audio
node tools/render.cjs build/frames workers=4                # ~3 phút cho 74 s
tools/encode.sh build/frames build/audio/mix.wav out/video.mp4
```
- `make_audio.py` cân giọng về ~-14 LUFS, tự tổng hợp hiệu ứng (không dùng mẫu của ai), rồi **bù độ trễ** của bộ nén để giọng nằm đúng vị trí bản gốc (đo bằng tương quan, phải ra 0 ms).
- Bản chỉ có giọng: ghép `build/audio/voice_master.wav` với `-c:v copy`.

## 6. Kiểm tra trước khi giao

```bash
python3 tools/sync_sheet.py build/frames timing/sfx.json timing/timing.json work/sync
```
Mỗi hàng là một từ có hiệu ứng, 7 khung quanh nhịp (khung vàng). Hiệu ứng phải bắt đầu ở −1/−2 và đã hiện đủ ở khung vàng. Sai lệch thì sửa `hit` trong `scenes.js` hoặc ghim lại thời gian.
Kiểm tra thêm: `ffprobe` (1080×1920, 30 fps, H.264 + AAC), độ to (~-14 LUFS, đỉnh ≤ -1 dB), và giọng trong MP4 lệch 0 ms so với bản thu gốc.
