import { Module } from '@nestjs/common';

// 1. Controller (Infrastructure -> Driving Adapter)
import { CatalogController } from './infrastructure/http/catalog/catalog.controller';
import { GridController } from './infrastructure/http/grid/grid.controller';
import { MatrixController } from './infrastructure/http/matrix/matrix.controller';
import { PublicSitemapController } from './infrastructure/http/public/public-sitemap.controller';
import { SystemCatalogController } from './infrastructure/http/system/system-catalog.controller';

// 2. Use Cases (Application Layer)
import { GetAllContentUseCase } from './application/use-cases/catalog/get-all-content.use-case';
import { GetContentBySlugUseCase } from './application/use-cases/catalog/get-content-by-slug.use-case';
import { GetContentDetailUseCase } from './application/use-cases/catalog/get-content-detail.use-case';
import { GetSystemCatalogIndexUseCase } from './application/use-cases/system/get-system-catalog-index.use-case';
import { GetPublicSitemapNodesUseCase } from './application/use-cases/system/get-public-sitemap-nodes.use-case';
import { GetMacroClusterViewUseCase } from './application/use-cases/grid/get-macrocluster-view.use-case';
import { GetGridOverviewUseCase } from './application/use-cases/grid/get-grid-overview.use-case';
import { GetClusterViewUseCase } from './application/use-cases/grid/get-cluster-view.use-case';
import { GetMatrixUseCase } from './application/use-cases/matrix/get-matrix.use-case';

// 3. Ports (Domain Layer)
import { AssetRepositoryPort } from './domain/ports/outbound/asset-repository.port';
import { MatrixRepositoryPort } from './application/ports/matrix/matrix-repository.port';
import { CatalogRepositoryPort } from './application/ports/catalog/catalog-repository.port';
import { GridRepositoryPort } from './application/ports/grid/grid-repository.port';
import { SystemCatalogRepositoryPort } from './application/ports/system/system-catalog-repository.port';

// 4. Repositories & Mapper (Infrastructure -> Driven Adapter)
import { AssetMapper } from './infrastructure/persistence/neo4j/shared/asset.mapper';
import { Neo4jAssetRepository } from './infrastructure/persistence/neo4j/shared/neo4j-asset.repository';
import { Neo4jMatrixRepository } from './infrastructure/persistence/neo4j/matrix/neo4j-matrix.repository';
import { Neo4jGridRepository } from './infrastructure/persistence/neo4j/grid/neo4j-grid.repository';
import { Neo4jCatalogRepository } from './infrastructure/persistence/neo4j/catalog/neo4j-catalog.repository';
import { Neo4jSystemCatalogRepository } from './infrastructure/persistence/neo4j/system/neo4j-system-catalog.repository';

@Module({
  imports: [], // Hier könnte man interne Module importieren, aktuell leer
  controllers: [
    GridController,
    CatalogController,
    MatrixController,
    PublicSitemapController,
    SystemCatalogController,
  ],
  providers: [
    // A) Hilfsklassen
    AssetMapper,

    // B) Use Cases registrieren (damit Controller sie injecten können)
    GetGridOverviewUseCase,
    GetMacroClusterViewUseCase,
    GetClusterViewUseCase,
    GetAllContentUseCase,
    GetContentDetailUseCase,
    GetContentBySlugUseCase,
    GetSystemCatalogIndexUseCase,
    GetPublicSitemapNodesUseCase,
    GetMatrixUseCase,

    // C) Der Hexagonal-Trick (Dependency Inversion):
    // Wir sagen NestJS: "Wann immer jemand (z.B. ein UseCase) den 'AssetRepositoryPort' anfordert,
    // injiziere bitte die konkrete 'Neo4jAssetRepository' Implementierung."
    {
      provide: AssetRepositoryPort, // <-- Das Token (abstrakte Klasse)
      useClass: Neo4jAssetRepository, // <-- Die echte Implementierung
    },
    {
      provide: GridRepositoryPort,
      useClass: Neo4jGridRepository,
    },
    {
      provide: CatalogRepositoryPort,
      useClass: Neo4jCatalogRepository,
    },
    {
      provide: SystemCatalogRepositoryPort,
      useClass: Neo4jSystemCatalogRepository,
    },
    {
      provide: MatrixRepositoryPort,
      useClass: Neo4jMatrixRepository,
    },
  ],
  exports: [
    // Falls andere Module (z.B. ein SearchModule) Zugriff auf die Assets brauchen,
    // könntest du hier den Port exportieren. Für jetzt aber leer lassen.
  ],
})
export class NexonomaCoreModule {}
