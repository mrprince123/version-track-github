import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { githubApi } from "@/services/github";
import { RepoCard } from "@/components/RepoCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Search, SlidersHorizontal, Star, GitFork, Clock, TrendingUp } from "lucide-react";

const LANGUAGES = [
  "all",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C++",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "C#",
  "Dart",
  "Scala",
  "Shell",
];

const SORT_OPTIONS = [
  { value: "stars", label: "Stars", icon: Star },
  { value: "forks", label: "Forks", icon: GitFork },
  { value: "updated", label: "Updated", icon: Clock },
];

const RepoSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState("stars");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["searchRepos", submittedQuery, language, sort, page],
    queryFn: () => githubApi.searchRepos(submittedQuery, language, sort, page),
    enabled: !!submittedQuery,
    keepPreviousData: true,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
      setPage(1);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] relative">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-primary">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Discover open source projects</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Explore <span className="gradient-text">Repositories</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Search across millions of GitHub repositories by keyword, language, and popularity.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="max-w-3xl mx-auto space-y-4 animate-fade-in-up animation-delay-100">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-smooth" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repositories... (e.g. react, machine learning)"
                className="w-full h-12 pl-12 pr-4 text-base rounded-xl glass-card text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-smooth"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-6 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-smooth shadow-glow shrink-0"
            >
              Search
            </button>
          </form>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters:</span>
            </div>

            {/* Language */}
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setPage(1);
              }}
              className="h-8 px-3 text-sm rounded-lg glass bg-transparent text-foreground border-white/[0.08] focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-[hsl(222,47%,11%)]">
                  {lang === "all" ? "All Languages" : lang}
                </option>
              ))}
            </select>

            {/* Sort */}
            <div className="flex gap-1 glass rounded-lg p-0.5">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSort(opt.value);
                    setPage(1);
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-smooth ${
                    sort === opt.value
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <opt.icon className="h-3 w-3" />
                  {opt.label}
                </button>
              ))}
            </div>

            {data && (
              <span className="text-xs text-muted-foreground ml-auto">
                {data.total_count.toLocaleString()} results
              </span>
            )}
          </div>
        </div>

        {/* Results */}
        {isLoading && <LoadingSpinner />}

        {!submittedQuery && !isLoading && (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Search for repositories to get started</p>
          </div>
        )}

        {data && data.items.length > 0 && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.items.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  username={repo.owner?.login || repo.full_name.split("/")[0]}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
                className="px-5 py-2.5 rounded-xl glass text-sm font-medium text-foreground disabled:opacity-30 hover:bg-white/[0.05] transition-smooth"
              >
                Previous
              </button>
              <span className="px-4 py-2.5 text-sm text-muted-foreground">
                Page {page}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={data.items.length < 20 || isFetching}
                className="px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-medium disabled:opacity-30 hover:opacity-90 transition-smooth"
              >
                {isFetching ? "Loading..." : "Next"}
              </button>
            </div>
          </div>
        )}

        {data && data.items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">No repositories found for "{submittedQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoSearch;
