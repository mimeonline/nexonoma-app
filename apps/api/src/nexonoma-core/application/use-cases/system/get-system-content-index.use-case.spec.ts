import { CatalogIndexRecord } from '../../../domain/entities/catalog-index-record.entity';
import { AssetStatus, AssetType } from '../../../domain/types/asset-enums';
import { SystemCatalogRepositoryPort } from '../../ports/system/system-content-repository.port';
import { GetSystemContentIndexUseCase } from './get-system-content-index.use-case';

const createRecord = (
  overrides: Partial<CatalogIndexRecord>,
): CatalogIndexRecord => ({
  id: 'id-1',
  type: AssetType.CONCEPT,
  slug: 'alpha',
  status: AssetStatus.PUBLISHED,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-02T00:00:00.000Z',
  language: 'en',
  ...overrides,
});

describe('GetSystemContentIndexUseCase', () => {
  it('returns empty result when no types are provided', async () => {
    const assetRepo: Partial<SystemCatalogRepositoryPort> = {
      findContentIndex: jest.fn(),
    };

    const useCase = new GetSystemContentIndexUseCase(assetRepo);

    const result = await useCase.execute({
      page: 1,
      limit: 500,
      status: AssetStatus.PUBLISHED,
      types: [],
      languages: ['en'],
    });

    expect(result).toEqual({ page: 1, limit: 500, total: 0, items: [] });
    expect(assetRepo.findContentIndex).not.toHaveBeenCalled();
  });

  it('filters invalid slugs, merges languages, and sorts deterministically', async () => {
    const assetRepo: Partial<SystemCatalogRepositoryPort> = {
      findContentIndex: jest
        .fn()
        .mockResolvedValueOnce([
          createRecord({
            id: 'a1',
            slug: 'valid',
            type: AssetType.TOOL,
            language: 'de',
          }),
          createRecord({
            id: 'a2',
            slug: 'bad slug',
            type: AssetType.CONCEPT,
            language: 'de',
          }),
          createRecord({
            id: 'a3',
            slug: 'bad/slug',
            type: AssetType.METHOD,
            language: 'de',
          }),
          createRecord({
            id: 'a4',
            slug: '',
            type: AssetType.CONCEPT,
            language: 'de',
          }),
          createRecord({
            id: 'a5',
            slug: 'valid',
            type: AssetType.TOOL,
            status: AssetStatus.DRAFT,
            language: 'de',
          }),
        ])
        .mockResolvedValueOnce([
          createRecord({
            id: 'a1',
            slug: 'valid',
            type: AssetType.TOOL,
            language: 'en',
          }),
          createRecord({
            id: 'b1',
            slug: 'another',
            type: AssetType.CONCEPT,
            language: 'en',
          }),
        ]),
    };

    const useCase = new GetSystemContentIndexUseCase(assetRepo);

    const result = await useCase.execute({
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

    expect(result.total).toBe(2);
    expect(result.items).toHaveLength(2);
    result.items.forEach((item) => {
      expect(Object.keys(item)).toEqual(
        expect.arrayContaining([
          'availableLanguages',
          'createdAt',
          'id',
          'slug',
          'type',
          'updatedAt',
        ]),
      );
    });
    expect(result.items[0]).toMatchObject({
      type: AssetType.CONCEPT,
      slug: 'another',
      id: 'b1',
      availableLanguages: ['en'],
    });
    expect(result.items[1]).toMatchObject({
      type: AssetType.TOOL,
      slug: 'valid',
      id: 'a1',
      availableLanguages: ['de', 'en'],
    });
  });

  it('paginates after sorting', async () => {
    const assetRepo: Partial<SystemCatalogRepositoryPort> = {
      findContentIndex: jest.fn().mockResolvedValueOnce([
        createRecord({
          id: 'a1',
          slug: 'alpha',
          type: AssetType.CONCEPT,
          language: 'en',
        }),
        createRecord({
          id: 'a2',
          slug: 'beta',
          type: AssetType.CONCEPT,
          language: 'en',
        }),
        createRecord({
          id: 'a3',
          slug: 'gamma',
          type: AssetType.CONCEPT,
          language: 'en',
        }),
      ]),
    };

    const useCase = new GetSystemContentIndexUseCase(assetRepo);

    const result = await useCase.execute({
      page: 2,
      limit: 2,
      status: AssetStatus.PUBLISHED,
      types: [AssetType.CONCEPT],
      languages: ['en'],
    });

    expect(result.total).toBe(3);
    expect(result.items).toEqual([
      expect.objectContaining({ id: 'a3', slug: 'gamma' }),
    ]);
  });
});
