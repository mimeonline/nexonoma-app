import { CatalogIndexRecord } from '../../../domain/entities/catalog-index-record.entity';

export abstract class SystemCatalogRepositoryPort {
  // System: minimaler Index für Sitemap/Indexing
  abstract findContentIndex(locale: string): Promise<CatalogIndexRecord[]>;
}
