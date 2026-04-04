import { GitHubUser } from "@/types/github";
import { MapPin, Link as LinkIcon, Building, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  user: GitHubUser;
}

export const ProfileCard = ({ user }: ProfileCardProps) => {
  return (
    <Card className="p-6 gradient-card border-border shadow-card transition-smooth hover:shadow-glow">
      <div className="flex flex-col md:flex-row gap-6">
        <Avatar className="h-32 w-32 border-2 border-primary shadow-glow">
          <AvatarImage src={user.avatar_url} alt={user.login} />
          <AvatarFallback>{user.login[0].toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{user.name || user.login}</h2>
            <p className="text-lg text-muted-foreground">@{user.login}</p>
          </div>

          {user.bio && <p className="text-foreground leading-relaxed">{user.bio}</p>}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {user.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user.company && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>{user.company}</span>
              </div>
            )}
            {user.blog && (
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                <a
                  href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-smooth"
                >
                  {user.blog}
                </a>
              </div>
            )}
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-foreground font-semibold">{user.followers}</span>
              <span className="text-muted-foreground">Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-foreground font-semibold">{user.following}</span>
              <span className="text-muted-foreground">Following</span>
            </div>
          </div>

          <Button asChild className="gradient-primary hover:opacity-90 transition-smooth">
            <a href={user.html_url} target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
};
