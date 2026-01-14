import { Controller, Get } from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import type { Overview360ResponseDto } from '../../../application/dtos/overview360/overview360-response.dto';
import { GetOverview360UseCase } from '../../../application/use-cases/overview360/get-overview360.use-case';

@Controller('360')
export class Overview360Controller {
  constructor(private readonly getOverviewUseCase: GetOverview360UseCase) {}

  /**
   * 360° Overview
   * GET /360
   */
  @Get()
  async getOverview(@I18nLang() lang: string): Promise<Overview360ResponseDto> {
    return this.getOverviewUseCase.execute(lang);
  }
}
