"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

export function ReferrerNav({ segmentName, clusterName, macroClusterName }: Props) {
  const router = useRouter();
  const { t } = useI18n();

  const [state, setState] = useState<ReferrerState>({ canGoBack: false, referrerPath: null });

  useEffect(() => {
    const historyBackPossible = window.history.length > 1;
    let refPath: string | null = null;

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

    setState({
      canGoBack: historyBackPossible || !!refPath,
      referrerPath: refPath,
    });
  }, []);

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
