import { NotFoundException } from '@nestjs/common';
import { AssetType } from '../../../domain/types/asset-enums';
import type { ContentRepositoryPort } from '../../ports/content/content-repository.port';
import type { ContentRecord } from '../../../infrastructure/persistence/neo4j/content/content-record.mapper';
import { GetContentUseCase } from './get-content.use-case';

const createRecord = (overrides?: Partial<ContentRecord>): ContentRecord => ({
  assetBlock: {
    id: 'asset-1',
    slug: 'snowflake',
    type: AssetType.TOOL,
    name: 'Snowflake',
    icon: 'Sparkles',
    tags: {
      data: { en: 'Data' },
      platform: { en: 'Platform' },
    },
    tagOrder: undefined,
    shortDescription: 'Short',
    longDescription: 'Long',
    organizationalLevel: ['ENTERPRISE'],
    organizationalMaturity: 'ADVANCED',
    impacts: 'TECHNICAL',
    decisionType: 'TECHNOLOGY_DECISION',
    complexityLevel: 'MEDIUM',
    valueStreamStage: 'DELIVERY',
    maturityLevel: 'ESTABLISHED',
    cognitiveLoad: 'MEDIUM',
  },
  structurePaths: [
    {
      macroCluster: { name: 'Data Strategy', slug: 'data-strategy' },
      cluster: { name: 'Platforms', slug: 'platforms' },
      segment: {
        name: 'Warehouses',
        slug: 'warehouses',
        tags: [{ slug: 'data', label: 'Data' }],
        tagOrder: ['data', 'platform'],
      },
    },
  ],
  relations: [
    {
      id: 'rel-1',
      type: 'PROCESS',
      relation: 'ENABLES',
      node: {
        id: 'node-1',
        type: AssetType.TECHNOLOGY,
        slug: 'sql',
        name: 'SQL Standard',
        icon: 'Database',
      },
    },
  ],
  ...overrides,
});

describe('GetContentUseCase', () => {
  it('maps content record into response dto with tag order fallback', async () => {
    const contentRepo: Partial<ContentRepositoryPort> = {
      findByTypeAndSlug: jest.fn().mockResolvedValue(createRecord()),
    };

    const useCase = new GetContentUseCase(contentRepo as ContentRepositoryPort);

    const result = await useCase.execute('en', 'tool', 'snowflake');

    expect(result.assetBlock).toMatchObject({
      id: 'asset-1',
      slug: 'snowflake',
      type: AssetType.TOOL,
      name: 'Snowflake',
      organisationLevel: 'ENTERPRISE',
      valueStream: 'DELIVERY',
    });
    expect(result.assetBlock.tags).toEqual(
      expect.arrayContaining([
        { slug: 'data', label: 'Data' },
        { slug: 'platform', label: 'Platform' },
      ]),
    );
    expect(result.assetBlock.tagOrder).toEqual(['data', 'platform']);
    expect(result.structure.paths[0].segment.tagOrder).toEqual([
      'data',
      'platform',
    ]);
    expect(result.relations.items[0].node).toMatchObject({
      id: 'node-1',
      slug: 'sql',
      name: 'SQL Standard',
      icon: 'Database',
    });
  });

  it('throws NotFoundException when content is missing', async () => {
    const contentRepo: Partial<ContentRepositoryPort> = {
      findByTypeAndSlug: jest.fn().mockResolvedValue(null),
    };

    const useCase = new GetContentUseCase(contentRepo as ContentRepositoryPort);

    await expect(useCase.execute('en', 'tool', 'missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
