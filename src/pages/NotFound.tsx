import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Home, SearchX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center relative">
      <AnimatedBackground />

      <div className="relative z-10 text-center space-y-6 px-4">
        <div className="glass-card rounded-2xl p-10 md:p-16 gradient-border max-w-md mx-auto space-y-6">
          <SearchX className="h-16 w-16 text-primary/40 mx-auto" />

          <h1 className="text-7xl md:text-8xl font-extrabold gradient-text animate-glitch">
            404
          </h1>

          <div className="space-y-2">
            <p className="text-xl font-semibold text-foreground">Page not found</p>
            <p className="text-sm text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 gradient-primary rounded-xl text-white font-semibold hover:opacity-90 transition-smooth shadow-glow hover:shadow-glow-strong"
          >
            <Home className="h-4 w-4" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;