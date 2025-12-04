import { AssetBlock } from './asset.entity';

/**
 * Repräsentiert Context Types (z.B. Role).
 * Basiert aktuell nur auf assetblock-base.schema.json,
 * kann aber später um kontext-spezifische Felder erweitert werden
 * (z.B. "department", "salaryLevel", "skills").
 */
export class ContextAsset extends AssetBlock {
  // Aktuell leer, da role.schema.json keine properties definiert.
  // Dient aber als Platzhalter für Typ-Sicherheit und zukünftige Erweiterungen.
}
