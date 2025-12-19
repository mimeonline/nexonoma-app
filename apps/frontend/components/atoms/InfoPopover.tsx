"use client";

import * as Popover from "@radix-ui/react-popover";
import clsx from "clsx";
import { ReactNode } from "react";

interface InfoPopoverProps {
  children: ReactNode;
  content: ReactNode;
  title?: string;
  width?: number;
  icon?: boolean;
  iconColor?: string;
}

export function InfoPopover({ children, content, title, width = 320, icon = false, iconColor = "text-slate-400" }: InfoPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <span className="inline-flex items-center gap-1">
          {children}
          {icon && (
            <svg className={clsx("w-4 h-4", iconColor)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="start"
          sideOffset={8}
          className={clsx(
            "z-50 rounded-xl",
            "bg-slate-900",
            "border border-slate-700",
            "shadow-xl shadow-black/40",
            "p-4 text-sm text-slate-100",
            "animate-in fade-in zoom-in-95"
          )}
          style={{ width }}
        >
          {title && <div className="mb-2 text-xs font-semibold tracking-wide text-white">{title}</div>}

          <div className="leading-relaxed space-y-2">{content}</div>

          <Popover.Arrow className="fill-slate-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
