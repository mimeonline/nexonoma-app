import type {
  MatrixAssetPreviewRecord,
  MatrixCellRecord,
} from '../../../../application/ports/matrix/matrix-repository.port';
import type { MatrixTagMap } from '../../../../application/use-cases/matrix/matrix.types';
import { JsonHydrator } from '../shared/json.rehydrator';

type MatrixTagValue = MatrixTagMap | { slug: string; label: string }[];

export class MatrixRecordMapper {
  static rehydrateCells(cells: MatrixCellRecord[]): MatrixCellRecord[] {
    return cells.map((cell) => ({
      ...cell,
      items: (cell.items ?? []).map((item) => ({
        ...item,
        tags: MatrixRecordMapper.rehydrateTags(item.tags),
      })),
    }));
  }

  private static rehydrateTags(
    value: MatrixAssetPreviewRecord['tags'],
  ): MatrixTagValue | undefined {
    if (!value) return undefined;

    if (Array.isArray(value)) return value;

    if (typeof value === 'string') {
      const parsed = JsonHydrator.rehydrateJson(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed))
        return parsed as MatrixTagMap;
      if (Array.isArray(parsed))
        return parsed as { slug: string; label: string }[];
      return {};
    }

    if (typeof value === 'object') return value as MatrixTagMap;

    return {};
  }
}
