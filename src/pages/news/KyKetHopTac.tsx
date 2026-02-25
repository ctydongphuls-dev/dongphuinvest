import NewsDetailLayout from "@/components/news/NewsDetailLayout";

const relatedArticles = [
  {
    title: "Ra mắt Quỹ đầu tư ĐP Capital",
    date: "15/01/2025",
    image: "https://kaikun-ai-image.s3.ap-northeast-1.amazonaws.com/58f3c039-d005-4011-aea8-10617b05b557%2F1771772268518.png",
    href: "/tin-tuc/ra-mat-quy-dau-tu-dp-capital",
    category: "Sản phẩm mới",
  },
  {
    title: "Hội thảo Đầu tư thông minh 2025",
    date: "20/02/2025",
    image: "https://kaikun-ai-image.s3.ap-northeast-1.amazonaws.com/58f3c039-d005-4011-aea8-10617b05b557%2F1771769340577.png",
    href: "/tin-tuc/hoi-thao-dau-tu-thong-minh-2025",
    category: "Sự kiện",
  },
];

const KyKetHopTac = () => (
  <NewsDetailLayout
    title="Đồng Phú Lạng Sơn ký kết hợp tác chiến lược với các đối tác"
    date="10/03/2025"
    author="Ban Truyền thông"
    category="Tin tức"
    image="https://kaikun-ai-image.s3.ap-northeast-1.amazonaws.com/58f3c039-d005-4011-aea8-10617b05b557%2F1771770007525.png"
    imageAlt="Lễ ký kết hợp tác chiến lược 2025"
    relatedArticles={relatedArticles}
  >
    <p className="text-lg text-foreground leading-relaxed mb-6">
      <strong>LẠNG SƠN, 10/03/2025</strong> – Công ty Cổ phần Đầu tư và Phát triển Đồng Phú Lạng Sơn đã tổ chức Lễ ký kết Thỏa thuận Hợp tác với các đối tác, đánh dấu bước phát triển mới trong việc mở rộng hoạt động kinh doanh và nâng cao chất lượng dịch vụ.
    </p>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Các đối tác hợp tác</h2>

    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">1. Công ty TNHH Tư vấn và Thiết bị Điện - Hợp tác về vốn</h3>
    <p className="text-muted-foreground leading-relaxed mb-4">
      Đồng Phú Lạng Sơn chính thức ký kết thỏa thuận hợp tác về vốn với Công ty TNHH Tư vấn và Thiết bị Điện. Đây là bước đi chiến lược nhằm tăng cường năng lực tài chính và mở rộng quy mô hoạt động của công ty.
    </p>
    <p className="text-sm font-semibold text-foreground mb-2">Nội dung hợp tác:</p>
    <ul className="space-y-1 text-muted-foreground mb-4 list-disc pl-5">
      <li>Hợp tác góp vốn đầu tư, mở rộng quy mô quỹ</li>
      <li>Chia sẻ nguồn lực và kinh nghiệm kinh doanh</li>
      <li>Phát triển các dự án đầu tư chung</li>
      <li>Hỗ trợ lẫn nhau trong các hoạt động kinh doanh</li>
    </ul>

    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">2. Công ty Chứng khoán TCBS - Đối tác giao dịch</h3>
    <p className="text-muted-foreground leading-relaxed mb-4">
      Đồng Phú Lạng Sơn đã hoàn tất thủ tục mở tài khoản giao dịch chứng khoán tại Công ty Chứng khoán TCBS - một trong những công ty chứng khoán hàng đầu Việt Nam với nền tảng công nghệ hiện đại.
    </p>
    <p className="text-sm font-semibold text-foreground mb-2">Lợi ích khi giao dịch qua TCBS:</p>
    <ul className="space-y-1 text-muted-foreground mb-4 list-disc pl-5">
      <li>Nền tảng giao dịch trực tuyến hiện đại, tiện lợi</li>
      <li>Phí giao dịch cạnh tranh</li>
      <li>Công cụ phân tích và nghiên cứu thị trường chuyên sâu</li>
      <li>Hỗ trợ kỹ thuật 24/7</li>
      <li>Báo cáo giao dịch minh bạch, cập nhật realtime</li>
    </ul>

    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">3. Công ty Luật Đồng Phú - Tư vấn pháp lý</h3>
    <ul className="space-y-1 text-muted-foreground mb-6 list-disc pl-5">
      <li>Tư vấn pháp lý cho các giao dịch đầu tư</li>
      <li>Hỗ trợ soạn thảo hợp đồng ủy thác</li>
      <li>Bảo vệ quyền lợi nhà đầu tư</li>
    </ul>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Phát biểu tại Lễ ký kết</h2>

    <blockquote className="border-l-4 border-gold pl-5 py-3 my-6 bg-muted/50 rounded-r-lg">
      <p className="text-foreground italic mb-2">
        "Việc hợp tác về vốn với Công ty TNHH Tư vấn và Thiết bị Điện sẽ giúp chúng tôi tăng cường năng lực tài chính, mở rộng quy mô quỹ đầu tư và mang đến nhiều cơ hội hơn cho các nhà đầu tư. Đồng thời, việc mở tài khoản tại TCBS giúp chúng tôi tiếp cận nền tảng giao dịch hiện đại nhất thị trường."
      </p>
      <cite className="text-sm text-gold font-semibold not-italic">
        — Ông Hoàng Văn Quyết, Chủ tịch HĐQT kiêm Tổng Giám đốc
      </cite>
    </blockquote>

    <blockquote className="border-l-4 border-gold pl-5 py-3 my-6 bg-muted/50 rounded-r-lg">
      <p className="text-foreground italic mb-2">
        "Mỗi đối tác mang đến những giá trị khác nhau. Sự hợp tác về vốn giúp chúng tôi có nguồn lực mạnh mẽ hơn, còn TCBS cung cấp công cụ giao dịch tối ưu để chúng tôi thực hiện các chiến lược đầu tư hiệu quả."
      </p>
      <cite className="text-sm text-gold font-semibold not-italic">
        — Ông Hoàng Viễn Trí Anh, Nhà sáng lập & Cố vấn Đầu tư
      </cite>
    </blockquote>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Lợi ích cho nhà đầu tư</h2>
    <ul className="space-y-2 text-muted-foreground mb-6">
      <li>✓ Quy mô quỹ được mở rộng, đa dạng hóa danh mục đầu tư</li>
      <li>✓ Giao dịch trên nền tảng TCBS hiện đại, minh bạch</li>
      <li>✓ Tư vấn pháp lý chuyên nghiệp cho mọi giao dịch</li>
      <li>✓ Báo cáo đầu tư chi tiết, cập nhật thường xuyên</li>
      <li>✓ An toàn và bảo mật cao</li>
    </ul>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Tầm nhìn tương lai</h2>
    <p className="text-muted-foreground leading-relaxed">
      Với nền tảng hợp tác vững chắc, Đồng Phú Lạng Sơn đặt mục tiêu tiếp tục mở rộng mạng lưới đối tác và phát triển các sản phẩm đầu tư đa dạng. Công ty cũng đang triển khai Dự án Trung tâm Khởi nghiệp Lạng Sơn, dự kiến khởi động vào Q2/2026.
    </p>
  </NewsDetailLayout>
);

export default KyKetHopTac;
