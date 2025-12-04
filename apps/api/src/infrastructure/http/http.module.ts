import { Module } from '@nestjs/common';
import { CatalogController } from './controllers/catalog.controller';
import { GridController } from './controllers/grid.controller';
import { MacroClusterController } from './controllers/macro-cluster.controller';

import { CatalogRepositoryPort } from '../../application/catalog/ports/catalog.repository.port';
import { GetCatalogUseCase } from '../../application/catalog/usecases/get-catalog.usecase';
import { GetCatalogItemByIdUseCase } from '../../application/catalog/usecases/get-catalog-item-by-id.usecase';
import { CatalogRepositoryNeo4j } from '../persistence/neo4j/catalog.repository.neo4j';
import { GridRepositoryPort } from '../../application/grid/ports/grid.repository.port';
import { GetGridUseCase } from '../../application/grid/usecases/get-grid.usecase';
import { GridRepositoryNeo4j } from '../persistence/neo4j/grid.repository.neo4j';
import { MacroClusterRepositoryPort } from '../../application/macro-cluster/ports/macro-cluster.repository.port';
import { GetMacroClustersUseCase } from '../../application/macro-cluster/usecases/get-macro-clusters.usecase';
import { GetMacroClusterByIdUseCase } from '../../application/macro-cluster/usecases/get-macro-cluster-by-id.usecase';
import { MacroClusterRepositoryNeo4j } from '../persistence/neo4j/macro-cluster.repository.neo4j';

import { Neo4jModule } from '../persistence/neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule],
  controllers: [GridController, CatalogController, MacroClusterController],
  providers: [
    GetGridUseCase,
    GetCatalogUseCase,
    GetCatalogItemByIdUseCase,
    GetMacroClustersUseCase,
    GetMacroClusterByIdUseCase,
    {
      provide: GridRepositoryPort,
      useClass: GridRepositoryNeo4j,
    },
    {
      provide: CatalogRepositoryPort,
      useClass: CatalogRepositoryNeo4j,
    },
    {
      provide: MacroClusterRepositoryPort,
      useClass: MacroClusterRepositoryNeo4j,
    },
  ],
})
export class HttpModule {}
