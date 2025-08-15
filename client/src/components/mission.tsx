import { Sun, Wind, Battery } from "lucide-react";

export default function Mission() {
  const missionPoints = [
    {
      icon: Sun,
      title: "Solar Innovation",
      description: "Cutting-edge photovoltaic technology that maximizes energy efficiency while minimizing environmental impact."
    },
    {
      icon: Wind,
      title: "Wind Power",
      description: "Advanced wind energy systems designed for optimal performance in diverse geographical conditions."
    },
    {
      icon: Battery,
      title: "Energy Storage",
      description: "Revolutionary battery technology that ensures reliable, round-the-clock renewable energy access."
    }
  ];

  return (
    <section id="mission" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6" data-testid="mission-title">
            Our Mission
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto" data-testid="mission-subtitle">
            We're committed to accelerating the world's transition to sustainable energy through innovative technology and strategic partnerships.
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
                  {point.title}
                </h3>
                <p className="text-slate-600" data-testid={`mission-description-${index}`}>
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mission statement highlight */}
        <div className="bg-gradient-to-r from-green-primary to-green-accent rounded-2xl p-8 lg:p-12 text-white text-center" data-testid="mission-statement">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4" data-testid="mission-statement-title">
            Building Tomorrow's Energy Infrastructure Today
          </h3>
          <p className="text-lg opacity-90 max-w-4xl mx-auto" data-testid="mission-statement-text">
            Every kilowatt of clean energy we generate is a step toward energy independence, economic growth, and environmental preservation. We believe that sustainable energy isn't just good for the planet—it's good for business.
          </p>
        </div>
      </div>
    </section>
  );
}
