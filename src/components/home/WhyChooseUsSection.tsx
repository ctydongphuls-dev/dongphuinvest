import { Shield, TrendingUp, Users, Award, Clock, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  { icon: Shield, title: "Bảo toàn vốn tối đa", desc: "Cam kết bảo vệ vốn đầu tư với hệ thống quản trị rủi ro chặt chẽ", stat: "99.5%" },
  { icon: TrendingUp, title: "Lợi nhuận vượt trội", desc: "Tỷ suất lợi nhuận trung bình hàng năm vượt xa lãi suất tiền gửi", stat: "15-25%" },
  { icon: Users, title: "Đội ngũ chuyên gia", desc: "Hơn 50 chuyên gia tài chính với kinh nghiệm quốc tế", stat: "50+" },
  { icon: Award, title: "Giấy phép đầy đủ", desc: "Được cấp phép và giám sát bởi các cơ quan quản lý Nhà nước", stat: "100%" },
  { icon: Clock, title: "Hỗ trợ 24/7", desc: "Đường dây tư vấn và hỗ trợ khách hàng hoạt động liên tục", stat: "24/7" },
  { icon: Headphones, title: "Tư vấn cá nhân hóa", desc: "Chiến lược đầu tư được thiết kế riêng cho từng khách hàng", stat: "1:1" },
];

const WhyChooseUsSection = () => {
  return (
    <section className="section-padding gradient-navy">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-gold font-semibold text-sm uppercase tracking-wide">Điểm khác biệt</span>
          <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mt-2 mb-4">
            Tại sao chọn Đồng Phú Lạng Sơn?
          </h2>
          <p className="text-primary-foreground/70">
            Những lý do hàng trăm khách hàng tin tưởng giao phó tài sản cho chúng tôi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(({ icon: Icon, title, desc, stat }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8 text-gold" />
                <span className="text-2xl font-bold text-gold">{stat}</span>
              </div>
              <h3 className="text-lg font-semibold text-primary-foreground mb-2">{title}</h3>
              <p className="text-sm text-primary-foreground/60 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
