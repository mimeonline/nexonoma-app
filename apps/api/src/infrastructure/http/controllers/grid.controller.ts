import { Controller, Get } from '@nestjs/common';
import { GetGridUseCase } from '../../../application/grid/usecases/get-grid.usecase';

@Controller('grid')
export class GridController {
  constructor(private readonly getGridUseCase: GetGridUseCase) {}

  @Get()
  async getGrid() {
    // Keine Logik im Controller – reine Orchestrierung
    return this.getGridUseCase.execute();
  }
}
