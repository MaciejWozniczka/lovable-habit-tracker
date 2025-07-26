import { Target, TrendingUp, Clock } from "lucide-react";

const benefits = [
  {
    icon: Target,
    title: "41%",
    subtitle: "większe szanse na osiągnięcie celu",
    description: "Użytkownicy habit trackerów osiągają cele prawie dwukrotnie częściej",
  },
  {
    icon: TrendingUp,
    title: "35%",
    subtitle: "redukcja prokrastynacji",
    description: "Systematyczne śledzenie eliminuje opóźnienia w działaniach",
  },
  {
    icon: Clock,
    title: "2,5h",
    subtitle: "zyskane tygodniowo dzięki automatyzmowi",
    description: "Nawyki stają się automatyczne, oszczędzając czas na decyzje",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-24 relative">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Korzyści w <span className="text-gradient">liczbach</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Badania naukowe potwierdzają skuteczność systematycznego śledzenia nawyków
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div 
                key={index}
                className="glass-card p-8 rounded-2xl hover-glow group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6 group-hover:animate-glow">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                    {benefit.title}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {benefit.subtitle}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}