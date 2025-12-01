export type SegmentContentType = "method" | "concept" | "tool" | "technology";

export interface SegmentContentItem {
  id: string;
  name: string;
  slug: string;
  type: SegmentContentType;
  shortDescription?: string;
  longDescription?: string;
}

export interface SegmentContent {
  methods: SegmentContentItem[];
  concepts: SegmentContentItem[];
  tools: SegmentContentItem[];
  technologies: SegmentContentItem[];
}

export interface Segment {
  id: string;
  name: string;
  slug: string;
  type: "segment";
  shortDescription: string;
  longDescription: string;
  content: SegmentContent;
}

export interface Cluster {
  id: string;
  name: string;
  slug: string;
  type: "cluster";
  shortDescription: string;
  longDescription: string;
  segments: Segment[];
}

export interface MacroCluster {
  id: string;
  name: string;
  slug: string;
  type: "macroCluster";
  shortDescription: string;
  longDescription: string;
  clusters: Cluster[];
  icon?: string;
}

export interface GridData {
  macroClusters: MacroCluster[];
}

export interface GridMeta {
  requestId: string;
  timestamp: string;
  page: number;
  pageSize: number;
  total: number;
}

export interface GridResponse {
  data: GridData;
  meta: GridMeta;
  errors: unknown[];
}
