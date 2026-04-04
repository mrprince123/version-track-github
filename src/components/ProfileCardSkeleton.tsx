import { Skeleton } from "@/components/ui/skeleton";

export const ProfileCardSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/5 space-y-6">
      {/* Avatar & Name Skeleton */}
      <div className="flex flex-col items-center text-center space-y-4">
        <Skeleton className="h-28 w-28 md:h-36 md:w-36 rounded-full" />
        <div className="space-y-2 flex flex-col items-center">
          <Skeleton className="h-8 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        </div>
      </div>

      {/* Bio Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mx-auto" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-11 rounded-xl" />
      </div>

      {/* Info List Skeleton */}
      <div className="space-y-4 pt-4 border-t border-white/[0.05]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full shrink-0" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
