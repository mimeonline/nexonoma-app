import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetRepositoryPort } from '../../../domain/ports/outbound/asset-repository.port';
import type { AssetBlockDto } from '../../dtos/assets/asset-block.dto';
import { mapAssetBlockToDto } from '../shared/asset-dto.mapper';

@Injectable()
export class GetContentDetailUseCase {
  constructor(private readonly assetRepo: AssetRepositoryPort) {}

  async execute(locale: string, id: string): Promise<AssetBlockDto> {
    // Wir nutzen findById, das sowohl Content als auch Context (Role) finden kann
    const asset = await this.assetRepo.findById(locale, id);

    if (!asset) {
      throw new NotFoundException(`Asset with ID '${id}' not found`);
    }

    return mapAssetBlockToDto(asset);
  }
}
