"use client";

import { Button } from "@/components/ui/atoms/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/atoms/Card";
import { useI18n } from "@/features/i18n/I18nProvider";
import { usePathname, useRouter } from "next/navigation";

export default function HomeTemplate() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.match(/^\/(de|en)(\/|$)/)?.[1];
  const localePrefix = locale ? `/${locale}` : "";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section className="space-y-3">
        <p className="text-base sm:text-lg text-text-primary">{t("home.start.intro.line1")}</p>
        <p className="text-sm sm:text-base text-text-secondary">{t("home.start.intro.line2")}</p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Card variant="interactive" className="border-accent-primary/30">
          <CardHeader>
            <CardTitle className="text-text-primary">{t("home.start.cards.catalog.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary leading-relaxed">{t("home.start.cards.catalog.description")}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push(`${localePrefix}/catalog`)}>{t("home.start.cards.catalog.cta")}</Button>
          </CardFooter>
        </Card>

        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="text-text-primary">{t("home.start.cards.structure.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary leading-relaxed">{t("home.start.cards.structure.description")}</p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" onClick={() => router.push(`${localePrefix}/grid`)}>
              {t("home.start.cards.structure.cta")}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="text-text-primary">{t("home.start.cards.preview.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary leading-relaxed">{t("home.start.cards.preview.description")}</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" onClick={() => router.push(`${localePrefix}/matrix`)}>
              {t("home.start.cards.preview.cta")}
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="mt-8 flex flex-wrap gap-4 text-sm text-text-muted">
        <a className="transition-colors hover:text-text-primary" href="https://nexonoma.de/about">
          {t("home.start.meta.about")}
        </a>
        <a className="transition-colors hover:text-text-primary" href="https://nexonoma.de/feedback">
          {t("home.start.meta.feedback")}
        </a>
      </section>
    </div>
  );
}
