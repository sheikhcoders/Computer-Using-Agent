import { cn } from "@/lib/utils";

/**
 * Skeleton loading component
 * MUST: Skeletons mirror final content to avoid layout shift
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse-subtle rounded-md bg-muted",
        // Reduced motion: no animation
        "motion-reduce:animate-none",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
