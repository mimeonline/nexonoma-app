import { GetPublicSitemapNodesUseCase } from './get-public-sitemap-nodes.use-case';
import { AssetStatus, AssetType } from '../../../domain/types/asset-enums';
import type { SystemCatalogRepositoryPort } from '../../ports/system/system-catalog-repository.port';

const createAsset = (overrides: Partial<any>) => ({
  id: 'id-1',
  type: AssetType.CONCEPT,
  slug: 'domain-driven-design',
  status: AssetStatus.PUBLISHED,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  tags: { architecture: { de: 'Architektur', en: 'Architecture' } },
  tagOrder: ['architecture'],
  ...overrides,
});

describe('GetPublicSitemapNodesUseCase', () => {
  it('filters to published by default and merges languages', async () => {
    const assetRepo = {
      findContentIndex: jest
        .fn()
        .mockResolvedValueOnce([
          createAsset({ id: 'a1', slug: 'ddd', status: AssetStatus.PUBLISHED }),
          createAsset({
            id: 'a2',
            slug: 'review-item',
            status: AssetStatus.REVIEW,
          }),
        ])
        .mockResolvedValueOnce([
          createAsset({ id: 'a1', slug: 'ddd', status: AssetStatus.PUBLISHED }),
        ]),
    } as unknown as SystemCatalogRepositoryPort;

    const useCase = new GetPublicSitemapNodesUseCase(assetRepo);
    const result = await useCase.execute({
      page: 1,
      limit: 100,
      languages: ['de', 'en'],
      includeReview: false,
    });

    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('ddd');
    expect(result[0].availableLanguages).toEqual(['de', 'en']);
  });

  it('includes review assets when enabled and supports pagination', async () => {
    const assetRepo = {
      findContentIndex: jest
        .fn()
        .mockResolvedValueOnce([
          createAsset({ id: 'a1', slug: 'ddd', status: AssetStatus.PUBLISHED }),
          createAsset({
            id: 'a2',
            slug: 'review-item',
            status: AssetStatus.REVIEW,
          }),
        ])
        .mockResolvedValueOnce([
          createAsset({ id: 'a1', slug: 'ddd', status: AssetStatus.PUBLISHED }),
          createAsset({
            id: 'a2',
            slug: 'review-item',
            status: AssetStatus.REVIEW,
          }),
        ]),
    } as unknown as SystemCatalogRepositoryPort;

    const useCase = new GetPublicSitemapNodesUseCase(assetRepo);
    const result = await useCase.execute({
      page: 1,
      limit: 1,
      languages: ['de', 'en'],
      includeReview: true,
    });

    expect(result).toHaveLength(1);
    expect(['ddd', 'review-item']).toContain(result[0].slug);
  });
});
