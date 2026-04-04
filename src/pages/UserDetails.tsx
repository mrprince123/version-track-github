import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { githubApi } from "@/services/github";
import { ProfileCard } from "@/components/ProfileCard";
import { StatsCard } from "@/components/StatsCard";
import { RepoCard } from "@/components/RepoCard";
import { LanguageChart } from "@/components/LangaugeChart";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Star, GitFork, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const UserDetails = () => {
  const { username } = useParams<{ username: string }>();

  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["user", username],
    queryFn: () => githubApi.getUser(username!),
    enabled: !!username,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats", username],
    queryFn: () => githubApi.getUserStats(username!),
    enabled: !!username,
  });

  const { data: languages, isLoading: languagesLoading } = useQuery({
    queryKey: ["languages", username],
    queryFn: () => githubApi.getLanguageStats(username!),
    enabled: !!username,
  });

  const { data: topRepos, isLoading: reposLoading } = useQuery({
    queryKey: ["topRepos", username],
    queryFn: async () => {
      const repos = await githubApi.getRepos(username!, 1, 6);
      return repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);
    },
    enabled: !!username,
  });

  if (userError) {
    toast.error("User not found");
  }

  if (userLoading || statsLoading || languagesLoading || reposLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">User not found</h2>
          <Link to="/">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <ProfileCard user={user} />

      <div className="grid md:grid-cols-3 gap-6">
        <StatsCard title="Total Stars" value={stats.totalStars} icon={Star} />
        <StatsCard title="Total Forks" value={stats.totalForks} icon={GitFork} />
        <StatsCard title="Public Repos" value={user.public_repos} icon={BookOpen} />
      </div>

      {languages && Object.keys(languages).length > 0 && (
        <LanguageChart stats={languages} />
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-foreground">Top Repositories</h2>
          <Link to={`/user/${username}/repos`}>
            <Button variant="outline" className="gap-2">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topRepos?.map((repo) => (
            <RepoCard key={repo.id} repo={repo} username={username} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;