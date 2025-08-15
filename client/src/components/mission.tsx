import { Sun, Wind, Battery } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Mission() {
  const { t } = useLanguage();
  
  const missionPoints = [
    {
      icon: Sun,
      titleKey: "mission.solar.title",
      descriptionKey: "mission.solar.description"
    },
    {
      icon: Wind,
      titleKey: "mission.wind.title",
      descriptionKey: "mission.wind.description"
    },
    {
      icon: Battery,
      titleKey: "mission.battery.title",
      descriptionKey: "mission.battery.description"
    }
  ];

  return (
    <section id="mission" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6" data-testid="mission-title">
            {t('mission.title')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto" data-testid="mission-subtitle">
            {t('mission.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {missionPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div key={index} className="text-center group" data-testid={`mission-point-${index}`}>
                <div className="bg-green-light rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-green-primary transition-colors duration-300">
                  <Icon className="text-green-primary text-2xl group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4" data-testid={`mission-title-${index}`}>
                  {t(point.titleKey)}
                </h3>
                <p className="text-slate-600" data-testid={`mission-description-${index}`}>
                  {t(point.descriptionKey)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mission statement highlight */}
        <div className="bg-gradient-to-r from-green-primary to-green-accent rounded-2xl p-8 lg:p-12 text-white text-center" data-testid="mission-statement">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4" data-testid="mission-statement-title">
            {t('mission.statement.title')}
          </h3>
          <p className="text-lg opacity-90 max-w-4xl mx-auto" data-testid="mission-statement-text">
            {t('mission.statement.text')}
          </p>
        </div>
      </div>
    </section>
  );
}
