"use client";

import { Button } from "@/components/ui/atoms/Button";
import { useI18n } from "@/features/i18n/I18nProvider";
import { usePathname, useRouter } from "next/navigation";

export default function MatrixPage() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname?.match(/^\/(de|en)(\/|$)/)?.[1];
  const localePrefix = locale ? `/${locale}` : "";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-10">
      <span className="inline-flex w-fit items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-200">
        {t("preview.label")}
      </span>
      <h1 className="font-display text-3xl font-semibold text-white">{t("preview.title")}</h1>
      <p className="text-sm text-slate-200/80">{t("preview.description")}</p>
      <div className="pt-2">
        <Button variant="secondary" onClick={() => router.push(`${localePrefix}/catalog`)}>
          {t("preview.actionCatalog")}
        </Button>
      </div>
    </div>
  );
}
