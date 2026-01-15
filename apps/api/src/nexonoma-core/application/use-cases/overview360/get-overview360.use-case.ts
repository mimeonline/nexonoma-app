import { Injectable } from '@nestjs/common';
import type { Overview360ResponseDto } from '../../dtos/overview360/overview360-response.dto';
import { Overview360RepositoryPort } from '../../ports/overview360/overview360-repository.port';
import { Overview360DtoBuilder } from './overview360.dto-builder';

const toGroupKey = (
  value?: string | null,
): keyof Overview360ResponseDto | null => {
  if (!value) return null;
  const normalized = value.trim().toUpperCase();
  if (normalized === 'FOUNDATIONAL') return 'foundational';
  if (normalized === 'STRUCTURAL') return 'structural';
  if (normalized === 'ATOMIC') return 'atomic';
  return null;
};

@Injectable()
export class GetOverview360UseCase {
  constructor(private readonly overviewRepo: Overview360RepositoryPort) {}

  async execute(locale: string): Promise<Overview360ResponseDto> {
    const records = await this.overviewRepo.findOverviewItems(locale);

    const grouped: Overview360ResponseDto = {
      foundational: [],
      structural: [],
      atomic: [],
    };

    records.forEach((record) => {
      const groupKey = toGroupKey(record.abstractionLevel);
      if (!groupKey) return;
      grouped[groupKey].push(Overview360DtoBuilder.buildItem(record));
    });

    return grouped;
  }
}
