import { Test } from '@nestjs/testing';
import { PublicSitemapController } from './public-sitemap.controller';
import { GetPublicSitemapNodesUseCase } from '../../../application/use-cases/system/get-public-sitemap-nodes.use-case';

describe('PublicSitemapController', () => {
  it('parses query params and passes them to the use case', async () => {
    const response = [
      {
        id: 'a1',
        type: 'CONCEPT',
        slug: 'ddd',
        updatedAt: '2024-01-02T00:00:00.000Z',
        createdAt: '2024-01-01T00:00:00.000Z',
        availableLanguages: ['de'],
        tags: [{ slug: 'architecture', label: 'Architecture' }],
        tagOrder: ['architecture'],
      },
    ];
    const getNodes = { execute: jest.fn().mockResolvedValue(response) };

    const moduleRef = await Test.createTestingModule({
      controllers: [PublicSitemapController],
      providers: [{ provide: GetPublicSitemapNodesUseCase, useValue: getNodes }],
    }).compile();

    const controller = moduleRef.get(PublicSitemapController);
    const result = await controller.getNodes('2', '200', 'de,en', 'true');

    expect(getNodes.execute).toHaveBeenCalledWith({
      page: 2,
      limit: 200,
      languages: ['de', 'en'],
      includeReview: true,
    });
    expect(result).toEqual(response);
  });

  it('applies defaults when query params are missing', async () => {
    const getNodes = { execute: jest.fn().mockResolvedValue([]) };

    const moduleRef = await Test.createTestingModule({
      controllers: [PublicSitemapController],
      providers: [{ provide: GetPublicSitemapNodesUseCase, useValue: getNodes }],
    }).compile();

    const controller = moduleRef.get(PublicSitemapController);
    await controller.getNodes();

    expect(getNodes.execute).toHaveBeenCalledWith({
      page: 1,
      limit: 1000,
      languages: ['de', 'en'],
      includeReview: false,
    });
  });
});
