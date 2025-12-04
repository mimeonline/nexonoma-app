import { AssetBlock } from '../../entities/asset.entity';
import { ContentAsset } from '../../entities/content-asset.entity';
import { ContextAsset } from '../../entities/context-asset.entity';
import { StructuralAsset } from '../../entities/structural-asset.entity';

export abstract class AssetRepositoryPort {
  // Findet Strukturelemente (Macro, Cluster, Segment) anhand Slug
  abstract findStructuralBySlug(slug: string): Promise<StructuralAsset | null>;

  // Findet Content (Tool, Method) oder Context (Role) anhand ID (für Detail Page)
  abstract findById(id: string): Promise<ContentAsset | ContextAsset | null>;

  // Findet Context (Role) anhand Slug
  abstract findContentBySlug(
    type: string,
    slug: string,
  ): Promise<ContentAsset | null>;

  // Findet alle Kinder eines Parents (egal ob Structure oder Content)
  abstract findChildren(parentId: string): Promise<AssetBlock[]>;

  // Page 1: Einstieg
  abstract findMacroClusters(): Promise<StructuralAsset[]>;

  // Page 4: Katalog Liste (Optional mit Filter)
  abstract findAllContent(): Promise<ContentAsset[]>;
}
