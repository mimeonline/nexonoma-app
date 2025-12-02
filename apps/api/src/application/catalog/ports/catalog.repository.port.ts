import { CatalogAggregate } from '../../../domain/catalog/catalog.aggregate';
import { CatalogEntity } from '../../../domain/catalog/catalog.entity';

export abstract class CatalogRepositoryPort {
  abstract loadCatalog(): Promise<CatalogAggregate>;
  abstract loadCatalogItemById(id: string): Promise<CatalogEntity | null>;
}
