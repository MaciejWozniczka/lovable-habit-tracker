import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center glass-card p-12 rounded-3xl max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-gradient">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Strona nie została znaleziona</p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold gradient-primary hover-glow text-white"
        >
          Powrót do strony głównej
        </a>
      </div>
    </div>
  );
};

export default NotFound;
