import { useState, useEffect } from "react";
import { Hero } from "@/components/landing/Hero";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { StatisticsSection } from "@/components/landing/StatisticsSection";
import { CTASection } from "@/components/landing/CTASection";
import { AuthModal } from "@/components/auth/AuthModal";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const handleAuthSuccess = (token: string) => {
    setAuthToken(token);
  };

  const handleLogout = () => {
    setAuthToken(null);
  };

  // If user is authenticated, show dashboard
  if (authToken) {
    return <Dashboard token={authToken} onLogout={handleLogout} />;
  }

  // Otherwise show landing page
  return (
    <div className="min-h-screen">
      <Hero onGetStarted={() => setIsAuthModalOpen(true)} />
      <BenefitsSection />
      <StatisticsSection />
      <CTASection />
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
