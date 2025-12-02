import { Module } from '@nestjs/common';
import { CatalogController } from './controllers/catalog.controller';
import { GridController } from './controllers/grid.controller';

import { CatalogRepositoryPort } from '../../application/catalog/ports/catalog.repository.port';
import { GetCatalogUseCase } from '../../application/catalog/usecases/get-catalog.usecase';
import { GetCatalogItemByIdUseCase } from '../../application/catalog/usecases/get-catalog-item-by-id.usecase';
import { CatalogRepositoryNeo4j } from '../persistence/neo4j/catalog.repository.neo4j';
import { GridRepositoryPort } from '../../application/grid/ports/grid.repository.port';
import { GetGridUseCase } from '../../application/grid/usecases/get-grid.usecase';
import { GridRepositoryNeo4j } from '../persistence/neo4j/grid.repository.neo4j';

import { Neo4jModule } from '../persistence/neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule],
  controllers: [GridController, CatalogController],
  providers: [
    GetGridUseCase,
    GetCatalogUseCase,
    GetCatalogItemByIdUseCase,
    {
      provide: GridRepositoryPort,
      useClass: GridRepositoryNeo4j,
    },
    {
      provide: CatalogRepositoryPort,
      useClass: CatalogRepositoryNeo4j,
    },
  ],
})
export class HttpModule {}
