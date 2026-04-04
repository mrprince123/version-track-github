# GitHub Repo Analyzer

A **React + TypeScript** app that lets users explore GitHub profiles and repositories. 

- Displays user info, repository stats, and programming language usage with interactive charts.  
- Allows users to compare two GitHub profiles side-by-side.  
- Built with **GitHub REST API**, **React**, **TypeScript**, and **Chart.js/Recharts**.


## WorkFlow

1. **First** – Basic User Search  
   - Fetch user details using GitHub API

2. **Second** – Repo Analysis  
   - Fetch all repositories for the user  
   - Analyze stars, forks, and languages

3. **Third** – User Comparison  
   - Two input fields to compare two users  
   - Compare followers, repos, stars, and top languages


## GitHub API Endpoints

**Base URL:** `https://api.github.com`

1. **User info**         - `BASEURL/users/:username`
2. **Repositories**      - `BASEURL/users/:username/repos`
3. **Languages**         - `BASEURL/repos/:owner/:repo/languages`
4. **Followers**         - `BASEURL/users/:username/followers`
5. **Following**         - `BASEURL/users/:username/following`
6. **Starred Repos**     - `BASEURL/users/:username/starred`
7. **Organizations**     - `BASEURL/users/:username/orgs`
8. **Contributors**      - `BASEURL/repos/:owner/:repo/contributors`
9. **Commits**           - `BASEURL/repos/:owner/:repo/commits`
10. **Issues**           - `BASEURL/repos/:owner/:repo/issues`
11. **Pull Requests**    - `BASEURL/repos/:owner/:repo/pulls`
12. **Public Events**    - `BASEURL/users/:username/events/public`
13. **Gists**            - `BASEURL/users/:username/gists`
14. **Search Users**     - `BASEURL/search/users?q=:query`
15. **Search Repositories** - `BASEURL/search/repositories?q=:query`


## **Folder Structure**
### api/
- `users.ts`        → User-related API calls (info, followers, following, starred, orgs, events, gists)
- `repos.ts`        → Repository-related API calls (repos, languages, contributors, commits, issues, pull requests)
- `search.ts`       → Search API calls (search users, search repositories)

### components/
- `UserCard.tsx`        → Displays basic user info
- `RepoList.tsx`        → Lists user repositories
- `LanguageChart.tsx`   → Shows chart of languages
- `StatsOverview.tsx`   → Summary stats (stars, forks, top repos)
- `ComparePanel.tsx`    → Compare two users side-by-side

### pages/
- `Home.tsx`        → Main search + display page
- `Compare.tsx`     → Compare two users page (optional)

### types/
- `users.ts`        → TS interfaces for user API data
- `repos.ts`        → TS interfaces for repository API data
- `search.ts`       → TS interfaces for search API responses

### utils/
- `helpers.ts`      → Data aggregation, formatting, or helper functions

### Root files
- `.env`            → Store API base URL or personal access token
- `App.tsx`         → App routes + layout
- `main.tsx`        → App entry point
- `vite.config.ts`  → Vite configuration


Hey, I want you to create a website, this should have only dark mode. Should look very professional and minimilist. this is the description of this website - A React + TypeScript app that lets users explore GitHub profiles and repositories. 
- Displays user info, repository stats, and programming language usage with interactive charts.
- Allows users to compare two GitHub profiles side-by-side.

now I want you to add one searchbar on the home to search github username, after search it should naviate to another page with user detailed information which is fetched from github. And there will be page to compare the details of two users where add two input fields to two usersname to compare. Another page to show all the repository of the secififc users with load more feature. make it very professional. 