import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { githubApi } from "@/services/github";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Circle, Users, FileCode2, Loader2 } from "lucide-react";

export const RepoDetails = () => {
  const { username, repoName } = useParams<{
    username: string;
    repoName: string;
  }>();

  const {
    data: repoDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["repoDetails", username, repoName],
    queryFn: () => githubApi.getReposDetails(username!, repoName!),
    enabled: !!username && !!repoName,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (isError || !repoDetails) {
    return (
      <div className="text-center text-muted-foreground mt-10">
        <p>Failed to load repository details. Please try again later.</p>
      </div>
    );
  }

  const {
    name,
    description,
    stargazers_count,
    forks_count,
    open_issues_count,
    watchers_count,
    languages,
    contributors,
    contents,
    html_url,
  } = repoDetails;

  console.log('Repo name is', repoName);

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-foreground">{name}</h1>
        {description && (
          <p className="text-muted-foreground max-w-3xl">{description}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-primary" />
            <span>{stargazers_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4 text-primary" />
            <span>{forks_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <span>{contributors?.length || 0} contributors</span>
          </div>
          <div className="flex items-center gap-1">
            <FileCode2 className="h-4 w-4 text-primary" />
            <span>{Object.keys(languages || {}).length} languages</span>
          </div>
        </div>

        <a
          href={html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-sm text-primary hover:underline"
        >
          View on GitHub →
        </a>
      </div>

      {/* Languages Section */}
      {languages && Object.keys(languages).length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Languages Used</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(languages).map(([lang, lines]) => (
              <Badge
                key={lang}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <Circle className="h-2 w-2 fill-primary" />
                {lang}{" "}
                <span className="text-xs text-muted-foreground ml-1">
                  ({lines})
                </span>
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Contributors Section */}
      {contributors && contributors.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Top Contributors</h2>
          <div className="flex flex-wrap gap-4">
            {contributors.slice(0, 8).map((user: any) => (
              <a
                key={user.id}
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center w-20 hover:opacity-80 transition"
              >
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-12 h-12 rounded-full shadow-md"
                />
                <span className="text-xs text-center mt-1 text-muted-foreground">
                  {user.login}
                </span>
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* File Structure */}
      {contents && contents.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Repository Files</h2>
          <ul className="divide-y divide-border">
            {contents.map((item: any) => (
              <li key={item.sha}>
                <Link to={`/code/${username}/${repoName}/${item.path}/master`} className="py-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="h-4 w-4 text-muted-foreground" />
                    <span>{item.name}</span>
                  </div>
                  <Badge variant="outline">{item.type}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
