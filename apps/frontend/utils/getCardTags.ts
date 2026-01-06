import { toArray, toTagMap } from "@/utils/data-normalization";

type TagMap = Record<string, { de: string; en: string }>;

type CardTagSource = {
  tags?: unknown;
  tagsMap?: TagMap;
  tagOrder?: unknown;
};

function resolveTagMap(asset: CardTagSource): TagMap {
  if (asset.tagsMap && Object.keys(asset.tagsMap).length > 0) return asset.tagsMap;
  return toTagMap(asset.tags);
}

export function getCardTagKeys(asset: CardTagSource): string[] {
  const tagsMap = resolveTagMap(asset);
  const desired: string[] = [];

  const addKey = (key: string | undefined) => {
    if (!key || desired.length >= 2) return;
    if (key in tagsMap && !desired.includes(key)) {
      desired.push(key);
    }
  };

  const tagOrder = toArray<string>(asset.tagOrder);
  if (tagOrder.length > 0) {
    for (const key of tagOrder) addKey(key);
  }

  if (desired.length < 2) {
    const fallbackKeys = Object.keys(tagsMap).sort((a, b) => a.localeCompare(b));
    for (const key of fallbackKeys) addKey(key);
  }

  return desired.slice(0, 2);
}

export function pickTwoTagKeys(asset: CardTagSource): string[] {
  return getCardTagKeys(asset);
}

export function getCardTagLabel(asset: CardTagSource, key: string, lang: string): string {
  const tagsMap = resolveTagMap(asset);
  const entry = tagsMap[key];
  if (!entry) return key;
  if (lang === "de") return entry.de || entry.en || key;
  return entry.en || entry.de || key;
}

export function getOrderedTagKeys(asset: CardTagSource): string[] {
  const tagsMap = resolveTagMap(asset);
  const ordered: string[] = [];

  const addKey = (key: string | undefined) => {
    if (!key) return;
    if (!(key in tagsMap)) return;
    if (ordered.includes(key)) return;
    ordered.push(key);
  };

  const tagOrder = toArray<string>(asset.tagOrder);
  if (tagOrder.length > 0) {
    for (const key of tagOrder) {
      addKey(key);
    }
  }

  const remaining = Object.keys(tagsMap)
    .filter((key) => !ordered.includes(key))
    .sort((a, b) => a.localeCompare(b));

  for (const key of remaining) {
    addKey(key);
  }

  return ordered;
}
