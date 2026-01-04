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
  includeReview?: boolean;
  langs: readonly string[];
};

const getApiBase = () => {
  const apiBase = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return apiBase;
};

export const fetchSitemapNodesPage = async ({
  page,
  limit,
  includeReview,
  langs,
}: SitemapNodePageParams): Promise<SitemapNode[]> => {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    langs: langs.join(","),
  });

  if (includeReview) {
    searchParams.set("includeReview", "true");
  }

  const res = await fetch(`${getApiBase()}/public/sitemap/nodes?${searchParams.toString()}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return [];
  }

  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    return [];
  }

  return data as SitemapNode[];
};
