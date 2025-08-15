import { Leaf } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t, currentLanguage } = useLanguage();
  
  // Get current year in user's locale
  const getCurrentYear = () => {
    const date = new Date();
    return date.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : currentLanguage === 'fr' ? 'fr-FR' : 'en-US', { 
      year: 'numeric' 
    });
  };
  
  const footerSections = [
    {
      titleKey: "footer.sections.solutions",
      links: [
        { nameKey: "footer.links.solar", href: "#" },
        { nameKey: "footer.links.wind", href: "#" },
        { nameKey: "footer.links.storage", href: "#" },
        { nameKey: "footer.links.grid", href: "#" },
      ]
    },
    {
      titleKey: "footer.sections.company",
      links: [
        { nameKey: "footer.links.about", href: "#" },
        { nameKey: "footer.links.careers", href: "#" },
        { nameKey: "footer.links.news", href: "#" },
        { nameKey: "footer.links.partners", href: "#" },
      ]
    },
    {
      titleKey: "footer.sections.support",
      links: [
        { nameKey: "footer.links.contact", href: "#" },
        { nameKey: "footer.links.docs", href: "#" },
        { nameKey: "footer.links.privacy", href: "#" },
        { nameKey: "footer.links.terms", href: "#" },
      ]
    }
  ];

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div data-testid="footer-company">
            <div className="flex items-center mb-4">
              <Leaf className="text-green-primary text-2xl mr-2" />
              <span className="text-xl font-bold">GreenTech Energy</span>
            </div>
            <p className="text-slate-400 mb-4">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-slate-400 hover:text-green-primary transition-colors duration-200"
                data-testid="social-linkedin"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-green-primary transition-colors duration-200"
                data-testid="social-twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-green-primary transition-colors duration-200"
                data-testid="social-facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index} data-testid={`footer-section-${index}`}>
              <h3 className="font-semibold mb-4" data-testid={`footer-title-${index}`}>
                {t(section.titleKey)}
              </h3>
              <ul className="space-y-2 text-slate-400">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href} 
                      className="hover:text-green-primary transition-colors duration-200"
                      data-testid={`footer-link-${index}-${linkIndex}`}
                    >
                      {t(link.nameKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <hr className="border-slate-700 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm" data-testid="footer-copyright">
            {t('footer.copyright', { year: getCurrentYear() })}
          </p>
          <p className="text-slate-400 text-sm mt-2 md:mt-0" data-testid="footer-tagline">
            {t('footer.designed')}
          </p>
        </div>
      </div>
    </footer>
  );
}
