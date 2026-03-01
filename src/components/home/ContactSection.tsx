import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(100),
  email: z.string().trim().email("Email không hợp lệ").max(255),
  phone: z.string().trim().min(1, "Vui lòng nhập số điện thoại").max(20),
  message: z.string().trim().min(1, "Vui lòng nhập nội dung").max(2000),
});

const contactInfo = [
  { icon: MapPin, label: "Địa chỉ", value: "Số 85 Nguyễn Thái Học, phường Lương Văn Chi, tỉnh Lạng Sơn", href: null },
  { icon: Phone, label: "Điện thoại", value: "(+84) 0947 223 888", href: "tel:+840947223888" },
  { icon: Mail, label: "Email", value: "ctcpdongphulangson@outlook.com.vn", href: "mailto:ctcpdongphulangson@outlook.com.vn" },
  { icon: Clock, label: "Giờ làm việc", value: "T2-T6: 9:00-11:30 & 13:00-16:00\n(T7, CN: Nghỉ)", href: null },
];

const ContactSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
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
    toast({ title: "Gửi thành công!", description: "Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất." });
    setForm({ name: "", email: "", phone: "", message: "" });
    setErrors({});
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 text-sm rounded-lg border ${
      errors[field] ? "border-destructive" : "border-border"
    } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors`;

  return (
    <section id="contact" className="section-padding bg-card">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-gold font-semibold text-sm uppercase tracking-wide">Liên hệ</span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Liên hệ với chúng tôi
          </h2>
          <p className="text-muted-foreground">
            Hãy để lại thông tin, chúng tôi sẽ tư vấn miễn phí cho bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="p-6 md:p-8 rounded-xl bg-background border border-border space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Họ và tên *</label>
                  <input name="name" value={form.name} onChange={handleChange} className={inputClass("name")} placeholder="Nguyễn Văn A" />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass("email")} placeholder="email@example.com" />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Số điện thoại *</label>
                <input name="phone" value={form.phone} onChange={handleChange} className={inputClass("phone")} placeholder="0912 345 678" />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nội dung *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4} className={inputClass("message")} placeholder="Tôi muốn tư vấn về..." />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
              </div>
              <Button variant="gold" size="lg" type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Gửi yêu cầu tư vấn
              </Button>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-6"
          >
             {contactInfo.map(({ icon: Icon, label, value, href }) => (
               <div key={label} className="flex gap-4">
                 <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                   <Icon className="w-5 h-5 text-gold" />
                 </div>
                 <div>
                   <p className="text-sm font-semibold text-foreground">{label}</p>
                   {href ? (
                     <a href={href} className="text-sm text-muted-foreground hover:text-gold transition-colors">
                       {value}
                     </a>
                   ) : (
                     <p className="text-sm text-muted-foreground whitespace-pre-line">{value}</p>
                   )}
                 </div>
               </div>
             ))}

            {/* Google Maps */}
            <div className="rounded-xl overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3703.405204066173!2d106.7554986!3d21.8419007!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x36b54dd88cc62577%3A0x3188f5cc4ca5e9f7!2zODUgTmd1eeG7hW4gVGjDoWkgSOG7jWMsIENoaSBMxINuZywgVGjDoG5oIHBo4buRIEzhuqFuZyBTxqFuLCBM4bqhbmcgU8ahbiwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1772026667443!5m2!1svi!2s"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vị trí Đồng Phú Lạng Sơn trên Google Maps"
              />
            </div>
            <a
              href="https://www.google.com/maps/place/85+Nguy%E1%BB%85n+Th%C3%A1i+H%E1%BB%8Dc,+Chi+L%C4%83ng,+Th%C3%A0nh+ph%E1%BB%91+L%E1%BA%A1ng+S%C6%A1n,+L%E1%BA%A1ng+S%C6%A1n,+Vi%E1%BB%87t+Nam/@21.8419007,106.7554986,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gold hover:underline mt-2"
            >
              <MapPin className="w-3.5 h-3.5" /> Xem bản đồ lớn hơn
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
