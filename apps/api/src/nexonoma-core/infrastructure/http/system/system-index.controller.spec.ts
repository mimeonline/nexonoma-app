import { Test } from '@nestjs/testing';
import { SystemIndexController } from './system-index.controller';
import { GetSystemContentIndexUseCase } from '../../../application/use-cases/system/get-system-content-index.use-case';
import { AssetStatus, AssetType } from '../../../domain/types/asset-enums';

const emptyResponse = { page: 1, limit: 500, total: 0, items: [] };

describe('SystemIndexController', () => {
  it('applies defaults when query params are missing', async () => {
    const getIndex = { execute: jest.fn().mockResolvedValue(emptyResponse) };

    const moduleRef = await Test.createTestingModule({
      controllers: [SystemIndexController],
      providers: [
        { provide: GetSystemContentIndexUseCase, useValue: getIndex },
      ],
    }).compile();

    const controller = moduleRef.get(SystemIndexController);
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
      controllers: [SystemIndexController],
      providers: [
        { provide: GetSystemContentIndexUseCase, useValue: getIndex },
      ],
    }).compile();

    const controller = moduleRef.get(SystemIndexController);
    await controller.getIndexNodes(
      'review',
      'concept,unknown,tool',
      '2',
      '5000',
    );

    expect(getIndex.execute).toHaveBeenCalledWith({
      page: 2,
      limit: 2000,
      status: AssetStatus.REVIEW,
      types: [AssetType.CONCEPT, AssetType.TOOL],
      languages: ['de', 'en'],
    });
  });
});
