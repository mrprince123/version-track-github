import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { githubApi } from "@/services/github";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import AnimatedBackground from "@/components/AnimatedBackground";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Star,
  GitFork,
  Users,
  Folder,
  File,
  ArrowLeft,
  ExternalLink,
  Eye,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  GitBranch,
  Download,
  Copy,
  Check,
  BookOpen,
  Archive,
  Terminal,
} from "lucide-react";

// Language colors
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  Java: "#b07219", Go: "#00ADD8", Rust: "#dea584", Ruby: "#701516",
  "C++": "#f34b7d", C: "#555555", "C#": "#178600", PHP: "#4F5D95",
  Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB", HTML: "#e34c26",
  CSS: "#563d7c", Shell: "#89e051", Vue: "#41b883",
};

export const RepoDetails = () => {
  const { username, repoName } = useParams<{ username: string; repoName: string }>();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState("");
  const [showBranches, setShowBranches] = useState(false);
  const [showCloneMenu, setShowCloneMenu] = useState(false);
  const [cloneProtocol, setCloneProtocol] = useState<"https" | "ssh">("https");
  const [copiedClone, setCopiedClone] = useState(false);

  const { data: repoDetails, isLoading, isError } = useQuery({
    queryKey: ["repoDetails", username, repoName],
    queryFn: () => githubApi.getReposDetails(username!, repoName!),
    enabled: !!username && !!repoName,
  });

  const { data: currentContents, isLoading: contentsLoading } = useQuery({
    queryKey: ["repoContents", username, repoName, currentPath],
    queryFn: () => githubApi.getRepoContents(username!, repoName!, currentPath),
    enabled: !!username && !!repoName && currentPath !== "",
  });

  // Fetch branches
  const { data: branches } = useQuery({
    queryKey: ["branches", username, repoName],
    queryFn: () => githubApi.getBranches(username!, repoName!),
    enabled: !!username && !!repoName,
  });

  // Fetch README
  const { data: readme } = useQuery({
    queryKey: ["readme", username, repoName],
    queryFn: () => githubApi.getRepoReadme(username!, repoName!),
    enabled: !!username && !!repoName,
  });

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-73px)] relative">
        <AnimatedBackground />
        <div className="relative z-10"><LoadingSpinner /></div>
      </div>
    );
  }

  if (isError || !repoDetails) {
    return (
      <div className="min-h-[calc(100vh-73px)] relative">
        <AnimatedBackground />
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Failed to load repository details.</p>
        </div>
      </div>
    );
  }

  const {
    name, description, stargazers_count, forks_count, open_issues_count,
    watchers_count, languages, contributors, contents, html_url, default_branch,
  } = repoDetails;

  const branch = default_branch || "main";
  const langTotal = languages
    ? Object.values(languages as Record<string, number>).reduce((a: number, b: number) => a + b, 0)
    : 0;
  const displayContents = currentPath ? currentContents : contents;
  const pathSegments = currentPath ? currentPath.split("/") : [];

  // Clone URLs
  const httpsUrl = `https://github.com/${username}/${repoName}.git`;
  const sshUrl = `git@github.com:${username}/${repoName}.git`;
  const zipUrl = `https://github.com/${username}/${repoName}/archive/refs/heads/${branch}.zip`;

  const handleCopyClone = async () => {
    const url = cloneProtocol === "https" ? httpsUrl : sshUrl;
    await navigator.clipboard.writeText(url);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const handleFileClick = (item: any) => {
    if (item.type === "dir") {
      setCurrentPath(item.path);
    } else {
      navigate(`/code/${username}/${repoName}/${item.path}/${branch}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] relative">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate(`/user/${username}`)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {username}
        </button>

        {/* Repository Header */}
        <div className="glass-card rounded-xl p-5 md:p-6 gradient-border animate-fade-in-up">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">{name}</h1>
              <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground shrink-0">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-yellow-400" />
                  {stargazers_count?.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="h-3.5 w-3.5 text-blue-400" />
                  {forks_count?.toLocaleString()}
                </span>
              </div>
            </div>
            <a
              href={html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm text-primary hover:bg-white/[0.05] transition-smooth shrink-0"
            >
              View on GitHub <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Branches + Clone/Download Row */}
        <div className="relative z-20 flex flex-wrap gap-3 animate-fade-in-up animation-delay-100">
          {/* Click-away overlay for dropdowns — inside the same stacking context */}
          {(showBranches || showCloneMenu) && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => { setShowBranches(false); setShowCloneMenu(false); }}
            />
          )}

          {/* Branch Selector */}
          <div className="relative z-20">
            <button
              onClick={() => { setShowBranches(!showBranches); setShowCloneMenu(false); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm text-foreground hover:bg-white/[0.05] transition-smooth"
            >
              <GitBranch className="h-4 w-4 text-primary" />
              <span className="font-medium">{branch}</span>
              {branches && <span className="text-muted-foreground/60">· {branches.length} branches</span>}
              <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-smooth ${showBranches ? "rotate-180" : ""}`} />
            </button>

            {showBranches && branches && branches.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-64 max-h-72 overflow-y-auto glass-opaque rounded-xl border border-white/[0.08] shadow-2xl z-30">
                <div className="px-3 py-2 border-b border-white/[0.06] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Branches ({branches.length})
                </div>
                {branches.map((b) => (
                  <button
                    key={b.name}
                    onClick={(e) => { e.stopPropagation(); setShowBranches(false); }}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-white/[0.04] transition-smooth ${
                      b.name === branch ? "text-primary bg-primary/5" : "text-foreground"
                    }`}
                  >
                    <GitBranch className="h-3 w-3 shrink-0" />
                    <span className="truncate">{b.name}</span>
                    {b.name === branch && (
                      <Check className="h-3 w-3 ml-auto text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clone/Download Button */}
          <div className="relative z-20 ml-auto">
            <button
              onClick={() => { setShowCloneMenu(!showCloneMenu); setShowBranches(false); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-smooth shadow-glow"
            >
              <Download className="h-4 w-4" />
              Code
              <ChevronDown className={`h-3.5 w-3.5 transition-smooth ${showCloneMenu ? "rotate-180" : ""}`} />
            </button>

            {showCloneMenu && (
              <div
                className="absolute top-full right-0 mt-2 w-80 glass-opaque rounded-xl border border-white/[0.08] shadow-2xl z-30 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Clone section */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Terminal className="h-4 w-4 text-primary" />
                    Clone
                  </div>

                  {/* Protocol toggle */}
                  <div className="flex gap-0.5 glass rounded-lg p-0.5">
                    <button
                      onClick={() => setCloneProtocol("https")}
                      className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-smooth ${
                        cloneProtocol === "https" ? "bg-primary/20 text-primary" : "text-muted-foreground"
                      }`}
                    >
                      HTTPS
                    </button>
                    <button
                      onClick={() => setCloneProtocol("ssh")}
                      className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-smooth ${
                        cloneProtocol === "ssh" ? "bg-primary/20 text-primary" : "text-muted-foreground"
                      }`}
                    >
                      SSH
                    </button>
                  </div>

                  {/* Clone URL */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={cloneProtocol === "https" ? httpsUrl : sshUrl}
                      className="flex-1 h-9 px-3 text-xs rounded-lg glass bg-black/20 text-foreground/80 font-mono focus:outline-none border border-white/[0.06] truncate"
                    />
                    <button
                      onClick={handleCopyClone}
                      className="h-9 w-9 flex items-center justify-center rounded-lg glass text-muted-foreground hover:text-primary transition-smooth shrink-0"
                      title="Copy clone URL"
                    >
                      {copiedClone ? (
                        <Check className="h-3.5 w-3.5 text-green-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Download section */}
                <div className="border-t border-white/[0.06] p-3 space-y-1">
                  <a
                    href={zipUrl}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-white/[0.04] transition-smooth"
                    download
                  >
                    <Archive className="h-4 w-4 text-green-400" />
                    <div>
                      <div className="font-medium">Download ZIP</div>
                      <div className="text-xs text-muted-foreground">Source code ({branch})</div>
                    </div>
                  </a>
                  <a
                    href={`https://github.com/${username}/${repoName}/archive/refs/heads/${branch}.tar.gz`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-white/[0.04] transition-smooth"
                    download
                  >
                    <Archive className="h-4 w-4 text-blue-400" />
                    <div>
                      <div className="font-medium">Download TAR.GZ</div>
                      <div className="text-xs text-muted-foreground">Source code ({branch})</div>
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== MAIN 2-COLUMN LAYOUT ===== */}
        <div className="grid lg:grid-cols-[1fr,340px] gap-6 animate-fade-in-up animation-delay-200">

          {/* ===== LEFT COLUMN: File Tree (70%) ===== */}
          <div className="min-w-0">
            {displayContents && displayContents.length > 0 && (
              <div className="glass-card rounded-xl overflow-hidden gradient-border">
                {/* Breadcrumb */}
                <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-1 text-sm flex-wrap">
                  <button
                    onClick={() => setCurrentPath("")}
                    className={`hover:text-primary transition-smooth ${!currentPath ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  >
                    {repoName}
                  </button>
                  {pathSegments.map((seg, i) => {
                    const fullPath = pathSegments.slice(0, i + 1).join("/");
                    const isLast = i === pathSegments.length - 1;
                    return (
                      <span key={fullPath} className="flex items-center gap-1">
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                        <button
                          onClick={() => setCurrentPath(fullPath)}
                          className={`hover:text-primary transition-smooth ${isLast ? "text-foreground font-medium" : "text-muted-foreground"}`}
                        >
                          {seg}
                        </button>
                      </span>
                    );
                  })}
                </div>

                {/* File list */}
                {contentsLoading ? (
                  <div className="p-8"><LoadingSpinner /></div>
                ) : (
                  <ul>
                    {currentPath && (
                      <li>
                        <button
                          onClick={() => {
                            const parent = currentPath.split("/").slice(0, -1).join("/");
                            setCurrentPath(parent);
                          }}
                          className="w-full px-5 py-2.5 flex items-center gap-3 text-sm text-muted-foreground hover:bg-white/[0.03] transition-smooth border-b border-white/[0.04]"
                        >
                          <Folder className="h-4 w-4 text-blue-400/70" />
                          <span>..</span>
                        </button>
                      </li>
                    )}
                    {(displayContents || []).map((item: any) => (
                      <li key={item.sha}>
                        <button
                          onClick={() => handleFileClick(item)}
                          className="w-full px-5 py-2.5 flex items-center justify-between text-sm hover:bg-white/[0.03] transition-smooth border-b border-white/[0.04] last:border-b-0 group"
                        >
                          <div className="flex items-center gap-3">
                            {item.type === "dir" ? (
                              <Folder className="h-4 w-4 text-blue-400/70" />
                            ) : (
                              <File className="h-4 w-4 text-muted-foreground/70" />
                            )}
                            <span className="text-foreground group-hover:text-primary transition-smooth">
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.type === "dir" ? (
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                            ) : (
                              <span className="text-xs text-muted-foreground/40">
                                {item.size > 1024 ? `${(item.size / 1024).toFixed(1)} KB` : `${item.size} B`}
                              </span>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* ===== RIGHT COLUMN: Sidebar (30%) ===== */}
          <div className="space-y-5">
            {/* About */}
            <div className="glass-card rounded-xl p-5 gradient-border space-y-4">
              <h2 className="text-base font-semibold text-foreground">About</h2>
              {description ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              ) : (
                <p className="text-sm text-muted-foreground/50 italic">No description provided.</p>
              )}

              {/* Quick stats */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-foreground font-medium">{stargazers_count?.toLocaleString()}</span>
                  <span>stars</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <GitFork className="h-4 w-4 text-blue-400" />
                  <span className="text-foreground font-medium">{forks_count?.toLocaleString()}</span>
                  <span>forks</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4 text-green-400" />
                  <span className="text-foreground font-medium">{watchers_count?.toLocaleString()}</span>
                  <span>watching</span>
                </div>
              </div>

              {/* External link */}
              <a
                href={html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                View on GitHub <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Languages */}
            {languages && langTotal > 0 && (
              <div className="glass-card rounded-xl p-5 gradient-border space-y-3">
                <h2 className="text-base font-semibold text-foreground">Languages</h2>
                <div className="flex rounded-full overflow-hidden h-2">
                  {Object.entries(languages as Record<string, number>).map(([lang, bytes]) => (
                    <div
                      key={lang}
                      style={{ width: `${(bytes / langTotal) * 100}%`, backgroundColor: LANGUAGE_COLORS[lang] || "#a78bfa" }}
                      title={`${lang}: ${((bytes / langTotal) * 100).toFixed(1)}%`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                  {Object.entries(languages as Record<string, number>).map(([lang, bytes]) => (
                    <div key={lang} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[lang] || "#a78bfa" }} />
                      <span className="text-foreground font-medium">{lang}</span>
                      <span>{((bytes / langTotal) * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contributors */}
            {contributors && contributors.length > 0 && (
              <div className="glass-card rounded-xl p-5 gradient-border space-y-4">
                <h2 className="text-base font-semibold text-foreground">
                  Contributors
                  <span className="ml-2 text-xs text-muted-foreground font-normal">({contributors.length})</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {contributors.slice(0, 12).map((contrib: any) => (
                    <a
                      key={contrib.id}
                      href={contrib.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={contrib.login}
                      className="group"
                    >
                      <img
                        src={contrib.avatar_url}
                        alt={contrib.login}
                        className="w-9 h-9 rounded-full ring-1 ring-white/10 group-hover:ring-primary/50 transition-smooth"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== FULL-WIDTH README ===== */}
        {readme && (
          <div className="glass-card rounded-xl overflow-hidden gradient-border animate-fade-in-up">
            <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">README.md</span>
            </div>
            <div className="p-6 md:p-8 markdown-preview">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>


    </div>
  );
};
