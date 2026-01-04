// apps/frontend/proxy.ts
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

const locales = ["de", "en"] as const;
const defaultLocale = "de";
const redirectPrefixes = ["/catalog", "/preview", "/structure", "/grid", "/matrix", "/city", "/content"] as const;

function getLocale(request: NextRequest): (typeof locales)[number] {
  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => (headers[k] = v));
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales as unknown as string[], defaultLocale) as (typeof locales)[number];
}

function shouldRedirect(pathname: string) {
  if (pathname === "/") return true;
  return redirectPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isSitemap =
    pathname === "/sitemap.xml" || (pathname.startsWith("/sitemap-") && pathname.endsWith(".xml"));

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    isSitemap ||
    /\\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  if (!shouldRedirect(pathname)) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
