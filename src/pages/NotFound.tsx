import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-2xl text-foreground">Page not found</p>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <a href="/" className="inline-block mt-4">
          <button className="px-6 py-3 gradient-primary rounded-lg hover:opacity-90 transition-smooth text-foreground font-semibold">
            Return to Home
          </button>
        </a>
      </div>
    </div>
  );
};

export default NotFound;