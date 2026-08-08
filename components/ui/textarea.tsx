import * as React from "react";
import { cn } from "@/lib/utils";

/** Champ de texte multiligne (convention shadcn/ui). */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentPropsWithoutRef<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-sage-200 bg-white/70 px-5 py-4 text-base text-ink",
        "placeholder:text-ink-soft/60 shadow-inner outline-none backdrop-blur-sm",
        "transition-all duration-300 focus:border-sage-400 focus:bg-white",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
