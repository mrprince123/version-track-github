import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { Github, Users, GitBranch, TrendingUp, Search, BarChart3, Code2, Star, GitFork } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (username: string) => {
    navigate(`/user/${username}`);
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl w-full space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 shadow-glow mb-4">
              <Github className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Explore GitHub{" "}
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Profiles
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover developers, analyze repositories, and compare profiles with interactive visualizations
            </p>
          </div>

          <SearchBar onSearch={handleSearch} />

          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <div className="text-center space-y-3 p-6 rounded-xl bg-card/50 border border-border transition-smooth hover:shadow-glow">
              <div className="inline-flex items-center justify-center p-3 rounded-lg bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Profile Analytics</h3>
              <p className="text-sm text-muted-foreground">
                View detailed stats, followers, and contributions
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-xl bg-card/50 border border-border transition-smooth hover:shadow-glow">
              <div className="inline-flex items-center justify-center p-3 rounded-lg bg-primary/10">
                <GitBranch className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Repository Insights</h3>
              <p className="text-sm text-muted-foreground">
                Explore repos with stars, forks, and languages
              </p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-xl bg-card/50 border border-border transition-smooth hover:shadow-glow">
              <div className="inline-flex items-center justify-center p-3 rounded-lg bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Compare Users</h3>
              <p className="text-sm text-muted-foreground">
                Side-by-side comparison of developer metrics
              </p>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="space-y-8 pt-16">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
              <p className="text-muted-foreground">Get started in three simple steps</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary to-transparent md:hidden"></div>
                </div>
                <div className="space-y-2 pl-16 md:pl-0">
                  <Search className="h-10 w-10 text-primary mb-2" />
                  <h3 className="text-xl font-semibold text-foreground">Search for Users</h3>
                  <p className="text-muted-foreground">Enter any GitHub username to explore their profile and projects</p>
                </div>
              </div>

              <div className="relative space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary to-transparent md:hidden"></div>
                </div>
                <div className="space-y-2 pl-16 md:pl-0">
                  <BarChart3 className="h-10 w-10 text-primary mb-2" />
                  <h3 className="text-xl font-semibold text-foreground">Analyze Data</h3>
                  <p className="text-muted-foreground">View interactive charts and detailed statistics about repositories</p>
                </div>
              </div>

              <div className="relative space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                </div>
                <div className="space-y-2 pl-16 md:pl-0">
                  <TrendingUp className="h-10 w-10 text-primary mb-2" />
                  <h3 className="text-xl font-semibold text-foreground">Compare & Discover</h3>
                  <p className="text-muted-foreground">Compare developers side-by-side and discover trending technologies</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features Section */}
          <div className="space-y-8 pt-16">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Powerful Features</h2>
              <p className="text-muted-foreground">Everything you need to explore GitHub profiles</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-card/50 border border-border space-y-3">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Code2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Language Distribution</h3>
                    <p className="text-sm text-muted-foreground">
                      Visualize programming languages used across all repositories with interactive pie charts
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card/50 border border-border space-y-3">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Repository Rankings</h3>
                    <p className="text-sm text-muted-foreground">
                      Discover top repositories sorted by stars, forks, and recent activity
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card/50 border border-border space-y-3">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <GitFork className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Contribution Metrics</h3>
                    <p className="text-sm text-muted-foreground">
                      Track followers, following, total commits, and overall contribution activity
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card/50 border border-border space-y-3">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Developer Comparison</h3>
                    <p className="text-sm text-muted-foreground">
                      Compare two developers side-by-side with detailed metrics and visual indicators
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
