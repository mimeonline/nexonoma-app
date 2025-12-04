import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';

// Imports (werden später erstellt)
import { GetAllContentUseCase } from '../../application/use-cases/catalog/get-all-content.use-case';
import { GetContentDetailUseCase } from '../../application/use-cases/catalog/get-content-detail.use-case';

@Controller('catalog')
export class CatalogController {
  constructor(
    private readonly getAll: GetAllContentUseCase,
    private readonly getDetail: GetContentDetailUseCase,
  ) {}

  /**
   * PAGE 4: Katalog Liste
   * Gibt alle Content-Bausteine zurück.
   * Die Objekte in dieser Liste MÜSSEN die 'id' enthalten,
   * damit das Frontend die Detail-Seite verlinken kann.
   */
  @Get()
  async getCatalog() {
    return this.getAll.execute();
  }

  /**
   * PAGE 5: Detailansicht
   * Lädt einen spezifischen Baustein anhand seiner UUID.
   * ParseUUIDPipe validiert automatisch, ob es eine echte UUID ist.
   * Beispiel: /api/catalog/123e4567-e89b-12d3-a456-426614174000
   */
  @Get(':id')
  async getContentDetail(@Param('id', ParseUUIDPipe) id: string) {
    return this.getDetail.execute(id);
  }
}
