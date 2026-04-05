import { Skeleton } from "@/components/ui/skeleton";

interface RepoCardSkeletonProps {
  index?: number;
}

export const RepoCardSkeleton = ({ index = 0 }: RepoCardSkeletonProps) => {
  return (
    <div
      className="glass-card rounded-2xl p-6 relative overflow-hidden animate-fade-in-up border border-white/5"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="space-y-4">
        {/* Header Skeleton */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
            <Skeleton className="h-6 w-32 md:w-48" />
          </div>
          <Skeleton className="h-7 w-12 rounded-full shrink-0" />
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>

        {/* Footer Skeleton */}
        <div className="flex items-center gap-6 pt-4 border-t border-white/[0.05]">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-3 w-24 ml-auto hidden sm:block" />
        </div>
      </div>
    </div>
  );
};
