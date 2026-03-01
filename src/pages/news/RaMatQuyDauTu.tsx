import NewsDetailLayout from "@/components/news/NewsDetailLayout";

const relatedArticles = [
  {
    title: "Hội thảo Đầu tư thông minh 2025",
    date: "20/02/2025",
    image: "https://kaikun-ai-image.s3.ap-northeast-1.amazonaws.com/58f3c039-d005-4011-aea8-10617b05b557%2F1771769340577.png",
    href: "/tin-tuc/hoi-thao-dau-tu-thong-minh-2025",
    category: "Sự kiện",
  },
  {
    title: "Ký kết hợp tác chiến lược",
    date: "10/03/2025",
    image: "https://kaikun-ai-image.s3.ap-northeast-1.amazonaws.com/58f3c039-d005-4011-aea8-10617b05b557%2F1771770007525.png",
    href: "/tin-tuc/ky-ket-hop-tac-chien-luoc",
    category: "Tin tức",
  },
];

const RaMatQuyDauTu = () => (
  <NewsDetailLayout
    title="Công ty CP Đầu tư và Phát triển Đồng Phú Lạng Sơn chính thức ra mắt Quỹ đầu tư Tăng trưởng ĐP Capital"
    date="15/01/2025"
    author="Ban Truyền thông"
    category="Sản phẩm mới"
    image="https://kaikun-ai-image.s3.ap-northeast-1.amazonaws.com/58f3c039-d005-4011-aea8-10617b05b557%2F1772025677399.png"
    imageAlt="Lễ ra mắt Quỹ đầu tư ĐP Capital 2025"
    relatedArticles={relatedArticles}
  >
    <p className="text-lg text-foreground leading-relaxed mb-6">
      <strong>LẠNG SƠN, 15/01/2025</strong> – Công ty Cổ phần Đầu tư và Phát triển Đồng Phú Lạng Sơn đã tổ chức lễ ra mắt Quỹ đầu tư Tăng trưởng ĐP Capital, đánh dấu bước tiến quan trọng trong hành trình phát triển của công ty sau gần 10 năm hoạt động trong lĩnh vực quản lý tài sản.
    </p>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Về Quỹ đầu tư ĐP Capital</h2>
    <p className="text-muted-foreground leading-relaxed mb-6">
      Quỹ đầu tư Tăng trưởng ĐP Capital được thành lập với mục tiêu mang đến cho nhà đầu tư cơ hội tiếp cận thị trường chứng khoán Việt Nam một cách chuyên nghiệp và hiệu quả. Quỹ tập trung vào các trái phiếu, cổ phiếu, công ty tăng trưởng bền vững trên thị trường Chứng khoán Việt Nam.
    </p>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Điểm nổi bật của Quỹ ĐP Capital</h2>
    <ul className="space-y-2 text-muted-foreground mb-6">
      <li>✓ Đội ngũ quản lý giàu kinh nghiệm với hơn 10 năm trong lĩnh vực tài chính</li>
      <li>✓ Chiến lược đầu tư đa dạng hóa, giảm thiểu rủi ro</li>
      <li>✓ Quy trình phân tích và lựa chọn cổ phiếu chặt chẽ</li>
      <li>✓ Báo cáo minh bạch, cập nhật định kỳ cho nhà đầu tư</li>
      <li>✓ Các gói dịch vụ linh hoạt phù hợp với nhiều đối tượng khách hàng</li>
    </ul>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Phát biểu tại lễ ra mắt</h2>

    <blockquote className="border-l-4 border-gold pl-5 py-3 my-6 bg-muted/50 rounded-r-lg">
      <p className="text-foreground italic mb-2">
        "Việc ra mắt Quỹ ĐP Capital là kết quả của quá trình tích lũy kinh nghiệm và xây dựng năng lực suốt nhiều năm qua. Chúng tôi cam kết mang đến cho nhà đầu tư những giải pháp đầu tư an toàn, minh bạch và hiệu quả."
      </p>
      <cite className="text-sm text-gold font-semibold not-italic">
        — Ông Hoàng Văn Quyết, Chủ tịch HĐQT kiêm Tổng Giám đốc
      </cite>
    </blockquote>

    <blockquote className="border-l-4 border-gold pl-5 py-3 my-6 bg-muted/50 rounded-r-lg">
      <p className="text-foreground italic mb-2">
        "Với nền tảng vững chắc từ mô hình quỹ gia đình từ năm 2016, chúng tôi tự tin rằng ĐP Capital sẽ trở thành đối tác đầu tư đáng tin cậy cho các nhà đầu tư tại Lạng Sơn và khu vực phía Bắc."
      </p>
      <cite className="text-sm text-gold font-semibold not-italic">
        — Ông Hoàng Viễn Trí Anh, Nhà sáng lập & Cố vấn Đầu tư
      </cite>
    </blockquote>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Thông tin liên hệ</h2>
    <div className="space-y-2 text-muted-foreground">
      <p>📞 Hotline: <a href="tel:+840947223888" className="text-gold hover:underline">(+84) 0947 223 888</a></p>
      <p>📧 Email: <a href="mailto:ctcpdongphulangson@outlook.com.vn" className="text-gold hover:underline">ctcpdongphulangson@outlook.com.vn</a></p>
      <p>📍 Địa chỉ: Số 85 Nguyễn Thái Học, phường Lương Văn Chi, tỉnh Lạng Sơn</p>
    </div>
  </NewsDetailLayout>
);

export default RaMatQuyDauTu;
