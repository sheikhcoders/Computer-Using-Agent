import { Skeleton } from "@/components/ui/skeleton";

/**
 * Message loading skeleton
 * MUST: Skeletons mirror final content to avoid layout shift
 */
export function MessageSkeleton() {
  return (
    <div className="flex gap-3" aria-busy="true" aria-label="Loading message">
      {/* Avatar skeleton */}
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      
      {/* Message content skeleton */}
      <div className="flex max-w-[85%] flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
