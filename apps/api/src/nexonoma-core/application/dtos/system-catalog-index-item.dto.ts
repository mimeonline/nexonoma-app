export type SystemCatalogIndexItemDto = {
  id: string;
  type: string;
  slug: string;
  updatedAt?: string;
  createdAt?: string;
  availableLanguages?: string[];
  tags?: Record<string, { de: string; en: string }>;
  tagOrder?: string[];
};
