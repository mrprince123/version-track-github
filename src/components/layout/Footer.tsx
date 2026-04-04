import { Github, Heart, ExternalLink, Code2, Star, GitBranch } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="glass-strong mt-auto border-t border-white/[0.06]">
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="md:col-span-1 space-y-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-bold text-foreground group"
            >
              <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                <Github className="h-5 w-5 text-primary" />
              </div>
              <span>
                <span className="gradient-text font-extrabold">Git</span>
                <span className="text-foreground font-semibold">Explorer</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground/70 leading-relaxed">
              Explore GitHub profiles, repositories, and source code with a beautiful, modern interface.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg glass hover:bg-primary/10 transition-smooth text-muted-foreground hover:text-primary"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg glass hover:bg-primary/10 transition-smooth text-muted-foreground hover:text-primary"
              >
                <Code2 className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg glass hover:bg-primary/10 transition-smooth text-muted-foreground hover:text-primary"
              >
                <Star className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Navigation</h4>
            <ul className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "Dashboard", path: "/dashboard" },
                { label: "Explore Repos", path: "/explore" },
                { label: "Compare Devs", path: "/compare" },
              ].map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Features</h4>
            <ul className="space-y-2">
              {[
                "Profile Analytics",
                "Code Viewer",
                "Markdown Preview",
                "Branch Explorer",
                "Clone & Download",
              ].map((feature) => (
                <li key={feature}>
                  <span className="text-sm text-muted-foreground/70">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Built With */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Built With</h4>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Vite", "Tailwind", "TanStack Query"].map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] px-2 py-1 rounded-md glass text-muted-foreground/70 border border-white/[0.04]"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="pt-2">
              <a
                href="https://docs.github.com/en/rest"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-smooth"
              >
                <GitBranch className="h-3 w-3" />
                Powered by GitHub API
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()} GitExplorer. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <span>Built with</span>
            <Heart className="h-3 w-3 text-red-400 animate-pulse" />
            <span>by</span>
            <a
              href="https://princesahni.com"
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-text font-extrabold hover:opacity-80 transition-smooth inline-flex items-center gap-1"
            >
              Prince Kumar Sahni
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </footer>
  );
};
