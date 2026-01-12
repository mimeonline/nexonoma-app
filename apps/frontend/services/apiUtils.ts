export class ApiError extends Error {
  status: number;
  url: string;

  constructor(message: string, status: number, url: string) {
    super(message);
    this.status = status;
    this.url = url;
  }
}

type ApiBaseOptions = {
  preferInternal?: boolean;
};

export function getApiBase(options: ApiBaseOptions = {}): string {
  const isServer = typeof window === "undefined";
  const preferInternal = options.preferInternal ?? true;

  const apiBase = isServer
    ? preferInternal
      ? process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL
      : process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL;

  if (!apiBase) {
    const hint = isServer ? "API_INTERNAL_URL or NEXT_PUBLIC_API_URL" : "NEXT_PUBLIC_API_URL";
    throw new Error(`${hint} is not set`);
  }

  return apiBase;
}

type FetchJsonOptions = {
  cache?: RequestCache;
  next?: { revalidate?: number };
  errorLabel?: string;
};

export async function fetchJson<T>(url: string, options: FetchJsonOptions = {}): Promise<T> {
  const res = await fetch(url, { cache: options.cache ?? "no-store", next: options.next });
  if (!res.ok) {
    const statusText = res.statusText || "Unknown";
    const label = options.errorLabel ?? "Request failed";
    throw new ApiError(`${label} (${res.status} ${statusText}) at ${url}`, res.status, url);
  }
  return res.json() as Promise<T>;
}

type FetchJsonSafeOptions = FetchJsonOptions & {
  logLabel: string;
};

export async function fetchJsonSafe<T>(url: string, options: FetchJsonSafeOptions): Promise<T | null> {
  try {
    return await fetchJson<T>(url, options);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[api] ${options.logLabel}`, { url, error: message });
    return null;
  }
}
