import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const news = [
  {
    title: "Ra mắt Quỹ đầu tư ĐP Capital",
    date: "15/01/2025",
    desc: "Công ty chính thức ra mắt Quỹ đầu tư Tăng trưởng ĐP Capital với mục tiêu hỗ trợ các cơ hội tăng trưởng bền vững.",
    category: "Sản phẩm mới",
  },
  {
    title: "Hội thảo Đầu tư thông minh 2025",
    date: "20/02/2025",
    desc: "Chia sẻ kiến thức và cơ hội đầu tư tại Lạng Sơn với các chuyên gia tài chính hàng đầu.",
    category: "Sự kiện",
  },
  {
    title: "Ký kết hợp tác chiến lược",
    date: "10/03/2025",
    desc: "Đồng Phú Lạng Sơn ký kết hợp tác với các đối tác chiến lược để mở rộng dịch vụ tài chính.",
    category: "Tin tức",
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
