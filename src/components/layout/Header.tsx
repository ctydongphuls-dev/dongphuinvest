import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/about" },
  { label: "Dịch vụ", href: "/services/uy-thac-dau-tu" },
  { label: "Dự án đầu tư", href: "/#projects" },
  { label: "Tin tức", href: "/#news" },
  { label: "Liên hệ", href: "/#contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href.split("#")[0]) && !href.startsWith("/#");
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      const id = href.replace("/#", "");
      if (location.pathname === "/") {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-gold font-bold text-lg lg:text-xl">ĐP</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm lg:text-base font-bold text-primary leading-tight">Đồng Phú Lạng Sơn</p>
              <p className="text-xs text-muted-foreground">Đầu tư & Phát triển</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? "text-gold bg-primary/5"
                    : "text-foreground hover:text-gold hover:bg-primary/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+840947223888"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-primary"
            >
              <Phone className="w-4 h-4 text-gold" />
              (+84) 0947 223 888
            </a>
            <Button variant="gold" size="sm" className="hidden sm:inline-flex" asChild>
              <Link to="/#contact">Tư vấn miễn phí</Link>
            </Button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-foreground"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-t border-border overflow-hidden"
          >
            <nav className="container-custom py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`block px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "text-gold bg-primary/5"
                      : "text-foreground hover:text-gold hover:bg-primary/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <a href="tel:+840947223888" className="flex items-center gap-2 px-4 text-sm font-semibold text-primary">
                  <Phone className="w-4 h-4 text-gold" />
                  (+84) 0947 223 888
                </a>
                <Button variant="gold" size="sm" className="mx-4" asChild>
                  <Link to="/#contact" onClick={() => setMobileOpen(false)}>Tư vấn miễn phí</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
