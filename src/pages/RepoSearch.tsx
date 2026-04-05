import { useState, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { githubApi } from "@/services/github";
import { RepoCard } from "@/components/RepoCard";
import { RepoCardSkeleton } from "@/components/RepoCardSkeleton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import { GitHubSearchResult } from "@/types/github";
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  GitFork, 
  Clock, 
  TrendingUp, 
  Dices, 
  Cpu, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Layout,
  Code2,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TOPICS = [
  { id: "ai", label: "Artificial Intelligence", query: "topic:machine-learning topic:ai", icon: Cpu, color: "text-purple-400" },
  { id: "web3", label: "Web3 & Crypto", query: "topic:blockchain topic:ethereum", icon: Globe, color: "text-blue-400" },
  { id: "fullstack", label: "Fullstack Frameworks", query: "topic:react topic:nextjs topic:typescript", icon: Layout, color: "text-emerald-400" },
  { id: "security", label: "Cybersecurity", query: "topic:security topic:hacking topic:pentesting", icon: ShieldCheck, color: "text-red-400" },
  { id: "creative", label: "Creative Coding", query: "topic:canvas topic:threejs topic:animation", icon: Zap, color: "text-amber-400" },
];

const LANGUAGES = [
  { label: "All Tech", value: "all", icon: Code2 },
  { label: "TypeScript", value: "TypeScript", icon: Zap },
  { label: "Python", value: "Python", icon: Cpu },
  { label: "Rust", value: "Rust", icon: ShieldCheck },
  { label: "Go", value: "Go", icon: Globe },
];

const SORT_OPTIONS = [
  { value: "stars", label: "Stars", icon: Star },
  { value: "forks", label: "Forks", icon: GitFork },
  { value: "updated", label: "Built", icon: Clock },
];

const RepoSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState("stars");
  const [page, setPage] = useState(1);

  // Recommendations query (used when no search is performed)
  const { data: recData, isLoading: recLoading } = useQuery<GitHubSearchResult>({
    queryKey: ["recommendedRepos"],
    queryFn: () => githubApi.searchRepos("stars:>50000", "all", "stars", 1),
    enabled: !submittedQuery,
  });

  // Search query
  const { data, isLoading: searchLoading, isFetching } = useQuery<GitHubSearchResult>({
    queryKey: ["searchRepos", submittedQuery, language, sort, page],
    queryFn: () => githubApi.searchRepos(submittedQuery, language, sort, page),
    enabled: !!submittedQuery,
    placeholderData: keepPreviousData,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
      setPage(1);
    }
  };

  const handleTopicClick = (query: string) => {
    setSubmittedQuery(query);
    setSearchQuery(query);
    setPage(1);
  };

  const handleRandom = () => {
    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    handleTopicClick(randomTopic.query);
  };

  const isLoading = submittedQuery ? searchLoading : recLoading;
  const currentData = submittedQuery ? data : recData;

  return (
    <div className="min-h-[calc(100vh-73px)] relative pb-20">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 text-xs font-semibold tracking-wide text-primary border-primary/20 shadow-glow">
            <TrendingUp className="h-3 w-3" />
            <span>Discover Repositories</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-foreground tracking-tight leading-none">
            Explore the <span className="gradient-text glow-text">Code</span>
          </h1>
          <p className="text-muted-foreground/80 md:text-lg max-w-xl mx-auto font-medium leading-relaxed">
            Search the global network of repositories. Filter by topic, language, and popularity.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 p-1.5 glass-strong rounded-2xl border-white/10 shadow-elevated focus-within:ring-2 focus-within:ring-primary/30 transition-smooth">
              <div className="relative flex-1 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-smooth" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search repository registry..."
                  className="w-full h-12 pl-12 pr-4 bg-transparent border-none text-base focus-visible:ring-0 placeholder:text-muted-foreground/30 font-medium"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 h-12 px-8 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-smooth shadow-glow shrink-0"
                >
                  Search
                </Button>
                <Button
                  type="button"
                  onClick={handleRandom}
                  variant="ghost"
                  className="h-12 w-12 p-0 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-muted-foreground hover:text-primary transition-smooth shrink-0"
                  title="Random Discovery"
                >
                  <Dices className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Trending Topics Grid */}
        {!submittedQuery && (
          <div className="space-y-6 animate-fade-in-up animation-delay-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">Trending Topics</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {TOPICS.map((topic, i) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicClick(topic.query)}
                  className="group relative flex flex-col items-center justify-center p-6 glass rounded-2xl border-white/[0.05] hover:bg-white/[0.08] hover:border-primary/30 transition-spring overflow-hidden text-center"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`p-3 rounded-2xl bg-white/[0.03] group-hover:bg-primary/10 mb-3 transition-smooth ${topic.color}`}>
                    <topic.icon className="h-6 w-6 group-hover:scale-110 transition-spring" />
                  </div>
                  <span className="text-xs font-semibold text-foreground/80 group-hover:text-primary transition-smooth">
                    {topic.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Global Filter Bar */}
        <div className="glass rounded-2xl p-3 flex flex-wrap items-center gap-4 border-white/[0.05] sticky top-24 z-30 shadow-xl backdrop-blur-xl animate-fade-in-up">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground ml-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
            <span>Filters:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                onClick={() => {
                  setLanguage(lang.value);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-smooth border ${
                  language === lang.value
                    ? "bg-primary text-white border-primary/50 shadow-glow"
                    : "bg-white/[0.03] text-muted-foreground border-white/[0.05] hover:bg-white/[0.08] hover:text-foreground"
                }`}
              >
                <lang.icon className="h-3 w-3" />
                {lang.label}
              </button>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-white/[0.08] hidden lg:block" />

          <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/[0.05]">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setSort(opt.value);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-smooth ${
                  sort === opt.value
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.05]"
                }`}
              >
                <opt.icon className="h-3 w-3" />
                {opt.label}
              </button>
            ))}
          </div>

          {currentData && (
            <div className="ml-auto mr-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              <span className="text-xs font-semibold text-primary">
                {currentData.total_count.toLocaleString()} results
              </span>
            </div>
          )}
        </div>

        {/* Results / Recommended Section */}
        <div className="space-y-8 min-h-[400px]">
          {/* Header section based on state */}
          {!recLoading && !searchLoading && (
            <>
              {!submittedQuery && (
                <div className="flex items-center gap-3 ml-1 animate-fade-in-up">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Star className="h-4 w-4 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Most Starred</h2>
                </div>
              )}

              {submittedQuery && (
                <div className="flex items-center justify-between ml-1 animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <Search className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">Search Results</h2>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setSubmittedQuery("");
                      setSearchQuery("");
                    }}
                    className="text-xs font-medium text-muted-foreground hover:text-red-400 gap-2"
                  >
                    Clear Search <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </>
          )}

          {(searchLoading || recLoading) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <RepoCardSkeleton key={i} index={i} />
              ))}
            </div>
          ) : (
            <>
              {currentData && currentData.items.length > 0 && (
                <div className="space-y-12">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                    {currentData.items.map((repo, i) => (
                      <RepoCard
                        key={repo.id}
                        repo={repo}
                        index={i % 6}
                        username={repo.owner?.login || repo.full_name.split("/")[0]}
                      />
                    ))}
                  </div>

                  {/* Pagination (Only for search) */}
                  {submittedQuery && currentData.total_count > 30 && (
                    <div className="flex justify-center items-center gap-6 pt-8 border-t border-white/[0.05]">
                      <Button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1 || isFetching}
                        variant="outline"
                        className="h-12 px-8 rounded-xl border-white/[0.1] bg-white/[0.02] text-xs font-black uppercase tracking-widest hover:bg-white/[0.08]"
                      >
                        Previous Sync
                      </Button>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Sector</span>
                        <span className="text-sm font-black text-foreground">{page}</span>
                      </div>
                      <Button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page * 30 >= currentData.total_count || isFetching}
                        variant="outline"
                        className="h-12 px-8 rounded-xl border-white/[0.1] bg-white/[0.02] text-xs font-black uppercase tracking-widest hover:bg-white/[0.08]"
                      >
                        Next Sync
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {currentData && currentData.items.length === 0 && submittedQuery && (
            <div className="text-center py-20 animate-fade-in-up">
              <div className="mb-4 p-6 bg-white/[0.03] rounded-full inline-block border border-white/10 group cursor-default">
                <Search className="h-12 w-12 text-muted-foreground/20 group-hover:text-primary/40 transition-smooth" />
              </div>
              <p className="text-lg font-bold text-foreground">Zero nodes detected.</p>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">Adjust your signal frequency or search query for better resonance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepoSearch;
