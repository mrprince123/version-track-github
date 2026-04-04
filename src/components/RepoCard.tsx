import { GitHubRepo } from "@/types/github";
import { Star, GitFork, Book, Code2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// GitHub language colors
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  Scala: "#c22d40",
  Lua: "#000080",
  R: "#198CE7",
  Perl: "#0298c3",
  Haskell: "#5e5086",
  Elixir: "#6e4a7e",
};

interface RepoCardProps {
  repo: GitHubRepo;
  username?: string;
  index?: number;
}

export const RepoCard = ({ repo, username, index = 0 }: RepoCardProps) => {
  const navigate = useNavigate();
  const owner = username || repo.owner?.login || repo.full_name.split("/")[0];

  const handleClick = () => {
    navigate(`/user/${owner}/${repo.name}/detail`);
  };

  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || "hsl(var(--primary))" : null;
  const updatedAt = new Date(repo.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div
      onClick={handleClick}
      className="group glass-card rounded-2xl p-6 cursor-pointer transition-spring hover:glow-border hover:scale-[1.02] gradient-border animate-fade-in-up shimmer overflow-hidden relative"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
      
      <div className="space-y-4">
        {/* Header: Icon + Name + Stars */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-primary/5 border border-primary/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-smooth shrink-0">
              {repo.fork ? <GitFork className="h-4 w-4 text-primary" /> : <Book className="h-4 w-4 text-primary" />}
            </div>
            <h3 className="text-lg font-black text-foreground group-hover:glow-text transition-smooth truncate uppercase tracking-tight">
              {repo.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] group-hover:bg-white/[0.08] transition-smooth shrink-0">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500/20" />
            <span className="text-xs font-black text-foreground">{repo.stargazers_count}</span>
          </div>
        </div>

        {/* Description */}
        {repo.description ? (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[40px] font-medium">
            {repo.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground/30 italic min-h-[40px] font-medium">
            No system identification provided for this node.
          </p>
        )}

        {/* Footer: Language + Stats + Update */}
        <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-[10px] text-muted-foreground uppercase tracking-widest font-black pt-2 border-t border-white/[0.05]">
          {repo.language && (
            <div className="flex items-center gap-2 group/lang hover:text-foreground transition-smooth">
              <Code2 className="h-3 w-3 text-primary" />
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: langColor || 'hsl(var(--primary))' }} />
              {repo.language}
            </div>
          )}
          
          <div className="flex items-center gap-2 hover:text-foreground transition-smooth">
            <GitFork className="h-3 w-3 text-blue-400" />
            <span>{repo.forks_count} FORKS</span>
          </div>

          <div className="ml-auto flex items-center gap-2 text-[9px] text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-smooth">
            <Globe className="h-3 w-3" />
            SYNCED {updatedAt}
          </div>
        </div>
      </div>
    </div>
  );
};
