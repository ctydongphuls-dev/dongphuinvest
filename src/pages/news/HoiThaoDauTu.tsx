import NewsDetailLayout from "@/components/news/NewsDetailLayout";

const relatedArticles = [
  {
    title: "Ra mắt Quỹ đầu tư ĐP Capital",
    date: "15/01/2025",
    image: "https://kaikun-ai-image.s3.ap-northeast-1.amazonaws.com/58f3c039-d005-4011-aea8-10617b05b557%2F1772025677399.png",
    href: "/tin-tuc/ra-mat-quy-dau-tu-dp-capital",
    category: "Sản phẩm mới",
  },
  {
    title: "Ký kết hợp tác chiến lược",
    date: "10/03/2025",
    image: "https://kaikun-ai-image.s3.ap-northeast-1.amazonaws.com/58f3c039-d005-4011-aea8-10617b05b557%2F1771770007525.png",
    href: "/tin-tuc/ky-ket-hop-tac-chien-luoc",
    category: "Tin tức",
  },
];

const HoiThaoDauTu = () => (
  <NewsDetailLayout
    title="Hội thảo Đầu tư thông minh 2025 – Nắm bắt cơ hội, Tối ưu lợi nhuận"
    date="20/02/2025"
    author="Ban Truyền thông"
    category="Sự kiện"
    image="https://kaikun-ai-image.s3.ap-northeast-1.amazonaws.com/58f3c039-d005-4011-aea8-10617b05b557%2F1771769340577.png"
    imageAlt="Hội thảo Đầu tư thông minh 2025"
    relatedArticles={relatedArticles}
  >
    <p className="text-lg text-foreground leading-relaxed mb-6">
      <strong>LẠNG SƠN, 20/02/2025</strong> – Công ty Cổ phần Đầu tư và Phát triển Đồng Phú Lạng Sơn đã tổ chức thành công Hội thảo "Đầu tư thông minh 2025" với sự tham gia của đông đảo nhà đầu tư, doanh nhân và những người quan tâm đến lĩnh vực tài chính.
    </p>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Chủ đề chính của Hội thảo</h2>

    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">1. Tổng quan thị trường chứng khoán Việt Nam 2025</h3>
    <ul className="space-y-1 text-muted-foreground mb-4 list-disc pl-5">
      <li>Phân tích xu hướng vĩ mô và tác động đến thị trường</li>
      <li>Dự báo các ngành nghề tiềm năng trong năm mới</li>
      <li>Các yếu tố rủi ro cần lưu ý</li>
    </ul>

    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">2. Chiến lược đầu tư hiệu quả</h3>
    <ul className="space-y-1 text-muted-foreground mb-4 list-disc pl-5">
      <li>Phương pháp phân tích cơ bản và kỹ thuật</li>
      <li>Xây dựng danh mục đầu tư cân bằng</li>
      <li>Quản lý rủi ro và bảo toàn vốn</li>
    </ul>

    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">3. Cơ hội đầu tư ủy thác</h3>
    <ul className="space-y-1 text-muted-foreground mb-6 list-disc pl-5">
      <li>Giới thiệu các gói dịch vụ ủy thác đầu tư</li>
      <li>So sánh ưu nhược điểm với đầu tư tự quản</li>
      <li>Case study thực tế từ Quỹ ĐP Capital</li>
    </ul>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Diễn giả chia sẻ</h2>

    <blockquote className="border-l-4 border-gold pl-5 py-3 my-6 bg-muted/50 rounded-r-lg">
      <p className="text-foreground italic mb-2">
        "Trong bối cảnh thị trường biến động, việc lựa chọn cổ phiếu có nền tảng tài chính vững chắc và triển vọng tăng trưởng dài hạn là yếu tố then chốt để đạt được lợi nhuận bền vững."
      </p>
      <cite className="text-sm text-gold font-semibold not-italic">
        — Bà Nguyễn Thị Minh Anh, Giám đốc Đầu tư, CFA Charterholder
      </cite>
    </blockquote>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Phản hồi từ người tham dự</h2>

    <blockquote className="border-l-4 border-border pl-5 py-3 my-6 bg-muted/30 rounded-r-lg">
      <p className="text-foreground italic mb-2">
        "Đây là lần đầu tiên tôi tham dự một hội thảo đầu tư chuyên nghiệp như vậy tại Lạng Sơn. Những kiến thức được chia sẻ rất thiết thực và giúp tôi có cái nhìn rõ ràng hơn về việc quản lý tài sản của mình."
      </p>
      <cite className="text-sm text-muted-foreground font-semibold not-italic">
        — Anh Nguyễn Văn Minh, Doanh nhân
      </cite>
    </blockquote>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Cam kết đồng hành</h2>

    <blockquote className="border-l-4 border-gold pl-5 py-3 my-6 bg-muted/50 rounded-r-lg">
      <p className="text-foreground italic mb-2">
        "Đồng Phú Lạng Sơn cam kết tiếp tục tổ chức các chương trình đào tạo, hội thảo nhằm nâng cao kiến thức tài chính cho cộng đồng nhà đầu tư địa phương. Chúng tôi tin rằng, kiến thức là nền tảng quan trọng nhất cho mọi quyết định đầu tư thành công."
      </p>
      <cite className="text-sm text-gold font-semibold not-italic">
        — Ông Hoàng Văn Quyết, Chủ tịch HĐQT kiêm Tổng Giám đốc
      </cite>
    </blockquote>

    <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Hội thảo tiếp theo</h2>
    <p className="text-muted-foreground leading-relaxed">
      Công ty dự kiến tổ chức chuỗi hội thảo định kỳ hàng quý. Để đăng ký tham dự các sự kiện sắp tới, vui lòng liên hệ hotline hoặc email của công ty.
    </p>
  </NewsDetailLayout>
);

export default HoiThaoDauTu;
