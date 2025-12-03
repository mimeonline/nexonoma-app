export type CatalogContentType = "concept" | "method" | "tool" | "technology";

export interface CatalogItem {
  id: string;
  name: string;
  slug: string;
  type: CatalogContentType | string;
  shortDescription?: string;
  longDescription?: string;
  tags?: string[];
  segmentName?: string;
  clusterName?: string;
  macroClusterName?: string;
  segmentSlug?: string;
  clusterSlug?: string;
  macroClusterSlug?: string;
  maturityLevel?: string;
  complexityLevel?: string;
  cognitiveLoad?: string;
  status?: string;
  impact?: string;
  decisionType?: string;
  organizationalMaturity?: string;
  tradeoffMatrix?: Record<string, unknown>[];
  integration?: string;
  valueStreamStage?: string;
  principles?: string[];
  organizationalLevel?: string[];
  [key: string]: unknown;
}

export interface CatalogResponse {
  data: {
    items: CatalogItem[];
  };
  meta: {
    requestId: string;
    timestamp: string;
    page: number;
    pageSize: number;
    total: number;
  };
  errors: unknown[];
}
