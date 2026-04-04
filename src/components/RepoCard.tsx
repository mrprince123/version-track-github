import { GitHubRepo } from "@/types/github";
import { Star, GitFork, Circle } from "lucide-react";
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

  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || "#a78bfa" : null;
  const updatedAt = new Date(repo.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={handleClick}
      className="group glass-card rounded-xl p-5 cursor-pointer transition-smooth hover:shadow-glow hover:scale-[1.02] gradient-border animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="space-y-3">
        {/* Title + Language */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-smooth truncate">
            {repo.name}
          </h3>
          {repo.language && langColor && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 shrink-0 bg-white/[0.05] border-white/[0.08] text-xs"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: langColor }} />
              {repo.language}
            </Badge>
          )}
        </div>

        {/* Description */}
        {repo.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {repo.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-yellow-400/80" />
            <span>{repo.stargazers_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-3.5 w-3.5 text-blue-400/80" />
            <span>{repo.forks_count.toLocaleString()}</span>
          </div>
          <span className="ml-auto text-muted-foreground/50">
            Updated {updatedAt}
          </span>
        </div>
      </div>
    </div>
  );
};
