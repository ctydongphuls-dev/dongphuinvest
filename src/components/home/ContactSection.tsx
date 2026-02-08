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
  { icon: MapPin, label: "Địa chỉ", value: "Số 10, Đường Trần Đăng Ninh, TP. Lạng Sơn, Tỉnh Lạng Sơn" },
  { icon: Phone, label: "Điện thoại", value: "1900 xxxx | 0123 456 789" },
  { icon: Mail, label: "Email", value: "info@dongphulangson.vn" },
  { icon: Clock, label: "Giờ làm việc", value: "Thứ 2 - Thứ 6: 8:00 - 17:30\nThứ 7: 8:00 - 12:00" },
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
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{value}</p>
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden border border-border h-48 bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Google Maps</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
