// cypher-fragments.ts

/**
 * I18n-Projection Helpers for Neo4j Cypher Map Projections
 *
 * Problem this solves:
 * - We store localized properties as suffixed fields, e.g. name_de / name_en
 * - For queries we want to project ONLY the requested locale (with fallback to EN)
 * - Different read models need different payload sizes (list vs detail)
 *
 * This file provides 3 entry points:
 * - getI18nProjectionAll(nodeAlias)  -> full/detail projection (strings + arrays)
 * - getI18nProjectionList(nodeAlias) -> minimal/list projection (name + shortDescription)
 * - getI18nProjectionParam(nodeAlias, fields) -> caller-selected fields
 *
 * Usage in a query:
 *   const i18n = getI18nProjectionList('n');
 *   RETURN n { .id, .slug, .type, ${i18n} } AS assetData
 */

// 1) Simple string fields (stored as e.g. n.name_de, n.shortDescription_de)
export const SIMPLE_I18N_FIELDS = [
  'name',
  'shortDescription',
  'longDescription',
] as const;

// 2) Arrays of strings (stored as e.g. n.benefits_de = ["A", "B"])
export const ARRAY_I18N_FIELDS = [
  'inputs',
  'outputs',
  'principles',
  'benefits',
  'limitations',
  'risks',
  'architecturalDrivers',
  'bottleneckTags',
  'constraints',
  'preconditions',
  'integrations',
  'requiredSkills',
  'implementationSteps',
  'bestPractices',
  'antiPatterns',
  'misuseExamples',
  'traps',
  'techDebts',
] as const;

// Combined “all/detail” field list
export const ALL_I18N_FIELDS = [
  ...SIMPLE_I18N_FIELDS,
  ...ARRAY_I18N_FIELDS,
] as const;

export type I18nField = (typeof ALL_I18N_FIELDS)[number];

// Predefined groups for common read models
export const I18N_FIELD_GROUPS = {
  /**
   * Minimal projection for list/index views
   * (Add longDescription here only if you really need it in lists.)
   */
  list: ['name', 'shortDescription'] as const,

  /**
   * Full projection for detail views
   */
  all: ALL_I18N_FIELDS,
} as const;

/**
 * Core builder: creates COALESCE projection entries for the given fields.
 * Example output line:
 *   benefits: COALESCE(n['benefits_' + $lang], n.benefits_en)
 *
 * @param nodeAlias - variable name of the node in the query (e.g. "n")
 * @param fields - list of i18n field names (without locale suffix)
 * @returns string fragment for Cypher map projection
 */
export const getI18nProjectionParam = (
  nodeAlias: string,
  fields: readonly I18nField[],
): string => {
  return fields
    .map((field) => {
      // Works for both strings and arrays, because COALESCE semantics are the same:
      // return first non-null property value.
      return `${field}: COALESCE(${nodeAlias}['${field}_' + $lang], ${nodeAlias}.${field}_en)`;
    })
    .join(',\n      ');
};

/**
 * Convenience: minimal projection for list/index.
 */
export const getI18nProjectionList = (nodeAlias: string): string => {
  return getI18nProjectionParam(nodeAlias, I18N_FIELD_GROUPS.list);
};

/**
 * Convenience: full/detail projection (backwards-compatible with the previous behavior).
 */
export const getI18nProjectionAll = (nodeAlias: string): string => {
  return getI18nProjectionParam(nodeAlias, I18N_FIELD_GROUPS.all);
};

/**
 * Backwards-compat alias (optional but helpful if existing code uses getI18nProjection).
 * Previously, getI18nProjection() returned ALL fields.
 *
 * If you want to force explicitness everywhere, you can remove this alias later.
 */
export const getI18nProjection = getI18nProjectionAll;
