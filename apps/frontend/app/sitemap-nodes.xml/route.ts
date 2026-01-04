import { NextRequest } from "next/server";
import { renderSitemapXml } from "@/utils/sitemap";
import { buildCatalogNodeSitemapPayload } from "@/utils/sitemap-builders";
import { createXmlResponse, resolveBaseUrl, resolveSitemapVariant } from "@/utils/sitemap-server";

export async function GET(request: NextRequest) {
  const variant = resolveSitemapVariant(request);
  if (variant !== "app") {
    return createXmlResponse(renderSitemapXml([]));
  }

  const baseUrl = resolveBaseUrl(request, variant);
  const { entries, stats } = await buildCatalogNodeSitemapPayload(baseUrl, variant);
  const xml = renderSitemapXml(entries);

  const response = createXmlResponse(xml);

  if (process.env.NODE_ENV === "development") {
    response.headers.set("X-Sitemap-Loaded", String(stats.loaded));
    response.headers.set("X-Sitemap-Included", String(stats.included));
    response.headers.set("X-Sitemap-Skipped", String(stats.skipped));
    response.headers.set("X-Sitemap-Source", "api");
    const breakdown = Object.entries(stats.reasonBreakdown)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([reason, count]) => `${reason}=${count}`)
      .join(",");
    console.log(
      `sitemap-nodes: loaded=${stats.loaded} included=${stats.included} skipped=${stats.skipped} reasonBreakdown=${breakdown}`
    );
  }

  return response;
}
