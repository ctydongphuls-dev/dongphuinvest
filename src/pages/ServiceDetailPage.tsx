import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, TrendingUp, FileText, Users, CheckCircle2, Phone,
  ChevronDown, ChevronUp, Loader2, Send, ArrowRight, Crown,
  BarChart3, ShieldCheck, Star, AlertTriangle, Newspaper, Radio, Info
} from "lucide-react";

const steps = [
  { num: "01", title: "Tư vấn ban đầu", desc: "Gặp gỡ chuyên gia để đánh giá nhu cầu, khẩu vị rủi ro và mục tiêu tài chính." },
  { num: "02", title: "Xây dựng chiến lược", desc: "Thiết kế chiến lược đầu tư cá nhân hóa với phân bổ tài sản tối ưu." },
  { num: "03", title: "Ký kết hợp đồng", desc: "Hoàn thiện thủ tục pháp lý, ký hợp đồng ủy thác và chuyển giao vốn." },
  { num: "04", title: "Triển khai đầu tư", desc: "Đội ngũ chuyên gia thực hiện đầu tư theo chiến lược đã thống nhất." },
  { num: "05", title: "Giám sát & Báo cáo", desc: "Theo dõi liên tục, báo cáo định kỳ và điều chỉnh khi cần thiết." },
];

const packages = [
  {
    name: "Gói Ủy thác 1",
    subtitle: "Ủy thác Linh hoạt",
    icon: BarChart3,
    desc: "Gói dịch vụ ủy thác đầu tư linh hoạt, không bảo đảm vốn. Quý khách giao vốn để chúng tôi toàn quyền đầu tư kinh doanh và khớp các lệnh giao dịch.",
    details: [
      { emoji: "💰", label: "Vốn tối thiểu", value: "100.000.000 VNĐ" },
      { emoji: "⏱️", label: "Thời hạn", value: "Linh hoạt (không bắt buộc)" },
      { emoji: "🎯", label: "Mục tiêu", value: "Tăng trưởng tài sản" },
      { emoji: "📊", label: "Thị trường", value: "Chứng khoán Việt Nam" },
      { emoji: "🛡️", label: "Bảo đảm vốn", value: "Không" },
    ],
    features: ["Vốn đầu tư từ 100 triệu", "Thời hạn linh hoạt", "Toàn quyền giao dịch chuyên nghiệp", "Tập trung thị trường chứng khoán nội địa"],
    highlight: false,
    cta: "Tư vấn ngay",
    ctaVariant: "outline" as const,
    borderClass: "border-border",
  },
  {
    name: "Gói Ủy thác 2",
    subtitle: "Ủy thác Bảo đảm Vốn",
    icon: ShieldCheck,
    desc: "Gói dịch vụ ủy thác cao cấp với tài sản bảo đảm vốn. Chúng tôi cam kết bảo đảm vốn bằng tài sản bất động sản thuộc quyền sở hữu của công ty.",
    details: [
      { emoji: "💰", label: "Vốn tối thiểu", value: "1.000.000.000 VNĐ" },
      { emoji: "⏱️", label: "Thời hạn tối thiểu", value: "3 năm" },
      { emoji: "🎯", label: "Mục tiêu", value: "Tăng trưởng dài hạn" },
      { emoji: "🛡️", label: "Bảo đảm vốn", value: "Có (Bất động sản)" },
      { emoji: "📜", label: "Tài sản đảm bảo", value: "Giấy chứng nhận QSDĐ" },
    ],
    features: ["Vốn đầu tư từ 1 tỷ đồng", "Cam kết bảo đảm vốn bằng BĐS", "Chiến lược tăng trưởng dài hạn 3+ năm", "An toàn - Minh bạch - Hiệu quả", "Hồ sơ pháp lý đầy đủ"],
    highlight: true,
    cta: "Đăng ký tư vấn",
    ctaVariant: "navy" as const,
    borderClass: "border-gold",
  },
  {
    name: "Gói VIP",
    subtitle: "Tư vấn Đầu tư VIP",
    icon: Crown,
    desc: "Dịch vụ tư vấn, khuyến nghị và định hướng đầu tư chứng khoán chuyên sâu dành cho nhà đầu tư tự quản lý danh mục.",
    details: [],
    vipServices: [
      { emoji: "📈", text: "Mã chứng khoán khuyến nghị" },
      { emoji: "💵", text: "Giá mua/bán tham chiếu hoặc vùng giá khuyến nghị" },
      { emoji: "📊", text: "Tỷ lệ phân bổ vốn cho từng mã/nhóm ngành" },
      { emoji: "🚦", text: "Tình trạng khuyến nghị: Mua / Bán / Nắm giữ / Quan sát" },
      { emoji: "📰", text: "Cập nhật tin doanh nghiệp, thị trường" },
      { emoji: "⚠️", text: "Cảnh báo rủi ro kịp thời" },
    ],
    features: ["Tư vấn chuyên sâu 1-1", "Cập nhật thông tin realtime", "Phân tích kỹ thuật & cơ bản", "Hỗ trợ qua Zalo/Telegram"],
    highlight: false,
    cta: "Tìm hiểu thêm",
    ctaVariant: "outline" as const,
    borderClass: "border-gold/30",
  },
];

