import { Module } from '@nestjs/common';

// 1. Controller (Infrastructure -> Driving Adapter)
import { CatalogController } from './infrastructure/http/catalog.controller';
import { GridController } from './infrastructure/http/grid.controller';

// 2. Use Cases (Application Layer)
import { GetAllContentUseCase } from './application/use-cases/catalog/get-all-content.use-case';
import { GetContentDetailUseCase } from './application/use-cases/catalog/get-content-detail.use-case';
import { GetGridClustersUseCase } from './application/use-cases/grid/get-grid-clusters.use-case';
import { GetGridMacrosUseCase } from './application/use-cases/grid/get-grid-macros.use-case';
import { GetGridSegmentsUseCase } from './application/use-cases/grid/get-grid-segments.use-case';

// 3. Ports (Domain Layer)
import { AssetRepositoryPort } from './domain/ports/outbound/asset-repository.port';

// 4. Repositories & Mapper (Infrastructure -> Driven Adapter)
import { AssetMapper } from './infrastructure/persistence/asset.mapper';
import { Neo4jAssetRepository } from './infrastructure/persistence/neo4j-asset.repository';

@Module({
  imports: [], // Hier könnte man interne Module importieren, aktuell leer
  controllers: [GridController, CatalogController],
  providers: [
    // A) Hilfsklassen
    AssetMapper,

    // B) Use Cases registrieren (damit Controller sie injecten können)
    GetGridMacrosUseCase,
    GetGridClustersUseCase,
    GetGridSegmentsUseCase,
    GetAllContentUseCase,
    GetContentDetailUseCase,

    // C) Der Hexagonal-Trick (Dependency Inversion):
    // Wir sagen NestJS: "Wann immer jemand (z.B. ein UseCase) den 'AssetRepositoryPort' anfordert,
    // injiziere bitte die konkrete 'Neo4jAssetRepository' Implementierung."
    {
      provide: AssetRepositoryPort, // <-- Das Token (abstrakte Klasse)
      useClass: Neo4jAssetRepository, // <-- Die echte Implementierung
    },
  ],
  exports: [
    // Falls andere Module (z.B. ein SearchModule) Zugriff auf die Assets brauchen,
    // könntest du hier den Port exportieren. Für jetzt aber leer lassen.
  ],
})
export class NexonomaCoreModule {}
