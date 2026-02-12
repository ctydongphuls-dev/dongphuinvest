import { motion } from "framer-motion";

const partners = [
  { name: "Công ty Chứng khoán TCBS", field: "Chứng khoán & Đầu tư" },
  { name: "Công ty Tư vấn Xây lắp Thiết bị Điện", field: "Xây dựng & Điện" },
  { name: "Công ty Luật Đồng Phú", field: "Tư vấn pháp lý" },
  { name: "Ngân hàng Đối tác", field: "Tài chính ngân hàng" },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map(({ name, field }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center justify-center p-6 rounded-xl border border-border bg-card hover:border-gold/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-3 border border-border">
                <p className="text-xs font-bold text-gold text-center">{name.split(" ")[0]}</p>
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
