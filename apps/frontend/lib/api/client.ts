// lib/api/client.ts

/**
 * Ermittelt die Basis-URL abhängig vom Environment (Server vs. Client).
 */
export function getBaseUrl(): string {
  // 1. Im Browser: Relative Pfade nutzen (Proxy/Rewrites übernehmen den Rest)
  if (typeof window !== "undefined") return "";

  // 2. Auf dem Server: Wir brauchen eine absolute URL.
  // Prio A: Explizite Backend-URL (falls gesetzt)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Prio B: Vercel URL oder Localhost (Fallback)
  const domain =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : `http://localhost:${process.env.PORT || "3000"}`);

  return domain;
}

/**
 * Generischer API-Client für Next.js
 */
export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getBaseUrl();

  // Verhindert doppelte Slashes, falls endpoint mit / beginnt
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${cleanEndpoint}`;

  const defaultHeaders = {
    Accept: "application/json",
    // Optional: Hier Auth-Token injecten, falls nötig
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Standard für Next.js: Daten nicht cachen, es sei denn anders gewünscht.
    // Für statische Daten kannst du hier 'force-cache' setzen.
    cache: options.cache || "no-store",
  });

  // 404 Handling: Manche APIs werfen Fehler, manche geben null zurück.
  // Hier werfen wir Fehler, fangen sie aber spezifisch im Service ab, wenn null erlaubt ist.
  if (!response.ok) {
    throw new Error(`API Error ${response.status} at ${url}`);
  }

  return response.json() as Promise<T>;
}
