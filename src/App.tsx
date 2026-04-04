import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UserDetails from "./pages/UserDetails";
import Repositories from "./pages/Repositories";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { RepoDetails } from "./pages/RepoDetails";
import CodeDetails from "./pages/CodeDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="flex flex-col min-h-screen">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/:username" element={<UserDetails />} />
            <Route path="/user/:username/repos" element={<Repositories />} />
            <Route path="/user/:username/:repoName/detail" element={<RepoDetails />} />
            <Route path="/code/:owner/:repo/:filePath/:branch" element={<CodeDetails />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
