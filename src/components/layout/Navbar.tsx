import { useState, useEffect, useRef } from "react";
import { Github, Search, Menu, X, Command } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      inputRef.current?.blur();
    }
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/explore", label: "Explore" },
    { path: "/compare", label: "Compare" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-glass py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
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

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-3 text-[11px] font-black uppercase tracking-widest transition-smooth rounded-lg ${
                      isActive(link.path)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
                    }`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>


          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1">
              {/* Search station */}
              <div className="relative group/search">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within/search:text-primary transition-smooth" />
                <form onSubmit={handleQuickSearch}>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search database... (⌘K)"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    className="w-48 lg:w-64 h-8 pl-10 pr-12 text-[11px] font-medium rounded-lg glass bg-white/[0.03] text-foreground border border-white/5 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:bg-white/[0.08] transition-smooth placeholder:text-muted-foreground/40"
                  />
                </form>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] font-black text-muted-foreground/40 select-none">
                  ⌘K
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in-up border-t border-white/5 pt-4 space-y-2">
            <form onSubmit={handleQuickSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-sm rounded-lg glass bg-white/[0.03] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 focus:bg-white/[0.08]"
              />
            </form>
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-[11px] font-black uppercase tracking-widest rounded-lg h-10 ${
                    isActive(link.path) ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};