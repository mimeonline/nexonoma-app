import { Controller, Get } from '@nestjs/common';
import { GetCatalogUseCase } from '../../../application/catalog/usecases/get-catalog.usecase';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly getCatalogUseCase: GetCatalogUseCase) {}

  @Get()
  async getCatalog() {
    return this.getCatalogUseCase.execute();
  }
}
