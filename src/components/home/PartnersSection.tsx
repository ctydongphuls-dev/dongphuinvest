import { motion } from "framer-motion";
import { Zap, Scale, Building2 } from "lucide-react";

const partners = [
  {
    name: "Công ty Chứng khoán TCBS",
    field: "Chứng khoán & Đầu tư",
    abbr: "TCBS",
    bg: "bg-[hsl(213,52%,25%)]",
    textColor: "text-white",
    icon: null,
  },
  {
    name: "Công ty Tư vấn Xây lắp Thiết bị Điện",
    field: "Xây dựng & Điện",
    abbr: "XL ĐIỆN",
    bg: "bg-[hsl(45,70%,47%)]",
    textColor: "text-white",
    icon: Zap,
  },
  {
    name: "Công ty Luật Đồng Phú",
    field: "Tư vấn pháp lý",
    abbr: "LUẬT ĐP",
    bg: "bg-[hsl(213,52%,20%)]",
    textColor: "text-white",
    icon: Scale,
  },
  {
    name: "Ngân hàng Đối tác",
    field: "Tài chính ngân hàng",
    abbr: "BANK",
    bg: "bg-[hsl(160,84%,29%)]",
    textColor: "text-white",
    icon: Building2,
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
          {partners.map(({ name, field, abbr, bg, textColor, icon: Icon }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col items-center justify-center p-6 rounded-xl border border-border bg-card hover:border-gold/30 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-[120px] h-[60px] rounded-lg ${bg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                {Icon && <Icon className={`w-4 h-4 ${textColor} mr-1`} />}
                <span className={`text-sm font-bold ${textColor}`}>{abbr}</span>
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
