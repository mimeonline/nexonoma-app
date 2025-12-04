import { Controller, Get, Param } from '@nestjs/common';

// Diese Imports erstellen wir in den nächsten Schritten
import { GetGridClustersUseCase } from '../../application/use-cases/grid/get-grid-clusters.use-case';
import { GetGridMacrosUseCase } from '../../application/use-cases/grid/get-grid-macros.use-case';
import { GetGridSegmentsUseCase } from '../../application/use-cases/grid/get-grid-segments.use-case';

@Controller('grid') // Base Route: /api/grid (wenn global prefix 'api' gesetzt ist)
export class GridController {
  constructor(
    private readonly getMacros: GetGridMacrosUseCase,
    private readonly getClusters: GetGridClustersUseCase,
    private readonly getSegments: GetGridSegmentsUseCase,
  ) {}

  /**
   * PAGE 1: Einstiegspunkt
   * Zeigt alle Macro Clusters an (z.B. "Software & Architektur", "Organisation").
   */
  @Get('macros')
  async getMacrosPage() {
    return this.getMacros.execute();
  }

  /**
   * PAGE 2: Cluster-Übersicht
   * Zeigt für ein gewähltes MacroCluster (slug) die enthaltenen Cluster an.
   * Beispiel: /api/grid/macros/software-architecture/clusters
   */
  @Get('macros/:slug/clusters')
  async getClustersPage(@Param('slug') macroSlug: string) {
    return this.getClusters.execute(macroSlug);
  }

  /**
   * PAGE 3: Segment-Ansicht (Deep Dive)
   * Zeigt für ein Cluster (slug) alle Segmente und deren Content-Bausteine.
   * Das ist die Datenbasis für die detaillierte Grid/City-Ansicht.
   * Beispiel: /api/grid/clusters/frontend-development/segments
   */
  @Get('clusters/:slug/segments')
  async getSegmentsPage(@Param('slug') clusterSlug: string) {
    return this.getSegments.execute(clusterSlug);
  }
}