const faqs = [
  { q: "Ủy thác đầu tư là gì?", a: "Ủy thác đầu tư là hình thức bạn giao vốn cho công ty quản lý chuyên nghiệp để đầu tư sinh lời thay bạn. Mọi hoạt động đều tuân thủ pháp luật và được giám sát chặt chẽ." },
  { q: "Mức vốn tối thiểu là bao nhiêu?", a: "packages_card" },
  { q: "Lợi nhuận kỳ vọng là bao nhiêu?", a: "Tùy thuộc vào gói đầu tư và điều kiện thị trường, lợi nhuận kỳ vọng dao động từ 12-25%/năm. Chúng tôi không cam kết lợi nhuận cố định nhưng nỗ lực tối đa để đạt mục tiêu." },
  { q: "Tôi có thể rút vốn bất cứ lúc nào không?", a: "Có, bạn có thể rút vốn theo các điều khoản trong hợp đồng. Thông thường cần thông báo trước 30 ngày làm việc." },
  { q: "Báo cáo đầu tư được gửi như thế nào?", a: "Báo cáo định kỳ được gửi qua email, zalo hoặc các phương tiện khác. Tần suất báo cáo phụ thuộc vào gói dịch vụ bạn chọn." },
];

const formSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(100),
  email: z.string().trim().email("Email không hợp lệ").max(255),
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại").max(20),
  investment: z.string().trim().min(1, "Vui lòng chọn mức đầu tư"),
});

