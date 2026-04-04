import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { githubApi } from "@/services/github";
import AnimatedBackground from "@/components/AnimatedBackground";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  TrendingUp,
  Star,
  GitFork,
  Eye,
  ArrowRight,
  Flame,
  Clock,
  Globe,
  Newspaper,
  Code2,
  Zap,
  BookOpen,
  Users,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

// Language options for the filter
const LANGUAGES = [
  "All", "JavaScript", "TypeScript", "Python", "Java", "Go",
  "Rust", "C++", "Ruby", "Swift", "Kotlin", "PHP",
];

// Simulated GitHub-like news/updates feed
const NEWS_FEED = [
  {
    id: 1,
    type: "announcement",
    icon: Zap,
    iconColor: "text-yellow-400",
    title: "GitHub Copilot X is now available",
    desc: "AI-powered coding assistant with chat, docs, and CLI support for all developers.",
    time: "2 hours ago",
    link: "https://github.com/features/copilot",
  },
  {
    id: 2,
    type: "release",
    icon: Code2,
    iconColor: "text-blue-400",
    title: "React 19 Stable Release",
    desc: "Async actions, use() hook, server components, and improved error handling are now stable.",
    time: "5 hours ago",
    link: "https://github.com/facebook/react",
  },
  {
    id: 3,
    type: "trending",
    icon: Flame,
    iconColor: "text-orange-400",
    title: "Bun v1.2 brings Windows support",
    desc: "The ultra-fast JavaScript runtime now supports Windows with full compatibility.",
    time: "8 hours ago",
    link: "https://github.com/oven-sh/bun",
  },
  {
    id: 4,
    type: "security",
    icon: Globe,
    iconColor: "text-green-400",
    title: "New security advisories dashboard",
    desc: "GitHub now provides a centralized view of all security advisories across your repositories.",
    time: "12 hours ago",
    link: "https://github.com/advisories",
  },
  {
    id: 5,
    type: "feature",
    icon: BookOpen,
    iconColor: "text-violet-400",
    title: "Markdown Alerts in README files",
    desc: "Use NOTE, TIP, IMPORTANT, WARNING, and CAUTION alerts directly in your Markdown.",
    time: "1 day ago",
    link: "https://github.com",
  },
  {
    id: 6,
    type: "community",
    icon: Users,
    iconColor: "text-pink-400",
    title: "100M+ developers on GitHub",
    desc: "The developer community has surpassed 100 million registered users worldwide.",
    time: "2 days ago",
    link: "https://github.com/about",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [showAllNews, setShowAllNews] = useState(false);

  // Fetch trending repos
  const { data: trendingRepos, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending", selectedLanguage],
    queryFn: () =>
      githubApi.searchRepos(
        selectedLanguage === "All" ? "stars:>50000" : `stars:>10000 language:${selectedLanguage}`,
        undefined,
        "stars",
        1,
        12
      ),
  });

  // Fetch recently updated repos
  const { data: recentRepos, isLoading: recentLoading } = useQuery({
    queryKey: ["recentlyUpdated"],
    queryFn: () => githubApi.searchRepos("stars:>5000", undefined, "updated", 1, 6),
  });

  const displayedNews = showAllNews ? NEWS_FEED : NEWS_FEED.slice(0, 4);

  return (
    <div className="min-h-[calc(100vh-73px)] relative">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Dashboard Header */}
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <Newspaper className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">GitHub updates, trending repos, and developer news</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ===== LEFT COLUMN: News Feed ===== */}
          <div className="lg:col-span-1 space-y-4 animate-fade-in-up animation-delay-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-primary" />
                News & Updates
              </h2>
            </div>

            <div className="space-y-3">
              {displayedNews.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block glass-card rounded-xl p-4 transition-smooth hover:shadow-glow gradient-border group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-primary/10 shrink-0 mt-0.5">
                      <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-smooth leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                        {item.desc}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-3 w-3 text-muted-foreground/50" />
                        <span className="text-[11px] text-muted-foreground/60">{item.time}</span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground/30 ml-auto" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {!showAllNews && NEWS_FEED.length > 4 && (
              <button
                onClick={() => setShowAllNews(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-primary hover:text-foreground transition-smooth glass rounded-lg"
              >
                Show more <ChevronDown className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* ===== RIGHT COLUMN: Trending + Recent ===== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trending Repos */}
            <div className="space-y-4 animate-fade-in-up animation-delay-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-400" />
                  Trending Repositories
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  {LANGUAGES.slice(0, 6).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-3 py-1 text-xs rounded-full transition-smooth ${
                        selectedLanguage === lang
                          ? "bg-primary/20 text-primary font-medium"
                          : "glass text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {trendingLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {trendingRepos?.items?.slice(0, 6).map((repo) => (
                    <button
                      key={repo.id}
                      onClick={() => navigate(`/user/${repo.owner.login}/${repo.name}/detail`)}
                      className="glass-card rounded-xl p-4 text-left transition-smooth hover:shadow-glow gradient-border group"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={repo.owner.avatar_url}
                          alt={repo.owner.login}
                          className="w-8 h-8 rounded-full ring-1 ring-white/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground truncate">{repo.owner.login}</span>
                            <span className="text-muted-foreground/30">/</span>
                          </div>
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-smooth truncate">
                            {repo.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {repo.description || "No description"}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            {repo.language && (
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-primary/70" />
                                {repo.language}
                              </span>
                            )}
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400" />
                              {repo.stargazers_count >= 1000
                                ? `${(repo.stargazers_count / 1000).toFixed(1)}k`
                                : repo.stargazers_count}
                            </span>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <GitFork className="h-3 w-3" />
                              {repo.forks_count >= 1000
                                ? `${(repo.forks_count / 1000).toFixed(1)}k`
                                : repo.forks_count}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recently Updated */}
            <div className="space-y-4 animate-fade-in-up animation-delay-300">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recently Updated
              </h2>

              {recentLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-3">
                  {recentRepos?.items?.slice(0, 5).map((repo) => (
                    <button
                      key={repo.id}
                      onClick={() => navigate(`/user/${repo.owner.login}/${repo.name}/detail`)}
                      className="w-full glass-card rounded-xl p-4 text-left transition-smooth hover:shadow-glow gradient-border group flex items-center gap-4"
                    >
                      <img
                        src={repo.owner.avatar_url}
                        alt={repo.owner.login}
                        className="w-10 h-10 rounded-full ring-1 ring-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{repo.owner.login}</span>
                          <span className="text-muted-foreground/30">/</span>
                          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-smooth truncate">
                            {repo.name}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {repo.description || "No description"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 text-yellow-400" />
                          {repo.stargazers_count >= 1000
                            ? `${(repo.stargazers_count / 1000).toFixed(1)}k`
                            : repo.stargazers_count}
                        </div>
                        <div className="text-xs text-muted-foreground/50">
                          {new Date(repo.updated_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary transition-smooth" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="grid sm:grid-cols-3 gap-4 animate-fade-in-up animation-delay-400">
              <button
                onClick={() => navigate("/explore")}
                className="glass-card rounded-xl p-5 text-center transition-smooth hover:shadow-glow gradient-border group"
              >
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-spring" />
                <h3 className="text-sm font-semibold text-foreground">Explore Repos</h3>
                <p className="text-xs text-muted-foreground mt-1">Search & discover projects</p>
              </button>
              <button
                onClick={() => navigate("/compare")}
                className="glass-card rounded-xl p-5 text-center transition-smooth hover:shadow-glow gradient-border group"
              >
                <Users className="h-8 w-8 text-violet-400 mx-auto mb-3 group-hover:scale-110 transition-spring" />
                <h3 className="text-sm font-semibold text-foreground">Compare Devs</h3>
                <p className="text-xs text-muted-foreground mt-1">Side-by-side comparison</p>
              </button>
              <button
                onClick={() => navigate("/")}
                className="glass-card rounded-xl p-5 text-center transition-smooth hover:shadow-glow gradient-border group"
              >
                <Eye className="h-8 w-8 text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-spring" />
                <h3 className="text-sm font-semibold text-foreground">Search Users</h3>
                <p className="text-xs text-muted-foreground mt-1">Find any GitHub profile</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
