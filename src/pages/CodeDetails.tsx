import { useEffect, useState } from "react";
import { githubApi } from "@/services/github";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, FileCode2, Copy } from "lucide-react";

const CodeDetails = () => {
  const { owner, repo, filePath, branch } = useParams<{
    owner: string;
    repo: string;
    filePath: string;
    branch: string;
  }>();

  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const fileContent = await githubApi.getRepoFileContent(
          owner!,
          repo!,
          filePath!
        );
        setContent(fileContent);
      } catch (err: any) {
        setError(err.message || "Failed to load file");
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, []);

  const handleCopy = async () => {
    console.log('Copy is working');
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to repository
      </button>

      {/* Code Card */}
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{filePath}</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* Code */}
        <pre className="overflow-x-auto p-4 text-sm bg-neutral-900 text-green-400 leading-relaxed">
          {content}
        </pre>
      </Card>
    </div>
  );
};

export default CodeDetails;
