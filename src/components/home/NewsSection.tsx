import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const news = [
  {
    title: "Ra mắt Quỹ đầu tư ĐP Capital",
    date: "15/01/2025",
    desc: "Công ty chính thức ra mắt Quỹ đầu tư Tăng trưởng ĐP Capital với mục tiêu hỗ trợ các cơ hội tăng trưởng bền vững.",
    category: "Sản phẩm mới",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=340&fit=crop",
    alt: "Lễ ra mắt Quỹ đầu tư ĐP Capital năm 2025",
    overlay: "RA MẮT QUỸ ĐẦU TƯ",
  },
  {
    title: "Hội thảo Đầu tư thông minh 2025",
    date: "20/02/2025",
    desc: "Chia sẻ kiến thức và cơ hội đầu tư tại Lạng Sơn với các chuyên gia tài chính hàng đầu.",
    category: "Sự kiện",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=340&fit=crop",
    alt: "Hội thảo Đầu tư thông minh 2025 tại Lạng Sơn",
    overlay: "HỘI THẢO ĐẦU TƯ 2025",
  },
  {
    title: "Ký kết hợp tác chiến lược",
    date: "10/03/2025",
    desc: "Đồng Phú Lạng Sơn ký kết hợp tác với các đối tác chiến lược để mở rộng dịch vụ tài chính.",
    category: "Tin tức",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=340&fit=crop",
    alt: "Lễ ký kết hợp tác chiến lược - bắt tay đối tác",
    overlay: "KÝ KẾT HỢP TÁC",
  },
];

const NewsImage = ({ src, alt, category, overlay }: { src: string; alt: string; category: string; overlay: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="h-44 overflow-hidden relative bg-muted">
      {!loaded && !error && <div className="absolute inset-0 animate-pulse bg-muted" />}
      {error ? (
        <div className="h-full gradient-navy flex items-center justify-center">
          <span className="text-sm font-bold text-primary-foreground/80">{overlay}</span>
        </div>
      ) : (
        <>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(213,52%,15%,0.7)] to-transparent" />
          <span className="absolute bottom-8 left-3 text-sm font-bold text-primary-foreground drop-shadow-lg">
            {overlay}
          </span>
          <span className="absolute bottom-2 left-3 text-xs font-medium text-primary-foreground/90 bg-black/30 px-2 py-0.5 rounded">
            {category}
          </span>
        </>
      )}
    </div>
  );
};

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
          {news.map(({ title, date, desc, category, image, alt, overlay }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-xl border border-border overflow-hidden bg-card hover:shadow-lg transition-shadow"
            >
              <NewsImage src={image} alt={alt} category={category} overlay={overlay} />
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
