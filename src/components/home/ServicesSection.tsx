import { Link } from "react-router-dom";
import { Landmark, PieChart, UserCheck, Building2, Briefcase, Wallet, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  { icon: Landmark, title: "Ủy thác đầu tư", desc: "Quản lý vốn đầu tư chuyên nghiệp với cam kết lợi nhuận hấp dẫn và bảo toàn vốn tối đa.", link: "/services/uy-thac-dau-tu" },
  { icon: PieChart, title: "Quản lý danh mục đầu tư", desc: "Phân bổ tài sản đa dạng, tối ưu rủi ro và lợi nhuận theo mục tiêu tài chính cá nhân.", link: "/services/uy-thac-dau-tu" },
  { icon: UserCheck, title: "Tư vấn tài chính cá nhân", desc: "Lập kế hoạch tài chính toàn diện, tư vấn chiến lược đầu tư phù hợp với từng khách hàng.", link: "/services/uy-thac-dau-tu" },
  { icon: Building2, title: "Đầu tư bất động sản", desc: "Cơ hội đầu tư bất động sản sinh lời cao tại các vị trí chiến lược trên toàn quốc.", link: "/services/uy-thac-dau-tu" },
  { icon: Briefcase, title: "Tư vấn doanh nghiệp", desc: "Giải pháp tài chính doanh nghiệp, tư vấn M&A, tái cơ cấu và quản trị rủi ro.", link: "/services/uy-thac-dau-tu" },
  { icon: Wallet, title: "Quản lý quỹ", desc: "Quản lý quỹ đầu tư chuyên nghiệp với đội ngũ phân tích và nghiên cứu thị trường hàng đầu.", link: "/services/uy-thac-dau-tu" },
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold font-semibold text-sm uppercase tracking-wide"
          >
            Giải pháp đầu tư
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-bold text-foreground mt-2 mb-4"
          >
            Dịch vụ của chúng tôi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Đa dạng giải pháp tài chính được thiết kế riêng, đáp ứng mọi nhu cầu đầu tư của bạn
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, link }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative p-6 rounded-xl bg-card border border-border hover:border-gold/30 hover:shadow-gold transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/5 group-hover:bg-gold/10 flex items-center justify-center mb-4 transition-colors">
                <Icon className="w-6 h-6 text-primary group-hover:text-gold transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{desc}</p>
              <Link
                to={link}
                className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-gold-dark transition-colors"
              >
                Tìm hiểu thêm
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
