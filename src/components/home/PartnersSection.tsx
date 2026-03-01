import { motion } from "framer-motion";
import { Zap, Scale, Landmark, TrendingUp } from "lucide-react";

const partners = [
  {
    name: "Công ty Chứng khoán TCBS",
    field: "Chứng khoán & Đầu tư",
    abbr: "TCBS",
    gradient: "from-[#1a56db] to-[#1e40af]",
    icon: TrendingUp,
  },
  {
    name: "Công ty Tư vấn Xây lắp Thiết bị Điện",
    field: "Xây dựng & Điện",
    abbr: "XÂY LẮP ĐIỆN",
    gradient: "from-[#f59e0b] to-[#d97706]",
    icon: Zap,
  },
  {
    name: "Công ty Luật Phương Lan",
    field: "Tư vấn pháp lý",
    abbr: "LUẬT PHƯƠNG LAN",
    gradient: "from-[#1e3a5f] to-[#0f2744]",
    icon: Scale,
    textGold: true,
  },
  {
    name: "Ngân hàng Đối tác",
    field: "Tài chính ngân hàng",
    abbr: "NGÂN HÀNG ĐỐI TÁC",
    gradient: "from-[#059669] to-[#047857]",
    icon: Landmark,
  },
];

const PartnersSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-gold font-semibold text-sm uppercase tracking-wide">Hợp tác chiến lược</span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mt-2">
            Đối tác của chúng tôi
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {partners.map(({ name, field, abbr, gradient, icon: Icon, textGold }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col items-center justify-center p-6 rounded-xl border border-border bg-card hover:border-gold/30 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`w-[150px] h-[70px] rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center gap-1.5 mb-4 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${textGold ? "text-[hsl(45,70%,47%)]" : "text-white"}`} />
                <span className={`text-xs font-bold leading-tight text-center ${textGold ? "text-[hsl(45,70%,47%)]" : "text-white"}`}>
                  {abbr}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground text-center leading-tight mb-1">{name}</p>
              <p className="text-xs text-muted-foreground text-center">{field}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
