import { ContentRecord } from 'src/nexonoma-core/infrastructure/persistence/neo4j/content/content-record.mapper';
import type { AssetType } from '../../../domain/types/asset-enums';

export abstract class ContentRepositoryPort {
  abstract findByTypeAndSlug(
    locale: string,
    assetType: AssetType,
    slug: string,
  ): Promise<ContentRecord | null>;
}
