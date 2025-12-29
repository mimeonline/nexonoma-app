import { ReadingProgress } from "@/components/molecules/ReadingProgress";
import type { Metadata } from "next";
import { access, readFile } from "fs/promises";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import path from "path";
import readingTime from "reading-time";
import { remark } from "remark";
import html from "remark-html";
import { buildSeoMetadata, SEO_SUPPORTED_LOCALES, SeoLocale } from "../../../../seo";

type PageParams = {
  lang: string;
  contentType: string;
  assetType: string;
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

type ContentFrontmatter = {
  title?: string;
  description?: string;
  contentType?: string;
  assetType?: string;
  updatedAt?: string;
  locale?: string;
  version?: string;
};

const resolveFilePath = (lang: string, contentType: string, assetType: string, slug: string) =>
  path.join(process.cwd(), "../../content", lang, contentType, assetType, `${slug}.md`);

const loadContent = async (lang: string, contentType: string, assetType: string, slug: string) => {
  const filePath = resolveFilePath(lang, contentType, assetType, slug);

  const fileContents = await readFile(filePath, "utf8");
  const { content, data } = matter(fileContents);
  const stats = readingTime(content);
  const processed = await remark().use(html).process(content);

  return {
    content,
    data: data as ContentFrontmatter,
    stats,
    contentHtml: processed.toString(),
  };
};

const toPlainText = (value: string) =>
  value
    .replace(/`+/g, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[#>*_~-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toStringValue = (value?: string) => (typeof value === "string" ? value : "");

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, contentType, assetType, slug } = await params;

  if (!lang || !contentType || !assetType || !slug || !SEO_SUPPORTED_LOCALES.includes(lang as SeoLocale)) {
    notFound();
  }

  let data: ContentFrontmatter;
  let content: string;
  try {
    const loaded = await loadContent(lang, contentType, assetType, slug);
    data = loaded.data;
    content = loaded.content;
  } catch {
    notFound();
  }

  const title = toStringValue(data.title).trim().length > 0 ? toStringValue(data.title) : slug.replace(/-/g, " ");
  const description =
    toStringValue(data.description).trim().length > 0 ? toStringValue(data.description) : toPlainText(content).slice(0, 160);

  const pathSuffix = `/content/${contentType}/${assetType}/${slug}`;
  const alternateLocales = await Promise.all(
    SEO_SUPPORTED_LOCALES.filter((locale) => locale !== lang).map(async (locale) => {
      try {
        await access(resolveFilePath(locale, contentType, assetType, slug));
        return locale;
      } catch {
        return null;
      }
    })
  );

  const includeAlternates = alternateLocales.some(Boolean);

  return buildSeoMetadata({
    lang: lang as SeoLocale,
    path: pathSuffix,
    title,
    description,
    includeAlternates,
  });
}

export default async function ContentPage({ params }: PageProps) {
  const { lang, contentType, assetType, slug } = await params;

  if (!lang || !contentType || !assetType || !slug || !SEO_SUPPORTED_LOCALES.includes(lang as SeoLocale)) {
    notFound();
  }

  let data: ContentFrontmatter;
  let stats: ReturnType<typeof readingTime>;
  let contentHtml: string;
  try {
    const loaded = await loadContent(lang, contentType, assetType, slug);
    data = loaded.data;
    stats = loaded.stats;
    contentHtml = loaded.contentHtml;
  } catch {
    notFound();
  }

  const contentTypeLabel = toStringValue(data.contentType);
  const assetTypeLabel = toStringValue(data.assetType);
  const updatedAt = toStringValue(data.updatedAt);
  const locale = toStringValue(data.locale) || "de";
  const version = toStringValue(data.version);

  return (
    <>
      <main className="flex justify-center px-6 py-16 sm:py-20 lg:py-24">
        <ReadingProgress targetId="content-article" />
        <section className="w-full max-w-4xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 shadow-sm shadow-black/10">
            {/* META HEADER */}
            <header className="px-6 pt-6 sm:px-10 lg:px-14 text-[12.5px] text-white/55 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-medium text-white/70">
                {contentTypeLabel} • {assetTypeLabel}
              </span>

              <span>•</span>
              <span>~{Math.ceil(stats.minutes)} min read</span>

              {updatedAt && (
                <>
                  <span>•</span>
                  <span>
                    Updated{" "}
                    {new Date(updatedAt).toLocaleDateString(locale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </>
              )}

              {version && (
                <>
                  <span>•</span>
                  <span className="rounded-full border border-white/15 px-2 py-0.5 text-[11px]">v{version}</span>
                </>
              )}
            </header>

            {/* CONTENT */}
            <article
              id="content-article"
              className="w-full px-6 py-10 text-[14.5px] leading-7 text-white/85
          sm:px-10 sm:py-12 lg:px-14 lg:py-14 max-w-[75ch]
          [&>h1]:text-2xl [&>h1]:font-semibold [&>h1]:tracking-tight [&>h1]:mb-6 [&>h1]:text-nexo-ocean 
          [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:text-nexo-aqua 
          [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:text-lg [&>h3]:font-semibold
          [&>p]:my-4
          [&>ul]:my-5 [&>ol]:my-5
          [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6
          [&_li]:pl-1 [&_li::marker]:text-white/60
          [&>blockquote]:my-5 [&>blockquote]:border-l-2 [&>blockquote]:border-white/15
          [&>blockquote]:pl-4 [&>blockquote]:text-white/75
          [&>pre]:my-6 [&>pre]:rounded-md [&>pre]:bg-black/30 [&>pre]:p-4
          [&>code]:rounded [&>code]:bg-white/10 [&>code]:px-1 [&>code]:py-0.5
          [&>hr]:my-8 [&>hr]:border-white/10
          [&_a]:text-white [&_a]:underline-offset-4 hover:[&_a]:underline"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>
        </section>
      </main>
    </>
  );
}
