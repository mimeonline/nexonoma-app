import { Module } from '@nestjs/common';
import { GridController } from './controllers/grid.controller';

import { GridRepositoryPort } from '../../application/grid/ports/grid.repository.port';
import { GetGridUseCase } from '../../application/grid/usecases/get-grid.usecase';
import { GridRepositoryNeo4j } from '../persistence/neo4j/grid.repository.neo4j';

import { Neo4jModule } from '../persistence/neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule],
  controllers: [GridController],
  providers: [
    GetGridUseCase,
    {
      provide: GridRepositoryPort,
      useClass: GridRepositoryNeo4j,
    },
  ],
})
export class HttpModule {}
