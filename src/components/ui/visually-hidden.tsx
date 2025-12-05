"use client";

import * as React from "react";
import * as VisuallyHiddenPrimitive from "@radix-ui/react-visually-hidden";

/**
 * Visually hidden component for screen reader only content
 * MUST: Don't ship the schema—visuals may omit labels but accessible names still exist
 */
const VisuallyHidden = React.forwardRef<
  React.ElementRef<typeof VisuallyHiddenPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof VisuallyHiddenPrimitive.Root>
>(({ ...props }, ref) => (
  <VisuallyHiddenPrimitive.Root ref={ref} {...props} />
));
VisuallyHidden.displayName = "VisuallyHidden";

export { VisuallyHidden };
