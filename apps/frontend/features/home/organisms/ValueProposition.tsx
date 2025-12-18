"use client";

import { Card, CardContent, CardHeader, CardIcon, CardTitle } from "@/components/ui/atoms/Card"; // CardContent importieren!
import { SectionTitle } from "@/components/ui/atoms/SectionTitle";
import { GitFork, Network, ShieldAlert } from "lucide-react";
import { useI18n } from "@/features/i18n/I18nProvider";

export function ValueProposition() {
  const { t } = useI18n();

  return (
    <section>
      <SectionTitle title={t("home.valueProps.title")} description={t("home.valueProps.description")} />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Feature 1 */}
        <Card variant="glow" className="h-full flex flex-col">
          <CardHeader>
            <CardIcon className="bg-nexo-aqua/10 text-nexo-aqua border-nexo-aqua/20">
              <GitFork className="h-5 w-5" />
            </CardIcon>
            <CardTitle>{t("home.valueProps.items.alternatives.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-nexo-muted leading-relaxed">
              {t("home.valueProps.items.alternatives.description")}
            </p>
          </CardContent>
        </Card>

        {/* Feature 2 */}
        <Card variant="glow" className="h-full flex flex-col">
          <CardHeader>
            <CardIcon className="bg-nexo-ocean/10 text-nexo-ocean border-nexo-ocean/20">
              <Network className="h-5 w-5" />
            </CardIcon>
            <CardTitle>{t("home.valueProps.items.context.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-nexo-muted leading-relaxed">
              {t("home.valueProps.items.context.description")}
            </p>
          </CardContent>
        </Card>

        {/* Feature 3 */}
        <Card variant="glow" className="h-full flex flex-col">
          <CardHeader>
            <CardIcon className="bg-purple-500/10 text-purple-400 border-purple-500/20">
              <ShieldAlert className="h-5 w-5" />
            </CardIcon>
            <CardTitle>{t("home.valueProps.items.risks.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-nexo-muted leading-relaxed">{t("home.valueProps.items.risks.description")}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
