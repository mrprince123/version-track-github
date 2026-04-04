import { Github } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Github className="h-8 w-8 text-primary" />
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              GitHub Explorer
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant={isActive("/") ? "default" : "ghost"} className="transition-smooth">
                Search
              </Button>
            </Link>
            <Link to="/compare">
              <Button variant={isActive("/compare") ? "default" : "ghost"} className="transition-smooth">
                Compare
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};