import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { githubApi } from "@/services/github";
import { SearchBar } from "@/components/SearchBar";
import { ProfileCard } from "@/components/ProfileCard";
import { StatsCard } from "@/components/StatsCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card } from "@/components/ui/card";
import { Users, Star, GitFork, BookOpen } from "lucide-react";
import { toast } from "sonner";

const Compare = () => {
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");

  const { data: userData1, isLoading: loading1 } = useQuery({
    queryKey: ["user", user1],
    queryFn: () => githubApi.getUser(user1),
    enabled: !!user1,
  });

  const { data: stats1 } = useQuery({
    queryKey: ["userStats", user1],
    queryFn: () => githubApi.getUserStats(user1),
    enabled: !!user1,
  });

  const { data: userData2, isLoading: loading2 } = useQuery({
    queryKey: ["user", user2],
    queryFn: () => githubApi.getUser(user2),
    enabled: !!user2,
  });

  const { data: stats2 } = useQuery({
    queryKey: ["userStats", user2],
    queryFn: () => githubApi.getUserStats(user2),
    enabled: !!user2,
  });

  const handleSearch1 = (username: string) => {
    setUser1(username);
    toast.success(`Loaded ${username}`);
  };

  const handleSearch2 = (username: string) => {
    setUser2(username);
    toast.success(`Loaded ${username}`);
  };

  const getWinner = (val1: number, val2: number) => {
    if (val1 > val2) return "left";
    if (val2 > val1) return "right";
    return "tie";
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Compare GitHub Users</h1>
        <p className="text-lg text-muted-foreground">
          Enter two usernames to compare their profiles and statistics
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">User 1</h2>
          <SearchBar onSearch={handleSearch1} placeholder="Enter first username..." />
          {loading1 && <LoadingSpinner />}
          {userData1 && <ProfileCard user={userData1} />}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">User 2</h2>
          <SearchBar onSearch={handleSearch2} placeholder="Enter second username..." />
          {loading2 && <LoadingSpinner />}
          {userData2 && <ProfileCard user={userData2} />}
        </div>
      </div>

      {userData1 && userData2 && stats1 && stats2 && (
        <Card className="p-8 gradient-card border-border shadow-card">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Head to Head Comparison</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <ComparisonMetric
              label="Followers"
              value1={userData1.followers}
              value2={userData2.followers}
              icon={Users}
            />
            <ComparisonMetric
              label="Total Stars"
              value1={stats1.totalStars}
              value2={stats2.totalStars}
              icon={Star}
            />
            <ComparisonMetric
              label="Total Forks"
              value1={stats1.totalForks}
              value2={stats2.totalForks}
              icon={GitFork}
            />
            <ComparisonMetric
              label="Public Repos"
              value1={userData1.public_repos}
              value2={userData2.public_repos}
              icon={BookOpen}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

interface ComparisonMetricProps {
  label: string;
  value1: number;
  value2: number;
  icon: React.ComponentType<{ className?: string }>;
}

const ComparisonMetric = ({ label, value1, value2, icon: Icon }: ComparisonMetricProps) => {
  const winner = value1 > value2 ? "left" : value2 > value1 ? "right" : "tie";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 justify-center">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-semibold text-muted-foreground">{label}</h3>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div
          className={`text-2xl font-bold ${
            winner === "left" ? "text-primary" : winner === "tie" ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {value1.toLocaleString()}
        </div>
        <div className="text-muted-foreground">vs</div>
        <div
          className={`text-2xl font-bold ${
            winner === "right" ? "text-primary" : winner === "tie" ? "text-foreground" : "text-muted-foreground"
          }`}
        >
          {value2.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default Compare;
