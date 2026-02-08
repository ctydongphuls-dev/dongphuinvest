import { MapPin, TrendingUp, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    title: "Khu đô thị Đồng Phú Residence",
    location: "TP. Lạng Sơn",
    desc: "Dự án khu đô thị cao cấp với hơn 200 lô đất nền, hạ tầng đồng bộ hiện đại.",
    status: "Đang triển khai",
    roi: "18-22%/năm",
    date: "2023 - 2026",
    color: "bg-gold/10 text-gold",
  },
  {
    title: "Quỹ đầu tư Tăng trưởng ĐP Capital",
    location: "Toàn quốc",
    desc: "Quỹ đầu tư mở tập trung vào cổ phiếu blue-chip và trái phiếu doanh nghiệp uy tín.",
    status: "Đang huy động",
    roi: "15-20%/năm",
    date: "2024 - Hiện tại",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "Dự án Năng lượng tái tạo Lạng Sơn",
    location: "Tỉnh Lạng Sơn",
    desc: "Đầu tư phát triển hệ thống điện mặt trời quy mô lớn tại khu vực biên giới.",
    status: "Sắp khởi động",
    roi: "12-16%/năm",
    date: "Q2/2025",
    color: "bg-blue-500/10 text-blue-600",
  },
];

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
          {projects.map(({ title, location, desc, status, roi, date, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-xl border border-border overflow-hidden bg-background hover:shadow-lg transition-all duration-300"
            >
              <div className="h-48 gradient-navy flex items-center justify-center">
                <TrendingUp className="w-16 h-16 text-gold/30" />
              </div>
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
