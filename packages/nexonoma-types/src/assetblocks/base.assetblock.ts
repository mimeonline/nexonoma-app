import { Relation } from "../relations";

export type AssetBlockType =
  | "macroCluster"
  | "cluster"
  | "clusterView"
  | "segment"
  | "concept"
  | "method"
  | "tool"
  | "technology"
  | "role";

// Organizational scope matches json schema (Enterprise/Domain/Team)
export type OrganizationalLevel = "Enterprise" | "Domain" | "Team";

/**
 * Gemeinsamer Basistyp für alle AssetBlocks.
 * Schema: schemas/nodes/assetblock-base.schema.json
 * Optional: abbreviation, organizationalLevel, relations (UI-Referenzen), customFields bleibt required als Erweiterungsslot.
 */
export interface BaseAssetBlock {
  id: string;
  name: string;
  slug: string;
  type: AssetBlockType;
  abbreviation?: string;
  shortDescription: string;
  longDescription: string;
  status: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  author: string;
  contributor: string[];
  license: string;
  language: string;
  tags: string[];
  organizationalLevel?: OrganizationalLevel[];
  customFields: Record<string, unknown>;
  relations?: Relation[]; // optional in schema
}
