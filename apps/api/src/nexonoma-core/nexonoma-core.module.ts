import { Module } from '@nestjs/common';

// 1. Controller (Infrastructure -> Driving Adapter)
import { CatalogController } from './infrastructure/http/catalog/catalog.controller';
import { ContentController } from './infrastructure/http/content/content.controller';
import { GridController } from './infrastructure/http/grid/grid.controller';
import { MatrixController } from './infrastructure/http/matrix/matrix.controller';
import { Overview360Controller } from './infrastructure/http/overview360/overview360.controller';
import { PublicSitemapController } from './infrastructure/http/public/public-sitemap.controller';
import { SystemIndexController } from './infrastructure/http/system/system-index.controller';

// 2. Use Cases (Application Layer)
import { GetAllContentUseCase } from './application/use-cases/catalog/get-all-content.use-case';
import { GetContentBySlugUseCase } from './application/use-cases/catalog/get-content-by-slug.use-case';
import { GetContentDetailUseCase } from './application/use-cases/catalog/get-content-detail.use-case';
import { GetContentUseCase } from './application/use-cases/content/get-content.use-case';
import { GetClusterViewUseCase } from './application/use-cases/grid/get-cluster-view.use-case';
import { GetGridOverviewUseCase } from './application/use-cases/grid/get-grid-overview.use-case';
import { GetMacroClusterViewUseCase } from './application/use-cases/grid/get-macrocluster-view.use-case';
import { GetMatrixUseCase } from './application/use-cases/matrix/get-matrix.use-case';
import { GetOverview360UseCase } from './application/use-cases/overview360/get-overview360.use-case';
import { GetPublicSitemapNodesUseCase } from './application/use-cases/system/get-public-sitemap-nodes.use-case';
import { GetSystemContentIndexUseCase } from './application/use-cases/system/get-system-content-index.use-case';

// 3. Ports (Domain Layer)
import { CatalogRepositoryPort } from './application/ports/catalog/catalog-repository.port';
import { ContentRepositoryPort } from './application/ports/content/content-repository.port';
import { GridRepositoryPort } from './application/ports/grid/grid-repository.port';
import { MatrixRepositoryPort } from './application/ports/matrix/matrix-repository.port';
import { Overview360RepositoryPort } from './application/ports/overview360/overview360-repository.port';
import { SystemContentRepositoryPort } from './application/ports/system/system-content-repository.port';
import { AssetRepositoryPort } from './domain/ports/outbound/asset-repository.port';

// 4. Repositories & Mapper (Infrastructure -> Driven Adapter)
import { Neo4jCatalogRepository } from './infrastructure/persistence/neo4j/catalog/neo4j-catalog.repository';
import { Neo4jContentRepository } from './infrastructure/persistence/neo4j/content/neo4j-content.repository';
import { Neo4jGridRepository } from './infrastructure/persistence/neo4j/grid/neo4j-grid.repository';
import { Neo4jMatrixRepository } from './infrastructure/persistence/neo4j/matrix/neo4j-matrix.repository';
import { Neo4jOverview360Repository } from './infrastructure/persistence/neo4j/overview360/neo4j-overview360.repository';
import { AssetMapper } from './infrastructure/persistence/neo4j/shared/asset.mapper';
import { Neo4jAssetRepository } from './infrastructure/persistence/neo4j/shared/neo4j-asset.repository';
import { Neo4jSystemIndexRepository } from './infrastructure/persistence/neo4j/system/neo4j-system-index.repository';

@Module({
  imports: [], // Hier könnte man interne Module importieren, aktuell leer
  controllers: [
    GridController,
    CatalogController,
    MatrixController,
    PublicSitemapController,
    SystemIndexController,
    ContentController,
    Overview360Controller,
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
    GetSystemContentIndexUseCase,
    GetPublicSitemapNodesUseCase,
    GetMatrixUseCase,
    GetContentUseCase,
    GetOverview360UseCase,

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
      provide: SystemContentRepositoryPort,
      useClass: Neo4jSystemIndexRepository,
    },
    {
      provide: MatrixRepositoryPort,
      useClass: Neo4jMatrixRepository,
    },
    {
      provide: ContentRepositoryPort,
      useClass: Neo4jContentRepository,
    },
    {
      provide: Overview360RepositoryPort,
      useClass: Neo4jOverview360Repository,
    },
  ],
  exports: [
    // Falls andere Module (z.B. ein SearchModule) Zugriff auf die Assets brauchen,
    // könntest du hier den Port exportieren. Für jetzt aber leer lassen.
  ],
})
export class NexonomaCoreModule {}
