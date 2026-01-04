import { describe, expect, it, vi } from "vitest";
import { getPublicBaseUrl } from "../sitemap-server";

type MockRequest = {
  url: string;
  headers: Map<string, string>;
};

const makeRequest = (url: string, headers?: Record<string, string>): MockRequest => {
  const map = new Map<string, string>();
  Object.entries(headers ?? {}).forEach(([key, value]) => map.set(key, value));
  return { url, headers: map };
};

describe("getPublicBaseUrl", () => {
  it("uses env var in production even if request host is internal", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://app.nexonoma.de");

    const request = makeRequest("http://e4fe240c1154:3000/sitemap.xml");
    const result = getPublicBaseUrl(request as any, "app");

    expect(result).toBe("https://app.nexonoma.de");
  });

  it("uses request origin in development when env missing", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");

    const request = makeRequest("http://localhost:3000/sitemap.xml");
    const result = getPublicBaseUrl(request as any, "app");

    expect(result).toBe("http://localhost:3000");
  });

  it("uses forwarded headers when env missing", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");

    const request = makeRequest("http://internal:3000/sitemap.xml", {
      "x-forwarded-proto": "https",
      "x-forwarded-host": "app.nexonoma.de",
    });
    const result = getPublicBaseUrl(request as any, "app");

    expect(result).toBe("https://app.nexonoma.de");
  });
});
