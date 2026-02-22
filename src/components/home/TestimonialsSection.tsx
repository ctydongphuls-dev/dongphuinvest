import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const testimonials = [
  {
    name: "Nguyễn Văn Minh",
    role: "Doanh nhân",
    content: "Tôi đã ủy thác đầu tư tại Đồng Phú Lạng Sơn hơn 3 năm. Lợi nhuận ổn định, minh bạch và đội ngũ tư vấn rất chuyên nghiệp. Hoàn toàn yên tâm khi giao phó tài sản.",
    initials: "NM",
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Trần Thị Hương",
    role: "Giám đốc Tài chính",
    content: "Báo cáo chi tiết, cập nhật thường xuyên. Đồng Phú Lạng Sơn thực sự đặt lợi ích khách hàng lên hàng đầu. Tôi rất hài lòng với dịch vụ quản lý danh mục đầu tư.",
    initials: "TH",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Lê Hoàng Phúc",
    role: "Nhà đầu tư cá nhân",
    content: "Từ khi hợp tác với Đồng Phú Lạng Sơn, danh mục đầu tư của tôi tăng trưởng đều đặn 18%/năm. Chiến lược đầu tư được thiết kế riêng, rất phù hợp với mục tiêu của tôi.",
    initials: "LP",
    avatar: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=200&h=200&fit=crop&crop=face",
  },
];

const AvatarImg = ({ src, initials }: { src: string; initials: string }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border-[3px] border-[hsl(45,70%,47%)]">
        <span className="text-sm font-semibold text-gold">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Avatar ${initials}`}
      loading="lazy"
      onError={() => setError(true)}
      className="w-12 h-12 rounded-full object-cover object-top border-[3px] border-[hsl(45,70%,47%)]"
    />
  );
};

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-card">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-gold font-semibold text-sm uppercase tracking-wide">Đánh giá</span>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, content, initials, avatar }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-6 rounded-xl bg-background border border-border hover:shadow-lg transition-shadow"
            >
              <Quote className="w-8 h-8 text-gold/20 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{content}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <AvatarImg src={avatar} initials={initials} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
