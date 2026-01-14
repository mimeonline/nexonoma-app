export type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

export type SortableSitemapEntry = SitemapEntry & {
  type: string;
  slug: string;
  id?: string;
  locale?: string;
};

export type UrlForAssetContext = {
  baseUrl: string;
  locale: string;
};

export type UrlForAssetInput = {
  type: string;
  slug: string;
  macroSlug?: string;
  clusterSlug?: string;
};

export const CONTENT_TYPE_ROUTE_MAP: Record<string, string> = {
  CONCEPT: "concept",
  METHOD: "method",
  TOOL: "tool",
  TECHNOLOGY: "technology",
};

const normalizeBaseUrl = (value: string) => value.replace(/\/$/, "");

const normalizeType = (value: string) => value.toString().toUpperCase();

const hasWhitespace = (value: string) => /\s/.test(value);

export const isValidSlug = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes("/")) return false;
  if (hasWhitespace(trimmed)) return false;
  return true;
};

export const resolveSitemapLocales = (available: string[] | undefined, fallback: readonly string[]) => {
  const resolved = available && available.length > 0 ? available : [...fallback];
  return resolved.filter((locale): locale is string => fallback.includes(locale));
};

export const formatLastmod = (value?: string | Date): string | undefined => {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

export const sortEntriesByTypeSlugIdLang = (entries: SortableSitemapEntry[]): SortableSitemapEntry[] => {
  return [...entries].sort((a, b) => {
    const typeCompare = a.type.localeCompare(b.type);
    if (typeCompare !== 0) return typeCompare;

    const slugCompare = a.slug.localeCompare(b.slug);
    if (slugCompare !== 0) return slugCompare;

    const idCompare = (a.id ?? "").localeCompare(b.id ?? "");
    if (idCompare !== 0) return idCompare;

    const localeA = a.locale ?? "";
    const localeB = b.locale ?? "";
    return localeA.localeCompare(localeB);
  });
};

export const dedupeEntries = <T extends SitemapEntry>(entries: T[]): T[] => {
  const deduped = new Map<string, T>();
  entries.forEach((entry) => {
    if (!deduped.has(entry.loc)) {
      deduped.set(entry.loc, entry);
    }
  });
  return Array.from(deduped.values());
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const buildUrl = (baseUrl: string, path: string) => {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export const urlForAsset = (asset: UrlForAssetInput, context: UrlForAssetContext): string | null => {
  const type = normalizeType(asset.type);
  if (!isValidSlug(asset.slug)) return null;
  if (!context.locale) return null;

  const localePrefix = `/${context.locale}`;
  const contentRoute = CONTENT_TYPE_ROUTE_MAP[type];

  if (contentRoute) {
    return buildUrl(context.baseUrl, `${localePrefix}/content/${contentRoute}/${asset.slug}`);
  }

  if (type === "MACRO_CLUSTER") {
    return buildUrl(context.baseUrl, `${localePrefix}/grid/${asset.slug}`);
  }

  if (type === "CLUSTER" || type === "CLUSTER_VIEW") {
    if (!isValidSlug(asset.macroSlug)) return null;
    return buildUrl(context.baseUrl, `${localePrefix}/grid/${asset.macroSlug}/${asset.slug}`);
  }

  if (type === "SEGMENT") {
    if (!isValidSlug(asset.macroSlug) || !isValidSlug(asset.clusterSlug)) return null;
    const segmentParam = encodeURIComponent(asset.slug);
    return buildUrl(context.baseUrl, `${localePrefix}/grid/${asset.macroSlug}/${asset.clusterSlug}?segment=${segmentParam}`);
  }

  return null;
};

export const renderSitemapXml = (entries: SitemapEntry[]): string => {
  const body = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "";
      return `<url><loc>${escapeXml(entry.loc)}</loc>${lastmod}</url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
};

export const renderSitemapIndexXml = (entries: SitemapEntry[]): string => {
  const body = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "";
      return `<sitemap><loc>${escapeXml(entry.loc)}</loc>${lastmod}</sitemap>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;
};
