import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { githubApi } from "@/services/github";
import { RepoCard } from "@/components/RepoCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Repositories = () => {
  const { username } = useParams<{ username: string }>();
  const [page, setPage] = useState(1);

  const { data: repos, isLoading } = useQuery({
    queryKey: ["repos", username, page],
    queryFn: () => githubApi.getRepos(username!, page, 30),
    enabled: !!username,
  });

  if (isLoading && page === 1) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/user/${username}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground">
            Repositories by <span className="text-primary">{username}</span>
          </h1>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos?.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>

      {repos && repos.length === 30 && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={isLoading}
            className="gradient-primary hover:opacity-90 transition-smooth px-8"
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Repositories;