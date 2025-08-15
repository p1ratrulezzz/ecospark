import { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/language-selector";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center" data-testid="logo">
            <Leaf className="text-green-primary text-2xl mr-2" />
            <span className="text-xl font-bold text-slate-900">GreenTech Energy</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-slate-700 hover:text-green-primary transition-colors duration-200"
              data-testid="nav-home"
            >
              {t('nav.home')}
            </button>
            <button
              onClick={() => scrollToSection("mission")}
              className="text-slate-700 hover:text-green-primary transition-colors duration-200"
              data-testid="nav-mission"
            >
              {t('nav.mission')}
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-slate-700 hover:text-green-primary transition-colors duration-200"
              data-testid="nav-contact"
            >
              {t('nav.contact')}
            </button>
            <LanguageSelector />
          </div>
          
          <div className="flex items-center space-x-4 md:hidden">
            <LanguageSelector />
            <button
              className="text-slate-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="mobile-menu-button"
            >
              {isMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("home")}
                className="text-slate-700 hover:text-green-primary transition-colors duration-200 text-left"
                data-testid="mobile-nav-home"
              >
                {t('nav.home')}
              </button>
              <button
                onClick={() => scrollToSection("mission")}
                className="text-slate-700 hover:text-green-primary transition-colors duration-200 text-left"
                data-testid="mobile-nav-mission"
              >
                {t('nav.mission')}
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-slate-700 hover:text-green-primary transition-colors duration-200 text-left"
                data-testid="mobile-nav-contact"
              >
                {t('nav.contact')}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
