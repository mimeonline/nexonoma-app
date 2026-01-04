import { NextRequest, NextResponse } from "next/server";
import { resolveBaseUrl, resolveSitemapVariant } from "@/utils/sitemap-server";

const buildRobots = (baseUrl: string) => {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /sandbox",
    "Disallow: /preview",
    "Disallow: /api",
    "Disallow: /auth",
    "Disallow: /login",
    "Disallow: /backoffice",
    "Disallow: /admin",
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join("\n");
};

export async function GET(request: NextRequest) {
  const variant = resolveSitemapVariant(request);
  const baseUrl = resolveBaseUrl(request, variant);
  const body = buildRobots(baseUrl);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
