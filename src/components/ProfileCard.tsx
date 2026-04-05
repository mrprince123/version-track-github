import { GitHubUser } from "@/types/github";
import {
  MapPin,
  Link as LinkIcon,
  Building,
  Users,
  Calendar,
  ExternalLink,
  Mail,
  Zap,
  Share2,
  Check,
  Trophy,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface ProfileCardProps {
  user: GitHubUser;
  layout?: "full" | "sidebar";
}

export const ProfileCard = ({ user, layout = "full" }: ProfileCardProps) => {
  const [copied, setCopied] = useState(false);

  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Profile link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getDevLevel = () => {
    const score = user.public_repos + (user.followers * 2);
    if (score > 500) return { label: "Legendary", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" };
    if (score > 200) return { label: "Architect", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" };
    if (score > 100) return { label: "Elite", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" };
    if (score > 50) return { label: "Explorer", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
    return { label: "Rising Star", color: "text-slate-400 bg-slate-400/10 border-slate-400/20" };
  };

  const devLevel = getDevLevel();

  if (layout === "sidebar") {
    return (
      <div className="glass-card rounded-2xl p-6 md:p-8 gradient-border sticky top-24 group/card">
        <div className="space-y-6">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-primary via-blue-500 to-purple-600 blur-md opacity-20 group-hover:opacity-60 transition-smooth animate-pulse-glow" />
              <Avatar className="relative h-28 w-28 md:h-36 md:w-36 ring-2 ring-white/[0.08] ring-offset-4 ring-offset-background group-hover:scale-[1.02] transition-smooth border border-white/[0.1]">
                <AvatarImage src={user.avatar_url} alt={user.login} />
                <AvatarFallback className="text-3xl font-bold gradient-primary text-white">
                  {user.login[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-foreground tracking-tight group-hover/card:glow-text transition-smooth">
                {user.name || user.login}
              </h2>
              <div className="flex items-center justify-center gap-2">
                <p className="text-primary font-bold text-sm">@{user.login}</p>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border ${devLevel.color}`}>
                  {devLevel.label}
                </span>
              </div>
            </div>
          </div>

          {user.bio && (
            <p className="text-sm text-muted-foreground/90 leading-relaxed text-center px-2 italic">
              "{user.bio}"
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              asChild
              className="flex-1 h-11 gradient-primary hover:opacity-90 transition-smooth shadow-glow rounded-xl gap-2 font-bold group"
            >
              <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                Follow <Users className="h-4 w-4 group-hover:rotate-12 transition-smooth" />
              </a>
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="w-11 h-11 p-0 border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.08] text-foreground rounded-xl transition-smooth"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            </Button>
          </div>

          {/* Social Stats Row */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="glass rounded-xl p-3 text-center border-white/[0.05] hover:bg-white/[0.08] transition-smooth cursor-default group/stat">
              <p className="text-xl font-black text-foreground group-hover/stat:text-primary transition-smooth">
                {user.followers >= 1000 ? (user.followers / 1000).toFixed(1) + "k" : user.followers}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Followers</p>
            </div>
            <div className="glass rounded-xl p-3 text-center border-white/[0.05] hover:bg-white/[0.08] transition-smooth cursor-default group/stat">
              <p className="text-xl font-black text-foreground group-hover/stat:text-primary transition-smooth">
                {user.following >= 1000 ? (user.following / 1000).toFixed(1) + "k" : user.following}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Following</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold text-center">Identity & Reach</h4>
            <div className="grid gap-2.5">
              {user.location && (
                <DetailRow icon={MapPin} label={user.location} />
              )}
              {user.company && (
                <DetailRow icon={Building} label={user.company} />
              )}
              {user.blog && (
                <DetailRow
                  icon={LinkIcon}
                  label={user.blog}
                  href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                />
              )}
              {user.email && (
                <DetailRow icon={Mail} label={user.email} href={`mailto:${user.email}`} />
              )}
              <DetailRow icon={Calendar} label={`Member since ${joinDate}`} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 gradient-border animate-fade-in-up overflow-hidden relative group/card">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/card:opacity-30 transition-smooth">
        <Trophy className="h-24 w-24 text-primary rotate-12" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 relative z-10">
        {/* Avatar */}
        <div className="relative shrink-0 self-center md:self-start group">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/60 to-blue-500/40 blur-sm group-hover:scale-105 transition-smooth" />
          <Avatar className="relative h-28 w-28 md:h-32 md:w-32 ring-2 ring-primary/30 ring-offset-2 ring-offset-background transition-smooth border border-white/[0.1]">
            <AvatarImage src={user.avatar_url} alt={user.login} />
            <AvatarFallback className="text-3xl font-bold gradient-primary text-white">
              {user.login[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tight group-hover/card:glow-text transition-smooth">
                {user.name || user.login}
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-base text-primary font-medium">@{user.login}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border ${devLevel.color}`}>
                  <Zap className="h-2.5 w-2.5 fill-current" /> {devLevel.label.toUpperCase()}
                </span>
                {user.public_repos > 50 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-500 border border-yellow-400/20 font-bold flex items-center gap-1">
                    POWER USER
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.08] text-foreground rounded-xl transition-smooth h-11 px-4"
              >
                {copied ? <Check className="h-4 w-4 mr-2 text-emerald-400" /> : <Share2 className="h-4 w-4 mr-2" />}
                {copied ? "Link Copied" : "Share"}
              </Button>
              <Button
                asChild
                className="gradient-primary hover:opacity-90 transition-smooth shadow-glow rounded-xl gap-2 font-bold px-6 h-11"
              >
                <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                  GITHUB <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {user.bio && (
            <p className="text-foreground/80 leading-relaxed max-w-xl italic whitespace-pre-wrap">
              "{user.bio}"
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            {[
              { icon: MapPin, label: user.location },
              { icon: Building, label: user.company },
              { icon: LinkIcon, label: user.blog, href: user.blog?.startsWith("http") ? user.blog : `https://${user.blog}` },
              { icon: Calendar, label: `Member since ${joinDate}` },
            ].filter(d => d.label).map((detail, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground group">
                <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] group-hover:bg-primary/10 group-hover:border-primary/20 transition-smooth">
                  <detail.icon className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary transition-smooth shrink-0" />
                </div>
                {detail.href ? (
                  <a href={detail.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-smooth line-clamp-1 truncate">
                    {detail.label}
                  </a>
                ) : (
                  <span className="line-clamp-1">{detail.label}</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-8 pt-4 border-t border-white/[0.06]">
            <SocialStat icon={Users} value={user.followers} label="Followers" />
            <SocialStat icon={Users} value={user.following} label="Following" />
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialStat = ({ icon: Icon, value, label }: { icon: any; value: number; label: string }) => (
  <div className="flex items-center gap-2.5 group cursor-default">
    <div className="p-2 rounded-xl bg-primary/5 border border-primary/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-smooth">
      <Icon className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:scale-110 transition-smooth" />
    </div>
    <div>
      <p className="text-xl font-black text-foreground leading-none group-hover:glow-text transition-smooth">
        {value.toLocaleString()}
      </p>
      <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-extrabold">{label}</p>
    </div>
  </div>
);

const DetailRow = ({ icon: Icon, label, href }: { icon: any; label: string; href?: string }) => (
  <div className="glass rounded-xl px-3 py-2.5 flex items-center gap-3 border-white/[0.05] hover:bg-white/[0.08] hover:border-white/[0.1] hover:translate-x-1 transition-smooth group overflow-hidden">
    <Icon className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary transition-smooth shrink-0" />
    {href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] text-muted-foreground group-hover:text-foreground transition-smooth truncate font-medium"
      >
        {label}
      </a>
    ) : (
      <span className="text-[11px] text-muted-foreground truncate font-medium">{label}</span>
    )}
  </div>
);
