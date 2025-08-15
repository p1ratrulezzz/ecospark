import { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-slate-700 hover:text-green-primary transition-colors duration-200"
              data-testid="nav-home"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("mission")}
              className="text-slate-700 hover:text-green-primary transition-colors duration-200"
              data-testid="nav-mission"
            >
              Mission
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-slate-700 hover:text-green-primary transition-colors duration-200"
              data-testid="nav-contact"
            >
              Contact
            </button>
          </div>
          
          <button
            className="md:hidden text-slate-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {isMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
          </button>
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
                Home
              </button>
              <button
                onClick={() => scrollToSection("mission")}
                className="text-slate-700 hover:text-green-primary transition-colors duration-200 text-left"
                data-testid="mobile-nav-mission"
              >
                Mission
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-slate-700 hover:text-green-primary transition-colors duration-200 text-left"
                data-testid="mobile-nav-contact"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
