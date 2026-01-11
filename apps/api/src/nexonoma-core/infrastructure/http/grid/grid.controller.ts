import { Controller, Get, Param } from '@nestjs/common';

// Diese Imports erstellen wir in den nächsten Schritten
import { I18nLang } from 'nestjs-i18n';
import { GetGridClustersUseCase } from '../../../application/use-cases/grid/get-grid-clusters.use-case';
import { GetGridMacrosUseCase } from '../../../application/use-cases/grid/get-grid-macros.use-case';
import { GetGridSegmentsUseCase } from '../../../application/use-cases/grid/get-grid-segments.use-case';
import type { StructuralAssetDto } from '../../../application/dtos/assets/structural-asset.dto';
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
  async getMacrosPage(@I18nLang() lang: string): Promise<StructuralAssetDto[]> {
    return this.getMacros.execute(lang);
  }

  /**
   * PAGE 2: Cluster-Übersicht
   * Zeigt für ein gewähltes MacroCluster (slug) die enthaltenen Cluster an.
   * Beispiel: /api/grid/macros/software-architecture/clusters
   */
  @Get('macros/:slug/clusters')
  async getClustersPage(
    @I18nLang() lang: string,
    @Param('slug') macroSlug: string,
  ): Promise<StructuralAssetDto> {
    return this.getClusters.execute(lang, macroSlug);
  }

  /**
   * PAGE 3: Segment-Ansicht (Deep Dive)
   * Zeigt für ein Cluster (slug) alle Segmente und deren Content-Bausteine.
   * Das ist die Datenbasis für die detaillierte Grid/City-Ansicht.
   * Beispiel: /api/grid/clusters/frontend-development/segments
   */
  @Get('clusters/:slug/segments')
  async getSegmentsPage(
    @I18nLang() lang: string,
    @Param('slug') clusterSlug: string,
  ): Promise<StructuralAssetDto> {
    return this.getSegments.execute(lang, clusterSlug);
  }
}
