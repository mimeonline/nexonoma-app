import { AssetStatus, AssetType } from '../../../domain/types/asset-enums';

// TODO : Wir im Moment nicht genutzt. Später einbinden oder löschen.
export class GridNodeDto {
  // --- Identifikation ---
  id: string;
  slug: string;
  name: string;
  type: AssetType; // 'macroCluster' | 'cluster' | 'segment' | 'tool' ...

  // --- Visuelles ---
  shortDescription: string;
  icon?: string; // URL oder Icon-Name
  image?: string; // Vorschaubild (falls vorhanden)
  status: AssetStatus; // Für Badges (z.B. "DRAFT")
  tags?: { slug: string; label: string }[];
  tagOrder?: string[];

  // --- Struktur & Hierarchie ---
  // Optional, da nur Cluster eine Category haben
  category?: string;

  // Optional, da nur ClusterViews ein Framework haben
  framework?: string;

  // Rekursion: Ein Node kann Kinder haben (Cluster -> Segmente -> Content)
  children: GridNodeDto[];
  chidrenCount: number;

  // Optional: Metadaten für das Grid (z.B. Sortierung)
  order?: number;

  constructor(partial: Partial<GridNodeDto>) {
    Object.assign(this, partial);
    // Sicherstellen, dass children immer ein Array ist
    this.children = partial.children
      ? partial.children.map((c) => new GridNodeDto(c))
      : [];
  }
}
