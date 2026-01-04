import { NextRequest } from "next/server";
import { buildSitemapPagesEntries } from "@/utils/sitemap-builders";
import { renderSitemapXml } from "@/utils/sitemap";
import { createXmlResponse, getPublicBaseUrl } from "@/utils/sitemap-server";

export async function GET(request: NextRequest) {
  const baseUrl = getPublicBaseUrl(request);
  const entries = buildSitemapPagesEntries(baseUrl);
  const xml = renderSitemapXml(entries);

  return createXmlResponse(xml);
}
