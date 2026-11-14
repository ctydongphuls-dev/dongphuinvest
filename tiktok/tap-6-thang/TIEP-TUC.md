# Làm tiếp clip "Tập 6 tháng vẫn y như cũ" (dành cho phiên Claude chạy trên máy có OmniVoice Studio)

Đã xong: kịch bản + bản đọc (`ban-doc.txt`). Còn lại:

1. Đọc bằng OmniVoice Studio, giọng "Trí Franks" (app phải đang mở):
   ```
   python3 ../skill/tiktok-gym-clip/scripts/omnivoice_tts.py --check
   python3 ../skill/tiktok-gym-clip/scripts/omnivoice_tts.py --voices
   python3 ../skill/tiktok-gym-clip/scripts/omnivoice_tts.py ban-doc.txt -o voice.wav --voice "<tên hoặc id giọng Trí Franks>" --split
   ```
   Nếu lỗi, đọc nội dung lỗi máy chủ trả về rồi chỉnh `--voice` / `--extra`. Nghe lại các từ dễ đọc sai: dim (gym), rép (rep), com men (comment).
2. Dựng video khớp từng khung hình theo `../skill/tiktok-gym-clip/references/video-pipeline.md`
   (mẫu dự án: `../skill/tiktok-gym-clip/assets/template`, clip mẫu: `../dam-re-nhat`).
   Kịch bản hình từng cảnh nằm trong phần "Bước 1" dưới đây.

## Kịch bản hình
| Giây | Lời | Hình và chữ |
|---|---|---|
| 0–5 | Tập 6 tháng, gần trăm buổi tạ, gương vẫn y như cũ. Không phải lười, có 3 thứ ăn cắp kết quả | Lịch 6 tháng lật, đếm ~100 BUỔI, gương y hệt. **6 THÁNG = 0 THAY ĐỔI?** → **KHÔNG PHẢI MÀY LƯỜI** |
| 5–8 | Cái thứ ba hầu hết dân gym không biết, xem tới cuối | 3 thẻ úp, thẻ 3 có "?" rung |
| 8–18 | Thiếu đạm: 70 ký cần ~110 g, ăn thường ~50 g, nửa số gạch | Thanh đo ~50/110g, tường gạch dở. **#1 THIẾU ĐẠM** |
| 18–25 | Tập mãi một mức tạ, 3 tháng vẫn 40 ký | Sổ tập "40kg" lặp lại, gạch đỏ. **#2 TẠ ĐỨNG YÊN** |
| 25–38 | Ngủ: nhóm ngủ 5,5h đốt chưa tới nửa lượng mỡ, mất thêm cơ; thức tới 2h sáng là tự xoá công | 2 cột 8,5h / 5,5h, đồng hồ 2:00, tẩy xoá "2 TIẾNG TẬP". **#3 NGỦ ÍT** |
| 38–46 | Sửa: bữa nào cũng có đạm, mỗi tuần thêm chút tạ, ngủ đủ 7 tiếng | 3 dấu ✓ |
| 46–53 | Lưu lại, đang dính cái thứ mấy, comment | Khung tổng kết đứng yên để chụp; icon lưu + bình luận |

Nguồn số liệu: 1,6 g đạm/kg/ngày; Nedeltcheva et al. 2010 (Ann Intern Med) – ngủ 5,5h giảm mỡ ít hơn ~55% so với 8,5h.
