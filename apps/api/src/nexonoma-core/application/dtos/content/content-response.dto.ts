import type { AssetType } from '../../../domain/types/asset-enums';
import type { LocalizedTagDto } from '../assets/localized-tag.dto';

export type ContentResponseDto = {
  assetBlock: ContentAssetBlockDto;
  structure: ContentStructureDto;
  relations: ContentRelationsDto;
};

export type ContentAssetBlockDto = {
  id: string;
  slug: string;
  type: AssetType;
  name: string;
  icon: string | null;
  tags: LocalizedTagDto[];
  tagOrder: string[];
  shortDescription: string;
  longDescription: string;
  /**
   * Maps domain "organizationalLevel" (array) to the first entry for API compatibility.
   * Spelling is intentionally "organisationLevel" to match the existing frontend contract.
   */
  organisationLevel: string | null;
  organizationalMaturity: string | null;
  impacts: string | null;
  decisionType: string | null;
  complexityLevel: string | null;
  /**
   * Maps domain "valueStreamStage" to "valueStream" for API compatibility.
   */
  valueStream: string | null;
  maturityLevel: string | null;
  cognitiveLoad: string | null;
};

export type ContentStructureDto = {
  paths: ContentStructurePathDto[];
};

export type ContentStructurePathDto = {
  macroCluster: ContentStructureNodeDto;
  cluster: ContentStructureNodeDto;
  segment: ContentStructureSegmentDto;
};

export type ContentStructureNodeDto = {
  name: string;
  slug: string;
};

export type ContentStructureSegmentDto = {
  name: string;
  slug: string;
  tags: LocalizedTagDto[];
  tagOrder: string[];
};

export type ContentRelationsDto = {
  items: ContentRelationItemDto[];
};

export type ContentRelationItemDto = {
  id: string;
  type: string | null;
  relation: string | null;
  node: ContentRelationNodeDto;
};

export type ContentRelationNodeDto = {
  id: string;
  type: AssetType;
  slug: string;
  name: string;
  icon: string | null;
};
