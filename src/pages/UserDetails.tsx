import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { githubApi } from "@/services/github";
import { ProfileCard } from "@/components/ProfileCard";
import { StatsCard } from "@/components/StatsCard";
import { RepoCard } from "@/components/RepoCard";
import { LanguageChart } from "@/components/LangaugeChart";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ActivityFeed } from "@/components/ActivityFeed";
import { OrganizationList } from "@/components/OrganizationList";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  Star,
  GitFork,
  BookOpen,
  ArrowRight,
  LayoutGrid,
  Activity,
  Users,
  Building2,
  Calendar,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const UserDetails = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "organizations">("overview");

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

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ["userEvents", username],
    queryFn: () => githubApi.getUserEvents(username!),
    enabled: !!username,
  });

  const { data: organizations, isLoading: orgsLoading } = useQuery({
    queryKey: ["userOrgs", username],
    queryFn: () => githubApi.getUserOrgs(username!),
    enabled: !!username,
  });

  const isLoading = userLoading || statsLoading || languagesLoading || reposLoading || eventsLoading || orgsLoading;

  if (userError) {
    toast.error("User not found");
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-73px)] relative">
        <AnimatedBackground />
        <div className="relative z-10 container mx-auto px-4 py-32 flex flex-col items-center justify-center">
          <LoadingSpinner />
          <p className="mt-4 text-muted-foreground animate-pulse font-medium tracking-wide">
            Fetching developer intelligence...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !stats) {
    return (
      <div className="min-h-[calc(100vh-73px)] relative">
        <AnimatedBackground />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="text-center space-y-4 py-20 animate-fade-in-up">
            <div className="w-20 h-20 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <h2 className="text-3xl font-black text-foreground">User Not Found</h2>
            <p className="text-muted-foreground max-w-sm mx-auto">
              We couldn't find a GitHub profile for <span className="text-primary font-bold">"{username}"</span>.
            </p>
            <div className="pt-4">
              <Link to="/">
                <Button className="gradient-primary rounded-xl px-8 py-6 h-auto font-bold shadow-glow">
                  Back to Hub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "activity", label: "Contribution Activity", icon: Activity, count: events?.length },
    { id: "organizations", label: "Organizations", icon: Building2, count: organizations?.length },
  ];

  return (
    <div className="min-h-[calc(100vh-73px)] relative overflow-x-hidden">
      <AnimatedBackground />

      {/* Breadcrumbs */}
      <div className="relative z-10 container mx-auto px-4 pt-8">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/60 mb-6 group">
          <Link to="/" className="hover:text-primary transition-smooth">Explore</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground/80">User Profile</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary font-bold uppercase tracking-widest">{username}</span>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-[380px,1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <ProfileCard user={user} layout="sidebar" />
          </div>

          {/* Main Content */}
          <div className="space-y-8 min-w-0">
            {/* Horizontal Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-fade-in-up">
              <StatsCard
                title="Total Stars"
                value={stats.totalStars}
                icon={Star}
                color="text-yellow-400"
                className="bg-yellow-400/5 border-yellow-400/10 shadow-[0_8px_20px_hsl(45_93%_47%/0.08)]"
              />
              <StatsCard
                title="Total Forks"
                value={stats.totalForks}
                icon={GitFork}
                color="text-blue-400"
                className="bg-blue-400/5 border-blue-400/10 shadow-[0_8px_20px_hsl(199_89%_48%/0.08)]"
              />
              <StatsCard
                title="Total Repos"
                value={user.public_repos}
                icon={BookOpen}
                color="text-emerald-400"
                className="bg-emerald-400/5 border-emerald-400/10 shadow-[0_8px_20px_hsl(160_84%_39%/0.08)]"
              />
            </div>

            {/* Tabs */}
            <div className="glass rounded-2xl p-1.5 flex flex-wrap gap-1 sticky top-24 z-20 border-white/[0.05] shadow-xl backdrop-blur-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-smooth ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-md ${
                      activeTab === tab.id ? "bg-white/20" : "bg-white/10"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 transition-all duration-500 min-h-[400px]">
              {/* Tab Content: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-10 animate-fade-in-up">
                  {/* Languages Section */}
                  {languages && Object.keys(languages).length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 ml-1">
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                          <LayoutGrid className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-xl font-black text-foreground uppercase tracking-wider">Skill Set</h2>
                      </div>
                      <LanguageChart stats={languages} />
                    </div>
                  )}

                  {/* Top Repos Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between ml-1 leading-none">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-xl font-black text-foreground uppercase tracking-wider">Top Creations</h2>
                      </div>
                      <Link to={`/user/${username}/repos`}>
                        <Button
                          variant="ghost"
                          className="gap-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-xl group px-4"
                        >
                          EXPLORE ALL <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-smooth" />
                        </Button>
                      </Link>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 group/list">
                      {topRepos?.map((repo, i) => (
                        <RepoCard key={repo.id} repo={repo} username={username} index={i} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: Activity */}
              {activeTab === "activity" && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center gap-3 ml-1">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <Activity className="h-4 w-4 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-black text-foreground uppercase tracking-wider">Recent Signals</h2>
                  </div>
                  <ActivityFeed events={events || []} />
                </div>
              )}

              {/* Tab Content: Organizations */}
              {activeTab === "organizations" && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center gap-3 ml-1">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <Building2 className="h-4 w-4 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-black text-foreground uppercase tracking-wider">Memberships</h2>
                  </div>
                  <OrganizationList organizations={organizations || []} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;