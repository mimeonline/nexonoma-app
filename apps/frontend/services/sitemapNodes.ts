export type SitemapNode = {
  id: string;
  type: string;
  slug: string;
  updatedAt?: string;
  createdAt?: string;
  availableLanguages?: string[];
};

export type SitemapNodePageParams = {
  page: number;
  limit: number;
};

const getApiBase = () => {
  const apiBase = process.env.API_INTERNAL_URL;
  if (!apiBase) {
    throw new Error("API_INTERNAL_URL is not set");
  }
  return apiBase;
};

export const fetchSitemapNodesPage = async ({ page, limit }: SitemapNodePageParams): Promise<SitemapNode[]> => {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    status: "published",
    types: "concept,method,tool,technology",
  });

  const res = await fetch(`${getApiBase()}/system/catalog/index?${searchParams.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const data: unknown = await res.json();
  if (!data || typeof data !== "object") {
    return [];
  }

  const items = (data as { items?: unknown }).items;
  if (!Array.isArray(items)) {
    return [];
  }

  return items as SitemapNode[];
};
