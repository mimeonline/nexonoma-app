import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/atoms/Badge";
import { Card } from "@/components/ui/atoms/Card";
import { cn } from "@/lib/utils";

type HeroMetaTone = "neutral" | "accent" | "warning";

type StructurePath = {
  id: string;
  domain: string[];
  title: string;
  context: string;
  href: string;
};

type RelationItem = {
  id: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  href: string;
};

type FactItem = {
  id: string;
  label: string;
  value: string;
  tone?: HeroMetaTone;
};

export type AssetContent = {
  title: string;
  typeLabel: string;
  tags: string[];
  heroDescription: string;
  heroNote: string;
  actionLabel: string;
  actionHint: string;
  structurePaths: StructurePath[];
  relations: RelationItem[];
  facts: FactItem[];
  longDescription: string;
};

type ContentTemplateProps = {
  lang: string;
  asset: AssetContent;
};

const metaToneClasses: Record<HeroMetaTone, string> = {
  neutral: "text-white bg-white/10 border-white/10",
  accent: "text-nexo-aqua bg-nexo-aqua/10 border-nexo-aqua/20",
  warning: "text-warning bg-warning/10 border-warning/20",
};

function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("text-lg font-display font-semibold text-white", className)}>{children}</h2>;
}

function TagChip({ label }: { label: string }) {
  return (
    <span className="rounded px-2.5 py-1 text-[11px] font-medium text-text-secondary border border-white/10 bg-white/5 transition-colors duration-200 ease-out hover:border-white/20">
      {label}
    </span>
  );
}

function HoverCardLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "group block w-full rounded-xl border border-white/5 bg-nexo-card p-4 transition-all duration-200 ease-out hover:border-white/20 hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function ContentTemplate({ lang, asset }: ContentTemplateProps) {
  return (
    <div className="space-y-8 pb-20">
      <div>
        <Link
          href={`/${lang}/catalog`}
          className="group inline-flex items-center gap-2 text-xs font-medium text-text-secondary transition-colors duration-200 ease-out hover:text-white"
        >
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/5 transition-colors duration-200 ease-out group-hover:border-white/20">
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </span>
          <span>Zur Übersicht</span>
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-stretch">
        <Card className="bg-nexo-surface p-8 duration-200 ease-out">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Badge variant="tool" size="md" radius="sm">
              {asset.typeLabel}
            </Badge>
            {asset.tags.map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </div>

          <div className="flex items-start gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-nexo-card">
              <svg
                className="h-8 w-8 text-nexo-aqua"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" />
                <path d="M16 12a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4 4Z" />
              </svg>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">{asset.title}</h1>
              <p className="text-[15px] text-text-secondary leading-relaxed max-w-2xl">{asset.heroDescription}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4 rounded-lg border border-white/5 border-l-2 border-l-nexo-aqua/60 bg-nexo-bg/40 p-4">
            <p className="text-sm text-text-secondary">{asset.heroNote}</p>
          </div>
        </Card>

        <div className="flex h-full flex-col gap-4">
          <Card className="p-5 duration-200 ease-out">
            <Link
              href={`/${lang}/catalog`}
              className="flex items-center justify-center w-full gap-2 rounded-xl bg-accent-primary px-4 py-3 text-sm font-semibold text-nexo-bg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent-primary/90"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {asset.actionLabel}
            </Link>
            <p className="mt-3 text-center text-xs text-text-muted">{asset.actionHint}</p>
          </Card>

          <Card className="flex-1 bg-nexo-surface p-6 duration-200 ease-out">
            <h2 className="text-lg font-display font-semibold text-white">Einordnung</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Diese Seite bündelt grundlegende Informationen, Kontext und Beziehungen zu diesem Baustein. Sie dient als neutraler Einstiegspunkt ins
              Modell – unabhängig von Lern- oder Entscheidungswegen.
            </p>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col">
          <div className="mb-4 px-1">
            <SectionTitle>Kontext im Modell</SectionTitle>
          </div>
          <Card className="flex-1 bg-nexo-surface p-5 duration-200 ease-out">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-nexo-card text-text-secondary">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Strukturelle Einordnung</h3>
                <p className="mt-0.5 text-xs text-text-muted">Verortung in der Struktur</p>
              </div>
            </div>

            <div className="space-y-3">
              {asset.structurePaths.map((item) => (
                <HoverCardLink key={item.id} href={`/${lang}${item.href}`} className="p-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-text-muted mb-1">
                    <span>{item.domain[0]}</span>
                    <span className="text-white/10">/</span>
                    <span>{item.domain[1]}</span>
                  </div>
                  <div className="text-sm font-medium text-white mb-2">{item.title}</div>
                  <span className="inline-flex rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-text-secondary transition-colors duration-200 ease-out group-hover:border-white/20">
                    {item.context}
                  </span>
                </HoverCardLink>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col">
          <div className="mb-4 px-1">
            <SectionTitle>Beziehungen</SectionTitle>
          </div>
          <Card className="flex-1 bg-nexo-surface p-5 duration-200 ease-out">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-nexo-card text-nexo-aqua">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Netzwerk</h3>
                <p className="mt-0.5 text-xs text-text-muted">Direkt verknüpfte Bausteine</p>
              </div>
            </div>

            <div className="space-y-3">
              {asset.relations.map((relation) => (
                <HoverCardLink key={relation.id} href={`/${lang}${relation.href}`} className="p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-nexo-card text-[10px] font-bold text-text-secondary transition-colors duration-200 ease-out group-hover:text-white">
                        {relation.shortLabel}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-white">{relation.title}</div>
                        <div className="truncate text-[11px] text-text-muted">{relation.subtitle}</div>
                      </div>
                    </div>
                    <span className="rounded p-1 text-text-muted transition-colors duration-200 ease-out group-hover:text-white">
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </HoverCardLink>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section>
        <SectionTitle className="mb-4 px-1">Basisdaten</SectionTitle>
        <div className="flex w-full gap-3">
          {asset.facts.map((fact) => (
            <Card key={fact.id} className="flex-1 min-w-0 p-4 text-center duration-200 ease-out">
              <div className="mb-1.5 text-[10px] uppercase tracking-wider text-text-muted">{fact.label}</div>
              {fact.tone ? (
                <span className={cn("inline-flex rounded border px-2 py-0.5 text-[10px] font-bold tracking-wide", metaToneClasses[fact.tone])}>
                  {fact.value}
                </span>
              ) : (
                <div className="text-sm font-medium text-white">{fact.value}</div>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle className="mb-4 px-1">Beschreibung</SectionTitle>
        <Card className="p-6 duration-200 ease-out">
          <p className="text-[15px] leading-7 text-text-secondary">{asset.longDescription}</p>
        </Card>
      </section>
    </div>
  );
}
