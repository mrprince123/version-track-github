import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  buttonLabel?: string;
}

export const SearchBar = ({
  onSearch,
  placeholder = "Enter GitHub username...",
  className = "",
  buttonLabel = "Search",
}: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col md:flex-row items-center gap-3 ${className}`}>
      <div className="relative w-full flex-1 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-smooth" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-12 pl-12 pr-4 text-base rounded-xl glass-card text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-smooth border border-white/[0.08] bg-white/[0.03]"
        />
      </div>
      <button
        type="submit"
        className="w-full md:w-auto h-12 px-8 rounded-xl gradient-primary text-white hover:opacity-90 transition-smooth font-semibold text-base shadow-glow hover:shadow-glow-strong shrink-0"
      >
        {buttonLabel}
      </button>
    </form>
  );
};
