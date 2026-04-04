import { GitHubUser, GitHubRepo, LanguageStats } from "@/types/github";

const GITHUB_API_BASE = "https://api.github.com";

export const githubApi = {
  async getUser(username: string): Promise<GitHubUser> {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);
    if (!response.ok) {
      throw new Error(
        response.status === 404 ? "User not found" : "Failed to fetch user"
      );
    }
    return response.json();
  },

  async getRepos(
    username: string,
    page = 1,
    perPage = 30
  ): Promise<GitHubRepo[]> {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=${perPage}&page=${page}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
    }
    return response.json();
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
    branch = "master"
  ): Promise<string> {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;

    const response = await fetch(rawUrl);

    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? "File not found"
          : "Failed to fetch file content"
      );
    }

    return response.text();
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
    if (!response.ok) {
      throw new Error("Failed to fetch followers");
    }
    return response.json();
  },

  async getReposDetails(username: string, repoName: string) {
    // Fetch repository metadata (main repo details)
    const repoResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${username}/${repoName}`
    );
    if (!repoResponse.ok) {
      throw new Error(
        repoResponse.status === 404
          ? "Repository not found"
          : "Failed to fetch repository details"
      );
    }

    const repoDetails = await repoResponse.json();

    // Optionally fetch repository contents (root directory files)
    const contentsResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${username}/${repoName}/contents`
    );
    if (!contentsResponse.ok) {
      throw new Error("Failed to fetch repository contents");
    }

    const contents = await contentsResponse.json();

    // Optionally fetch contributors
    const contributorsResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${username}/${repoName}/contributors`
    );
    const contributors = contributorsResponse.ok
      ? await contributorsResponse.json()
      : [];

    // Optionally fetch languages used in the repository
    const languagesResponse = await fetch(
      `${GITHUB_API_BASE}/repos/${username}/${repoName}/languages`
    );
    const languages = languagesResponse.ok
      ? await languagesResponse.json()
      : {};

    // Combine everything into one structured object
    return {
      ...repoDetails,
      contents,
      contributors,
      languages,
    };
  },
};
