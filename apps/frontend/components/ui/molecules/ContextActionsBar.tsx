"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ContextActionsBarProps {
  backLabel: string;
  copyLabel: string;
  copiedLabel: string;
  contextLabel?: string;
  contextHref?: string;
  className?: string;
}

export function ContextActionsBar({ backLabel, copyLabel, copiedLabel, contextLabel, contextHref, className }: ContextActionsBarProps) {
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setIsCopied(false), 1600);
    } catch {
      // ignore clipboard failures
    }
  };

  return (
    <div className={cn("flex items-center justify-between gap-4 text-xs text-slate-300", className)}>
      <button
        type="button"
        aria-label={backLabel}
        className="cursor-pointer inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-200 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
        onClick={() => router.back()}
      >
        ←<span>{backLabel}</span>
      </button>

      <div className="flex items-center gap-4 text-[11px]">
        <button
          type="button"
          aria-label={copyLabel}
          className="cursor-pointer font-semibold uppercase tracking-[0.3em] text-slate-300 transition hover:text-white"
          onClick={handleCopy}
        >
          {isCopied ? copiedLabel : copyLabel}
        </button>
        {contextLabel && contextHref && (
          <Link
            href={contextHref}
            aria-label={contextLabel}
            className="cursor-pointer font-semibold uppercase tracking-[0.3em] text-slate-300 transition hover:text-white"
          >
            {contextLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
