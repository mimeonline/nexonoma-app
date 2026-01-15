import { Injectable } from '@nestjs/common';
import { SystemIndexQueryDto } from '../../dtos/system/system-index-query.dto';
import { SystemIndexResponseDto } from '../../dtos/system/system-index-response.dto';
import { SystemContentRepositoryPort } from '../../ports/system/system-content-repository.port';
import { buildSystemIndexResponse } from './system-index.builder';

@Injectable()
export class GetSystemContentIndexUseCase {
  constructor(private readonly catalogRepo: SystemContentRepositoryPort) {}

  async execute(query: SystemIndexQueryDto): Promise<SystemIndexResponseDto> {
    const { languages, types } = query;
    if (types.length === 0 || languages.length === 0) {
      return { page: query.page, limit: query.limit, total: 0, items: [] };
    }
    const results = await Promise.all(
      languages.map((lang) => this.catalogRepo.findContentIndex(lang)),
    );

    return buildSystemIndexResponse(query, results);
  }
}
