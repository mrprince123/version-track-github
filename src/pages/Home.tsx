import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  Github,
  Users,
  GitBranch,
  TrendingUp,
  Search,
  BarChart3,
  Code2,
  Star,
  GitFork,
  BookOpen,
  Zap,
  Eye,
  ArrowRight,
  Shield,
  Layers,
  Globe,
  Terminal,
  FileCode2,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

// Animated counter hook
const useCounter = (target: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 60;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += 1;
      setCount(Math.min(Math.round(increment * start), target));
      if (start >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

// Popular profiles for the "Trending Developers" section
const TRENDING_DEVS = [
  { login: "torvalds", name: "Linus Torvalds", avatar: "https://avatars.githubusercontent.com/u/1024025?v=4", role: "Linux Creator" },
  { login: "gaearon", name: "Dan Abramov", avatar: "https://avatars.githubusercontent.com/u/810438?v=4", role: "React Core" },
  { login: "sindresorhus", name: "Sindre Sorhus", avatar: "https://avatars.githubusercontent.com/u/170270?v=4", role: "Open Source" },
  { login: "tj", name: "TJ Holowaychuk", avatar: "https://avatars.githubusercontent.com/u/25254?v=4", role: "Express.js" },
  { login: "yyx990803", name: "Evan You", avatar: "https://avatars.githubusercontent.com/u/499550?v=4", role: "Vue.js Creator" },
  { login: "getify", name: "Kyle Simpson", avatar: "https://avatars.githubusercontent.com/u/150330?v=4", role: "JS Author" },
];

// Popular repos for the showcase
const POPULAR_REPOS = [
  { name: "react", owner: "facebook", stars: "225k", lang: "JavaScript", langColor: "#f1e05a", desc: "A library for building user interfaces" },
  { name: "tensorflow", owner: "tensorflow", stars: "185k", lang: "Python", langColor: "#3572A5", desc: "An open source ML framework" },
  { name: "vscode", owner: "microsoft", stars: "162k", lang: "TypeScript", langColor: "#3178c6", desc: "Visual Studio Code editor" },
  { name: "linux", owner: "torvalds", stars: "178k", lang: "C", langColor: "#555555", desc: "Linux kernel source tree" },
];

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (username: string) => {
    navigate(`/user/${username}`);
  };

  const repos = useCounter(420, 2500);
  const devs = useCounter(100, 2500);
  const stars = useCounter(5, 2000);
  const contributions = useCounter(3, 2000);

  return (
    <div className="min-h-[calc(100vh-73px)] flex flex-col relative">
      <AnimatedBackground />

      <div className="flex-1 relative z-10">
        {/* ===== HERO SECTION ===== */}
        <section className="flex items-center justify-center px-4 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="max-w-4xl w-full space-y-10">
            {/* Badge */}
            <div className="flex justify-center animate-fade-in-up">
              <div className="glass rounded-full px-4 py-1.5 flex items-center gap-2 text-sm text-primary">
                <Zap className="h-3.5 w-3.5" />
                <span>Explore the world of open source</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-5 animate-fade-in-up animation-delay-100">
              <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-tight tracking-tight">
                Discover GitHub
                <br />
                <span className="gradient-text animate-gradient-shift bg-[length:200%_200%]">
                  Developers & Code
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Search profiles, explore repositories, browse source code, and compare developers
                — all with stunning interactive visualizations.
              </p>
            </div>

            {/* Search */}
            <div className="animate-fade-in-up animation-delay-200 max-w-2xl mx-auto">
              <SearchBar onSearch={handleSearch} placeholder="Enter a GitHub username to explore..." />
            </div>

            {/* Platform Stats */}
            <div className="flex justify-center gap-6 md:gap-12 animate-fade-in-up animation-delay-300">
              {[
                { value: `${repos}M+`, label: "Repositories" },
                { value: `${devs}M+`, label: "Developers" },
                { value: `${stars}B+`, label: "Stars Given" },
                { value: `${contributions}B+`, label: "Contributions" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TRENDING DEVELOPERS ===== */}
        <section className="px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Trending Developers
                </h2>
                <p className="text-sm text-muted-foreground">Popular open source contributors to explore</p>
              </div>
              <button
                onClick={() => navigate("/explore")}
                className="hidden sm:flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {TRENDING_DEVS.map((dev, i) => (
                <button
                  key={dev.login}
                  onClick={() => navigate(`/user/${dev.login}`)}
                  className={`glass-card rounded-xl p-4 space-y-3 text-center transition-smooth hover:shadow-glow hover:scale-[1.04] gradient-border group animate-fade-in-up animation-delay-${(i + 1) * 100}`}
                >
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="w-14 h-14 rounded-full mx-auto ring-2 ring-white/10 group-hover:ring-primary/50 transition-smooth"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground truncate">{dev.name}</p>
                    <p className="text-xs text-muted-foreground">{dev.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURE CARDS ===== */}
        <section className="px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: Users,
                  title: "Profile Analytics",
                  desc: "Deep-dive into developer profiles with followers, repos, and contribution stats.",
                  color: "text-violet-400",
                  delay: "animation-delay-100",
                },
                {
                  icon: GitBranch,
                  title: "Repository Insights",
                  desc: "Explore repos with stars, forks, language breakdowns, and file browsing.",
                  color: "text-blue-400",
                  delay: "animation-delay-200",
                },
                {
                  icon: TrendingUp,
                  title: "Compare Developers",
                  desc: "Put two devs side-by-side and compare followers, stars, and repos.",
                  color: "text-emerald-400",
                  delay: "animation-delay-300",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className={`glass-card rounded-xl p-6 space-y-4 transition-smooth hover:shadow-glow hover:scale-[1.03] gradient-border group animate-fade-in-up ${feature.delay}`}
                >
                  <div className="p-3 rounded-xl bg-primary/10 inline-flex group-hover:bg-primary/20 transition-smooth">
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== POPULAR REPOS SHOWCASE ===== */}
        <section className="px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Popular Repositories
              </h2>
              <p className="text-muted-foreground">Explore some of the most starred projects on GitHub</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {POPULAR_REPOS.map((repo) => (
                <button
                  key={`${repo.owner}/${repo.name}`}
                  onClick={() => navigate(`/user/${repo.owner}/${repo.name}/detail`)}
                  className="glass-card rounded-xl p-5 text-left transition-smooth hover:shadow-glow gradient-border group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary/70" />
                        <span className="text-sm text-muted-foreground">{repo.owner}</span>
                        <span className="text-muted-foreground/40">/</span>
                        <span className="text-base font-semibold text-foreground group-hover:text-primary transition-smooth">
                          {repo.name}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{repo.desc}</p>
                      <div className="flex items-center gap-4 pt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: repo.langColor }} />
                          {repo.lang}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 text-yellow-400" />
                          {repo.stars}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-smooth shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                How It Works
              </h2>
              <p className="text-muted-foreground">Get started in three simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  icon: Search,
                  title: "Search for Users",
                  desc: "Enter any GitHub username to explore their profile, repos, and activity.",
                },
                {
                  step: 2,
                  icon: BarChart3,
                  title: "Analyze & Browse",
                  desc: "View interactive charts, browse repository files, and read source code.",
                },
                {
                  step: 3,
                  icon: TrendingUp,
                  title: "Compare & Discover",
                  desc: "Compare developers side-by-side and discover trending repositories.",
                },
              ].map((item) => (
                <div key={item.step} className="relative space-y-4 animate-fade-in-up">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full glass flex items-center justify-center ring-2 ring-primary/30">
                      <span className="text-lg font-bold gradient-text">{item.step}</span>
                    </div>
                    {item.step < 3 && (
                      <div className="flex-1 h-px bg-gradient-to-r from-primary/40 to-transparent hidden md:block" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-primary/10 inline-flex">
                      <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== POWERFUL FEATURES ===== */}
        <section className="px-4 py-16">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Powerful Features
              </h2>
              <p className="text-muted-foreground">Everything you need to explore open source</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Code2,
                  title: "Code Viewer",
                  desc: "Browse files and view source code with line numbers.",
                  color: "text-cyan-400",
                },
                {
                  icon: Star,
                  title: "Repository Rankings",
                  desc: "Discover top repos sorted by stars and forks.",
                  color: "text-yellow-400",
                },
                {
                  icon: GitFork,
                  title: "Contribution Metrics",
                  desc: "Track followers, forks, and contribution activity.",
                  color: "text-green-400",
                },
                {
                  icon: Eye,
                  title: "Repo Search",
                  desc: "Search repos by keyword, language, and popularity.",
                  color: "text-pink-400",
                },
                {
                  icon: FileCode2,
                  title: "Markdown Preview",
                  desc: "Render README files with rich markdown formatting.",
                  color: "text-orange-400",
                },
                {
                  icon: Terminal,
                  title: "Clone & Download",
                  desc: "Get clone URLs and download source as ZIP.",
                  color: "text-violet-400",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="glass-card rounded-xl p-5 space-y-3 transition-smooth hover:shadow-glow gradient-border group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TECH STACK ===== */}
        <section className="px-4 py-12">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Built With</h2>
              <p className="text-muted-foreground">Modern technologies powering GitHub Explorer</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "React", icon: Layers, color: "text-cyan-400" },
                { name: "TypeScript", icon: FileCode2, color: "text-blue-400" },
                { name: "Vite", icon: Zap, color: "text-yellow-400" },
                { name: "Tailwind CSS", icon: Sparkles, color: "text-sky-400" },
                { name: "GitHub API", icon: Github, color: "text-white" },
                { name: "TanStack Query", icon: Globe, color: "text-orange-400" },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="glass-card rounded-xl px-5 py-3 flex items-center gap-2.5 transition-smooth hover:shadow-glow gradient-border"
                >
                  <tech.icon className={`h-4 w-4 ${tech.color}`} />
                  <span className="text-sm font-medium text-foreground">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="glass-card rounded-2xl p-10 space-y-6 gradient-border">
              <BookOpen className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-3xl font-bold text-foreground">
                Ready to Explore?
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Start discovering amazing developers and projects on GitHub right now.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => navigate("/explore")}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-smooth shadow-glow hover:shadow-glow-strong"
                >
                  Explore Repositories <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl glass text-foreground font-semibold hover:bg-white/[0.05] transition-smooth"
                >
                  View Dashboard <BarChart3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
