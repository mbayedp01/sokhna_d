import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-2xl glass px-5 py-4 text-primary placeholder:text-dim/60 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 resize-none transition-colors",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
