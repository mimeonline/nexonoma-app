import neo4j from 'neo4j-driver';

export function normalizeNeo4j(value: any): any {
  if (neo4j.isInt(value)) return value.toNumber();

  if (value && typeof value === 'object' && 'low' in value && 'high' in value) {
    return neo4j.int(value.low, value.high).toNumber();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeNeo4j);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, normalizeNeo4j(v)]),
    );
  }

  return value;
}

export function toNumber(value: any) {
  return neo4j.isInt(value) ? value.toNumber() : value;
}
