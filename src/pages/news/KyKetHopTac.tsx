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
    title="Đồng Phú Lạng Sơn ký kết hợp tác chiến lược với các đối tác hàng đầu"
    date="10/03/2025"
    author="Ban Truyền thông"
    category="Tin tức"
    image="https://kaikun-ai-image.s3.ap-northeast-1.amazonaws.com/58f3c039-d005-4011-aea8-10617b05b557%2F1771770007525.png"
    imageAlt="Lễ ký kết hợp tác chiến lược 2025"
    relatedArticles={relatedArticles}
  >
    <p className="text-lg text-foreground leading-relaxed mb-6">
      <strong>LẠNG SƠN, 10/03/2025</strong> – Công ty Cổ phần Đầu tư và Phát triển Đồng Phú Lạng Sơn đã tổ chức Lễ ký kết Thỏa thuận Hợp tác Chiến lược với các đối tác uy tín, đánh dấu bước phát triển mới trong việc mở rộng hệ sinh thái dịch vụ tài chính toàn diện.
    </p>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Các đối tác chiến lược</h2>

    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">1. Công ty Chứng khoán TCBS</h3>
    <ul className="space-y-1 text-muted-foreground mb-4 list-disc pl-5">
      <li>Hợp tác trong lĩnh vực môi giới chứng khoán</li>
      <li>Chia sẻ công nghệ và nền tảng giao dịch</li>
      <li>Phát triển sản phẩm đầu tư chung</li>
    </ul>

    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">2. Công ty Luật Đồng Phú</h3>
    <ul className="space-y-1 text-muted-foreground mb-4 list-disc pl-5">
      <li>Tư vấn pháp lý cho các giao dịch đầu tư</li>
      <li>Hỗ trợ soạn thảo hợp đồng ủy thác</li>
      <li>Bảo vệ quyền lợi nhà đầu tư</li>
    </ul>

    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">3. Ngân hàng Đối tác</h3>
    <ul className="space-y-1 text-muted-foreground mb-6 list-disc pl-5">
      <li>Dịch vụ lưu ký và quản lý tài khoản</li>
      <li>Giải pháp thanh toán và chuyển tiền</li>
      <li>Sản phẩm tài chính bổ sung</li>
    </ul>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Nội dung hợp tác chính</h2>
    <ul className="space-y-2 text-muted-foreground mb-6">
      <li><strong className="text-foreground">Chia sẻ nguồn lực:</strong> Tận dụng thế mạnh của từng đối tác để cung cấp dịch vụ tốt nhất cho khách hàng</li>
      <li><strong className="text-foreground">Phát triển sản phẩm:</strong> Nghiên cứu và ra mắt các sản phẩm đầu tư mới phù hợp với nhu cầu thị trường</li>
      <li><strong className="text-foreground">Đào tạo nhân sự:</strong> Chương trình đào tạo chéo nâng cao năng lực đội ngũ</li>
      <li><strong className="text-foreground">Mở rộng thị trường:</strong> Phối hợp tiếp cận và phục vụ khách hàng tại khu vực phía Bắc</li>
    </ul>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Phát biểu tại Lễ ký kết</h2>

    <blockquote className="border-l-4 border-gold pl-5 py-3 my-6 bg-muted/50 rounded-r-lg">
      <p className="text-foreground italic mb-2">
        "Việc hợp tác với các đối tác uy tín là bước đi chiến lược quan trọng của Đồng Phú Lạng Sơn. Chúng tôi tin rằng sự kết hợp này sẽ tạo ra giá trị vượt trội cho khách hàng, đồng thời góp phần phát triển thị trường tài chính tại địa phương."
      </p>
      <cite className="text-sm text-gold font-semibold not-italic">
        — Ông Hoàng Văn Quyết, Chủ tịch HĐQT kiêm Tổng Giám đốc
      </cite>
    </blockquote>

    <blockquote className="border-l-4 border-gold pl-5 py-3 my-6 bg-muted/50 rounded-r-lg">
      <p className="text-foreground italic mb-2">
        "Hợp tác chiến lược không chỉ giúp chúng tôi mở rộng phạm vi dịch vụ mà còn nâng cao chất lượng phục vụ. Nhà đầu tư sẽ được trải nghiệm hệ sinh thái tài chính toàn diện với sự hỗ trợ chuyên nghiệp từ nhiều chuyên gia."
      </p>
      <cite className="text-sm text-gold font-semibold not-italic">
        — Ông Hoàng Viễn Trí Anh, Nhà sáng lập & Cố vấn Đầu tư
      </cite>
    </blockquote>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Lợi ích cho nhà đầu tư</h2>
    <ul className="space-y-2 text-muted-foreground mb-6">
      <li>✓ Tiếp cận nền tảng giao dịch hiện đại từ TCBS</li>
      <li>✓ Tư vấn pháp lý miễn phí cho các giao dịch ủy thác</li>
      <li>✓ Ưu đãi phí giao dịch và quản lý</li>
      <li>✓ Dịch vụ chăm sóc khách hàng 24/7</li>
      <li>✓ Báo cáo đầu tư chuyên sâu và cập nhật</li>
    </ul>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Tầm nhìn tương lai</h2>
    <p className="text-muted-foreground leading-relaxed">
      Đồng Phú Lạng Sơn đặt mục tiêu tiếp tục mở rộng mạng lưới đối tác, hướng đến xây dựng hệ sinh thái tài chính toàn diện phục vụ nhu cầu đa dạng của nhà đầu tư. Công ty cũng đang triển khai Dự án Trung tâm Khởi nghiệp Lạng Sơn, dự kiến khởi động vào Q2/2026, nhằm hỗ trợ cộng đồng doanh nghiệp trẻ tại địa phương.
    </p>
  </NewsDetailLayout>
);

export default KyKetHopTac;
