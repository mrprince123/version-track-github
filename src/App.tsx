import { useState, useCallback, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserDetails from "./pages/UserDetails";
import Repositories from "./pages/Repositories";
import Compare from "./pages/Compare";
import RepoSearch from "./pages/RepoSearch";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { RepoDetails } from "./pages/RepoDetails";
import CodeDetails from "./pages/CodeDetails";
import { RateLimitAlert } from "./components/RateLimitAlert";
import { RateLimitError } from "./services/github";

const App = () => {
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    message: string;
    resetTime?: Date;
  } | null>(null);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof RateLimitError) {
      setRateLimitInfo({
        message: error.message,
        resetTime: error.resetTime,
      });
    }
  }, []);

  // Create QueryClient once with error handlers
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({ onError: handleError }),
        mutationCache: new MutationCache({ onError: handleError }),
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              // Don't retry on rate limit errors
              if (error instanceof RateLimitError) return false;
              return failureCount < 2;
            },
          },
        },
      })
  );

  // Auto-dismiss after reset time passes
  useEffect(() => {
    if (!rateLimitInfo?.resetTime) return;
    const diff = rateLimitInfo.resetTime.getTime() - Date.now();
    if (diff <= 0) return;
    const timeout = setTimeout(() => {
      setRateLimitInfo(null);
    }, diff + 2000); // small buffer
    return () => clearTimeout(timeout);
  }, [rateLimitInfo]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {rateLimitInfo && (
          <RateLimitAlert
            message={rateLimitInfo.message}
            resetTime={rateLimitInfo.resetTime}
            onDismiss={() => setRateLimitInfo(null)}
          />
        )}

        <div className="flex flex-col min-h-screen">
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<RepoSearch />} />
              <Route path="/user/:username" element={<UserDetails />} />
              <Route path="/user/:username/repos" element={<Repositories />} />
              <Route path="/user/:username/:repoName/detail" element={<RepoDetails />} />
              <Route path="/code/:owner/:repo/*" element={<CodeDetails />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
