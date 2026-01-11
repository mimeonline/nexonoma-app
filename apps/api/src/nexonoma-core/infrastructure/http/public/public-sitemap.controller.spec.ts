import { Test } from '@nestjs/testing';
import { PublicSitemapController } from './public-sitemap.controller';
import { GetAllContentUseCase } from '../../../application/use-cases/catalog/get-all-content.use-case';
import { AssetStatus, AssetType } from '../../../domain/types/asset-enums';

const createAsset = (overrides: Partial<any>) => ({
  id: 'id-1',
  type: AssetType.CONCEPT,
  slug: 'domain-driven-design',
  status: AssetStatus.PUBLISHED,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  ...overrides,
});

describe('PublicSitemapController', () => {
  it('filters to published by default and merges languages', async () => {
    const getAll = {
      execute: jest
        .fn()
        .mockResolvedValueOnce([
          createAsset({ id: 'a1', slug: 'ddd', status: AssetStatus.PUBLISHED }),
          createAsset({ id: 'a2', slug: 'review-item', status: AssetStatus.REVIEW }),
        ])
        .mockResolvedValueOnce([
          createAsset({ id: 'a1', slug: 'ddd', status: AssetStatus.PUBLISHED }),
        ]),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [PublicSitemapController],
      providers: [{ provide: GetAllContentUseCase, useValue: getAll }],
    }).compile();

    const controller = moduleRef.get(PublicSitemapController);
    const result = await controller.getNodes('1', '100', 'de,en');

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('ddd');
    expect(result[0].availableLanguages).toEqual(['de', 'en']);
  });

  it('includes review assets when flag is enabled and supports pagination', async () => {
    const getAll = {
      execute: jest
        .fn()
        .mockResolvedValueOnce([
          createAsset({ id: 'a1', slug: 'ddd', status: AssetStatus.PUBLISHED }),
          createAsset({ id: 'a2', slug: 'review-item', status: AssetStatus.REVIEW }),
        ])
        .mockResolvedValueOnce([
          createAsset({ id: 'a1', slug: 'ddd', status: AssetStatus.PUBLISHED }),
          createAsset({ id: 'a2', slug: 'review-item', status: AssetStatus.REVIEW }),
        ]),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [PublicSitemapController],
      providers: [{ provide: GetAllContentUseCase, useValue: getAll }],
    }).compile();

    const controller = moduleRef.get(PublicSitemapController);
    const result = await controller.getNodes('1', '1', 'de,en', 'true');

    expect(result).toHaveLength(1);
    expect(['ddd', 'review-item']).toContain(result[0].slug);
  });
});
