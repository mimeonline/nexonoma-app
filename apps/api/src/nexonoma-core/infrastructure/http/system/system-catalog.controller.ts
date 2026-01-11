import { Controller, Get, Query } from '@nestjs/common';
import { GetSystemCatalogIndexUseCase } from '../../../application/use-cases/system/get-system-catalog-index.use-case';
import { SystemCatalogIndexResponseDto } from '../../../application/dtos/system/system-catalog-index-response.dto';
import { AssetStatus, AssetType } from '../../../domain/types/asset-enums';

const DEFAULT_STATUS = AssetStatus.PUBLISHED;
const DEFAULT_TYPES = [
  AssetType.CONCEPT,
  AssetType.METHOD,
  AssetType.TOOL,
  AssetType.TECHNOLOGY,
] as const;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 500;
const MAX_LIMIT = 2000;
const DEFAULT_LANGS = ['de', 'en'] as const;

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
};

const parseStatus = (value?: string): AssetStatus => {
  if (!value) return DEFAULT_STATUS;
  const normalized = value.trim().toUpperCase();
  const statuses = Object.values(AssetStatus) as string[];
  if (statuses.includes(normalized)) {
    return normalized as AssetStatus;
  }
  return DEFAULT_STATUS;
};

const typeMap: Record<string, AssetType> = {
  concept: AssetType.CONCEPT,
  method: AssetType.METHOD,
  tool: AssetType.TOOL,
  technology: AssetType.TECHNOLOGY,
};

const parseTypes = (value?: string): AssetType[] => {
  if (!value) return [...DEFAULT_TYPES];
  const resolved = value
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0)
    .map((entry) => typeMap[entry])
    .filter((entry): entry is AssetType => Boolean(entry));

  return resolved.length > 0 ? resolved : [];
};

@Controller('system/catalog')
export class SystemCatalogController {
  constructor(private readonly getIndex: GetSystemCatalogIndexUseCase) {}

  @Get('index')
  async getIndexNodes(
    @Query('status') status?: string,
    @Query('types') types?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<SystemCatalogIndexResponseDto> {
    const parsedPage = Math.max(1, parseNumber(page, DEFAULT_PAGE));
    const parsedLimit = Math.min(MAX_LIMIT, parseNumber(limit, DEFAULT_LIMIT));
    const parsedStatus = parseStatus(status);
    const parsedTypes = parseTypes(types);

    return this.getIndex.execute({
      page: parsedPage,
      limit: parsedLimit,
      status: parsedStatus,
      types: parsedTypes,
      languages: [...DEFAULT_LANGS],
    });
  }
}
