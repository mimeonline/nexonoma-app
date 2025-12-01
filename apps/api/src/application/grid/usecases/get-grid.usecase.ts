import { Injectable } from '@nestjs/common';
import { GridResponseDto } from '../dto/grid.response.dto';
import { GridRepositoryPort } from '../ports/grid.repository.port';

@Injectable()
export class GetGridUseCase {
  constructor(private readonly gridRepository: GridRepositoryPort) {}

  async execute(): Promise<GridResponseDto> {
    const aggregate = await this.gridRepository.loadGrid();
    return new GridResponseDto(aggregate);
  }
}
