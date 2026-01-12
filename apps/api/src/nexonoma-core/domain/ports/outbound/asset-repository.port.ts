import { AssetBlock } from '../../entities/asset.entity';
import { ContentAsset } from '../../entities/content-asset.entity';
import { ContextAsset } from '../../entities/context-asset.entity';
import { StructuralAsset } from '../../entities/structural-asset.entity';

export abstract class AssetRepositoryPort {
  // Findet Strukturelemente (Macro, Cluster, Segment) anhand Slug
  abstract findStructuralBySlug(
    locale: string,
    slug: string,
  ): Promise<StructuralAsset | null>;

  // Findet Content (Tool, Method) oder Context (Role) anhand ID (für Detail Page)
  abstract findById(
    locale,
    id: string,
  ): Promise<ContentAsset | ContextAsset | null>;

  // Findet Context (Role) anhand Slug
  abstract findContentBySlug(
    locale: string,
    type: string,
    slug: string,
  ): Promise<ContentAsset | null>;

  // Findet alle Kinder eines Parents (egal ob Structure oder Content)
  abstract findChildren(
    locale: string,
    parentId: string,
  ): Promise<AssetBlock[]>;
}
