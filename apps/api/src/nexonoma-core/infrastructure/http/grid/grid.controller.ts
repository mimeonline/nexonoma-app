import { Controller, Get, Param } from '@nestjs/common';

// Diese Imports erstellen wir in den nächsten Schritten
import { I18nLang } from 'nestjs-i18n';
import type { GridClustersResponseDto } from '../../../application/dtos/grid/clusters-response.dto';
import type { GridMacroclustersResponseDto } from '../../../application/dtos/grid/macroclusters-response.dto';
import type { GridSegmentsResponseDto } from '../../../application/dtos/grid/segments-response.dto';
import { GetGridClustersUseCase } from '../../../application/use-cases/grid/get-grid-clusters.use-case';
import { GetGridMacrosUseCase } from '../../../application/use-cases/grid/get-grid-macros.use-case';
import { GetGridSegmentsUseCase } from '../../../application/use-cases/grid/get-grid-segments.use-case';
@Controller('grid') // Base Route: /api/grid (wenn global prefix 'api' gesetzt ist)
export class GridController {
  constructor(
    private readonly getMacros: GetGridMacrosUseCase,
    private readonly getClusters: GetGridClustersUseCase,
    private readonly getSegments: GetGridSegmentsUseCase,
  ) {}

  /**
   * PAGE 1: Grid Overview
   * Einstiegspunkt der Grid-Navigation.
   *
   * Zeigt eine Übersicht aller MacroCluster
   * (z. B. "Software & Architektur", "Organisation").
   *
   * Von hier aus navigiert der Nutzer in einen einzelnen MacroCluster.
   */
  @Get('overview')
  async getGridOverview(
    @I18nLang() lang: string,
  ): Promise<GridMacroclustersResponseDto[]> {
    return this.getMacros.execute(lang);
  }

  /**
   * PAGE 2: MacroCluster View
   *
   * Zeigt die Detailansicht eines einzelnen MacroClusters
   * inklusive der enthaltenen Cluster als Cards.
   *
   * Beispiel:
   * /api/grid/macroclusters/software-architecture
   */
  @Get('macroclusters/:slug')
  async getMacroClusterView(
    @I18nLang() lang: string,
    @Param('slug') macroSlug: string,
  ): Promise<GridClustersResponseDto> {
    return this.getClusters.execute(lang, macroSlug);
  }

  /**
   * PAGE 3: Cluster View
   *
   * Zeigt die Detailansicht eines einzelnen Clusters
   * inklusive aller Segmente und deren Content-Bausteine.
   *
   * Grundlage für Grid- und City-Detailansichten.
   *
   * Beispiel:
   * /api/grid/clusters/frontend-development
   */
  @Get('clusters/:slug')
  async getClusterView(
    @I18nLang() lang: string,
    @Param('slug') clusterSlug: string,
  ): Promise<GridSegmentsResponseDto> {
    return this.getSegments.execute(lang, clusterSlug);
  }
}
