import { NextRequest } from "next/server";
import { renderSitemapXml } from "@/utils/sitemap";
import { buildCatalogListSitemapEntries } from "@/utils/sitemap-builders";
import { createXmlResponse, resolveBaseUrl, resolveSitemapVariant } from "@/utils/sitemap-server";

export async function GET(request: NextRequest) {
  const variant = resolveSitemapVariant(request);
  if (variant !== "app") {
    return createXmlResponse(renderSitemapXml([]));
  }

  const baseUrl = resolveBaseUrl(request, variant);
  const entries = buildCatalogListSitemapEntries(baseUrl, variant);
  const xml = renderSitemapXml(entries);

  return createXmlResponse(xml);
}
