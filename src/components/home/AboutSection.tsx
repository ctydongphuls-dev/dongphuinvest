import { Shield, Eye, Award, Target } from "lucide-react";
import { motion } from "framer-motion";

const values = [
  { icon: Shield, title: "Uy tín", desc: "Cam kết bảo vệ quyền lợi nhà đầu tư với tiêu chuẩn đạo đức nghề nghiệp cao nhất." },
  { icon: Eye, title: "Minh bạch", desc: "Mọi hoạt động đầu tư đều được báo cáo rõ ràng, minh bạch đến từng chi tiết." },
  { icon: Award, title: "Chuyên nghiệp", desc: "Đội ngũ chuyên gia giàu kinh nghiệm với năng lực chuyên môn hàng đầu." },
  { icon: Target, title: "Hiệu quả", desc: "Tối ưu lợi nhuận đầu tư với chiến lược quản lý rủi ro bài bản, khoa học." },
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-card">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold font-semibold text-sm uppercase tracking-wide"
          >
            Giới thiệu
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-4xl font-bold text-foreground mt-2 mb-4"
          >
            Về Đồng Phú Lạng Sơn
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground leading-relaxed"
          >
            Với hơn 10 năm kinh nghiệm trong lĩnh vực tài chính đầu tư, Đồng Phú Lạng Sơn luôn đặt lợi ích của khách hàng lên hàng đầu. Chúng tôi cam kết mang đến các giải pháp đầu tư an toàn, hiệu quả và bền vững.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-xl bg-background border border-border hover:border-gold/30 hover:shadow-gold transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/5 group-hover:bg-gold/10 flex items-center justify-center mx-auto mb-4 transition-colors">
                <Icon className="w-7 h-7 text-primary group-hover:text-gold transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
