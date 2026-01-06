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

type TagMapValue = {
  de?: string;
  en?: string;
  label?: string;
};

/**
 * Normalisiert Tag-Strukturen (Map oder Array) in eine Map mit de/en Labels.
 */
export function toTagMap(value: unknown): Record<string, { de: string; en: string }> {
  if (!value) return {};

  let parsed: unknown = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      console.warn("toTagMap: Failed to parse JSON string", value);
      return {};
    }
  }

  if (Array.isArray(parsed)) {
    const map: Record<string, { de: string; en: string }> = {};
    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue;
      const tag = entry as Record<string, unknown>;
      const key = typeof tag.slug === "string" && tag.slug ? tag.slug : typeof tag.key === "string" && tag.key ? tag.key : undefined;
      if (!key || map[key]) continue;

      const de = typeof tag.de === "string" ? tag.de : typeof tag.label === "string" ? tag.label : undefined;
      const en = typeof tag.en === "string" ? tag.en : typeof tag.label === "string" ? tag.label : undefined;
      if (de || en) {
        map[key] = { de: de ?? en ?? key, en: en ?? de ?? key };
      }
    }
    return map;
  }

  if (parsed && typeof parsed === "object") {
    const map: Record<string, { de: string; en: string }> = {};
    for (const [key, raw] of Object.entries(parsed as Record<string, TagMapValue | string | null | undefined>)) {
      if (raw && typeof raw === "object") {
        const valueObj = raw as TagMapValue;
        const de = typeof valueObj.de === "string" ? valueObj.de : typeof valueObj.label === "string" ? valueObj.label : undefined;
        const en = typeof valueObj.en === "string" ? valueObj.en : typeof valueObj.label === "string" ? valueObj.label : undefined;
        if (de || en) {
          map[key] = { de: de ?? en ?? key, en: en ?? de ?? key };
        }
      } else if (typeof raw === "string") {
        map[key] = { de: raw, en: raw };
      }
    }
    return map;
  }

  return {};
}
