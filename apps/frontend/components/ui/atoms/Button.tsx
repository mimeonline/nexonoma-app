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
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexo-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-nexo-bg disabled:cursor-not-allowed disabled:opacity-50 active:scale-95";

  // Varianten-Styles (Farben & Rahmen)
  const variants = {
    primary:
      "bg-nexo-ocean text-[#020617] shadow-[0_0_20px_-5px_rgba(56,189,248,0.4)] hover:bg-nexo-ocean/90 hover:shadow-[0_0_25px_-5px_rgba(56,189,248,0.6)] border border-transparent",

    secondary: "bg-[#1F2A40] text-white border border-white/5 hover:bg-[#2A3655] hover:border-white/10 shadow-md shadow-black/20",

    outline: "bg-transparent text-slate-300 border border-white/10 hover:bg-white/5 hover:text-white hover:border-white/20",

    ghost: "bg-transparent text-slate-400 hover:text-nexo-ocean hover:bg-nexo-ocean/10",

    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40",
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
