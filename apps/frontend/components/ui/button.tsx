import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F2A40] px-5 py-3 text-sm font-semibold text-white transition duration-150",
        "shadow-md shadow-nexo-surface/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#4c6bff1a]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C6BFF] focus-visible:ring-offset-2 focus-visible:ring-offset-nexo-surface",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
