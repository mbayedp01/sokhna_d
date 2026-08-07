"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(175,198,255,0.15)]",
        accent:
          "bg-accent/15 text-white border border-accent/30 hover:bg-accent/25 hover:shadow-[0_0_40px_rgba(175,198,255,0.2)]",
        ghost:
          "text-primary/70 hover:text-primary hover:bg-white/5",
        glass:
          "glass text-primary hover:bg-white/12",
      },
      size: {
        sm: "h-9 px-5 text-sm",
        md: "h-11 px-7 text-base",
        lg: "h-13 px-9 text-lg",
        xl: "h-16 px-12 text-xl tracking-wide",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
