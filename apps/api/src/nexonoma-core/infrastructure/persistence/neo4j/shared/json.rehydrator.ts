// apps/api/src/nexonoma-core/infrastructure/persistence/neo4j/shared/json.hydrator.ts

export type JsonObject = Record<string, unknown>;

export class JsonHydrator {
  static safeParseJson(value: string): unknown | undefined {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }

  /**
   * Rehydrates a value that may be:
   * - undefined/null -> undefined
   * - string (JSON)  -> parsed JSON (object/array/primitive)
   * - object/array   -> passthrough
   * - anything else  -> undefined
   */
  static rehydrateJson(value: unknown): unknown | undefined {
    if (value === null || value === undefined) return undefined;

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return undefined;
      return JsonHydrator.safeParseJson(trimmed);
    }

    if (typeof value === 'object') {
      return value;
    }

    return undefined;
  }

  static asObject(value: unknown): JsonObject | undefined {
    const hydrated = JsonHydrator.rehydrateJson(value);
    if (!hydrated || typeof hydrated !== 'object' || Array.isArray(hydrated))
      return undefined;
    return hydrated as JsonObject;
  }

  static asArray(value: unknown): unknown[] | undefined {
    const hydrated = JsonHydrator.rehydrateJson(value);
    if (!Array.isArray(hydrated)) return undefined;
    return hydrated;
  }
}
