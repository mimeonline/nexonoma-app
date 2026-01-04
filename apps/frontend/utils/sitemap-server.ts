import { NextRequest, NextResponse } from "next/server";
import type { SitemapVariant } from "./sitemap";

const DEFAULT_SITE_HOSTS = ["nexonoma.de", "www.nexonoma.de"] as const;
const DEFAULT_APP_HOSTS = ["app.nexonoma.de"] as const;

const parseHost = (value?: string | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.split(":")[0].toLowerCase();
};

const getEnvHost = (envValue?: string) => {
  if (!envValue) return null;
  try {
    return new URL(envValue).hostname.toLowerCase();
  } catch {
    return null;
  }
};

export const resolveSitemapVariant = (request: NextRequest): SitemapVariant => {
  const host = parseHost(request.headers.get("host"));
  const siteHost = getEnvHost(process.env.NEXT_PUBLIC_SITE_URL);
  const appHost = getEnvHost(process.env.NEXT_PUBLIC_APP_URL);

  const siteHosts = new Set<string>([...DEFAULT_SITE_HOSTS, ...(siteHost ? [siteHost] : [])]);
  const appHosts = new Set<string>([...DEFAULT_APP_HOSTS, ...(appHost ? [appHost] : [])]);

  if (host && appHosts.has(host)) return "app";
  if (host && siteHosts.has(host)) return "site";
  if (host && host.startsWith("app.")) return "app";

  return "app";
};

export const resolveBaseUrl = (request: NextRequest, variant: SitemapVariant): string => {
  const fallbackOrigin = new URL(request.url).origin;

  if (variant === "site") {
    return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? fallbackOrigin.replace(/\/$/, "");
  }

  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? fallbackOrigin.replace(/\/$/, "");
};

export const SITEMAP_CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

export const createXmlResponse = (xml: string) =>
  new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": SITEMAP_CACHE_CONTROL,
    },
  });
