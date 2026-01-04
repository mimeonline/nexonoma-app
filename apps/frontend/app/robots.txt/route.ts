import { NextRequest, NextResponse } from "next/server";
import { getPublicBaseUrl } from "../../utils/sitemap-server";

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
  const baseUrl = getPublicBaseUrl(request);
  const body = buildRobots(baseUrl);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
