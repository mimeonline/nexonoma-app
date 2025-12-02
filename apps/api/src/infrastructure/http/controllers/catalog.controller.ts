import { Controller, Get, Param } from '@nestjs/common';
import { GetCatalogUseCase } from '../../../application/catalog/usecases/get-catalog.usecase';
import { GetCatalogItemByIdUseCase } from '../../../application/catalog/usecases/get-catalog-item-by-id.usecase';

@Controller('catalog')
export class CatalogController {
  constructor(
    private readonly getCatalogUseCase: GetCatalogUseCase,
    private readonly getCatalogItemByIdUseCase: GetCatalogItemByIdUseCase,
  ) {}

  @Get()
  async getCatalog() {
    return this.getCatalogUseCase.execute();
  }

  @Get(':id')
  async getCatalogItemById(@Param('id') id: string) {
    return this.getCatalogItemByIdUseCase.execute(id);
  }
}
