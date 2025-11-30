export type ContentType = "method" | "concept" | "tool" | "technology";

export type ContentItem = {
  id: string;
  name: string;
  slug: string;
  type: ContentType;
  shortDescription: string;
  longDescription: string;
};

export type ContentGroup = {
  methods: ContentItem[];
  concepts: ContentItem[];
  tools: ContentItem[];
  technologies: ContentItem[];
};

export type Segment = {
  id: string;
  name: string;
  slug: string;
  type: "segment";
  shortDescription: string;
  longDescription: string;
  content: ContentGroup;
};

export type Cluster = {
  id: string;
  name: string;
  slug: string;
  type: "cluster";
  shortDescription: string;
  longDescription: string;
  segments: Segment[];
};

export type MacroCluster = {
  id: string;
  name: string;
  slug: string;
  type: "macroCluster";
  shortDescription: string;
  longDescription: string;
  clusters: Cluster[];
  icon?: string;
};

export type GridData = {
  macroClusters: MacroCluster[];
};

export type GridMeta = {
  requestId: string;
  timestamp: string;
  page: number;
  pageSize: number;
  total: number;
};

export type GridResponse = {
  data: GridData;
  meta: GridMeta;
  errors: unknown[];
};
