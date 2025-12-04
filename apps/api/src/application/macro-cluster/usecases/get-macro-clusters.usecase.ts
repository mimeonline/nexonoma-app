import { Injectable } from '@nestjs/common';
import { MacroClusterResponseDto } from '../dto/macro-cluster.response.dto';
import { MacroClusterRepositoryPort } from '../ports/macro-cluster.repository.port';

@Injectable()
export class GetMacroClustersUseCase {
  constructor(
    private readonly macroClusterRepository: MacroClusterRepositoryPort,
  ) {}

  async execute(): Promise<MacroClusterResponseDto> {
    const aggregate = await this.macroClusterRepository.loadMacroClusters();
    return new MacroClusterResponseDto(aggregate);
  }
}
