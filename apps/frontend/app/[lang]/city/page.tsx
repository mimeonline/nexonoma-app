"use client";

import { useI18n } from "@/features/i18n/I18nProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "City View",
  description: "Navigate architectural knowledge as a city map with clusters, neighborhoods and contextual paths.",
};
export default function CityPage() {
  const { t } = useI18n();

  return (
    <div className="p-10 text-white">
      <h1 className="mb-4 text-3xl font-bold">{t("city.title")}</h1>
      <p>{t("city.description")}</p>
    </div>
  );
}
