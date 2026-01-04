import { NextRequest } from "next/server";
import { buildCoreSitemapEntries } from "@/services/sitemapCore";
import { renderSitemapXml } from "@/utils/sitemap";
import { createXmlResponse, resolveBaseUrl, resolveSitemapVariant } from "@/utils/sitemap-server";

export async function GET(request: NextRequest) {
  const variant = resolveSitemapVariant(request);
  if (variant !== "site") {
    return createXmlResponse(renderSitemapXml([]));
  }

  const baseUrl = resolveBaseUrl(request, variant);
  const entries = await buildCoreSitemapEntries(baseUrl, variant);
  const xml = renderSitemapXml(entries);

  return createXmlResponse(xml);
}
