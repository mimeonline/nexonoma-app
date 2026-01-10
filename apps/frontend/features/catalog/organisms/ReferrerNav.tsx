"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";
import { useI18n } from "@/features/i18n/I18nProvider";

type Props = {
  segmentName?: string;
  clusterName?: string;
  macroClusterName?: string;
};

type ReferrerState = {
  canGoBack: boolean;
  referrerPath: string | null;
};

function getReferrerSnapshot(): string {
  if (typeof window === "undefined") {
    return "0|";
  }

  const historyBackPossible = window.history.length > 1;
  let refPath = "";

  try {
    const ref = document.referrer;
    if (ref) {
      const url = new URL(ref);
      if (url.origin === window.location.origin) {
        refPath = url.pathname;
      }
    }
  } catch {
    // ignore parsing issues
  }

  return `${historyBackPossible || !!refPath ? 1 : 0}|${refPath}`;
}

function subscribeReferrer(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

export function ReferrerNav({ segmentName, clusterName, macroClusterName }: Props) {
  const router = useRouter();
  const { t } = useI18n();

  const snapshot = useSyncExternalStore(subscribeReferrer, getReferrerSnapshot, () => "0|");
  const state = useMemo<ReferrerState>(() => {
    const [canGoBackFlag, refPath] = snapshot.split("|");
    return { canGoBack: canGoBackFlag === "1", referrerPath: refPath || null };
  }, [snapshot]);

  const cameFromGrid = useMemo(
    () => !!state.referrerPath?.match(/^\/([a-z]{2})(-[A-Z]{2})?\/grid(\/|$)|^\/grid(\/|$)/),
    [state.referrerPath]
  );

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-300">
      {state.canGoBack && (
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide transition hover:border-white/30 hover:bg-white/10"
        >
          <span aria-hidden>←</span>
          {t("catalog.detail.referrer.back")}
        </button>
      )}

      {cameFromGrid && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span>{t("catalog.detail.referrer.fromGrid")}</span>
          <Link
            href={state.referrerPath ?? "./grid"}
            className="rounded-full bg-slate-800/60 px-3 py-1 text-slate-200 transition hover:bg-slate-700/80"
          >
            {segmentName || clusterName || macroClusterName || t("catalog.detail.referrer.segmentPlaceholder")}
          </Link>
        </div>
      )}
    </div>
  );
}
