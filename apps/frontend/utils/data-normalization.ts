// src/utils/data-normalization.ts

/**
 * Wandelt einen unbekannten Wert (String, Array, null) in ein Array um.
 * Nützlich für APIs, die mal "String", mal ["String"] senden.
 */
export function toArray<T = string>(value: unknown): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") return [value as unknown as T];
  // Fallback: Wenn es ein Objekt ist, aber kein Array, packen wir es in ein Array
  if (typeof value === "object") return [value as T];
  return [];
}

/**
 * Versucht, JSON-Strings oder Objekte in ein Array von Objekten zu parsen.
 * Filtert ungültige Einträge heraus.
 */
export function toObjectArray<T extends object>(value: unknown): T[] {
  // 1. Fall: Es ist ein JSON-String
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        // Rekursiv sicherstellen, dass wir wirklich Objekte haben
        return parsed.filter((entry) => entry && typeof entry === "object") as T[];
      }
      if (parsed && typeof parsed === "object") {
        return [parsed as T];
      }
    } catch {
      console.warn("toObjectArray: Failed to parse JSON string", value);
      return [];
    }
  }

  // 2. Fall: Es ist bereits ein Array oder Objekt -> toArray nutzen
  return toArray<T>(value).filter((entry) => entry && typeof entry === "object");
}
