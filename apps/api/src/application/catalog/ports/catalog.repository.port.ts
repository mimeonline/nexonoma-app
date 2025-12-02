import { CatalogAggregate } from '../../../domain/catalog/catalog.aggregate';

export abstract class CatalogRepositoryPort {
  abstract loadCatalog(): Promise<CatalogAggregate>;
}
