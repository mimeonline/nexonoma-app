import { NextRequest } from "next/server";
import { renderSitemapXml } from "@/utils/sitemap";
import { buildCatalogTypeSitemapEntries } from "@/utils/sitemap-builders";
import { createXmlResponse, resolveBaseUrl, resolveSitemapVariant } from "@/utils/sitemap-server";

export async function GET(request: NextRequest) {
  const variant = resolveSitemapVariant(request);
  if (variant !== "site") {
    return createXmlResponse(renderSitemapXml([]));
  }

  const baseUrl = resolveBaseUrl(request, variant);
  const entries = await buildCatalogTypeSitemapEntries(baseUrl, variant, "TOOL");
  const entriesXml = renderSitemapXml(entries);

  return createXmlResponse(entriesXml);
}
