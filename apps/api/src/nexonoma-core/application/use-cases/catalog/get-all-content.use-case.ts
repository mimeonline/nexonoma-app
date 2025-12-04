import { Injectable } from '@nestjs/common';
import { ContentAsset } from '../../../domain/entities/content-asset.entity';
import { AssetRepositoryPort } from '../../../domain/ports/outbound/asset-repository.port';

@Injectable()
export class GetAllContentUseCase {
  constructor(private readonly assetRepo: AssetRepositoryPort) {}

  async execute(): Promise<ContentAsset[]> {
    // Ruft alle Content-Bausteine ab.
    // Hier könnte man später Filter-Parameter (z.B. type='tool') durchreichen.
    return this.assetRepo.findAllContent();
  }
}
