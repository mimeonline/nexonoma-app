import { AssetBlock } from '../../../domain/entities/asset.entity';
import { ContentAsset } from '../../../domain/entities/content-asset.entity';
import { ContextAsset } from '../../../domain/entities/context-asset.entity';
import { StructuralAsset } from '../../../domain/entities/structural-asset.entity';
import type { AssetBaseDto } from '../../dtos/assets/asset-base.dto';
import type { AssetBlockDto } from '../../dtos/assets/asset-block.dto';
import type { ContentAssetDto } from '../../dtos/assets/content-asset.dto';
import type { ContextAssetDto } from '../../dtos/assets/context-asset.dto';
import type { StructuralAssetDto } from '../../dtos/assets/structural-asset.dto';

const toIsoString = (value: Date | string): string =>
  value instanceof Date ? value.toISOString() : value;

const mapAssetBase = (asset: AssetBlock): AssetBaseDto => ({
  id: asset.id,
  slug: asset.slug,
  name: asset.name,
  type: asset.type,
  status: asset.status,
  version: asset.version,
  language: asset.language,
  license: asset.license,
  createdAt: toIsoString(asset.createdAt),
  updatedAt: toIsoString(asset.updatedAt),
  author: asset.author,
  contributor: asset.contributor ?? [],
  shortDescription: asset.shortDescription,
  longDescription: asset.longDescription,
  tags: asset.tags ?? [],
  tagOrder: asset.tagOrder,
  abbreviation: asset.abbreviation,
  organizationalLevel: asset.organizationalLevel ?? [],
  icon: asset.icon,
  image: asset.image,
});

export const mapContentAssetToDto = (asset: ContentAsset): ContentAssetDto => ({
  ...mapAssetBase(asset),
  useCases: asset.useCases ?? [],
  scenarios: asset.scenarios ?? [],
  examples: asset.examples ?? [],
  resources: asset.resources ?? [],
  tradeoffMatrix: asset.tradeoffMatrix ?? [],
  metrics: asset.metrics ?? [],
  maturityLevel: asset.maturityLevel,
  complexityLevel: asset.complexityLevel,
  impacts: asset.impacts,
  decisionType: asset.decisionType,
  organizationalMaturity: asset.organizationalMaturity,
  valueStreamStage: asset.valueStreamStage,
  cognitiveLoad: asset.cognitiveLoad,
  principles: asset.principles ?? [],
  inputs: asset.inputs ?? [],
  outputs: asset.outputs ?? [],
  integrations: asset.integrations ?? [],
  architecturalDrivers: asset.architecturalDrivers ?? [],
  bottleneckTags: asset.bottleneckTags ?? [],
  benefits: asset.benefits ?? [],
  limitations: asset.limitations ?? [],
  requiredSkills: asset.requiredSkills ?? [],
  implementationSteps: asset.implementationSteps ?? [],
  preconditions: asset.preconditions ?? [],
  risks: asset.risks ?? [],
  bestPractices: asset.bestPractices ?? [],
  antiPatterns: asset.antiPatterns ?? [],
  techDebts: asset.techDebts ?? [],
  misuseExamples: asset.misuseExamples ?? [],
  traps: asset.traps ?? [],
  constraints: asset.constraints ?? [],
  vendor: asset.vendor,
});

export const mapContextAssetToDto = (asset: ContextAsset): ContextAssetDto =>
  mapAssetBase(asset);

export const mapStructuralAssetToDto = (
  asset: StructuralAsset,
): StructuralAssetDto => ({
  ...mapAssetBase(asset),
  framework: asset.framework,
  parentId: asset.parentId,
  children: (asset.children ?? []).map((child) => mapAssetBlockToDto(child)),
  childrenCount: asset.childrenCount ?? 0,
});

export const mapAssetBlockToDto = (asset: AssetBlock): AssetBlockDto => {
  if (asset instanceof ContentAsset) {
    return mapContentAssetToDto(asset);
  }
  if (asset instanceof StructuralAsset) {
    return mapStructuralAssetToDto(asset);
  }
  return mapContextAssetToDto(asset as ContextAsset);
};
