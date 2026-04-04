import { Skeleton } from "@/components/ui/skeleton";

export const ActivityFeedSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-6 w-32" />
      </div>
      
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 relative">
            {/* Timeline line */}
            {i < 5 && (
              <div className="absolute left-[11px] top-7 bottom-[-24px] w-px bg-white/[0.05]" />
            )}
            
            <Skeleton className="h-[22px] w-[22px] rounded-full shrink-0 z-10" />
            
            <div className="flex-1 space-y-2 pb-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
