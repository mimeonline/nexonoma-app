import { Controller, Get, Param } from '@nestjs/common';

// Diese Imports erstellen wir in den nächsten Schritten
import { I18nLang } from 'nestjs-i18n';
import type { ClusterViewResponseDto } from '../../../application/dtos/grid/cluster-view-response.dto';
import type { GridOverviewResponseDto } from '../../../application/dtos/grid/grid-overview-response.dto';
import type { MacroClusterViewResponseDto } from '../../../application/dtos/grid/macrocluster-view-response.dto';
import { GetClusterViewUseCase } from '../../../application/use-cases/grid/get-cluster-view.use-case';
import { GetGridOverviewUseCase } from '../../../application/use-cases/grid/get-grid-overview.use-case';
import { GetMacroClusterViewUseCase } from '../../../application/use-cases/grid/get-macrocluster-view.use-case';
@Controller('grid') // Base Route: /api/grid (wenn global prefix 'api' gesetzt ist)
export class GridController {
  constructor(
    private readonly getOverviewUseCase: GetGridOverviewUseCase,
    private readonly getMacroClusterViewUseCase: GetMacroClusterViewUseCase,
    private readonly getClusterViewUseCase: GetClusterViewUseCase,
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
  ): Promise<GridOverviewResponseDto> {
    return this.getOverviewUseCase.execute(lang);
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
  ): Promise<MacroClusterViewResponseDto> {
    return this.getMacroClusterViewUseCase.execute(lang, macroSlug);
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
  ): Promise<ClusterViewResponseDto> {
    return this.getClusterViewUseCase.execute(lang, clusterSlug);
  }
}
