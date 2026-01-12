import type { Metadata } from "next";
import de from "../dictionaries/de.json";
import en from "../dictionaries/en.json";
import { buildSeoMetadata, SeoLocale } from "../seo";
import { MatrixRail } from "@/features/matrix/components/MatrixRail";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = lang === "de" ? de : en;
  const title = dict?.seo?.matrix?.title ?? en.seo.matrix.title;
  const description = dict?.seo?.matrix?.description ?? en.seo.matrix.description;

  return buildSeoMetadata({
    lang: lang as SeoLocale,
    path: "/matrix",
    title,
    description,
    indexable: false,
  });
}

export default function MatrixLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-[calc(100vh-var(--header))]">
      <aside className="w-64 shrink-0 border-r border-nexo-border bg-nexo-surface/40">
        <div className="px-4 py-6">
          <MatrixRail />
        </div>
      </aside>

      <section className="flex-1 overflow-auto">{children}</section>
    </div>
  );
}
