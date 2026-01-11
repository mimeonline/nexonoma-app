import { ContentAsset } from '../../../domain/entities/content-asset.entity';

export abstract class CatalogRepositoryPort {
  // Page 4: Katalog Liste (Optional mit Filter)
  abstract findAllContent(locale: string): Promise<ContentAsset[]>;
}
