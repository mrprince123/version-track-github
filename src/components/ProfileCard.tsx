import { GitHubUser } from "@/types/github";
import { MapPin, Link as LinkIcon, Building, Users, Calendar, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  user: GitHubUser;
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 gradient-border animate-fade-in-up">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Avatar */}
        <div className="relative shrink-0 self-center md:self-start">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/60 to-blue-500/40 blur-sm animate-pulse-glow" />
          <Avatar className="relative h-28 w-28 md:h-32 md:w-32 ring-2 ring-primary/30 ring-offset-2 ring-offset-background">
            <AvatarImage src={user.avatar_url} alt={user.login} />
            <AvatarFallback className="text-3xl font-bold gradient-primary text-white">
              {user.login[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {user.name || user.login}
            </h2>
            <p className="text-base text-muted-foreground">@{user.login}</p>
          </div>

          {user.bio && (
            <p className="text-foreground/80 leading-relaxed max-w-xl">{user.bio}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {user.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary/70" />
                <span>{user.location}</span>
              </div>
            )}
            {user.company && (
              <div className="flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-primary/70" />
                <span>{user.company}</span>
              </div>
            )}
            {user.blog && (
              <div className="flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5 text-primary/70" />
                <a
                  href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-smooth truncate max-w-[200px]"
                >
                  {user.blog}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary/70" />
              <span>Joined {joinDate}</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-6 pt-1">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-foreground font-semibold">{user.followers.toLocaleString()}</span>
              <span className="text-muted-foreground text-sm">Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-foreground font-semibold">{user.following.toLocaleString()}</span>
              <span className="text-muted-foreground text-sm">Following</span>
            </div>
          </div>

          <Button
            asChild
            className="gradient-primary hover:opacity-90 transition-smooth shadow-glow rounded-xl gap-2"
          >
            <a href={user.html_url} target="_blank" rel="noopener noreferrer">
              View on GitHub <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};
