import { GitHubRepo } from "@/types/github";
import { Star, GitFork, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface RepoCardProps {
  repo: GitHubRepo;
  username: string; // pass username as prop so we can route properly
}

export const RepoCard = ({ repo, username }: RepoCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user/${username}/${repo.name}/detail`);
  };

  return (
    <Card
      onClick={handleClick}
      className="p-6 gradient-card border-border shadow-card transition-smooth hover:shadow-glow hover:scale-[1.02] cursor-pointer"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-foreground hover:text-primary transition-smooth">
            {repo.name}
          </h3>
          {repo.language && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Circle className="h-2 w-2 fill-primary" />
              {repo.language}
            </Badge>
          )}
        </div>

        {repo.description && (
          <p className="text-muted-foreground line-clamp-2">
            {repo.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-primary" />
            <span>{repo.stargazers_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4 text-primary" />
            <span>{repo.forks_count}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
