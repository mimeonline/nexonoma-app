import { StructuralAsset } from '../../../domain/entities/structural-asset.entity';

export abstract class GridRepositoryPort {
  // Page 1: Einstieg
  abstract findMacroClusters(locale: string): Promise<StructuralAsset[]>;
}
