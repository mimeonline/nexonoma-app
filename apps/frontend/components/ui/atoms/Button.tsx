import { cn } from "@/lib/utils";
import * as React from "react";

// Definiere die möglichen Varianten
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, variant = "primary", size = "md", ...props }, ref) => {
  // Basis-Styles, die jeder Button hat
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-nexo-bg disabled:cursor-not-allowed disabled:opacity-50 active:scale-95";

  // Varianten-Styles (Farben & Rahmen)
  const variants = {
    primary:
      "bg-accent-primary text-nexo-bg shadow-card hover:bg-accent-primary/90 border border-transparent",

    secondary: "bg-nexo-surface text-text-primary border border-text-muted/30 hover:border-text-muted/50 shadow-card",

    outline: "bg-transparent text-text-secondary border border-text-muted/30 hover:bg-text-muted/10 hover:text-text-primary",

    ghost: "bg-transparent text-text-muted hover:text-accent-primary hover:bg-accent-primary/10",

    danger: "bg-error/10 text-error border border-error/30 hover:bg-error/20 hover:border-error/50",
  };

  // Größen-Styles
  const sizes = {
    sm: "h-9 px-3 text-xs",
    md: "h-11 px-6 text-sm", // Dein Standard (vorher px-5 py-3 ist ca h-11)
    lg: "h-14 px-8 text-base",
    icon: "h-11 w-11 p-0", // Für Buttons die nur ein Icon haben
  };

  return (
    <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
});

Button.displayName = "Button";
