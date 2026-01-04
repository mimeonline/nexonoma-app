import { describe, expect, it } from "vitest";
import {
  dedupeEntries,
  formatLastmod,
  isValidSlug,
  renderSitemapIndexXml,
  renderSitemapXml,
  resolveSitemapLocales,
  sortEntriesByTypeSlugIdLang,
  urlForAsset,
  type SitemapEntry,
} from "../sitemap";

describe("sitemap utils", () => {
  it("maps catalog types to catalog detail routes", () => {
    const context = { baseUrl: "https://app.nexonoma.de", locale: "de" } as const;

    expect(urlForAsset({ type: "CONCEPT", slug: "event-storming" }, context)).toBe(
      "https://app.nexonoma.de/de/catalog/concept/event-storming"
    );
    expect(urlForAsset({ type: "METHOD", slug: "impact-mapping" }, context)).toBe(
      "https://app.nexonoma.de/de/catalog/method/impact-mapping"
    );
    expect(urlForAsset({ type: "TOOL", slug: "figma" }, context)).toBe("https://app.nexonoma.de/de/catalog/tool/figma");
    expect(urlForAsset({ type: "TECHNOLOGY", slug: "kafka" }, context)).toBe(
      "https://app.nexonoma.de/de/catalog/technology/kafka"
    );
  });

  it("maps core grid assets and segments", () => {
    const context = { baseUrl: "https://nexonoma.de", locale: "en" } as const;

    expect(urlForAsset({ type: "MACRO_CLUSTER", slug: "architecture" }, context)).toBe(
      "https://nexonoma.de/en/grid/architecture"
    );
    expect(urlForAsset({ type: "CLUSTER", slug: "platforms", macroSlug: "architecture" }, context)).toBe(
      "https://nexonoma.de/en/grid/architecture/platforms"
    );
    expect(
      urlForAsset({ type: "SEGMENT", slug: "deploy", macroSlug: "architecture", clusterSlug: "platforms" }, context)
    ).toBe("https://nexonoma.de/en/grid/architecture/platforms?segment=deploy");
  });

  it("returns null for invalid slugs or unknown types", () => {
    const context = { baseUrl: "https://app.nexonoma.de", locale: "de" } as const;

    expect(urlForAsset({ type: "UNKNOWN", slug: "test" }, context)).toBeNull();
    expect(urlForAsset({ type: "CONCEPT", slug: "bad/slug" }, context)).toBeNull();
  });

  it("validates slugs and dedupes by loc", () => {
    expect(isValidSlug("valid-slug")).toBe(true);
    expect(isValidSlug("")).toBe(false);
    expect(isValidSlug("has space")).toBe(false);
    expect(isValidSlug("nested/slug")).toBe(false);

    const entries: SitemapEntry[] = [
      { loc: "https://nexonoma.de/a" },
      { loc: "https://nexonoma.de/a" },
      { loc: "https://nexonoma.de/b" },
    ];

    expect(dedupeEntries(entries)).toHaveLength(2);
  });

  it("expands locales with fallback", () => {
    expect(resolveSitemapLocales(["en"], ["de", "en"])).toEqual(["en"]);
    expect(resolveSitemapLocales([], ["de", "en"])).toEqual(["de", "en"]);
  });

  it("formats lastmod and skips invalid values", () => {
    const formatted = formatLastmod("2024-01-01T00:00:00.000Z");
    expect(formatted).toBe("2024-01-01T00:00:00.000Z");
    expect(formatLastmod("not-a-date")).toBeUndefined();
  });

  it("renders basic sitemap xml", () => {
    const xml = renderSitemapXml([
      { loc: "https://nexonoma.de/a", lastmod: "2024-01-01T00:00:00.000Z" },
      { loc: "https://nexonoma.de/b" },
    ]);

    expect(xml.startsWith("<?xml")).toBe(true);
    expect(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')).toBe(true);
    expect(xml.includes("<loc>https://nexonoma.de/a</loc>")).toBe(true);
    expect(xml.match(/<url>/g)?.length).toBe(2);
  });

  it("renders basic sitemap index xml", () => {
    const xml = renderSitemapIndexXml([
      { loc: "https://nexonoma.de/sitemap-pages.xml" },
      { loc: "https://nexonoma.de/sitemap-catalog.xml" },
    ]);

    expect(xml.startsWith("<?xml")).toBe(true);
    expect(xml.includes('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')).toBe(true);
    expect(xml.includes("<loc>https://nexonoma.de/sitemap-pages.xml</loc>")).toBe(true);
    expect(xml.match(/<sitemap>/g)?.length).toBe(2);
  });

  it("sorts deterministically by type, slug, id, lang", () => {
    const entries = [
      { loc: "b", type: "METHOD", slug: "alpha", id: "2", locale: "en" },
      { loc: "a", type: "CONCEPT", slug: "alpha", id: "2", locale: "de" },
      { loc: "c", type: "METHOD", slug: "alpha", id: "1", locale: "de" },
      { loc: "d", type: "METHOD", slug: "alpha", id: "1", locale: "en" },
    ];

    const ordered = sortEntriesByTypeSlugIdLang(entries);
    expect(ordered.map((entry) => entry.loc)).toEqual(["a", "c", "d", "b"]);
  });
});
