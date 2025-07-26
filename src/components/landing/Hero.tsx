import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      // MailerLite integration
      const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNzkxYmEzODA5ZDJlMzllODczYjZkNDIxY2YyNjc1OGY0MTc5NDQzMzU3MTE1OTI1M2RiZmI2OGE5MWY2MmVjMDM0MjAwNWM5MmVkMzQ5Y2YiLCJpYXQiOjE3NTMzMDE1ODEuMDQ3NzM3LCJuYmYiOjE3NTMzMDE1ODEuMDQ3NzM5LCJleHAiOjQ5MDg5NzUxODEuMDQzMzMyLCJzdWIiOiIxNjg1OTIxIiwic2NvcGVzIjpbXX0.WUF-9AA3kRxH7RcEj6JKXb_pDudHc-Da-EP9lvH-nhgeFh1rSAN4IG8peQVrIlcDYOgtglTNJ9MA5Ifls3i8IwN_TFkZ63PFqbKuFv0EQf-UjcYzekMuqrsrTZB2FBdtWZhCCebI0Gjqem4P_m9urCEs07rGP_QKssj0VY07mEgw93D36KdGsEhNmC18greOCqgpUV4NM2lakoCurc61mT4DHirmiua1J38TcNUXNkKzQvAf_Ee_Gd04dGLsOkPhz2xcV87ydaHHMwBmuEn8Y9E1v_8Kh5mpJm0TKlVD_0DyZQqp7Fkhcy0deBVxb4cCcMFR7V6IXUNtWkQej6j8F4hSnwfKIjtOY1Tkmk9AiIBsYvkEvVxsIBAGZaXwI2EnVV9RIQ7hPwvJT6jnqHtS7BOL1Y1iQ3ZACa_ldQdYIup97gcI2GG0coTjlt249xETPtXkIUVjPAH_5XKCxvUG2bcNSaBWAoEgwE53DeLIEMdSwCBiEDb_SGA48lKHE98mE294ViatrkdpqaNji2Ei83zf6cx-7KdxZVoTQE9RteWqp8RcXzCJ7wZ5nrYSz0ebFT_lkIlKFQKBdZltiV3v_kO_E_e8ottHflwL30gWQOoox9Tjspk70__N2tPvdilp3CJsjP7_bD-rV_XGzExhgGh6yd19yjCgtitgREkXziY'
        },
        body: JSON.stringify({
          email,
          groups: ['160748329250063934']
        })
      });

      if (response.ok) {
        toast({
          title: "Dziękujemy!",
          description: "Zostałeś dodany do listy. Wkrótce otrzymasz więcej informacji.",
        });
        setEmail("");
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Wystąpił problem z zapisem. Spróbuj ponownie.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-l from-accent/15 to-primary/15 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      
      <div className="container px-4 mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Nowa era budowania nawyków</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-gradient">Zbuduj systematyczność</span>,<br />
            która przekłada się na <span className="text-primary">wyniki</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Codzienne śledzenie działań zwiększa skuteczność, eliminuje prokrastynację 
            i pozwala osiągać cele szybciej. Zamiast czekać na motywację, zbuduj działający system.
          </p>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Input
                type="email"
                placeholder="Wpisz swój email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-card border-border-glass text-lg h-12"
                required
              />
              <Button 
                type="submit"
                disabled={isLoading}
                className="gradient-primary hover-glow h-12 px-8 text-lg font-semibold"
              >
                {isLoading ? "Zapisuję..." : "Dołącz teraz"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button 
              variant="outline" 
              size="lg"
              onClick={onGetStarted}
              className="glass-card border-border-glass hover-glow text-lg font-semibold px-8"
            >
              Masz już konto? Zaloguj się
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}