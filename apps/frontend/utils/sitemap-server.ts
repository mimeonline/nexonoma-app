import { NextRequest, NextResponse } from "next/server";

const normalizeUrl = (value: string) => value.replace(/\/$/, "");

const getForwardedOrigin = (request: Pick<NextRequest, "headers">) => {
  const proto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("x-forwarded-host");
  if (!proto || !host) return null;
  return `${proto}://${host}`;
};

export const getPublicBaseUrl = (
  request: Pick<NextRequest, "url" | "headers">
): string => {
  const isProd = process.env.NODE_ENV === "production";
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (isProd && envUrl) {
    return normalizeUrl(envUrl);
  }

  const forwardedOrigin = getForwardedOrigin(request);
  if (forwardedOrigin) {
    return normalizeUrl(forwardedOrigin);
  }

  return normalizeUrl(new URL(request.url).origin);
};

export const SITEMAP_CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

export const createXmlResponse = (xml: string) =>
  new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": SITEMAP_CACHE_CONTROL,
    },
  });
