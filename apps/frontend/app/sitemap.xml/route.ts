import { NextRequest } from "next/server";
import { createXmlResponse, resolveBaseUrl, resolveSitemapVariant } from "@/utils/sitemap-server";
import { renderSitemapIndexXml } from "@/utils/sitemap";

const buildIndexEntries = (baseUrl: string, variant: "site" | "app") => {
  const shared = [{ loc: `${baseUrl}/sitemap-catalog.xml` }, { loc: `${baseUrl}/sitemap-nodes.xml` }];
  if (variant !== "site") {
    return shared;
  }

  return [
    ...shared,
    { loc: `${baseUrl}/sitemap-core.xml` },
    { loc: `${baseUrl}/sitemap-concepts.xml` },
    { loc: `${baseUrl}/sitemap-methods.xml` },
    { loc: `${baseUrl}/sitemap-tools.xml` },
    { loc: `${baseUrl}/sitemap-technologies.xml` },
  ];
};

export async function GET(request: NextRequest) {
  const variant = resolveSitemapVariant(request);
  const baseUrl = resolveBaseUrl(request, variant);
  const entries = buildIndexEntries(baseUrl, variant);
  const xml = renderSitemapIndexXml(entries);

  return createXmlResponse(xml);
}
