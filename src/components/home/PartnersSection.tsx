import { motion } from "framer-motion";

const partners = [
  "Ngân hàng TMCP Ngoại thương",
  "Ngân hàng TMCP Công thương",
  "Công ty CK VNDirect",
  "Quỹ đầu tư Dragon Capital",
  "Công ty BĐS Vingroup",
  "Tập đoàn FPT",
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-center p-6 rounded-xl border border-border bg-card hover:border-gold/30 hover:shadow-gold transition-all duration-300 aspect-[3/2]"
            >
              <p className="text-sm font-medium text-muted-foreground text-center leading-tight">{name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
