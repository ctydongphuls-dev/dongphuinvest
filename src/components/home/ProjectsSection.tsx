import { MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const projects = [
  {
    title: "Quỹ đầu tư Tăng trưởng ĐP Capital",
    location: "Lạng Sơn & Vùng phụ cận",
    desc: "Quỹ đầu tư tập trung vào các trái phiếu, cổ phiếu tăng trưởng bền vững trên thị trường Chứng khoán Việt Nam.",
    status: "Đang hoạt động",
    roi: "15-20%/năm",
    date: "Từ 2025 đến nay",
    color: "bg-emerald-500/10 text-emerald-600",
    image: "https://kaikun-ai-image.s3.ap-northeast-1.amazonaws.com/58f3c039-d005-4011-aea8-10617b05b557%2F1771824856919.png",
    alt: "Quỹ đầu tư Tăng trưởng ĐP Capital",
  },
  {
    title: "Dự án Trung tâm Khởi nghiệp Lạng Sơn",
    location: "Tỉnh Lạng Sơn",
    desc: "Xây dựng hệ sinh thái khởi nghiệp, hỗ trợ doanh nghiệp trẻ phát triển tại địa phương.",
    status: "Đang chuẩn bị",
    roi: "Theo dự án",
    date: "Q2/2026",
    color: "bg-blue-500/10 text-blue-600",
    image: "https://cafefcdn.com/203337114487263232/2025/8/27/undefined-1-17562693125651308410700.png",
    alt: "Dự án Trung tâm Khởi nghiệp Lạng Sơn",
  },
];

const ProjectImage = ({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="h-48 overflow-hidden relative bg-muted">
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      {error ? (
        <div className="h-full gradient-navy flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Hình ảnh</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
};

const ProjectsSection = () => {
  return (
    <section id="projects" className="section-padding bg-card">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-gold font-semibold text-sm uppercase tracking-wide">Cơ hội đầu tư</span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Dự án nổi bật
          </h2>
          <p className="text-muted-foreground">
            Các dự án đầu tư tiêu biểu đang được Đồng Phú Lạng Sơn triển khai và quản lý
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map(({ title, location, desc, status, roi, date, color, image, alt }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-xl border border-border overflow-hidden bg-background hover:shadow-lg transition-all duration-300"
            >
              <ProjectImage src={image} alt={alt} />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={`${color} border-0 text-xs font-medium`}>{status}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {date}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{desc}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {location}
                  </span>
                  <span className="text-sm font-semibold text-gold">{roi}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
