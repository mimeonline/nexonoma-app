import { AssetType } from '../../../../domain/types/asset-enums';
import type { Neo4jService } from '../../../../../shared/infrastructure/neo4j/neo4j.service';
import { Neo4jContentRepository } from './neo4j-content.repository';

const record = (values: Record<string, unknown>) => ({
  get: (key: string) => values[key],
});

describe('Neo4jContentRepository', () => {
  it('maps asset, structure paths, and relations from Neo4j results', async () => {
    const neo4j: Partial<Neo4jService> = {
      read: jest
        .fn()
        .mockResolvedValueOnce([
          record({
            assetData: {
              id: 'asset-1',
              slug: 'snowflake',
              type: AssetType.TOOL,
              name: 'Snowflake',
              icon: 'Sparkles',
              tags: { data: { en: 'Data' }, platform: { en: 'Platform' } },
              tagOrder: '["data","platform"]',
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
          }),
        ])
        .mockResolvedValueOnce([
          record({
            macroData: { slug: 'data-strategy', name: 'Data Strategy' },
            clusterData: { slug: 'platforms', name: 'Platforms' },
            segmentData: {
              slug: 'warehouses',
              name: 'Warehouses',
              tags: { data: { en: 'Data' } },
              tagOrder: '["data"]',
            },
          }),
        ])
        .mockResolvedValueOnce([
          record({
            relationData: {
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
          }),
        ]),
    };

    const repo = new Neo4jContentRepository(neo4j as Neo4jService);

    const result = await repo.findByTypeAndSlug(
      'en',
      AssetType.TOOL,
      'snowflake',
    );

    expect(result?.assetBlock).toMatchObject({
      id: 'asset-1',
      slug: 'snowflake',
      type: AssetType.TOOL,
      tagOrder: ['data', 'platform'],
    });

    expect(result?.structurePaths[0]).toMatchObject({
      macroCluster: { slug: 'data-strategy', name: 'Data Strategy' },
      cluster: { slug: 'platforms', name: 'Platforms' },
      segment: { slug: 'warehouses', name: 'Warehouses', tagOrder: ['data'] },
    });

    expect(result?.relations[0]).toMatchObject({
      id: 'rel-1',
      type: 'PROCESS',
      relation: 'ENABLES',
      node: { id: 'node-1', slug: 'sql', name: 'SQL Standard' },
    });
  });

  it('returns null when asset is missing', async () => {
    const neo4j: Partial<Neo4jService> = {
      read: jest.fn().mockResolvedValueOnce([]),
    };

    const repo = new Neo4jContentRepository(neo4j as Neo4jService);

    const result = await repo.findByTypeAndSlug(
      'en',
      AssetType.TOOL,
      'missing',
    );

    expect(result).toBeNull();
  });
});
