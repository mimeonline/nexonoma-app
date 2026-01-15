import { CatalogIndexRecord } from '../../../domain/entities/catalog-index-record.entity';

export type SystemContentIndexOptions = {
  has360?: boolean;
};

export abstract class SystemContentRepositoryPort {
  // System: minimaler Index für Sitemap/Indexing
  abstract findContentIndex(
    locale: string,
    options?: SystemContentIndexOptions,
  ): Promise<CatalogIndexRecord[]>;
}
