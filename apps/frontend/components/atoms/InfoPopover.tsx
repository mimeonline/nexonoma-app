// components/InfoPopover.tsx
"use client";

import { useI18n } from "@/features/i18n/I18nProvider";
import { useEffect, useRef, useState } from "react";

interface InfoPopoverProps {
  infoKey: string;
}

export function InfoPopover({ infoKey }: InfoPopoverProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-500 text-xs text-slate-300 hover:bg-slate-700"
        aria-label="Info"
      >
        i
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-72 rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-200 shadow-xl">
          <p className="leading-snug">{t(`${infoKey}.description`)}</p>

          {(() => {
            const examples = t(`${infoKey}.examples`);
            return examples && examples !== `${infoKey}.examples` ? (
              <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-400">
                {examples.split("\n").map((e: string) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            ) : null;
          })()}
        </div>
      )}
    </div>
  );
}
