import { CatalogIndexRecord } from '../../../domain/entities/catalog-index-record.entity';

export abstract class SystemContentRepositoryPort {
  // System: minimaler Index für Sitemap/Indexing
  abstract findContentIndex(locale: string): Promise<CatalogIndexRecord[]>;
}
