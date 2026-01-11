import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { GetMatrixUseCase } from '../../application/use-cases/matrix/get-matrix.use-case';
import { MatrixResponseDto } from '../../application/use-cases/matrix/matrix.dto';
import { AssetType } from '../../domain/types/asset-enums';
import { MatrixMode, MatrixPerspective } from '../../application/use-cases/matrix/matrix.types';

const DEFAULT_CONTENT_TYPES = [
  AssetType.CONCEPT,
  AssetType.METHOD,
  AssetType.TOOL,
  AssetType.TECHNOLOGY,
];
const DEFAULT_CELL_LIMIT = 12;
const MAX_CELL_LIMIT = 50;

const parseCsv = (value?: string): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
};

const parseMode = (value?: string): MatrixMode => {
  if (!value) {
    throw new BadRequestException('mode is required');
  }
  const normalized = value.trim().toUpperCase();
  const values = Object.values(MatrixMode) as string[];
  if (!values.includes(normalized)) {
    throw new BadRequestException(`Invalid mode: ${value}`);
  }
  return normalized as MatrixMode;
};

const parsePerspective = (value?: string): MatrixPerspective => {
  if (!value) {
    throw new BadRequestException('perspective is required');
  }
  const normalized = value.trim().toUpperCase();
  const values = Object.values(MatrixPerspective) as string[];
  if (!values.includes(normalized)) {
    throw new BadRequestException(`Invalid perspective: ${value}`);
  }
  return normalized as MatrixPerspective;
};

const parseContentTypes = (value?: string): AssetType[] => {
  if (!value) return [...DEFAULT_CONTENT_TYPES];
  const typeMap: Record<string, AssetType> = {
    concept: AssetType.CONCEPT,
    method: AssetType.METHOD,
    tool: AssetType.TOOL,
    technology: AssetType.TECHNOLOGY,
  };

  const resolved = parseCsv(value)
    .map((entry) => entry.toLowerCase())
    .map((entry) => typeMap[entry])
    .filter((entry): entry is AssetType => Boolean(entry));

  return resolved.length > 0 ? resolved : [...DEFAULT_CONTENT_TYPES];
};

const parseLang = (value?: string): string => {
  if (!value) return 'de';
  const normalized = value.trim().toLowerCase();
  return normalized === 'en' ? 'en' : 'de';
};

const parseCellLimit = (value?: string): number => {
  if (!value) return DEFAULT_CELL_LIMIT;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_CELL_LIMIT;
  return Math.min(MAX_CELL_LIMIT, parsed);
};

@Controller('matrix')
export class MatrixController {
  constructor(private readonly getMatrix: GetMatrixUseCase) {}

  @Get()
  async getMatrixResponse(
    @Query('clusterId') clusterId?: string,
    @Query('mode') mode?: string,
    @Query('perspective') perspective?: string,
    @Query('contentTypes') contentTypes?: string,
    @Query('lang') lang?: string,
    @Query('cellLimit') cellLimit?: string,
    @Query('xIds') xIds?: string,
  ): Promise<MatrixResponseDto> {
    if (!clusterId) {
      throw new BadRequestException('clusterId is required');
    }

    const parsedMode = parseMode(mode);
    const parsedPerspective = parsePerspective(perspective);
    const parsedContentTypes = parseContentTypes(contentTypes);
    const parsedLang = parseLang(lang);
    const parsedCellLimit = parseCellLimit(cellLimit);
    const parsedXIds = parseCsv(xIds);

    if (parsedMode === MatrixMode.ROLE_BY_PERSPECTIVE && parsedXIds.length === 0) {
      throw new BadRequestException('xIds is required for ROLE_BY_PERSPECTIVE');
    }

    return this.getMatrix.execute({
      clusterId,
      mode: parsedMode,
      perspective: parsedPerspective,
      contentTypes: parsedContentTypes,
      lang: parsedLang,
      cellLimit: parsedCellLimit,
      xIds: parsedMode === MatrixMode.ROLE_BY_PERSPECTIVE ? parsedXIds : undefined,
    });
  }
}
