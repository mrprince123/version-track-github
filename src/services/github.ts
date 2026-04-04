import { GitHubUser, GitHubRepo, LanguageStats, GitHubSearchResult, GitHubContent, GitHubBranch } from "@/types/github";

const GITHUB_API_BASE = "https://api.github.com";

// Custom error for rate limiting
export class RateLimitError extends Error {
  remaining: number;
  resetTime: Date;

  constructor(resetTimestamp: number) {
    const resetDate = new Date(resetTimestamp * 1000);
    const minutesUntilReset = Math.max(1, Math.ceil((resetDate.getTime() - Date.now()) / 60000));
    super(`GitHub API rate limit exceeded. Resets in ~${minutesUntilReset} minute${minutesUntilReset > 1 ? "s" : ""}.`);
    this.name = "RateLimitError";
    this.remaining = 0;
    this.resetTime = resetDate;
  }
}

// Helper: check response for rate limit and throw descriptive error
async function handleResponse<T>(response: Response, fallbackMsg: string): Promise<T> {
  if (response.ok) {
    return response.json();
  }

  // Check for rate limiting
  if (response.status === 403 || response.status === 429) {
    const resetHeader = response.headers.get("X-RateLimit-Reset");
    const remaining = response.headers.get("X-RateLimit-Remaining");

    if (remaining === "0" || response.status === 429) {
      const resetTimestamp = resetHeader ? parseInt(resetHeader, 10) : Math.floor(Date.now() / 1000) + 3600;
      throw new RateLimitError(resetTimestamp);
    }
  }

  if (response.status === 404) {
    throw new Error("Not found");
  }

  throw new Error(fallbackMsg);
}

// Safe fetch helper – returns null instead of throwing for non-critical requests
async function safeFetch<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, options);

    if (response.status === 403 || response.status === 429) {
      const remaining = response.headers.get("X-RateLimit-Remaining");
      const resetHeader = response.headers.get("X-RateLimit-Reset");
      if (remaining === "0" || response.status === 429) {
        const resetTimestamp = resetHeader ? parseInt(resetHeader, 10) : Math.floor(Date.now() / 1000) + 3600;
        throw new RateLimitError(resetTimestamp);
      }
    }

    if (!response.ok) return null;
    return response.json();
  } catch (err) {
    if (err instanceof RateLimitError) throw err;
    return null;
  }
}

export const githubApi = {
  async getUser(username: string): Promise<GitHubUser> {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);
    return handleResponse<GitHubUser>(response, "Failed to fetch user");
  },

  async getRepos(
    username: string,
    page = 1,
    perPage = 30
  ): Promise<GitHubRepo[]> {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=${perPage}&page=${page}`
    );
    return handleResponse<GitHubRepo[]>(response, "Failed to fetch repositories");
  },

  async searchRepos(
    query: string,
    language?: string,
    sort: string = "stars",
    page: number = 1,
    perPage: number = 20
  ): Promise<GitHubSearchResult> {
    let q = query;
    if (language && language !== "all") {
      q += `+language:${encodeURIComponent(language)}`;
    }
    const response = await fetch(
      `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(q)}&sort=${sort}&order=desc&per_page=${perPage}&page=${page}`
    );
    return handleResponse<GitHubSearchResult>(response, "Failed to search repositories");
  },

  async getLanguageStats(username: string): Promise<LanguageStats> {
    const repos = await this.getRepos(username, 1, 100);
    const stats: LanguageStats = {};

    repos.forEach((repo) => {
      if (repo.language) {
        stats[repo.language] = (stats[repo.language] || 0) + 1;
      }
    });

    return stats;
  },

  async getRepoFileContent(
    owner: string,
    repo: string,
    filePath: string,
    branch = "main"
  ): Promise<string> {
    const branches = [branch, branch === "main" ? "master" : "main"];
    
    for (const b of branches) {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${b}/${filePath}`;
      const response = await fetch(rawUrl);
      if (response.ok) {
        return response.text();
      }
    }

    throw new Error("File not found");
  },

  async getRepoContents(
    owner: string,
    repo: string,
    path: string = ""
  ): Promise<GitHubContent[]> {
    const url = path
      ? `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`
      : `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents`;

    const response = await fetch(url);
    const data = await handleResponse<GitHubContent | GitHubContent[]>(response, "Failed to fetch repository contents");
    return Array.isArray(data)
      ? data.sort((a: GitHubContent, b: GitHubContent) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === "dir" ? -1 : 1;
        })
      : [data];
  },

  async getRepoReadme(owner: string, repo: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`,
        { headers: { Accept: "application/vnd.github.v3.raw" } }
      );
      if (response.status === 403 || response.status === 429) {
        const remaining = response.headers.get("X-RateLimit-Remaining");
        const resetHeader = response.headers.get("X-RateLimit-Reset");
        if (remaining === "0" || response.status === 429) {
          const resetTimestamp = resetHeader ? parseInt(resetHeader, 10) : Math.floor(Date.now() / 1000) + 3600;
          throw new RateLimitError(resetTimestamp);
        }
      }
      if (!response.ok) return null;
      return response.text();
    } catch (err) {
      if (err instanceof RateLimitError) throw err;
      return null;
    }
  },

  async getBranches(owner: string, repo: string): Promise<GitHubBranch[]> {
    const data = await safeFetch<GitHubBranch[]>(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/branches?per_page=100`
    );
    return data || [];
  },

  async getUserStats(username: string) {
    const repos = await this.getRepos(username, 1, 100);
    const totalStars = repos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

    return {
      totalStars,
      totalForks,
      totalRepos: repos.length,
    };
  },

  async getUsersFollowers(username: string): Promise<GitHubUser[]> {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/followers`
    );
    return handleResponse<GitHubUser[]>(response, "Failed to fetch followers");
  },

  async getReposDetails(username: string, repoName: string) {
    const repoResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${username}/${repoName}`
    );
    const repoDetails = await handleResponse<any>(
      repoResponse,
      "Failed to fetch repository details"
    );

    // These are non-critical — use safeFetch so a rate limit on one
    // doesn't block the whole page, but DO propagate RateLimitError
    const [contents, contributors, languages] = await Promise.all([
      safeFetch<any[]>(`${GITHUB_API_BASE}/repos/${username}/${repoName}/contents`),
      safeFetch<any[]>(`${GITHUB_API_BASE}/repos/${username}/${repoName}/contributors`),
      safeFetch<Record<string, number>>(`${GITHUB_API_BASE}/repos/${username}/${repoName}/languages`),
    ]);

    const sortedContents = Array.isArray(contents)
      ? contents.sort((a: any, b: any) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === "dir" ? -1 : 1;
        })
      : [];

    return {
      ...repoDetails,
      contents: sortedContents,
      contributors: contributors || [],
      languages: languages || {},
    };
  },
};
