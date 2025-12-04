import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetBlock } from '../../../domain/entities/asset.entity';
import { AssetRepositoryPort } from '../../../domain/ports/outbound/asset-repository.port';

@Injectable()
export class GetContentDetailUseCase {
  constructor(private readonly assetRepo: AssetRepositoryPort) {}

  async execute(id: string): Promise<AssetBlock> {
    // Wir nutzen findById, das sowohl Content als auch Context (Role) finden kann
    const asset = await this.assetRepo.findById(id);

    if (!asset) {
      throw new NotFoundException(`Asset with ID '${id}' not found`);
    }

    return asset;
  }
}