const ServiceDetailPage = () => {
  const { toast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", investment: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = formSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    toast({ title: "Đăng ký thành công!", description: "Chúng tôi sẽ liên hệ tư vấn trong 24h." });
    setForm({ name: "", email: "", phone: "", investment: "" });
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 text-sm rounded-lg border ${errors[field] ? "border-destructive" : "border-border"} bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors`;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="gradient-navy py-20 md:py-28">
          <div className="container-custom">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase bg-gold/20 text-gold border border-gold/30 mb-4">
                Dịch vụ nổi bật
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                Ủy thác <span className="text-gold">Đầu tư</span>
              </h1>
              <p className="text-primary-foreground/70 text-lg max-w-xl mb-6">
                Giao phó vốn đầu tư cho đội ngũ chuyên gia, an tâm tận hưởng lợi nhuận bền vững.
              </p>
              <Button variant="hero" size="lg" asChild>
                <a href="#register">Đăng ký tư vấn ngay</a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Description */}
        <section className="section-padding bg-card">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Giải pháp đầu tư chuyên nghiệp
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Dịch vụ Ủy thác Đầu tư của Đồng Phú Lạng Sơn cho phép bạn giao phó vốn đầu tư cho đội ngũ chuyên gia giàu kinh nghiệm. Chúng tôi sẽ quản lý và đầu tư thay bạn với chiến lược tối ưu, đảm bảo an toàn vốn và tối đa hóa lợi nhuận.
                  </p>
                  <p>
                    Với hệ thống quản trị rủi ro chặt chẽ và đội ngũ phân tích thị trường hàng đầu, chúng tôi cam kết mang đến giá trị đầu tư vượt trội cho khách hàng.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, label: "Bảo toàn vốn", val: "99.5%" },
                  { icon: TrendingUp, label: "Lợi nhuận TB", val: "18%/năm" },
                  { icon: Users, label: "Khách hàng", val: "100+" },
                  { icon: FileText, label: "Tài sản quản lý", val: "200+ tỷ" },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="p-5 rounded-xl border border-border bg-background text-center">
                    <Icon className="w-8 h-8 text-gold mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{val}</p>
                    <p className="text-xs text-muted-foreground mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="text-gold font-semibold text-sm uppercase tracking-wide">Quy trình</span>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mt-2">
                5 bước ủy thác đầu tư
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {steps.map(({ num, title, desc }, i) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative p-5 rounded-xl border border-border bg-card text-center"
                >
                  <span className="text-4xl font-bold text-gold drop-shadow-sm">{num}</span>
                  <h3 className="text-sm font-semibold text-foreground mt-2 mb-1">{title}</h3>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                  {i < steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold z-10" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="section-padding bg-card">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="text-gold font-semibold text-sm uppercase tracking-wide">Gói dịch vụ</span>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mt-2">
                Chọn gói phù hợp với bạn
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {packages.map(({ name, subtitle, icon: Icon, desc, details, vipServices, features, highlight, cta, ctaVariant, borderClass }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative p-6 rounded-xl border bg-background transition-all duration-300 hover:shadow-lg ${borderClass} ${
                    highlight ? "shadow-gold md:scale-105 md:z-10" : ""
                  }`}
                >
                  {highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-semibold rounded-full bg-gold text-primary">
                      Khuyến nghị
                    </span>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${highlight ? "bg-gold/10" : "bg-primary/5"}`}>
                      <Icon className={`w-5 h-5 ${highlight ? "text-gold" : "text-primary"}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{name}</h3>
                      <p className="text-xs text-muted-foreground">{subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{desc}</p>

                  {/* Details table */}
                  {details.length > 0 && (
                    <div className="space-y-2 mb-4 p-3 rounded-lg bg-muted/50">
                      {details.map(({ emoji, label, value }) => (
                        <div key={label} className="flex items-start gap-2 text-sm">
                          <span>{emoji}</span>
                          <span className="text-muted-foreground">{label}:</span>
                          <span className="font-medium text-foreground ml-auto text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* VIP services */}
                  {vipServices && vipServices.length > 0 && (
                    <div className="space-y-2 mb-4 p-3 rounded-lg bg-muted/50">
                      <p className="text-xs font-semibold text-foreground mb-2">Nội dung dịch vụ:</p>
                      {vipServices.map(({ emoji, text }) => (
                        <div key={text} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span>{emoji}</span>
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${highlight ? "text-gold" : "text-primary"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant={ctaVariant} className={`w-full ${name === "Gói VIP" ? "border-gold text-gold hover:bg-gold/10" : ""}`} asChild>
                    <a href="#register">{cta}</a>
                  </Button>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-xs text-muted-foreground mt-8">
              * Các điều khoản chi tiết sẽ được thể hiện trong Hợp đồng. Vui lòng liên hệ để được tư vấn cụ thể.
            </p>
            <div className="text-center mt-4">
              <Button variant="gold" size="lg" asChild>
                <a href="tel:+84947223888">
                  <Phone className="w-4 h-4 mr-2" /> Liên hệ tư vấn miễn phí
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding bg-background">
          <div className="container-custom max-w-3xl">
            <div className="text-center mb-14">
              <span className="text-gold font-semibold text-sm uppercase tracking-wide">FAQ</span>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mt-2">
                Câu hỏi thường gặp
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map(({ q, a }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-sm font-semibold text-foreground pr-4">{q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="w-5 h-5 text-gold shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      {a === "packages_card" ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                          {[
                            { name: "Gói Tư vấn", capital: "Không yêu cầu", highlight: false },
                            { name: "Gói Ủy thác 1", capital: "100 triệu VNĐ", highlight: false },
                            { name: "Gói Ủy thác 2", capital: "1 tỷ VNĐ", highlight: true },
                          ].map((pkg, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-gold hover:shadow-md text-center"
                            >
                              <h4 className="text-sm font-bold text-foreground mb-2">{pkg.name}</h4>
                              <p className="text-lg font-semibold text-gold">{pkg.capital}</p>
                              <p className="text-xs text-muted-foreground mt-1">Mức vốn tối thiểu</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Register Form */}
        <section id="register" className="section-padding gradient-navy">
          <div className="container-custom max-w-2xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-3">
                Đăng ký tư vấn miễn phí
              </h2>
              <p className="text-primary-foreground/70">
                Để lại thông tin để nhận tư vấn từ chuyên gia đầu tư của chúng tôi
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-primary-foreground/80 mb-1 block">Họ và tên *</label>
                  <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 text-sm rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-1 focus:ring-gold" placeholder="Nguyễn Văn A" />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-primary-foreground/80 mb-1 block">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 text-sm rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-1 focus:ring-gold" placeholder="email@example.com" />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-primary-foreground/80 mb-1 block">Số điện thoại *</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 text-sm rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-1 focus:ring-gold" placeholder="0912 345 678" />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-primary-foreground/80 mb-1 block">Mức đầu tư dự kiến *</label>
                <select name="investment" value={form.investment} onChange={handleChange} className="w-full px-4 py-3 text-sm rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground focus:outline-none focus:ring-1 focus:ring-gold">
                  <option value="" className="text-foreground">Chọn mức đầu tư</option>
                  <option value="500tr-2ty" className="text-foreground">500 triệu - 2 tỷ VNĐ</option>
                  <option value="2ty-10ty" className="text-foreground">2 tỷ - 10 tỷ VNĐ</option>
                  <option value="10ty+" className="text-foreground">Trên 10 tỷ VNĐ</option>
                </select>
                {errors.investment && <p className="text-xs text-destructive mt-1">{errors.investment}</p>}
              </div>
              <Button variant="hero" size="lg" type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Gửi yêu cầu tư vấn
              </Button>
            </form>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-card">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Sẵn sàng bắt đầu đầu tư?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Liên hệ ngay hotline{" "}
              <a href="tel:+84947223888" className="font-bold text-gold hover:text-gold-light transition-colors">
                <Phone className="w-4 h-4 inline mr-1" />(+84) 0947 223 888
              </a>{" "}
              để được tư vấn miễn phí
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gold" size="lg" asChild>
                <a href="tel:+84947223888">
                  <Phone className="w-4 h-4 mr-2" /> Gọi ngay
                </a>
              </Button>
              <Button variant="navy" size="lg" asChild>
                <Link to="/#contact">Gửi yêu cầu</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
