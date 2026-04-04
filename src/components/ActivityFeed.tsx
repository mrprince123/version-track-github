import { GitHubEvent } from "@/types/github";
import { GitCommit, GitPullRequest, CircleDot, Star, UserPlus, GitFork, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityFeedProps {
  events: GitHubEvent[];
}

export const ActivityFeed = ({ events }: ActivityFeedProps) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "PushEvent":
        return <GitCommit className="h-4 w-4 text-emerald-400" />;
      case "PullRequestEvent":
        return <GitPullRequest className="h-4 w-4 text-purple-400" />;
      case "IssuesEvent":
        return <CircleDot className="h-4 w-4 text-orange-400" />;
      case "WatchEvent":
        return <Star className="h-4 w-4 text-yellow-400" />;
      case "FollowEvent":
        return <UserPlus className="h-4 w-4 text-blue-400" />;
      case "ForkEvent":
        return <GitFork className="h-4 w-4 text-cyan-400" />;
      case "IssueCommentEvent":
        return <MessageSquare className="h-4 w-4 text-pink-400" />;
      default:
        return <CircleDot className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatEventLabel = (event: GitHubEvent) => {
    const type = event.type;
    const repoName = event.repo.name.split("/")[1];

    switch (type) {
      case "PushEvent":
        return (
          <span>
            Pushed to <span className="text-foreground font-medium">{repoName}</span>
          </span>
        );
      case "PullRequestEvent":
        return (
          <span>
            {event.payload.action} a PR in <span className="text-foreground font-medium">{repoName}</span>
          </span>
        );
      case "IssuesEvent":
        return (
          <span>
            {event.payload.action} an issue in <span className="text-foreground font-medium">{repoName}</span>
          </span>
        );
      case "WatchEvent":
        return (
          <span>
            Starred <span className="text-foreground font-medium">{repoName}</span>
          </span>
        );
      case "ForkEvent":
        return (
          <span>
            Forked <span className="text-foreground font-medium">{repoName}</span>
          </span>
        );
      case "IssueCommentEvent":
        return (
          <span>
            Commented on <span className="text-foreground font-medium">{repoName}</span>
          </span>
        );
      default:
        return <span>Activity in <span className="text-foreground font-medium">{repoName}</span></span>;
    }
  };

  if (events.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center border-white/[0.05]">
        <p className="text-muted-foreground">No recent public activity found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div
          key={event.id}
          className="glass rounded-xl p-4 flex items-start gap-4 border-white/[0.05] hover:bg-white/[0.02] transition-smooth group animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="mt-1 p-2 rounded-lg bg-white/[0.03] group-hover:bg-white/[0.08] transition-smooth">
            {getEventIcon(event.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <p className="text-sm text-muted-foreground">
                {formatEventLabel(event)}
              </p>
              <span className="text-[10px] text-muted-foreground/50 whitespace-nowrap">
                {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
              </span>
            </div>
            {event.payload.commits && event.payload.commits.length > 0 && (
              <div className="mt-2 pl-3 border-l-2 border-white/[0.06] space-y-1">
                {event.payload.commits.slice(0, 2).map((commit) => (
                  <p key={commit.sha} className="text-xs text-muted-foreground/80 truncate font-mono">
                    {commit.message}
                  </p>
                ))}
              </div>
            )}
            {(event.payload.issue || event.payload.pull_request) && (
              <p className="mt-1 text-xs text-primary/80 truncate">
                #{(event.payload.issue || event.payload.pull_request)?.number} {(event.payload.issue || event.payload.pull_request)?.title}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
