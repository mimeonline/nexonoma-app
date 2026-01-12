// apps/api/src/nexonoma-core/infrastructure/persistence/neo4j/shared/tags.rehydrator.ts

import { JsonHydrator, JsonObject } from './json.rehydrator';

export type TagLabelMap = Partial<Record<string, string>>; // e.g. { de: "...", en: "..." }
export type TagMap = Record<string, TagLabelMap>; // e.g. { "microservices": { de: "...", en: "..." } }

export type LocalizedTag = { slug: string; label: string };

export class TagsRehydrator {
  /**
   * Accepts tags as:
   * - JSON stringified map
   * - map object
   * - already localized array [{slug,label}]
   *
   * Returns a TagMap if possible (normalized), otherwise undefined.
   */
  static toTagMap(value: unknown): TagMap | undefined {
    if (value === null || value === undefined) return undefined;

    if (Array.isArray(value)) {
      // If tags are already in array form, we don't convert to TagMap here.
      // Catalog pipeline expects TagMap, so return undefined to avoid guessing.
      return undefined;
    }

    const obj = JsonHydrator.asObject(value);
    if (!obj) return undefined;

    // obj should be: Record<string, {de?:string; en?:string; ...}>
    const result: TagMap = {};
    for (const [slug, labelObj] of Object.entries(obj)) {
      if (!labelObj || typeof labelObj !== 'object' || Array.isArray(labelObj))
        continue;

      const labels = labelObj as JsonObject;
      const normalized: TagLabelMap = {};

      // Keep only string values
      for (const [lang, label] of Object.entries(labels)) {
        if (typeof label === 'string') normalized[lang] = label;
      }

      // Always keep the slug key if we have any labels (or even none, to preserve tag existence)
      result[slug] = normalized;
    }

    return Object.keys(result).length ? result : undefined;
  }

  /**
   * Localizes a TagMap into a stable array of {slug,label}.
   * Fallback order:
   * - requested locale
   * - en
   * - slug (as label)
   */
  static localize(
    tagMap: TagMap | undefined,
    locale: string,
  ): LocalizedTag[] | undefined {
    if (!tagMap) return undefined;

    const tags: LocalizedTag[] = Object.entries(tagMap).map(
      ([slug, labels]) => {
        const label =
          (labels && typeof labels === 'object' ? labels[locale] : undefined) ??
          (labels && typeof labels === 'object' ? labels.en : undefined) ??
          slug;

        return { slug, label };
      },
    );

    // stable output (nice for UI + caching)
    tags.sort((a, b) => a.label.localeCompare(b.label, locale));

    return tags.length ? tags : undefined;
  }
}
