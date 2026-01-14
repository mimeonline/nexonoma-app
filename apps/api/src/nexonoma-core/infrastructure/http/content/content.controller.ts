import { Controller, Get, Param } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import type { ContentResponseDto } from '../../../application/dtos/content/content-response.dto';
import { GetContentUseCase } from '../../../application/use-cases/content/get-content.use-case';

@Controller('content')
export class ContentController {
  constructor(private readonly getContent: GetContentUseCase) {}

  /**
   * Content Detail (Asset Block + Structure + Relations)
   * GET /content/:assetType/:slug
   */
  @Get(':assetType/:slug')
  async getContentBySlug(
    @Param('assetType') assetType: string,
    @Param('slug') slug: string,
    @I18nLang() lang: string,
  ): Promise<ContentResponseDto> {
    return this.getContent.execute(lang, assetType, slug);
  }
}
