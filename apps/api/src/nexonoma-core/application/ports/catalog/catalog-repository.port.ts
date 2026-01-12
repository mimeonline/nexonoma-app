import { CatalogRecord } from 'src/nexonoma-core/infrastructure/persistence/neo4j/catalog/catalog-record.mapper';

export abstract class CatalogRepositoryPort {
  // Page 4: Katalog Liste (Optional mit Filter)
  abstract findAllContent(locale): Promise<CatalogRecord[]>;
}
