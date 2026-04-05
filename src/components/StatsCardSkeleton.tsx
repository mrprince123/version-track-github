import { Skeleton } from "@/components/ui/skeleton";

export const StatsCardSkeleton = () => {
  return (
    <div className="glass-card rounded-xl p-5 border border-white/5 space-y-2">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
      </div>
    </div>
  );
};
