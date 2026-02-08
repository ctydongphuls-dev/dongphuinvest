import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Shield, Eye, Award, Target, Calendar, Users, TrendingUp, Building } from "lucide-react";
import { motion } from "framer-motion";

const timeline = [
  { year: "2013", title: "Thành lập công ty", desc: "Công ty Cổ phần Đầu tư và Phát triển Đồng Phú Lạng Sơn chính thức được thành lập." },
  { year: "2015", title: "Mở rộng dịch vụ", desc: "Ra mắt dịch vụ ủy thác đầu tư và quản lý danh mục cho khách hàng cá nhân." },
  { year: "2018", title: "Cột mốc 100 tỷ", desc: "Tổng tài sản quản lý vượt mốc 100 tỷ đồng, phục vụ hơn 200 khách hàng." },
  { year: "2020", title: "Chuyển đổi số", desc: "Triển khai nền tảng quản lý đầu tư trực tuyến, nâng cao trải nghiệm khách hàng." },
  { year: "2023", title: "Phát triển bền vững", desc: "Mở rộng sang lĩnh vực năng lượng tái tạo và đầu tư bền vững." },
  { year: "2024", title: "1,000+ tỷ đồng", desc: "Tổng tài sản quản lý vượt 1,000 tỷ đồng với hơn 500 khách hàng tin tưởng." },
];

const leaders = [
  { name: "Nguyễn Đức Thành", role: "Chủ tịch HĐQT", initials: "NĐT", desc: "20 năm kinh nghiệm trong lĩnh vực tài chính ngân hàng và đầu tư." },
  { name: "Trần Minh Quang", role: "Tổng Giám đốc", initials: "TMQ", desc: "Chuyên gia quản lý đầu tư với bằng CFA và MBA từ đại học quốc tế." },
  { name: "Lê Thị Mai Anh", role: "Giám đốc Tài chính", initials: "LMA", desc: "15 năm kinh nghiệm quản lý tài chính doanh nghiệp và quỹ đầu tư." },
  { name: "Phạm Văn Hùng", role: "Giám đốc Đầu tư", initials: "PVH", desc: "Chuyên gia phân tích thị trường với thành tích đầu tư ấn tượng." },
  { name: "Hoàng Thị Lan", role: "Giám đốc Pháp chế", initials: "HTL", desc: "Luật sư với kinh nghiệm chuyên sâu về luật đầu tư và chứng khoán." },
  { name: "Đỗ Quốc Bảo", role: "Giám đốc Công nghệ", initials: "ĐQB", desc: "Chuyên gia fintech với kinh nghiệm xây dựng nền tảng đầu tư số." },
];

const awards = [
  "Giấy phép kinh doanh số 1234567890 do Sở KH&ĐT tỉnh Lạng Sơn cấp",
  "Chứng nhận ISO 9001:2015 về Hệ thống quản lý chất lượng",
  "Giải thưởng Doanh nghiệp đầu tư uy tín 2023",
  "Top 50 Doanh nghiệp tài chính tăng trưởng nhanh nhất Việt Nam",
  "Chứng nhận Doanh nghiệp phát triển bền vững 2024",
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="gradient-navy py-20 md:py-28">
          <div className="container-custom text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4"
            >
              Về <span className="text-gold">Đồng Phú Lạng Sơn</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-primary-foreground/70 max-w-2xl mx-auto"
            >
              Hơn một thập kỷ đồng hành cùng nhà đầu tư Việt Nam trên con đường tạo dựng tài sản bền vững
            </motion.p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="section-padding bg-card">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-xl border border-border bg-background"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Tầm nhìn</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Trở thành công ty quản lý đầu tư hàng đầu khu vực phía Bắc, được tin tưởng bởi hàng ngàn khách hàng với tổng tài sản quản lý vượt 10,000 tỷ đồng vào năm 2030.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-xl border border-border bg-background"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Sứ mệnh</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Mang đến các giải pháp đầu tư an toàn, hiệu quả và minh bạch, giúp khách hàng gia tăng tài sản một cách bền vững. Chúng tôi cam kết đặt lợi ích khách hàng lên trên hết.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="text-gold font-semibold text-sm uppercase tracking-wide">Hành trình</span>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mt-2">
                Lịch sử hình thành & Phát triển
              </h2>
            </div>

            <div className="relative">
              <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-8">
                {timeline.map(({ year, title, desc }, i) => (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className={`hidden md:block md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <div className="p-5 rounded-xl border border-border bg-card">
                        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                      </div>
                    </div>
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10">
                      <span className="text-xs font-bold text-gold">{year.slice(2)}</span>
                    </div>
                    <div className={`ml-12 md:hidden`}>
                      <p className="text-xs font-bold text-gold mb-1">{year}</p>
                      <h3 className="text-base font-semibold text-foreground">{title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                    </div>
                    <div className={`hidden md:block md:w-1/2 ${i % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}>
                      <span className="text-2xl font-bold text-gold">{year}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="section-padding bg-card">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="text-gold font-semibold text-sm uppercase tracking-wide">Con người</span>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mt-2">
                Đội ngũ lãnh đạo
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaders.map(({ name, role, initials, desc }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-xl border border-border bg-background text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-gold">{initials}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{name}</h3>
                  <p className="text-sm text-gold font-medium mb-3">{role}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="text-gold font-semibold text-sm uppercase tracking-wide">Thành tựu</span>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mt-2">
                Giấy phép & Chứng nhận
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {awards.map((award, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-3 p-5 rounded-xl border border-border bg-card"
                >
                  <Award className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{award}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
