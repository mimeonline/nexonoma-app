import { NextRequest } from "next/server";
import { createXmlResponse, getPublicBaseUrl } from "@/utils/sitemap-server";
import { renderSitemapIndexXml } from "@/utils/sitemap";

const buildIndexEntries = (baseUrl: string) => [
  { loc: `${baseUrl}/sitemap-pages.xml` },
  { loc: `${baseUrl}/sitemap-catalog.xml` },
];

export async function GET(request: NextRequest) {
  const baseUrl = getPublicBaseUrl(request);
  const entries = buildIndexEntries(baseUrl);
  const xml = renderSitemapIndexXml(entries);

  return createXmlResponse(xml);
}
