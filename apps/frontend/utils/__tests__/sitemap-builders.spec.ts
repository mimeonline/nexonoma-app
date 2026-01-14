import { describe, expect, it } from "vitest";
import type { SitemapNode } from "../../services/systemApi";
import { buildSitemapPagesEntries, mapAssetsToSitemapEntries } from "../sitemap-builders";

describe("sitemap builders", () => {
  it("builds sitemap pages with the exact static list", () => {
    const baseUrl = "https://app.nexonoma.de";
    const fixedDate = new Date("2024-01-01T00:00:00.000Z");
    const entries = buildSitemapPagesEntries(baseUrl, fixedDate);

    expect(entries.map((entry) => entry.loc)).toEqual([
      "https://app.nexonoma.de/de/",
      "https://app.nexonoma.de/en/",
      "https://app.nexonoma.de/de/catalog",
      "https://app.nexonoma.de/en/catalog",
      "https://app.nexonoma.de/de/grid",
      "https://app.nexonoma.de/en/grid",
      "https://app.nexonoma.de/de/preview",
      "https://app.nexonoma.de/en/preview",
    ]);

    entries.forEach((entry) => {
      expect(entry.lastmod).toBe("2024-01-01T00:00:00.000Z");
    });
  });

  it("maps assets to catalog urls, dedupes, and sorts deterministically", () => {
    const assets: SitemapNode[] = [
      {
        id: "2",
        type: "METHOD",
        slug: "beta",
        updatedAt: "2024-01-02T00:00:00.000Z",
      },
      {
        id: "1",
        type: "CONCEPT",
        slug: "alpha",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: "1",
        type: "CONCEPT",
        slug: "alpha",
        updatedAt: "2024-01-01T00:00:00.000Z",
        availableLanguages: ["de"],
      },
      {
        id: "3",
        type: "METHOD",
        slug: "beta",
        updatedAt: "2024-01-03T00:00:00.000Z",
        availableLanguages: ["en"],
      },
      {
        id: "skip-me",
        type: "TOOL",
        slug: "bad/slug",
      },
    ];

    const result = mapAssetsToSitemapEntries(assets, "https://app.nexonoma.de", ["de", "en"]);

    expect(result.entries.map((entry) => entry.loc)).toEqual([
      "https://app.nexonoma.de/de/content/concept/alpha",
      "https://app.nexonoma.de/en/content/concept/alpha",
      "https://app.nexonoma.de/de/content/method/beta",
      "https://app.nexonoma.de/en/content/method/beta",
    ]);
    expect(result.skipped).toBe(1);
    expect(result.total).toBe(5);
  });
});
