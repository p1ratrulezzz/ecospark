import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ru' | 'fr';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.mission': 'Mission',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.title': 'Powering a',
    'hero.title.sustainable': 'Sustainable',
    'hero.title.future': 'Future',
    'hero.subtitle': 'Revolutionary renewable energy solutions that transform how businesses and communities harness clean power. Join us in building a greener tomorrow.',
    'hero.cta.getStarted': 'Get Started Today',
    'hero.cta.learnMore': 'Learn More',
    'hero.stats.energy': 'Clean Energy Generated',
    'hero.stats.carbon': 'Tons CO₂ Reduced',
    
    // Mission Section
    'mission.title': 'Our Mission',
    'mission.subtitle': "We're committed to accelerating the world's transition to sustainable energy through innovative technology and strategic partnerships.",
    'mission.solar.title': 'Solar Innovation',
    'mission.solar.description': 'Cutting-edge photovoltaic technology that maximizes energy efficiency while minimizing environmental impact.',
    'mission.wind.title': 'Wind Power',
    'mission.wind.description': 'Advanced wind energy systems designed for optimal performance in diverse geographical conditions.',
    'mission.battery.title': 'Energy Storage',
    'mission.battery.description': 'Revolutionary battery technology that ensures reliable, round-the-clock renewable energy access.',
    'mission.statement.title': "Building Tomorrow's Energy Infrastructure Today",
    'mission.statement.text': "Every kilowatt of clean energy we generate is a step toward energy independence, economic growth, and environmental preservation. We believe that sustainable energy isn't just good for the planet—it's good for business.",
    
    // Contact Section
    'contact.title': "Let's Power Your Future Together",
    'contact.subtitle': 'Ready to explore renewable energy solutions for your business? Get in touch with our experts and discover how we can help you achieve your sustainability goals.',
    'contact.info.call': 'Call Us',
    'contact.info.email': 'Email Us',
    'contact.info.visit': 'Visit Us',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.company': 'Company',
    'contact.form.message': 'Message',
    'contact.form.placeholder.name': 'John Doe',
    'contact.form.placeholder.email': 'john@company.com',
    'contact.form.placeholder.company': 'Your Company Name',
    'contact.form.placeholder.message': 'Tell us about your renewable energy needs...',
    'contact.form.submit': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.form.success.title': 'Message Sent Successfully!',
    'contact.form.success.subtitle': "We'll get back to you within 24 hours.",
    'contact.form.required': '*',
    
    // Footer
    'footer.tagline': 'Leading the renewable energy revolution with innovative solutions for a sustainable future.',
    'footer.sections.solutions': 'Solutions',
    'footer.sections.company': 'Company',
    'footer.sections.support': 'Support',
    'footer.links.solar': 'Solar Power',
    'footer.links.wind': 'Wind Energy',
    'footer.links.storage': 'Energy Storage',
    'footer.links.grid': 'Smart Grid',
    'footer.links.about': 'About Us',
    'footer.links.careers': 'Careers',
    'footer.links.news': 'News',
    'footer.links.partners': 'Partners',
    'footer.links.contact': 'Contact',
    'footer.links.docs': 'Documentation',
    'footer.links.privacy': 'Privacy Policy',
    'footer.links.terms': 'Terms of Service',
    'footer.copyright': '© 2024 GreenTech Energy. All rights reserved.',
    'footer.designed': 'Designed with ♻️ for a sustainable future',
    
    // Language Selector
    'language.select': 'Select Language',
    'language.english': 'English',
    'language.russian': 'Русский',
    'language.french': 'Français',
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.mission': 'Миссия',
    'nav.contact': 'Контакты',
    
    // Hero Section
    'hero.title': 'Энергия для',
    'hero.title.sustainable': 'Устойчивого',
    'hero.title.future': 'Будущего',
    'hero.subtitle': 'Революционные решения в области возобновляемой энергии, которые трансформируют способы использования чистой энергии предприятиями и сообществами. Присоединяйтесь к созданию более зеленого завтра.',
    'hero.cta.getStarted': 'Начать Сегодня',
    'hero.cta.learnMore': 'Узнать Больше',
    'hero.stats.energy': 'Чистой Энергии Произведено',
    'hero.stats.carbon': 'Тонн CO₂ Сокращено',
    
    // Mission Section
    'mission.title': 'Наша Миссия',
    'mission.subtitle': 'Мы стремимся ускорить переход мира к устойчивой энергетике через инновационные технологии и стратегические партнерства.',
    'mission.solar.title': 'Солнечные Инновации',
    'mission.solar.description': 'Передовая фотовольтаическая технология, которая максимизирует энергоэффективность при минимальном воздействии на окружающую среду.',
    'mission.wind.title': 'Ветровая Энергия',
    'mission.wind.description': 'Передовые системы ветровой энергии, спроектированные для оптимальной работы в различных географических условиях.',
    'mission.battery.title': 'Накопление Энергии',
    'mission.battery.description': 'Революционная аккумуляторная технология, обеспечивающая надежный круглосуточный доступ к возобновляемой энергии.',
    'mission.statement.title': 'Строим Энергетическую Инфраструктуру Завтра Уже Сегодня',
    'mission.statement.text': 'Каждый киловатт чистой энергии, которую мы производим, — это шаг к энергетической независимости, экономическому росту и сохранению окружающей среды. Мы верим, что устойчивая энергетика полезна не только для планеты — она полезна для бизнеса.',
    
    // Contact Section
    'contact.title': 'Давайте Вместе Создадим Ваше Энергетическое Будущее',
    'contact.subtitle': 'Готовы изучить решения в области возобновляемой энергии для вашего бизнеса? Свяжитесь с нашими экспертами и узнайте, как мы можем помочь достичь ваших целей устойчивого развития.',
    'contact.info.call': 'Позвонить',
    'contact.info.email': 'Написать',
    'contact.info.visit': 'Посетить',
    'contact.form.name': 'Полное Имя',
    'contact.form.email': 'Email Адрес',
    'contact.form.company': 'Компания',
    'contact.form.message': 'Сообщение',
    'contact.form.placeholder.name': 'Иван Иванов',
    'contact.form.placeholder.email': 'ivan@company.com',
    'contact.form.placeholder.company': 'Название Вашей Компании',
    'contact.form.placeholder.message': 'Расскажите нам о ваших потребностях в возобновляемой энергии...',
    'contact.form.submit': 'Отправить Сообщение',
    'contact.form.sending': 'Отправка...',
    'contact.form.success.title': 'Сообщение Успешно Отправлено!',
    'contact.form.success.subtitle': 'Мы свяжемся с вами в течение 24 часов.',
    'contact.form.required': '*',
    
    // Footer
    'footer.tagline': 'Ведем революцию в области возобновляемой энергии с инновационными решениями для устойчивого будущего.',
    'footer.sections.solutions': 'Решения',
    'footer.sections.company': 'Компания',
    'footer.sections.support': 'Поддержка',
    'footer.links.solar': 'Солнечная Энергия',
    'footer.links.wind': 'Ветровая Энергия',
    'footer.links.storage': 'Накопление Энергии',
    'footer.links.grid': 'Умная Сеть',
    'footer.links.about': 'О Нас',
    'footer.links.careers': 'Карьера',
    'footer.links.news': 'Новости',
    'footer.links.partners': 'Партнеры',
    'footer.links.contact': 'Контакты',
    'footer.links.docs': 'Документация',
    'footer.links.privacy': 'Политика Конфиденциальности',
    'footer.links.terms': 'Условия Использования',
    'footer.copyright': '© 2024 GreenTech Energy. Все права защищены.',
    'footer.designed': 'Разработано с ♻️ для устойчивого будущего',
    
    // Language Selector
    'language.select': 'Выбрать Язык',
    'language.english': 'English',
    'language.russian': 'Русский',
    'language.french': 'Français',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.mission': 'Mission',
    'nav.contact': 'Contact',
    
    // Hero Section
    'hero.title': 'Alimenter un',
    'hero.title.sustainable': 'Avenir',
    'hero.title.future': 'Durable',
    'hero.subtitle': 'Solutions révolutionnaires d\'énergie renouvelable qui transforment la façon dont les entreprises et les communautés exploitent l\'énergie propre. Rejoignez-nous pour construire un avenir plus vert.',
    'hero.cta.getStarted': 'Commencer Aujourd\'hui',
    'hero.cta.learnMore': 'En Savoir Plus',
    'hero.stats.energy': 'Énergie Propre Générée',
    'hero.stats.carbon': 'Tonnes CO₂ Réduites',
    
    // Mission Section
    'mission.title': 'Notre Mission',
    'mission.subtitle': 'Nous nous engageons à accélérer la transition mondiale vers l\'énergie durable grâce à la technologie innovante et aux partenariats stratégiques.',
    'mission.solar.title': 'Innovation Solaire',
    'mission.solar.description': 'Technologie photovoltaïque de pointe qui maximise l\'efficacité énergétique tout en minimisant l\'impact environnemental.',
    'mission.wind.title': 'Énergie Éolienne',
    'mission.wind.description': 'Systèmes d\'énergie éolienne avancés conçus pour des performances optimales dans diverses conditions géographiques.',
    'mission.battery.title': 'Stockage d\'Énergie',
    'mission.battery.description': 'Technologie de batterie révolutionnaire qui assure un accès fiable à l\'énergie renouvelable 24h/24.',
    'mission.statement.title': 'Construire l\'Infrastructure Énergétique de Demain Aujourd\'hui',
    'mission.statement.text': 'Chaque kilowatt d\'énergie propre que nous générons est un pas vers l\'indépendance énergétique, la croissance économique et la préservation de l\'environnement. Nous croyons que l\'énergie durable n\'est pas seulement bonne pour la planète — elle est bonne pour les affaires.',
    
    // Contact Section
    'contact.title': 'Alimentons Ensemble Votre Avenir',
    'contact.subtitle': 'Prêt à explorer les solutions d\'énergie renouvelable pour votre entreprise ? Contactez nos experts et découvrez comment nous pouvons vous aider à atteindre vos objectifs de durabilité.',
    'contact.info.call': 'Appelez-nous',
    'contact.info.email': 'Écrivez-nous',
    'contact.info.visit': 'Visitez-nous',
    'contact.form.name': 'Nom Complet',
    'contact.form.email': 'Adresse Email',
    'contact.form.company': 'Entreprise',
    'contact.form.message': 'Message',
    'contact.form.placeholder.name': 'Jean Dupont',
    'contact.form.placeholder.email': 'jean@entreprise.com',
    'contact.form.placeholder.company': 'Nom de Votre Entreprise',
    'contact.form.placeholder.message': 'Parlez-nous de vos besoins en énergie renouvelable...',
    'contact.form.submit': 'Envoyer le Message',
    'contact.form.sending': 'Envoi...',
    'contact.form.success.title': 'Message Envoyé avec Succès !',
    'contact.form.success.subtitle': 'Nous vous recontacterons dans les 24 heures.',
    'contact.form.required': '*',
    
    // Footer
    'footer.tagline': 'Leader de la révolution des énergies renouvelables avec des solutions innovantes pour un avenir durable.',
    'footer.sections.solutions': 'Solutions',
    'footer.sections.company': 'Entreprise',
    'footer.sections.support': 'Support',
    'footer.links.solar': 'Énergie Solaire',
    'footer.links.wind': 'Énergie Éolienne',
    'footer.links.storage': 'Stockage d\'Énergie',
    'footer.links.grid': 'Réseau Intelligent',
    'footer.links.about': 'À Propos',
    'footer.links.careers': 'Carrières',
    'footer.links.news': 'Actualités',
    'footer.links.partners': 'Partenaires',
    'footer.links.contact': 'Contact',
    'footer.links.docs': 'Documentation',
    'footer.links.privacy': 'Politique de Confidentialité',
    'footer.links.terms': 'Conditions d\'Utilisation',
    'footer.copyright': '© 2024 GreenTech Energy. Tous droits réservés.',
    'footer.designed': 'Conçu avec ♻️ pour un avenir durable',
    
    // Language Selector
    'language.select': 'Sélectionner la Langue',
    'language.english': 'English',
    'language.russian': 'Русский',
    'language.french': 'Français',
  },
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'ru', 'fr'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[currentLanguage]?.[key as keyof typeof translations[typeof currentLanguage]] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}