import { Zap, Leaf } from "lucide-react";

export default function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToMission = () => {
    const element = document.getElementById("mission");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-green-light to-white py-20 lg:py-32">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="h-full w-full" 
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2310B981" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`,
            backgroundSize: "60px 60px"
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6" data-testid="hero-title">
              Powering a{" "}
              <span className="text-green-primary">Sustainable</span>{" "}
              Future
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed" data-testid="hero-subtitle">
              Revolutionary renewable energy solutions that transform how businesses and communities harness clean power. Join us in building a greener tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={scrollToContact}
                className="bg-green-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                data-testid="button-get-started"
              >
                Get Started Today
              </button>
              <button 
                onClick={scrollToMission}
                className="border-2 border-green-primary text-green-primary px-8 py-4 rounded-lg font-semibold hover:bg-green-primary hover:text-white transition-all duration-200"
                data-testid="button-learn-more"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            {/* Hero image showcasing renewable energy technology */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=800"
                alt="Modern solar panels against blue sky representing renewable energy innovation"
                className="w-full h-auto"
                data-testid="hero-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating stats cards */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg" data-testid="stat-energy">
              <div className="flex items-center space-x-3">
                <div className="bg-green-light p-2 rounded-lg">
                  <Zap className="text-green-primary text-xl" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">500MW+</div>
                  <div className="text-sm text-slate-600">Clean Energy Generated</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-lg" data-testid="stat-carbon">
              <div className="flex items-center space-x-3">
                <div className="bg-green-light p-2 rounded-lg">
                  <Leaf className="text-green-primary text-xl" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">2.5M</div>
                  <div className="text-sm text-slate-600">Tons CO₂ Reduced</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
