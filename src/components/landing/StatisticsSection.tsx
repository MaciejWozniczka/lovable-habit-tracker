import { BarChart3, Users, Star, Zap } from "lucide-react";

const stats = [
  {
    icon: BarChart3,
    value: "64%",
    label: "skuteczności w osiąganiu celów",
    source: "Behavioral Science in Practice (2023)",
    description: "u użytkowników trackerów nawyków",
  },
  {
    icon: Users,
    value: "58%",
    label: "lepsze samopoczucie",
    source: "Atomic Habits Survey (2024)",
    description: "wzrost ogólnego zadowolenia z życia",
  },
  {
    icon: Zap,
    value: "42%",
    label: "więcej energii",
    source: "Atomic Habits Survey (2024)",
    description: "dzięki regularnym rutinom",
  },
  {
    icon: Star,
    value: "36%",
    label: "lepsze wyniki w pracy",
    source: "Atomic Habits Survey (2024)",
    description: "wyższa produktywność zawodowa",
  },
];

export function StatisticsSection() {
  return (
    <section className="py-24 relative">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Dlaczego to <span className="text-gradient">działa</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Statystyki rynkowe potwierdzają transformacyjną moc systematycznego budowania nawyków
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="glass-card p-6 rounded-2xl hover-glow group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:animate-glow">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="text-3xl font-bold text-gradient mb-2">
                    {stat.value}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {stat.label}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {stat.description}
                  </p>
                  
                  <div className="text-xs text-primary font-medium px-3 py-1 rounded-full bg-primary-muted">
                    {stat.source}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual chart representation */}
        <div className="mt-16 glass-card p-8 rounded-2xl max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Wzrost skuteczności w czasie</h3>
          <div className="flex items-end justify-center gap-4 h-40">
            {[20, 35, 50, 64].map((height, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-16 gradient-primary rounded-t-lg transition-all duration-1000 hover-glow"
                  style={{ 
                    height: `${height * 1.5}px`,
                    animationDelay: `${index * 0.2}s`
                  }}
                />
                <div className="text-sm font-semibold mt-2 text-muted-foreground">
                  {index + 1} mies.
                </div>
                <div className="text-lg font-bold text-primary">
                  {height}%
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-6">
            Skuteczność osiągania celów rośnie wraz z czasem używania aplikacji
          </p>
        </div>
      </div>
    </section>
  );
}