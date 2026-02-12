import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Facebook, Linkedin, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="gradient-navy text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                <span className="text-gold font-bold text-lg">ĐP</span>
              </div>
              <p className="font-bold">Đồng Phú Lạng Sơn</p>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed mb-4">
              Công ty Cổ phần Đầu tư và Phát triển Đồng Phú Lạng Sơn - Đồng hành cùng bạn trên con đường đầu tư thịnh vượng.
            </p>
            <div className="flex gap-3">
              {[Facebook, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-gold/20 flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Trang chủ", href: "/" },
                { label: "Về chúng tôi", href: "/about" },
                { label: "Ủy thác đầu tư", href: "/services/uy-thac-dau-tu" },
                { label: "Tin tức", href: "/#news" },
                { label: "Liên hệ", href: "/#contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-sm text-primary-foreground/70 hover:text-gold transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
               {[
                { icon: MapPin, text: "Số 85 Nguyễn Thái Học, phường Lương Văn Chi, tỉnh Lạng Sơn", href: null },
                { icon: Phone, text: "(+84) 0947 223 888", href: "tel:+840947223888" },
                { icon: Mail, text: "ctcpdongphulangson@outlook.com.vn", href: "mailto:ctcpdongphulangson@outlook.com.vn" },
                { icon: Clock, text: "T2-T6: 9:00-11:30 & 13:00-16:00 (T7, CN: Nghỉ)", href: null },
              ].map(({ icon: Icon, text, href }, i) => (
                <li key={i} className="flex items-start gap-2.5">
                   <Icon className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                   {href ? (
                     <a href={href} className="text-sm text-primary-foreground/70 hover:text-gold transition-colors">
                       {text}
                     </a>
                   ) : (
                     <span className="text-sm text-primary-foreground/70">{text}</span>
                   )}
                 </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gold mb-4">Đăng ký nhận tin</h3>
            <p className="text-sm text-primary-foreground/70 mb-4">
              Nhận thông tin mới nhất về cơ hội đầu tư và tin tức tài chính.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-sm rounded-md bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-1 focus:ring-gold"
                required
              />
              <Button variant="gold" size="sm" type="submit" className="shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary-foreground/50">
            © 2024 Công ty Cổ phần Đầu tư và Phát triển Đồng Phú Lạng Sơn. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-primary-foreground/50 hover:text-gold transition-colors">Chính sách bảo mật</a>
            <a href="#" className="text-xs text-primary-foreground/50 hover:text-gold transition-colors">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
