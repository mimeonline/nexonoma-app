import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";

const makeRequest = (url: string, headers: Record<string, string> = {}) => {
  const headerMap = new Map<string, string>();
  Object.entries(headers).forEach(([key, value]) => headerMap.set(key.toLowerCase(), value));
  return {
    url,
    headers: {
      get: (key: string) => headerMap.get(key.toLowerCase()) ?? null,
    },
  } as any;
};

describe("robots.txt route", () => {
  it("uses request host when env not set", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");

    const res = await GET(makeRequest("http://internal:3000/robots.txt", { "x-forwarded-proto": "https", "x-forwarded-host": "app.example.com" }));
    const body = await res.text();

    expect(body).toContain("Sitemap: https://app.example.com/sitemap.xml");
  });

  it("prefers NEXT_PUBLIC_SITE_URL in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://canonical.example.com");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://legacy.example.com");

    const res = await GET(makeRequest("http://internal:3000/robots.txt", { "x-forwarded-proto": "https", "x-forwarded-host": "app.example.com" }));
    const body = await res.text();

    expect(body).toContain("Sitemap: https://canonical.example.com/sitemap.xml");
  });
});
