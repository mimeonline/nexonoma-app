// cypher-fragments.ts

// 1. Einfache Strings (werden zu n.name_de)
const SIMPLE_I18N_FIELDS = ['name', 'shortDescription', 'longDescription'];

// 2. Arrays von Strings (werden zu n.benefits_de = ["A", "B"])
// Diese Liste basiert auf deinem '12-Factor App' JSON und dem Import-Skript (Phase 2)
const ARRAY_I18N_FIELDS = [
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
];

// Wir kombinieren beide Listen, da die Abfragelogik identisch ist
const ALL_I18N_FIELDS = [...SIMPLE_I18N_FIELDS, ...ARRAY_I18N_FIELDS];

/**
 * Erzeugt dynamisch die COALESCE-Logik für Neo4j.
 * @param nodeAlias - Der Variablenname des Nodes in der Query (z.B. "n")
 * @returns Ein String-Fragment für die Cypher-Map-Projection
 */
export const getI18nProjection = (nodeAlias: string): string => {
  return ALL_I18N_FIELDS.map((field) => {
    // Generiert: benefits: COALESCE(n['benefits_' + $lang], n.benefits_en)
    // Das funktioniert sowohl für Strings als auch für Arrays.
    // Wenn $lang 'de' ist, sucht er n.benefits_de.
    // Fallback ist immer die englische Property (n.benefits_en).
    return `${field}: COALESCE(${nodeAlias}['${field}_' + $lang], ${nodeAlias}.${field}_en)`;
  }).join(',\n      ');
};
