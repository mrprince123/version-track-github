import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { githubApi } from "@/services/github";
import { SearchBar } from "@/components/SearchBar";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  Users,
  Star,
  GitFork,
  BookOpen,
  Swords,
  Trophy,
  Minus,
  Crown,
  Zap,
  MapPin,
  Building2,
  Calendar,
  ArrowRight,
  Flame,
  Shield,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Quick match presets for fun
const QUICK_MATCHES = [
  { user1: "torvalds", user2: "gaearon", label: "Torvalds vs Abramov" },
  { user1: "yyx990803", user2: "gaearon", label: "Vue vs React" },
  { user1: "sindresorhus", user2: "tj", label: "Sindre vs TJ" },
  { user1: "getify", user2: "addyosmani", label: "Kyle vs Addy" },
];

// Animated number component
const AnimatedNumber = ({ value, delay = 0 }: { value: number; delay?: number }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const steps = 40;
      const inc = value / steps;
      const timer = setInterval(() => {
        start++;
        setDisplay(Math.min(Math.round(inc * start), value));
        if (start >= steps) clearInterval(timer);
      }, 25);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return <>{display.toLocaleString()}</>;
};

const Compare = () => {
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const navigate = useNavigate();

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
    toast.success(`Loading ${username}...`);
  };

  const handleSearch2 = (username: string) => {
    setUser2(username);
    toast.success(`Loading ${username}...`);
  };

  const handleQuickMatch = (m: typeof QUICK_MATCHES[0]) => {
    setUser1(m.user1);
    setUser2(m.user2);
    toast.success(`⚔️ ${m.label} — Fight!`);
  };

  // Calculate overall winner
  const battleResult = useMemo(() => {
    if (!userData1 || !userData2 || !stats1 || !stats2) return null;

    const metrics = [
      { label: "Followers", v1: userData1.followers, v2: userData2.followers },
      { label: "Stars", v1: stats1.totalStars, v2: stats2.totalStars },
      { label: "Forks", v1: stats1.totalForks, v2: stats2.totalForks },
      { label: "Repos", v1: userData1.public_repos, v2: userData2.public_repos },
    ];

    let score1 = 0, score2 = 0;
    metrics.forEach((m) => {
      if (m.v1 > m.v2) score1++;
      else if (m.v2 > m.v1) score2++;
    });

    return {
      winner: score1 > score2 ? "left" : score2 > score1 ? "right" : "tie",
      score1,
      score2,
      metrics,
    };
  }, [userData1, userData2, stats1, stats2]);

  const bothLoaded = userData1 && userData2 && stats1 && stats2 && battleResult;

  return (
    <div className="min-h-[calc(100vh-73px)] relative">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-primary">
            <Swords className="h-3.5 w-3.5" />
            <span>Head-to-head developer battle</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Developer <span className="gradient-text">Battle Arena</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Who's the ultimate open-source champion? Enter two usernames and find out!
          </p>
        </div>

        {/* Quick Match Presets */}
        <div className="flex flex-wrap justify-center gap-2 animate-fade-in-up animation-delay-100">
          <span className="text-xs text-muted-foreground/60 self-center mr-1">Quick matches:</span>
          {QUICK_MATCHES.map((m) => (
            <button
              key={m.label}
              onClick={() => handleQuickMatch(m)}
              className="glass rounded-full px-3 py-1 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth flex items-center gap-1.5"
            >
              <Zap className="h-3 w-3 text-yellow-400" />
              {m.label}
            </button>
          ))}
        </div>

        {/* VS Battle Card */}
        <div className="animate-fade-in-up animation-delay-200">
          <div className="glass-card rounded-2xl p-6 md:p-8 gradient-border">
            <div className="grid md:grid-cols-[1fr,auto,1fr] gap-6 md:gap-4 items-start">
              {/* Player 1 */}
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white">1</span>
                  Challenger
                </h2>
                <SearchBar onSearch={handleSearch1} placeholder="Enter first username..." />
                {loading1 && <LoadingSpinner />}
                {userData1 && <BattlePlayerCard user={userData1} side="left" winner={battleResult?.winner} onNavigate={() => navigate(`/user/${userData1.login}`)} />}
              </div>

              {/* VS Divider */}
              <div className="flex md:flex-col items-center justify-center gap-3 py-4">
                <div className="h-px md:h-16 w-16 md:w-px bg-gradient-to-r md:bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg shrink-0 transition-all duration-500 ${
                  bothLoaded
                    ? "bg-gradient-to-br from-yellow-500 to-orange-500 text-black shadow-[0_0_30px_hsl(40_100%_50%/0.4)] scale-110"
                    : "glass text-primary"
                }`}
                >
                  {bothLoaded ? "⚔️" : "VS"}
                </div>
                <div className="h-px md:h-16 w-16 md:w-px bg-gradient-to-r md:bg-gradient-to-b from-transparent via-primary/40 to-transparent" />
              </div>

              {/* Player 2 */}
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">2</span>
                  Defender
                </h2>
                <SearchBar onSearch={handleSearch2} placeholder="Enter second username..." />
                {loading2 && <LoadingSpinner />}
                {userData2 && <BattlePlayerCard user={userData2} side="right" winner={battleResult?.winner} onNavigate={() => navigate(`/user/${userData2.login}`)} />}
              </div>
            </div>
          </div>
        </div>

        {/* Battle Results */}
        {bothLoaded && (
          <>
            {/* Winner Banner */}
            <div className="animate-fade-in-up">
              <div className={`glass-card rounded-2xl p-6 text-center gradient-border overflow-hidden relative ${
                battleResult.winner !== "tie" ? "shadow-glow-strong" : ""
              }`}>
                {/* Confetti-like particles for winner state */}
                {battleResult.winner !== "tie" && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-float-up" style={{ animationDelay: "0s" }} />
                    <div className="absolute top-0 left-1/3 w-1.5 h-1.5 bg-primary rounded-full animate-float-up" style={{ animationDelay: "0.3s" }} />
                    <div className="absolute top-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-float-up" style={{ animationDelay: "0.6s" }} />
                    <div className="absolute top-0 left-2/3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-float-up" style={{ animationDelay: "0.9s" }} />
                    <div className="absolute top-0 left-3/4 w-1 h-1 bg-primary rounded-full animate-float-up" style={{ animationDelay: "1.2s" }} />
                  </div>
                )}

                <div className="relative z-10">
                  {battleResult.winner === "tie" ? (
                    <>
                      <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h2 className="text-2xl font-bold text-foreground">It's a Tie!</h2>
                      <p className="text-sm text-muted-foreground mt-1">Both developers are equally matched!</p>
                    </>
                  ) : (
                    <>
                      <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-3 animate-bounce" />
                      <h2 className="text-2xl font-bold text-foreground">
                        <span className="gradient-text">
                          {battleResult.winner === "left" ? userData1?.login : userData2?.login}
                        </span>
                        {" "}wins!
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Winning {battleResult.winner === "left" ? battleResult.score1 : battleResult.score2} out of {battleResult.metrics.length} categories
                      </p>
                    </>
                  )}

                  {/* Score dots */}
                  <div className="flex items-center justify-center gap-8 mt-4">
                    <div className="flex items-center gap-2">
                      <img src={userData1?.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                      <span className="text-2xl font-black gradient-text">{battleResult.score1}</span>
                    </div>
                    <span className="text-muted-foreground/40">—</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-blue-400">{battleResult.score2}</span>
                      <img src={userData2?.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Stat Bars */}
            <div className="glass-card rounded-2xl p-6 md:p-8 gradient-border animate-fade-in-up animation-delay-100">
              <h2 className="text-xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Battle Breakdown
              </h2>

              <div className="space-y-6">
                {[
                  { label: "Followers", value1: userData1!.followers, value2: userData2!.followers, icon: Users, color1: "from-violet-500 to-purple-600", color2: "from-blue-500 to-cyan-500" },
                  { label: "Total Stars", value1: stats1!.totalStars, value2: stats2!.totalStars, icon: Star, color1: "from-yellow-500 to-orange-500", color2: "from-yellow-400 to-amber-500" },
                  { label: "Total Forks", value1: stats1!.totalForks, value2: stats2!.totalForks, icon: GitFork, color1: "from-green-500 to-emerald-600", color2: "from-teal-500 to-cyan-500" },
                  { label: "Public Repos", value1: userData1!.public_repos, value2: userData2!.public_repos, icon: BookOpen, color1: "from-pink-500 to-rose-600", color2: "from-indigo-500 to-violet-500" },
                ].map((stat, i) => {
                  const total = stat.value1 + stat.value2;
                  const pct1 = total > 0 ? (stat.value1 / total) * 100 : 50;
                  const pct2 = total > 0 ? (stat.value2 / total) * 100 : 50;
                  const winner = stat.value1 > stat.value2 ? "left" : stat.value2 > stat.value1 ? "right" : "tie";

                  return (
                    <div key={stat.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <stat.icon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">{stat.label}</span>
                        </div>
                        {winner !== "tie" && (
                          <div className="flex items-center gap-1 text-xs">
                            <Crown className="h-3 w-3 text-yellow-400" />
                            <span className="text-muted-foreground">
                              {winner === "left" ? userData1?.login : userData2?.login}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Battle bar */}
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold w-20 text-right tabular-nums ${winner === "left" ? "text-green-400" : "text-foreground"}`}>
                          <AnimatedNumber value={stat.value1} delay={i * 100} />
                        </span>

                        <div className="flex-1 h-3 rounded-full bg-white/[0.05] overflow-hidden flex">
                          <div
                            className={`h-full bg-gradient-to-r ${stat.color1} rounded-l-full transition-all duration-1000 ease-out`}
                            style={{ width: `${pct1}%`, transitionDelay: `${i * 150}ms` }}
                          />
                          <div className="w-0.5 bg-background shrink-0" />
                          <div
                            className={`h-full bg-gradient-to-r ${stat.color2} rounded-r-full transition-all duration-1000 ease-out`}
                            style={{ width: `${pct2}%`, transitionDelay: `${i * 150}ms` }}
                          />
                        </div>

                        <span className={`text-sm font-bold w-20 tabular-nums ${winner === "right" ? "text-green-400" : "text-foreground"}`}>
                          <AnimatedNumber value={stat.value2} delay={i * 100} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Player legend */}
              <div className="flex items-center justify-center gap-8 mt-6 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <img src={userData1?.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                  <span className="text-xs text-muted-foreground">{userData1?.login}</span>
                  <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-violet-500 to-purple-600" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-blue-500 to-cyan-500" />
                  <span className="text-xs text-muted-foreground">{userData2?.login}</span>
                  <img src={userData2?.avatar_url} alt="" className="w-5 h-5 rounded-full" />
                </div>
              </div>
            </div>

            {/* Side-by-side Overview */}
            <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up animation-delay-200">
              <DetailOverview user={userData1!} stats={stats1!} isWinner={battleResult.winner === "left"} />
              <DetailOverview user={userData2!} stats={stats2!} isWinner={battleResult.winner === "right"} />
            </div>
          </>
        )}

        {/* Empty state */}
        {!user1 && !user2 && (
          <div className="text-center glass-card rounded-2xl p-12 gradient-border animate-fade-in-up animation-delay-300">
            <Flame className="h-16 w-16 text-primary/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Battle?</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Enter two GitHub usernames above or pick a quick match to start the developer showdown!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {QUICK_MATCHES.slice(0, 2).map((m) => (
                <button
                  key={m.label}
                  onClick={() => handleQuickMatch(m)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-smooth shadow-glow"
                >
                  <Zap className="h-4 w-4" />
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Battle Player Card — shows avatar, name, bio, and stats in a compact battle format
interface BattlePlayerCardProps {
  user: any;
  side: "left" | "right";
  winner?: string | null;
  onNavigate: () => void;
}

const BattlePlayerCard = ({ user, side, winner, onNavigate }: BattlePlayerCardProps) => {
  const isWinner = (side === "left" && winner === "left") || (side === "right" && winner === "right");

  return (
    <div
      className={`glass rounded-xl p-4 transition-all duration-500 group cursor-pointer ${
        isWinner ? "ring-2 ring-yellow-400/50 shadow-[0_0_20px_hsl(40_100%_50%/0.15)]" : ""
      }`}
      onClick={onNavigate}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-14 h-14 rounded-full ring-2 ring-white/10 group-hover:ring-primary/50 transition-smooth"
          />
          {isWinner && (
            <Crown className="absolute -top-2 -right-2 h-5 w-5 text-yellow-400 animate-bounce" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-smooth">
            {user.name || user.login}
          </h3>
          <p className="text-xs text-muted-foreground">@{user.login}</p>
          {user.bio && (
            <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1">{user.bio}</p>
          )}
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-smooth shrink-0" />
      </div>

      {/* Quick stats row */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.06]">
        {user.company && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
            <Building2 className="h-3 w-3 shrink-0" /> {user.company}
          </span>
        )}
        {user.location && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 shrink-0" /> {user.location}
          </span>
        )}
        <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
          <Calendar className="h-3 w-3 shrink-0" />
          {new Date(user.created_at).getFullYear()}
        </span>
      </div>
    </div>
  );
};

// Detail Overview card for side-by-side
interface DetailOverviewProps {
  user: any;
  stats: { totalStars: number; totalForks: number; totalRepos: number };
  isWinner: boolean;
}

const DetailOverview = ({ user, stats, isWinner }: DetailOverviewProps) => (
  <div className={`glass-card rounded-xl p-5 gradient-border transition-all duration-500 ${
    isWinner ? "ring-1 ring-yellow-400/30" : ""
  }`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="relative">
        <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full ring-1 ring-white/10" />
        {isWinner && <Crown className="absolute -top-1.5 -right-1.5 h-4 w-4 text-yellow-400" />}
      </div>
      <div>
        <h3 className="text-sm font-bold text-foreground">{user.name || user.login}</h3>
        <p className="text-xs text-muted-foreground">@{user.login}</p>
      </div>
      {isWinner && (
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 font-semibold">
          WINNER
        </span>
      )}
    </div>

    <div className="grid grid-cols-2 gap-3">
      {[
        { label: "Followers", value: user.followers, icon: Users },
        { label: "Following", value: user.following, icon: Users },
        { label: "Stars", value: stats.totalStars, icon: Star },
        { label: "Forks", value: stats.totalForks, icon: GitFork },
        { label: "Repos", value: user.public_repos, icon: BookOpen },
        { label: "Gists", value: user.public_gists || 0, icon: Zap },
      ].map((s) => (
        <div key={s.label} className="glass rounded-lg p-2.5 text-center">
          <s.icon className="h-3.5 w-3.5 text-primary/60 mx-auto mb-1" />
          <p className="text-base font-bold text-foreground">{s.value.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Compare;
