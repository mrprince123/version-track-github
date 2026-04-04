import { useState, useEffect } from "react";
import { AlertTriangle, Clock, X, RefreshCw } from "lucide-react";

interface RateLimitAlertProps {
  message: string;
  resetTime?: Date;
  onDismiss: () => void;
}

export const RateLimitAlert = ({ message, resetTime, onDismiss }: RateLimitAlertProps) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!resetTime) return;

    const update = () => {
      const diff = resetTime.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("now");
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins}m ${secs}s`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [resetTime]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] w-full max-w-sm animate-fade-in-up">
      <div className="glass-card rounded-xl border border-amber-500/30 overflow-hidden shadow-2xl">
        {/* Amber accent bar */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />

        <div className="p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-amber-300">API Rate Limit Reached</h3>
              <button
                onClick={onDismiss}
                className="p-1 rounded-md hover:bg-white/[0.05] text-muted-foreground hover:text-foreground transition-smooth shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>

            <div className="flex items-center gap-4 pt-1">
              {resetTime && timeLeft !== "now" && (
                <div className="flex items-center gap-1.5 text-xs text-amber-400/80">
                  <Clock className="h-3 w-3" />
                  <span>Resets in <span className="font-mono font-semibold">{timeLeft}</span></span>
                </div>
              )}
              {timeLeft === "now" && (
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-smooth"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Refresh page</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-2.5 border-t border-white/[0.05] bg-white/[0.01]">
          <p className="text-[10px] text-muted-foreground/60">
            💡 GitHub allows 60 requests/hour for unauthenticated users. Add a GitHub token to increase to 5,000/hour.
          </p>
        </div>
      </div>
    </div>
  );
};
