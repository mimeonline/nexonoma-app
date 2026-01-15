import { renderSitemapXml } from "@/utils/sitemap";
import { buildSitemapContentEntries } from "@/utils/sitemap-builders";
import { createXmlResponse, getPublicBaseUrl } from "@/utils/sitemap-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl = getPublicBaseUrl(request);
  let skipped = 0;
  let total = 0;
  let xml = renderSitemapXml([]);
  let hasError = false;

  try {
    const result = await buildSitemapContentEntries(baseUrl);
    skipped = result.skipped;
    total = result.total;
    xml = renderSitemapXml(result.entries);
  } catch (err) {
    hasError = true;
    if (process.env.NODE_ENV !== "production") {
      console.error("sitemap-catalog: error", err);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    const urlCount = (xml.match(/<url>/g) ?? []).length;
    console.log(`sitemap-catalog: total=${total} urls=${urlCount} skipped=${skipped} types=concept,method,tool,technology`);

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "X-Sitemap-Asset-Total": total.toString(),
        "X-Sitemap-Url-Count": urlCount.toString(),
        "X-Sitemap-Skipped": skipped.toString(),
        ...(hasError ? { "X-Sitemap-Error": "1" } : {}),
      },
    });
  }

  return createXmlResponse(xml);
}
