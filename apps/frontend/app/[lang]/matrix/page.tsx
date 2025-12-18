"use client";

import { useI18n } from "@/features/i18n/I18nProvider";

export default function MatrixPage() {
  const { t } = useI18n();

  return (
    <div className="p-10 text-white">
      <h1 className="font-display mb-4 text-3xl font-bold">{t("matrix.title")}</h1>
      <p className="font-mono">{t("matrix.description")}</p>
      <p className="font-sans">{t("matrix.description")}</p>
      <p className="font-display">{t("matrix.description")}</p>
    </div>
  );
}
