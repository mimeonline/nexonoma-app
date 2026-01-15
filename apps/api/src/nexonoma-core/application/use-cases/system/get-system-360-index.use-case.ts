import { Injectable } from '@nestjs/common';

import { SystemIndexQueryDto } from '../../dtos/system/system-index-query.dto';
import { SystemIndexResponseDto } from '../../dtos/system/system-index-response.dto';
import { SystemContentRepositoryPort } from '../../ports/system/system-content-repository.port';
import { buildSystemIndexResponse } from './system-index.builder';

@Injectable()
export class GetSystem360IndexUseCase {
  constructor(private readonly catalogRepo: SystemContentRepositoryPort) {}

  async execute(query: SystemIndexQueryDto): Promise<SystemIndexResponseDto> {
    const { languages } = query;
    const results = await Promise.all(
      languages.map((lang) =>
        this.catalogRepo.findContentIndex(lang, { has360: true }),
      ),
    );

    return buildSystemIndexResponse(query, results);
  }
}
