import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { githubApi } from "@/services/github";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileCard } from "@/components/ProfileCard";
import { ProfileCardSkeleton } from "@/components/ProfileCardSkeleton";
import { StatsCard } from "@/components/StatsCard";
import { StatsCardSkeleton } from "@/components/StatsCardSkeleton";
import { RepoCard } from "@/components/RepoCard";
import { RepoCardSkeleton } from "@/components/RepoCardSkeleton";
import { LanguageChart } from "@/components/LangaugeChart";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ActivityFeed } from "@/components/ActivityFeed";
import { ActivityFeedSkeleton } from "@/components/ActivityFeedSkeleton";
import { OrganizationList } from "@/components/OrganizationList";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  Star,
  GitFork,
  BookOpen,
  LayoutGrid,
  Activity,
  Building2,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const UserDetails = () => {
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<"overview" | "activity" | "organizations">("overview");
  const [repoSearch, setRepoSearch] = useState("");
  const [repoSort, setRepoSort] = useState("stars");

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
    queryFn: () => githubApi.getRepos(username!, 1, 30), // Get more for filtering
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

  const filteredRepos = useMemo(() => {
    if (!topRepos) return [];
    
    let result = [...topRepos];
    
    // Filter
    if (repoSearch) {
      result = result.filter(repo => 
        repo.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
        repo.description?.toLowerCase().includes(repoSearch.toLowerCase())
      );
    }
    
    // Sort
    result.sort((a, b) => {
      if (repoSort === "stars") return b.stargazers_count - a.stargazers_count;
      if (repoSort === "forks") return b.forks_count - a.forks_count;
      if (repoSort === "updated") return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      return 0;
    });
    
    return result.slice(0, 6); // Keep top 6 after filter/sort
  }, [topRepos, repoSearch, repoSort]);

  const isLoading = userLoading || statsLoading || languagesLoading || reposLoading || eventsLoading || orgsLoading;

  if (userError) {
    toast.error("User not found");
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-73px)] relative overflow-x-hidden">
        <AnimatedBackground />
        
        {/* Breadcrumbs Skeleton */}
        <div className="relative z-10 container mx-auto px-4 pt-8">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-[380px,1fr] gap-8">
            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <ProfileCardSkeleton />
            </div>

            {/* Content Skeleton */}
            <div className="space-y-8">
              {/* Stats Grid Skeleton */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <StatsCardSkeleton key={i} />
                ))}
              </div>

              {/* Tabs Skeleton */}
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-28 rounded-xl" />
                ))}
              </div>

              {/* Major Content Skeleton (Repo Grid) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <RepoCardSkeleton key={i} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
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
              No intelligence matched for identity <span className="text-primary font-bold">"{username}"</span>.
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
    { id: "overview", label: "Intelligence", icon: LayoutGrid },
    { id: "activity", label: "Signals", icon: Activity, count: events?.length },
    { id: "organizations", label: "Nodes", icon: Building2, count: organizations?.length },
  ];

  return (
    <div className="min-h-[calc(100vh-73px)] relative overflow-x-hidden">
      <AnimatedBackground />

      {/* Breadcrumbs */}
      <div className="relative z-10 container mx-auto px-4 pt-8">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-6 group">
          <Link to="/" className="hover:text-primary transition-smooth">Network</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground/80">Entity Profile</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary glow-text">{username}</span>
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
                title="Public Repos"
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
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-smooth ${
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
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shadow-glow">
                          <LayoutGrid className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-xl font-black text-foreground uppercase tracking-widest glow-text">Expertise Profile</h2>
                      </div>
                      <LanguageChart stats={languages} />
                    </div>
                  )}

                  {/* Top Repos Section */}
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ml-1 leading-none">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 shadow-glow">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <h2 className="text-xl font-black text-foreground uppercase tracking-widest glow-text">Primary Nodes</h2>
                      </div>
                      
                      {/* Search & Sort Controls */}
                      <div className="flex flex-col md:flex-row md:items-center gap-3 bg-white/[0.02] border border-white/[0.05] p-1.5 rounded-2xl flex-1 w-full max-w-md">
                        <div className="relative flex-1 group">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-smooth" />
                          <Input 
                            placeholder="Filter nodes..." 
                            value={repoSearch}
                            onChange={(e) => setRepoSearch(e.target.value)}
                            className="bg-transparent border-none focus-visible:ring-0 text-xs h-9 pl-9 pr-8"
                          />
                          {repoSearch && (
                            <button 
                              onClick={() => setRepoSearch("")}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-md transition-smooth"
                            >
                              <X className="h-3 w-3 text-muted-foreground" />
                            </button>
                          )}
                        </div>
                        <div className="hidden md:block w-[1px] h-6 bg-white/[0.08]" />
                        <Select value={repoSort} onValueChange={setRepoSort}>
                          <SelectTrigger className="w-full md:w-[130px] bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-widest h-9">
                            <SlidersHorizontal className="h-3 w-3 mr-2 text-primary" />
                            <SelectValue placeholder="Sort" />
                          </SelectTrigger>
                          <SelectContent className="glass-strong border-white/[0.1] rounded-xl overflow-hidden">
                            <SelectItem value="stars" className="text-[10px] font-bold uppercase tracking-widest">By Stars</SelectItem>
                            <SelectItem value="forks" className="text-[10px] font-bold uppercase tracking-widest">By Forks</SelectItem>
                            <SelectItem value="updated" className="text-[10px] font-bold uppercase tracking-widest text-primary">Recently Built</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {filteredRepos.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-5 group/list">
                        {filteredRepos.map((repo, i) => (
                          <RepoCard key={repo.id} repo={repo} username={username} index={i} />
                        ))}
                      </div>
                    ) : (
                      <div className="glass rounded-2xl p-20 text-center border-dashed border-white/[0.05]">
                        <div className="mb-4 p-4 bg-white/[0.03] rounded-full inline-block">
                          <History className="h-8 w-8 text-muted-foreground/20" />
                        </div>
                        <p className="text-muted-foreground text-sm font-medium">No matching nodes found in this sector.</p>
                      </div>
                    )}

                    <div className="flex justify-center pt-4">
                      <Link to={`/user/${username}/repos`}>
                        <Button
                          variant="ghost"
                          className="gap-3 text-[10px] font-black tracking-widest text-primary hover:bg-primary/5 rounded-2xl group px-8 py-6 h-auto"
                        >
                          ACCESS COMPLETE REPOSITORY NETWORK <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-spring" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content: Activity */}
              {activeTab === "activity" && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center gap-3 ml-1">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <Activity className="h-4 w-4 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-black text-foreground uppercase tracking-widest glow-text">Recent Data Signals</h2>
                  </div>
                  <ActivityFeed events={events || []} />
                </div>
              )}

              {/* Tab Content: Organizations */}
              {activeTab === "organizations" && (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="flex items-center gap-3 ml-1">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      <Building2 className="h-4 w-4 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-black text-foreground uppercase tracking-widest glow-text">Network Memberships</h2>
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