import { Controller, Get, Param } from '@nestjs/common';
import { GetMacroClustersUseCase } from '../../../application/macro-cluster/usecases/get-macro-clusters.usecase';
import { GetMacroClusterByIdUseCase } from '../../../application/macro-cluster/usecases/get-macro-cluster-by-id.usecase';

@Controller('api/macrocluster')
export class MacroClusterController {
  constructor(
    private readonly getMacroClustersUseCase: GetMacroClustersUseCase,
    private readonly getMacroClusterByIdUseCase: GetMacroClusterByIdUseCase,
  ) {}

  @Get()
  async getMacroClusters() {
    return this.getMacroClustersUseCase.execute();
  }

  @Get(':id')
  async getMacroClusterById(@Param('id') id: string) {
    return this.getMacroClusterByIdUseCase.execute(id);
  }
}
