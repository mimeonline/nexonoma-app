import { cn } from "@/lib/utils";
import * as React from "react";

/* --- 1. Main Container --- */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glow" | "interactive" | "panel";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        // Base Styles
        "rounded-2xl border border-white/5 bg-nexo-card shadow-card transition-all duration-300",

        // Variant: Default
        variant === "default" && "hover:border-white/10",

        // Variant: Glow (Features)
        variant === "glow" && "hover:border-nexo-ocean/30 hover:shadow-[0_0_20px_-5px_rgba(56,189,248,0.15)]",

        // Variant: Interactive (Nav Cards)
        variant === "interactive" && "group hover:-translate-y-1 hover:border-nexo-ocean/40 hover:bg-[#151e32] cursor-pointer",

        // Variant: Panel (Für Dashboard-Container wie den Katalog)
        // Kein Standard-Hover-Effekt, Fokus auf Struktur.
        variant === "panel" && "bg-nexo-surface shadow-2xl",

        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

/* --- 2. Sub-Atoms --- */

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6 pb-2", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-bold text-white text-lg leading-tight tracking-tight group-hover:text-nexo-ocean transition-colors", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-nexo-muted leading-relaxed", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-2", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0 mt-auto", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

const CardIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-12 w-12 items-center justify-center rounded-xl bg-nexo-surface border border-white/5 shadow-inner mb-4 text-nexo-ocean",
      className
    )}
    {...props}
  />
));
CardIcon.displayName = "CardIcon";

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardIcon, CardTitle };
