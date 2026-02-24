import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, User, ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface RelatedArticle {
  title: string;
  date: string;
  image: string;
  href: string;
  category: string;
}

interface NewsDetailLayoutProps {
  title: string;
  date: string;
  author: string;
  category: string;
  image: string;
  imageAlt: string;
  children: React.ReactNode;
  relatedArticles: RelatedArticle[];
}

const NewsDetailLayout = ({
  title,
  date,
  author,
  category,
  image,
  imageAlt,
  children,
  relatedArticles,
}: NewsDetailLayoutProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Banner */}
        <section className="relative h-[340px] md:h-[420px] overflow-hidden">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(213,52%,10%,0.85)] via-[hsl(213,52%,15%,0.6)] to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-custom pb-10 md:pb-14">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gold/20 text-gold mb-3">
                {category}
              </span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-4xl font-bold text-primary-foreground max-w-3xl leading-tight mb-4"
              >
                {title}
              </motion.h1>
              <div className="flex items-center gap-4 text-sm text-primary-foreground/80">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {date}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" /> {author}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="border-b border-border bg-muted/50">
          <div className="container-custom py-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Trang chủ</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/#news">Tin tức</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1 max-w-[200px] md:max-w-none">
                    {title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Content */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <article className="prose prose-lg max-w-none">
                {children}
              </article>

              <div className="mt-10">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Quay lại
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="gradient-navy section-padding">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
              Quan tâm đến dịch vụ đầu tư?
            </h2>
            <p className="text-primary-foreground/70 mb-6">
              Liên hệ ngay để được tư vấn miễn phí
            </p>
            <Button variant="gold" size="lg" asChild>
              <a href="tel:+840947223888" className="gap-2">
                <Phone className="w-4 h-4" /> Gọi ngay: (+84) 0947 223 888
              </a>
            </Button>
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="section-padding bg-muted/30">
            <div className="container-custom">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-8">
                Bài viết liên quan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                {relatedArticles.map((article) => (
                  <Link
                    key={article.href}
                    to={article.href}
                    className="group rounded-xl border border-border overflow-hidden bg-card hover:shadow-lg transition-shadow"
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <Calendar className="w-3 h-3" /> {article.date}
                      </span>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-gold transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gold mt-2">
                        Đọc thêm <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetailLayout;
