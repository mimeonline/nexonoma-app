export type ContentTag = {
  slug: string;
  label: string;
};

export type ContentAssetBlock = {
  id: string;
  slug: string;
  type: string;
  name: string;
  icon: string | null;
  tags: ContentTag[];
  tagOrder: string[];
  shortDescription: string;
  longDescription: string;
  organisationLevel: string | null;
  organizationalMaturity: string | null;
  impacts: string | null;
  decisionType: string | null;
  complexityLevel: string | null;
  valueStream: string | null;
  maturityLevel: string | null;
  cognitiveLoad: string | null;
};

export type ContentStructurePath = {
  macroCluster: { name: string; slug: string };
  cluster: { name: string; slug: string };
  segment: { name: string; slug: string; tags?: ContentTag[]; tagOrder?: string[] };
};

export type ContentRelation = {
  id: string;
  type: string | null;
  relation: string | null;
  node: {
    id: string;
    type: string;
    slug: string;
    name: string;
    icon: string | null;
  };
};

export type ContentResponse = {
  assetBlock: ContentAssetBlock;
  structure: { paths: ContentStructurePath[] };
  relations: { items: ContentRelation[] };
};
