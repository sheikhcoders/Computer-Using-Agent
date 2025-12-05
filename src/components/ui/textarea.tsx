import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error message to display */
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, id, ...props }, ref) => {
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div className="relative w-full">
        <textarea
          id={id}
          className={cn(
            // Base styles
            "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground",
            // Focus styles - MUST: visible focus rings
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            // Disabled styles
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Error styles
            error && "border-destructive focus-visible:ring-destructive",
            // MUST: Font size ≥16px on mobile to prevent zoom
            "text-base md:text-sm",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={errorId}
          // NEVER: Block paste
          onPaste={(e) => props.onPaste?.(e)}
          {...props}
        />
        {/* MUST: Errors inline next to fields */}
        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
