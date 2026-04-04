import { useState, useEffect, useRef } from "react";
import { Github, Search, Menu, X, Command } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Detect scroll for enhanced navbar style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ⌘K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/user/${quickSearch.trim()}`);
      setQuickSearch("");
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/explore", label: "Explore" },
    { path: "/compare", label: "Compare" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "glass-strong border-white/[0.08] shadow-lg shadow-black/20"
          : "bg-transparent border-white/[0.04]"
      }`}
    >
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-xl font-bold text-foreground shrink-0 group"
          >
            <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth group-hover:shadow-glow">
              <Github className="h-5 w-5 text-primary" />
            </div>
            <span className="hidden sm:inline">
              <span className="gradient-text font-extrabold">Git</span>
              <span className="text-foreground font-semibold">Explorer</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5 glass rounded-full px-1 py-0.5">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`transition-smooth rounded-full text-xs h-8 px-4 ${
                    isActive(link.path)
                      ? "bg-primary/15 text-primary hover:bg-primary/20 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Quick Search */}
          <form
            onSubmit={handleQuickSearch}
            className="hidden md:flex items-center gap-2 flex-1 max-w-xs"
          >
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-smooth" />
              <input
                ref={inputRef}
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full h-8 pl-9 pr-14 text-sm rounded-full glass border-white/[0.08] bg-white/[0.03] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 focus:bg-white/[0.06] transition-smooth"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/40 bg-white/[0.05] rounded-md px-1.5 py-0.5 font-mono border border-white/[0.06]">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </div>
          </form>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/[0.05] transition-smooth text-foreground"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-1 animate-fade-in-up border-t border-white/[0.06] pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
              >
                <Button
                  variant="ghost"
                  className={`w-full justify-start rounded-lg transition-smooth ${
                    isActive(link.path)
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            <form onSubmit={handleQuickSearch} className="pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="Search users..."
                  className="w-full h-10 pl-10 pr-4 text-sm rounded-lg glass bg-white/[0.04] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-smooth"
                />
              </div>
            </form>
          </div>
        )}
      </div>
      {/* Animated gradient line */}
      <div className={`h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-40"}`} />
    </nav>
  );
};