import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Clock, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { icon: Clock, value: "10+", label: "Năm kinh nghiệm" },
  { icon: Users, value: "100+", label: "Khách hàng tin tưởng" },
  { icon: Briefcase, value: "200+", label: "Tỷ đồng quản lý" },
  { icon: TrendingUp, value: "95%", label: "Khách hàng hài lòng" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 gradient-hero" />

      <div className="relative container-custom py-20 md:py-28">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-gold/20 text-gold border border-gold/30 mb-6">
              Uy tín - Minh bạch - Hiệu quả
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
          >
            Đồng hành cùng bạn trên con đường{" "}
            <span className="text-gold">đầu tư thịnh vượng</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base md:text-lg text-primary-foreground/80 max-w-xl mb-8 leading-relaxed"
          >
            Công ty Cổ phần Đầu tư và Phát triển Đồng Phú Lạng Sơn cung cấp các giải pháp ủy thác đầu tư, quản lý tài sản và tư vấn tài chính chuyên nghiệp.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            <Button variant="hero" size="lg" asChild>
              <Link to="/services/uy-thac-dau-tu">Khám phá dịch vụ</Link>
            </Button>
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/#contact">Liên hệ ngay</Link>
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-5 border border-primary-foreground/10 text-center"
            >
              <Icon className="w-6 h-6 text-gold mx-auto mb-2" />
              <p className="text-2xl md:text-3xl font-bold text-primary-foreground">{value}</p>
              <p className="text-xs md:text-sm text-primary-foreground/70 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
