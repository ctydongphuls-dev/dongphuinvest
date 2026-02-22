import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsSection from "@/components/home/NewsSection";
import ContactSection from "@/components/home/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <ProjectsSection />
        <TestimonialsSection />
        <NewsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
