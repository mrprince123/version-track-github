import { Github } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-card/50 backdrop-blur-sm py-6 w-full mt-auto">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-foreground"
        >
          <Github className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Developed by Prince Kumar Sahni
          </span>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">
          &copy; {new Date().getFullYear()} GitHub Repo Analyzer. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};
