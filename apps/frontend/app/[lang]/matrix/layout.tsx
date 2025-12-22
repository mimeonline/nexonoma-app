import type { Metadata } from "next";
import de from "../dictionaries/de.json";
import en from "../dictionaries/en.json";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = lang === "de" ? de : en;
  const title = dict?.seo?.matrix?.title ?? en.seo.matrix.title;
  const description = dict?.seo?.matrix?.description ?? en.seo.matrix.description;

  return { title, description };
}

export default function GridLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-[calc(100vh-var(--header))]">
      <aside className="w-56 shrink-0 border-r border-nexo-border ml-4 pt-4">{/* Left Rail */}Menu </aside>

      <section className="flex-1 overflow-auto">{children}</section>
    </div>
  );
}
