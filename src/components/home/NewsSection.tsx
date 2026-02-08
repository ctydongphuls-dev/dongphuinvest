import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const news = [
  {
    title: "Đồng Phú Lạng Sơn ra mắt Quỹ đầu tư Tăng trưởng 2024",
    date: "15/01/2024",
    desc: "Quỹ đầu tư mới với quy mô 500 tỷ đồng, tập trung vào cổ phiếu tăng trưởng và trái phiếu doanh nghiệp uy tín.",
    category: "Sản phẩm mới",
  },
  {
    title: "Hội nghị khách hàng thường niên 2024 thành công tốt đẹp",
    date: "20/12/2023",
    desc: "Hơn 300 khách hàng tham dự, chia sẻ kết quả đầu tư ấn tượng và chiến lược năm 2024.",
    category: "Sự kiện",
  },
  {
    title: "Triển vọng thị trường đầu tư Việt Nam năm 2024",
    date: "10/12/2023",
    desc: "Phân tích chuyên sâu về xu hướng đầu tư, cơ hội và thách thức trong năm mới.",
    category: "Phân tích",
  },
];

const NewsSection = () => {
  return (
    <section id="news" className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-gold font-semibold text-sm uppercase tracking-wide">Cập nhật</span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Tin tức & Sự kiện
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map(({ title, date, desc, category }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-xl border border-border overflow-hidden bg-card hover:shadow-lg transition-shadow"
            >
              <div className="h-40 gradient-navy flex items-center justify-center">
                <span className="text-sm font-medium text-gold/60">{category}</span>
              </div>
              <div className="p-5">
                <span className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Calendar className="w-3 h-3" /> {date}
                </span>
                <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-gold transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{desc}</p>
                <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-dark transition-colors">
                  Đọc thêm <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
