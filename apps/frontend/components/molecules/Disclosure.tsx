// components/molecules/Disclosure.tsx
"use client";

import clsx from "clsx";
import { useState } from "react";

type DisclosureVariant = "card" | "inline" | "custom";

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: DisclosureVariant;

  /** 🔑 erlaubt gezieltes Überschreiben des äußeren Containers */
  containerClassName?: string;

  /** optional: Button/Text Styling */
  triggerClassName?: string;
}

export function Disclosure({ title, children, defaultOpen = false, variant = "card", containerClassName, triggerClassName }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={clsx(
        // default styles
        variant === "card" && "rounded-lg border border-slate-700 bg-slate-900",
        variant === "inline" && "border-l-2 pl-3",
        variant === "custom" && containerClassName
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={clsx(
          "flex w-full items-center justify-between text-left",
          variant === "card" && "px-4 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800",
          variant === "inline" && "py-1 text-sm text-slate-300 hover:text-slate-100",
          variant === "custom" && triggerClassName
        )}
      >
        <span>{title}</span>
        <span className={clsx("ml-2 text-slate-400 transition-transform", open && "rotate-90")}>›</span>
      </button>

      {open && (
        <div className={clsx("text-sm text-slate-400", variant === "card" && "px-4 pb-4 pt-2", variant === "inline" && "mt-2 pl-2")}>{children}</div>
      )}
    </div>
  );
}
