import { GitHubUser } from "@/types/github";
import {
  MapPin,
  Link as LinkIcon,
  Building,
  Users,
  Calendar,
  ExternalLink,
  Twitter,
  Mail,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  user: GitHubUser;
  layout?: "full" | "sidebar";
}

export const ProfileCard = ({ user, layout = "full" }: ProfileCardProps) => {
  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  if (layout === "sidebar") {
    return (
      <div className="glass-card rounded-2xl p-6 md:p-8 gradient-border sticky top-24">
        <div className="space-y-6">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-primary via-blue-500 to-purple-600 blur-md opacity-20 group-hover:opacity-60 transition-smooth animate-pulse-glow" />
              <Avatar className="relative h-28 w-28 md:h-36 md:w-36 ring-2 ring-white/[0.08] ring-offset-4 ring-offset-background group-hover:scale-[1.02] transition-smooth">
                <AvatarImage src={user.avatar_url} alt={user.login} />
                <AvatarFallback className="text-3xl font-bold gradient-primary text-white">
                  {user.login[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground tracking-tight">
                {user.name || user.login}
              </h2>
              <p className="text-primary font-medium text-sm">@{user.login}</p>
            </div>
          </div>

          {user.bio && (
            <p className="text-sm text-muted-foreground/90 leading-relaxed text-center px-2 italic">
              "{user.bio}"
            </p>
          )}

          <div className="pt-2">
            <Button
              asChild
              className="w-full h-11 gradient-primary hover:opacity-90 transition-smooth shadow-glow rounded-xl gap-2 font-bold group"
            >
              <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                Follow <Users className="h-4 w-4 group-hover:rotate-12 transition-smooth" />
              </a>
            </Button>
          </div>

          {/* Social Stats Row */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="glass rounded-xl p-3 text-center border-white/[0.05] hover:bg-white/[0.08] transition-smooth">
              <p className="text-xl font-black text-foreground">
                {user.followers >= 1000 ? (user.followers / 1000).toFixed(1) + "k" : user.followers}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Followers</p>
            </div>
            <div className="glass rounded-xl p-3 text-center border-white/[0.05] hover:bg-white/[0.08] transition-smooth">
              <p className="text-xl font-black text-foreground">
                {user.following >= 1000 ? (user.following / 1000).toFixed(1) + "k" : user.following}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Following</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold text-center">Contact & Bio</h4>
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
              {/* Note: some users have twitter_username but GitHubUser interface needs update or check */}
              <DetailRow icon={Calendar} label={`Joined ${joinDate}`} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original full layout (modified to match aesthetic)
  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 gradient-border animate-fade-in-up">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
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
              <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
                {user.name || user.login}
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-base text-primary font-medium">@{user.login}</p>
                {user.public_repos > 50 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-500 border border-yellow-400/20 font-bold flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5 fill-current" /> POWER USER
                  </span>
                )}
              </div>
            </div>
            <Button
              asChild
              className="gradient-primary hover:opacity-90 transition-smooth shadow-glow rounded-xl gap-2 font-bold px-6"
            >
              <a href={user.html_url} target="_blank" rel="noopener noreferrer">
                View GitHub <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
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
              { icon: Calendar, label: `Joined ${joinDate}` },
            ].filter(d => d.label).map((detail, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground group">
                <detail.icon className="h-4 w-4 text-primary/70 group-hover:text-primary transition-smooth shrink-0" />
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

          {/* Social Stats */}
          <div className="flex items-center gap-8 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 group cursor-default">
              <Users className="h-5 w-5 text-primary/60 group-hover:text-primary transition-smooth" />
              <div>
                <p className="text-lg font-black text-foreground leading-none">
                  {user.followers.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-bold">Followers</p>
              </div>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <Users className="h-5 w-5 text-primary/60 group-hover:text-primary transition-smooth" />
              <div>
                <p className="text-lg font-black text-foreground leading-none">
                  {user.following.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-bold">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ icon: Icon, label, href }: { icon: any; label: string; href?: string }) => (
  <div className="glass rounded-xl px-3 py-2 flex items-center gap-3 border-white/[0.05] hover:bg-white/[0.08] transition-smooth group overflow-hidden">
    <Icon className="h-3.5 w-3.5 text-primary/60 group-hover:text-primary transition-smooth shrink-0" />
    {href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] text-muted-foreground group-hover:text-foreground transition-smooth truncate"
      >
        {label}
      </a>
    ) : (
      <span className="text-[11px] text-muted-foreground truncate">{label}</span>
    )}
  </div>
);
