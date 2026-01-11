import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import { GetAllContentUseCase } from '../../../application/use-cases/catalog/get-all-content.use-case';
import { GetContentBySlugUseCase } from '../../../application/use-cases/catalog/get-content-by-slug.use-case';
import { GetContentDetailUseCase } from '../../../application/use-cases/catalog/get-content-detail.use-case';
@Controller('catalog')
export class CatalogController {
  constructor(
    private readonly getAll: GetAllContentUseCase,
    private readonly getDetail: GetContentDetailUseCase,
    private readonly getBySlug: GetContentBySlugUseCase, // <--- NEU injiziert
  ) {}

  /**
   * PAGE 4: Katalog Liste
   * GET /api/catalog
   */
  @Get()
  async getCatalog(@I18nLang() lang: string) {
    return this.getAll.execute(lang);
  }

  /**
   * PAGE 5a: Detailansicht via UUID
   * GET /api/catalog/123e4567-e89b-12d3-a456-426614174000
   * (Wird genutzt, wenn man vom Grid kommt, wo die ID bekannt ist)
   */
  @Get(':id')
  async getContentDetail(
    @I18nLang() lang: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.getDetail.execute(lang, id);
  }

  /**
   * PAGE 5b: Detailansicht via "Pretty URL" (SEO freundlich)
   * GET /api/catalog/:type/:slug
   * Beispiel: /api/catalog/technology/nestjs
   * (Wird genutzt für direkte Links oder Server-Side Rendering mit Slugs)
   */
  @Get(':type/:slug')
  async getContentBySlug(
    @Param('type') type: string,
    @Param('slug') slug: string,
    @I18nLang() lang: string,
  ) {
    return this.getBySlug.execute(lang, type, slug);
  }
}
