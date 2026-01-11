import type { LocalizedTagDto } from '../assets/localized-tag.dto';

export type SitemapNodeDto = {
  id: string;
  type: string;
  slug: string;
  updatedAt?: string;
  createdAt?: string;
  availableLanguages: string[];
  tags?: LocalizedTagDto[];
  tagOrder?: string[];
};
