import { GitHubOrg } from "@/types/github";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Building2 } from "lucide-react";

interface OrganizationListProps {
  organizations: GitHubOrg[];
}

export const OrganizationList = ({ organizations }: OrganizationListProps) => {
  if (organizations.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center border-white/[0.05]">
        <Building2 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground">No public organization memberships found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {organizations.map((org) => (
        <a
          key={org.id}
          href={`https://github.com/${org.login}`}
          target="_blank"
          rel="noopener noreferrer"
          className="glass rounded-xl p-4 flex items-center gap-3 border-white/[0.05] hover:bg-white/[0.04] transition-smooth group animate-fade-in-up"
        >
          <Avatar className="h-12 w-12 rounded-lg border border-white/[0.1]">
            <AvatarImage src={org.avatar_url} alt={org.login} />
            <AvatarFallback>{org.login[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-smooth truncate">
              {org.login}
            </h3>
            {org.description && (
              <p className="text-[10px] text-muted-foreground/70 line-clamp-1 mt-0.5">
                {org.description}
              </p>
            )}
          </div>
          <ExternalLink className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary transition-smooth shrink-0" />
        </a>
      ))}
    </div>
  );
};
