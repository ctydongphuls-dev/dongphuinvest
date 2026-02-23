import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Eye, Target, Home, TrendingUp, Rocket, Trophy, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

const timeline = [
  { year: "2016", title: "Khởi đầu hành trình", icon: Home, desc: "Bắt đầu hoạt động theo mô hình công ty quản lý quỹ gia đình." },
  { year: "2016-2022", title: "Xây dựng nền tảng", icon: TrendingUp, desc: "6 năm vận hành và phát triển theo mô hình quỹ gia đình, tích lũy kinh nghiệm và xây dựng chiến lược đầu tư hiệu quả." },
  { year: "2023", title: "Chuyển đổi & Mở rộng", icon: Rocket, desc: "Chính thức thành lập Công ty Cổ phần, tiếp nhận khoản đầu tư bên ngoài đầu tiên trị giá 10 tỷ đồng." },
  { year: "Cuối 2025", title: "Cột mốc tăng trưởng", icon: Trophy, desc: "Tổng tài sản quản lý vượt 50 tỷ đồng • Hơn 10 khách hàng ủy thác tin tưởng • 200+ khách hàng đăng ký nhận thông tin tư vấn." },
];

const leaders = [
  { name: "Hoàng Viễn Trí Anh", role: "Nhà sáng lập & Cố vấn Đầu tư", initials: "TA", image: "https://kaikun-ai-image.s3.ap-northeast-1.amazonaws.com/58f3c039-d005-4011-aea8-10617b05b557%2F1771834505323.png", alt: "Ông Hoàng Viễn Trí Anh - Nhà sáng lập & Cố vấn Đầu tư", desc: "MBA - Đại học Quốc tế. 10 năm kinh nghiệm trong lĩnh vực tài chính và đầu tư." },
  { name: "Hoàng Văn Quyết", role: "Chủ tịch HĐQT kiêm Tổng Giám đốc", initials: "HQ", image: "https://kaikun-ai-image.s3.ap-northeast-1.amazonaws.com/58f3c039-d005-4011-aea8-10617b05b557%2F1771834581537.png", alt: "Ông Hoàng Văn Quyết - Chủ tịch HĐQT kiêm Tổng Giám đốc", desc: "8 năm kinh nghiệm trong lĩnh vực tài chính ngân hàng và đầu tư." },
  { name: "Nguyễn Thị Minh Anh", role: "Giám đốc Đầu tư", initials: "MA", image: "https://img1.baidu.com/it/u=407630968,3894804235&fm=253&app=138&f=JPEG?w=800&h=1422", alt: "Bà Nguyễn Thị Minh Anh - Giám đốc Đầu tư", desc: "CFA Charterholder. Chuyên gia quản lý đầu tư và phân tích thị trường với thành tích đầu tư ấn tượng." },
  { name: "Lê Thị Mai Anh", role: "Giám đốc Tài chính", initials: "LMA", image: "https://img0.baidu.com/it/u=2570846430,2345236527&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=1200", alt: "Bà Lê Thị Mai Anh - Giám đốc Tài chính", desc: "15 năm kinh nghiệm quản lý tài chính doanh nghiệp và quỹ đầu tư." },
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
              <div className="space-y-10">
                {timeline.map(({ year, title, icon: Icon, desc }, i) => (
                  <motion.div
                    key={year}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                  >
                    <div className={`hidden md:block md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <div className="p-5 rounded-xl border border-border bg-card">
                        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                      </div>
                    </div>
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center z-10 border-2 border-gold/40">
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                    <div className="ml-12 md:hidden">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {leaders.map(({ name, role, initials, image, alt, desc }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-xl border border-border bg-background text-center hover:shadow-lg transition-shadow"
                >
                  <div className="w-[200px] h-[200px] rounded-full mx-auto mb-4 overflow-hidden border-4 border-gold shadow-lg">
                    <img
                      src={image}
                      alt={alt}
                      loading="lazy"
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const fallback = target.parentElement;
                        if (fallback) {
                          fallback.classList.add('bg-primary', 'flex', 'items-center', 'justify-center');
                          fallback.innerHTML = `<span class="text-3xl font-bold text-gold">${initials}</span>`;
                        }
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{name}</h3>
                  <p className="text-sm text-gold font-medium mb-3">{role}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* License */}
        <section className="section-padding bg-background">
          <div className="container-custom max-w-2xl">
            <div className="text-center mb-10">
              <span className="text-gold font-semibold text-sm uppercase tracking-wide">Pháp lý</span>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mt-2">Giấy phép hoạt động</h2>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl border border-gold/30 bg-card flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                <FileCheck className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Giấy chứng nhận Đăng ký Kinh doanh</h3>
                <p className="text-sm text-muted-foreground mt-1">Số giấy phép: <span className="font-medium text-foreground">4900891469</span></p>
                <p className="text-sm text-muted-foreground">Cơ quan cấp: Sở Kế hoạch và Đầu tư tỉnh Lạng Sơn</p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
