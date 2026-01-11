import { Controller, Get, Query } from '@nestjs/common';
import { GetPublicSitemapNodesUseCase } from '../../../application/use-cases/system/get-public-sitemap-nodes.use-case';
import type { SitemapNodeDto } from '../../../application/dtos/system/sitemap-node.dto';

const DEFAULT_LANGS = ['de', 'en'] as const;
const DEFAULT_LIMIT = 1000;
const MAX_LIMIT = 5000;

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
};

const parseLangs = (value?: string) => {
  if (!value) return [...DEFAULT_LANGS];
  const parsed = value
    .split(',')
    .map((lang) => lang.trim())
    .filter((lang) => lang.length > 0);
  return parsed.length > 0 ? parsed : [...DEFAULT_LANGS];
};

@Controller('public/sitemap')
export class PublicSitemapController {
  constructor(private readonly getNodesUseCase: GetPublicSitemapNodesUseCase) {}

  @Get('nodes')
  async getNodes(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('langs') langs?: string,
    @Query('includeReview') includeReview?: string,
  ): Promise<SitemapNodeDto[]> {
    const parsedPage = Math.max(1, parseNumber(page, 1));
    const parsedLimit = Math.min(MAX_LIMIT, parseNumber(limit, DEFAULT_LIMIT));
    const includeReviewFlag = includeReview === 'true';
    const languageList = parseLangs(langs);
    return this.getNodesUseCase.execute({
      page: parsedPage,
      limit: parsedLimit,
      languages: languageList,
      includeReview: includeReviewFlag,
    });
  }
}
