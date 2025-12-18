"use client";

import { useI18n } from "@/features/i18n/I18nProvider";

export default function CityPage() {
  const { t } = useI18n();

  return (
    <div className="p-10 text-white">
      <h1 className="mb-4 text-3xl font-bold">{t("city.title")}</h1>
      <p>{t("city.description")}</p>
    </div>
  );
}
