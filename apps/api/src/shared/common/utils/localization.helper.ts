// utils/localization.helper.ts

export class LocalizationHelper {
  /**
   * Parst einen JSON-String und extrahiert die gewünschte Sprache.
   * Wenn das Feld ein Array ist, wird über alle Einträge iteriert.
   */
  static parseAndLocalize<T>(
    jsonString: string,
    locale: string,
    fallback: string = 'en',
  ): T[] {
    if (!jsonString) return [];

    try {
      const rawData = JSON.parse(jsonString);

      if (!Array.isArray(rawData)) {
        return [];
      }

      return rawData.map((item) =>
        LocalizationHelper.localizeObject(item, locale, fallback),
      );
    } catch (e) {
      console.error('Failed to parse complex JSON field', e);
      return [];
    }
  }

  /**
   * Rekursive oder flache Auswahl der Sprache für ein Objekt
   */
  private static localizeObject(
    obj: any,
    locale: string,
    fallback: string,
  ): any {
    const result: any = {};

    for (const [key, value] of Object.entries(obj)) {
      // Fall 1: Das Value ist direkt ein Übersetzungs-Objekt {de: "...", en: "..."}
      if (
        value &&
        typeof value === 'object' &&
        ('de' in value || 'en' in value)
      ) {
        result[key] = value[locale] || value[fallback] || '';
      }
      // Fall 2: Das Value ist eine Liste von Übersetzungs-Objekten (z.B. inputs inside useCases)
      else if (Array.isArray(value)) {
        result[key] = value.map((subItem) => {
          // Check ob es ein einfaches {de, en} Objekt ist
          if (subItem && (subItem.de || subItem.en)) {
            return subItem[locale] || subItem[fallback];
          }
          // Oder ob es wieder ein komplexes Objekt ist (Rekursion möglich, hier vereinfacht)
          return subItem;
        });
      }
      // Fall 3: Einfacher Wert (String, Number, etc.) -> einfach übernehmen
      else {
        result[key] = value;
      }
    }
    return result;
  }

  /**
   * Speziell für Tags: Wandelt eine Map of i18n-Objects in ein flaches String-Array um.
   * Input: { "key": { "de": "Wert DE", "en": "Wert EN" } }
   * Output (de): ["Wert DE"]
   */
  static parseMapAndLocalize(
    jsonString: string,
    locale: string,
    fallback: string = 'en',
  ): string[] {
    if (!jsonString) return [];

    try {
      const rawData = JSON.parse(jsonString);

      // Falls es doch ein Array ist (Abwärtskompatibilität)
      if (Array.isArray(rawData)) {
        return this.parseAndLocalize(jsonString, locale, fallback); // Deine existierende Logik nutzen oder mappen
      }

      // Wenn es ein Objekt ist (Map)
      if (typeof rawData === 'object' && rawData !== null) {
        return Object.values(rawData)
          .map((tagObj: any) => {
            // Extrahiere den String für die Sprache
            return tagObj[locale] || tagObj[fallback] || '';
          })
          .filter((val) => val !== ''); // Leere Strings entfernen
      }

      return [];
    } catch (e) {
      console.error('Failed to parse tags map', e);
      return [];
    }
  }
}
