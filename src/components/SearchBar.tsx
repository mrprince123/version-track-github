import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (username: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ onSearch, placeholder = "Enter GitHub username...", className = "" }: SearchBarProps) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-3 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={placeholder}
          className="pl-10 h-12 bg-card border-border text-foreground"
        />
      </div>
      <Button type="submit" className="h-12 px-8 gradient-primary hover:opacity-90 transition-smooth">
        Search
      </Button>
    </form>
  );
};
