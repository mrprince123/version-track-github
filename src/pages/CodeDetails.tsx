import { useEffect, useState } from "react";
import { githubApi } from "@/services/github";
import { useParams, useNavigate } from "react-router-dom";
import AnimatedBackground from "@/components/AnimatedBackground";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  FileCode2,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  FileText,
  Code2,
} from "lucide-react";

const CodeDetails = () => {
  const { owner, repo, "*": rest } = useParams<{
    owner: string;
    repo: string;
    "*": string;
  }>();

  const segments = (rest || "").split("/");
  const branch = segments.pop() || "main";
  const filePath = segments.join("/");

  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"code" | "preview">("code");
  const navigate = useNavigate();

  const pathParts = filePath?.split("/") || [];
  const fileName = pathParts[pathParts.length - 1] || filePath;
  const extension = fileName?.split(".").pop()?.toLowerCase() || "";
  const isMarkdown = extension === "md" || extension === "mdx";

  useEffect(() => {
    const fetchFile = async () => {
      try {
        setLoading(true);
        setError(null);
        const fileContent = await githubApi.getRepoFileContent(owner!, repo!, filePath!, branch);
        setContent(fileContent);
      } catch (err: any) {
        setError(err.message || "Failed to load file");
      } finally {
        setLoading(false);
      }
    };
    if (owner && repo && filePath) fetchFile();
  }, [owner, repo, filePath, branch]);

  // Auto-select preview mode for markdown files
  useEffect(() => {
    if (isMarkdown) setViewMode("preview");
  }, [isMarkdown]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = content.split("\n");

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] relative">
        <AnimatedBackground />
        <div className="relative z-10"><LoadingSpinner /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-73px)] relative">
        <AnimatedBackground />
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <FileCode2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg text-red-400">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] relative">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 space-y-5">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
        >
          <ArrowLeft className="w-4 h-4" /> Back to repository
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm flex-wrap">
          <button
            onClick={() => navigate(`/user/${owner}/${repo}/detail`)}
            className="text-primary hover:underline"
          >
            {repo}
          </button>
          {pathParts.map((part, i) => {
            const isLast = i === pathParts.length - 1;
            return (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span className={isLast ? "text-foreground font-medium" : "text-muted-foreground"}>
                  {part}
                </span>
              </span>
            );
          })}
        </div>

        {/* Code/Preview Card */}
        <div className="glass-card rounded-xl overflow-hidden gradient-border animate-fade-in-up">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02] flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm">
              <FileCode2 className="w-4 h-4 text-primary/70" />
              <span className="font-medium text-foreground">{fileName}</span>
              <span className="text-muted-foreground/50">·</span>
              <span className="text-xs text-muted-foreground/50">{lines.length} lines</span>
              {extension && (
                <>
                  <span className="text-muted-foreground/50">·</span>
                  <ExtBadge ext={extension} />
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* View mode toggle for markdown */}
              {isMarkdown && (
                <div className="flex gap-0.5 glass rounded-lg p-0.5 mr-1">
                  <button
                    onClick={() => setViewMode("code")}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-smooth ${
                      viewMode === "code" ? "bg-primary/20 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Code2 className="h-3 w-3" /> Code
                  </button>
                  <button
                    onClick={() => setViewMode("preview")}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-smooth ${
                      viewMode === "preview" ? "bg-primary/20 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <FileText className="h-3 w-3" /> Preview
                  </button>
                </div>
              )}

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg glass text-muted-foreground hover:text-primary transition-smooth"
              >
                {copied ? (
                  <><Check className="w-3.5 h-3.5 text-green-400" /> Copied</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy</>
                )}
              </button>
              <a
                href={`https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg glass text-muted-foreground hover:text-primary transition-smooth"
              >
                <ExternalLink className="w-3.5 h-3.5" /> GitHub
              </a>
            </div>
          </div>

          {/* Content area */}
          {isMarkdown && viewMode === "preview" ? (
            <div className="p-6 md:p-8 markdown-preview">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          ) : (
            <div className="overflow-x-auto code-viewer">
              <div className="p-4 min-w-0">
                {lines.map((line, i) => (
                  <div key={i} className="code-line">
                    <span className="code-line-number">{i + 1}</span>
                    <span className="code-line-content">{line || " "}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ExtBadge = ({ ext }: { ext: string }) => (
  <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-primary/10 text-primary uppercase">
    {ext}
  </span>
);

export default CodeDetails;
