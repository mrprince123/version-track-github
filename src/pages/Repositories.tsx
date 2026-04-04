import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { githubApi } from "@/services/github";
import { RepoCard } from "@/components/RepoCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, LayoutGrid, List } from "lucide-react";

const Repositories = () => {
  const { username } = useParams<{ username: string }>();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [langFilter, setLangFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: repos, isLoading } = useQuery({
    queryKey: ["repos", username, page],
    queryFn: () => githubApi.getRepos(username!, page, 100),
    enabled: !!username,
  });

  // Collect unique languages
  const languages = useMemo(() => {
    if (!repos) return [];
    const langs = new Set(repos.map((r) => r.language).filter(Boolean));
    return Array.from(langs) as string[];
  }, [repos]);

  // Filtered repos
  const filteredRepos = useMemo(() => {
    if (!repos) return [];
    return repos.filter((repo) => {
      const matchesName = repo.name.toLowerCase().includes(filter.toLowerCase());
      const matchesLang = langFilter === "all" || repo.language === langFilter;
      return matchesName && matchesLang;
    });
  }, [repos, filter, langFilter]);

  if (isLoading && page === 1) {
    return (
      <div className="min-h-[calc(100vh-73px)] relative">
        <AnimatedBackground />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] relative">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 flex-wrap animate-fade-in-up">
          <Link to={`/user/${username}`}>
            <Button
              variant="outline"
              size="icon"
              className="glass border-white/[0.1] hover:bg-white/[0.05] rounded-xl"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Repositories by{" "}
            <span className="gradient-text">{username}</span>
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 animate-fade-in-up animation-delay-100">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter repositories..."
              className="w-full h-9 pl-9 pr-4 text-sm rounded-lg glass bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40 transition-smooth"
            />
          </div>

          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="h-9 px-3 text-sm rounded-lg glass bg-transparent text-foreground border-white/[0.08] focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
          >
            <option value="all" className="bg-[hsl(222,47%,11%)]">All Languages</option>
            {languages.map((lang) => (
              <option key={lang} value={lang} className="bg-[hsl(222,47%,11%)]">
                {lang}
              </option>
            ))}
          </select>

          {/* View toggle */}
          <div className="flex gap-0.5 glass rounded-lg p-0.5 ml-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-smooth ${
                viewMode === "grid" ? "bg-primary/20 text-primary" : "text-muted-foreground"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-smooth ${
                viewMode === "list" ? "bg-primary/20 text-primary" : "text-muted-foreground"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <span className="text-xs text-muted-foreground">
            {filteredRepos.length} repos
          </span>
        </div>

        {/* Repo Grid/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-5"
              : "flex flex-col gap-3"
          }
        >
          {filteredRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} username={username} />
          ))}
        </div>

        {filteredRepos.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No repositories match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Repositories;