import { Test } from '@nestjs/testing';
import { SystemCatalogController } from './system-catalog.controller';
import { GetSystemCatalogIndexUseCase } from '../../application/use-cases/system/get-system-catalog-index.use-case';
import { AssetStatus, AssetType } from '../../domain/types/asset-enums';

const emptyResponse = { page: 1, limit: 500, total: 0, items: [] };

describe('SystemCatalogController', () => {
  it('applies defaults when query params are missing', async () => {
    const getIndex = { execute: jest.fn().mockResolvedValue(emptyResponse) };

    const moduleRef = await Test.createTestingModule({
      controllers: [SystemCatalogController],
      providers: [{ provide: GetSystemCatalogIndexUseCase, useValue: getIndex }],
    }).compile();

    const controller = moduleRef.get(SystemCatalogController);
    await controller.getIndexNodes();

    expect(getIndex.execute).toHaveBeenCalledWith({
      page: 1,
      limit: 500,
      status: AssetStatus.PUBLISHED,
      types: [
        AssetType.CONCEPT,
        AssetType.METHOD,
        AssetType.TOOL,
        AssetType.TECHNOLOGY,
      ],
      languages: ['de', 'en'],
    });
  });

  it('maps types, ignores unknowns, and caps limit', async () => {
    const getIndex = { execute: jest.fn().mockResolvedValue(emptyResponse) };

    const moduleRef = await Test.createTestingModule({
      controllers: [SystemCatalogController],
      providers: [{ provide: GetSystemCatalogIndexUseCase, useValue: getIndex }],
    }).compile();

    const controller = moduleRef.get(SystemCatalogController);
    await controller.getIndexNodes('review', 'concept,unknown,tool', '2', '5000');

    expect(getIndex.execute).toHaveBeenCalledWith({
      page: 2,
      limit: 2000,
      status: AssetStatus.REVIEW,
      types: [AssetType.CONCEPT, AssetType.TOOL],
      languages: ['de', 'en'],
    });
  });
});
