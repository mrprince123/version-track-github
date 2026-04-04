import { Github } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative">
        {/* Orbital dots */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" style={{ animation: 'orbital 1.5s linear infinite' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-blue-400" style={{ animation: 'orbital 1.5s linear infinite 0.5s' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-purple-300" style={{ animation: 'orbital 1.5s linear infinite 1s' }} />
        </div>
        
        {/* Center icon */}
        <div className="p-3 glass rounded-full animate-pulse-glow">
          <Github className="h-8 w-8 text-primary" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
};
