import type { Cluster, MacroCluster, Segment, SegmentContentItem, SegmentContentType } from "@/types/grid";
import { AssetType } from "@/types/nexonoma";
import { toArray } from "@/utils/data-normalization";

type SegmentInput = Partial<Segment> & {
  content?: Record<string, unknown> | null;
  children?: unknown;
};

type SegmentChildInput = Partial<SegmentContentItem> & {
  type?: SegmentContentType;
};

type ClusterInput = Partial<Cluster> & {
  segments?: unknown;
  children?: unknown;
};

/**
 * Erstellt ein minimales MacroCluster Objekt basierend auf dem Slug,
 * damit die Breadcrumbs im Template funktionieren, ohne dass wir
 * einen extra API Call machen müssen.
 */
export function createParentContext(slug: string): MacroCluster {
  // Wir versuchen den Namen etwas hübscher zu machen (slug-case -> Title Case)
  // oder nutzen einfach den Slug als Fallback.
  const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");

  return {
    id: "context-only",
    slug,
    name, // Fallback Name
    type: AssetType.MACRO_CLUSTER,
    shortDescription: "",
    longDescription: "",
    clusters: [],
  } as unknown as MacroCluster; // Cast, da wir nur die Basis-Daten für Breadcrumbs brauchen
}

/**
 * Bereinigt die Cluster-Daten und stellt sicher, dass Segmente und Inhalte
 * korrekt strukturiert sind.
 */
export function mapToClusterDetail(item: ClusterInput): Cluster {
  // Mapping der Segmente
  const segments: Segment[] = toArray<SegmentInput>(item.segments || item.children).map((seg) => {
    // Hilfsfunktion um Content nach Typ zu filtern (falls API generisch 'children' liefert)
    const getContentByType = (type: SegmentContentType): SegmentContentItem[] => {
      // Fall A: API liefert bereits strukturiertes 'content' Objekt
      if (seg.content && Array.isArray(seg.content[`${type}s`])) {
        // methods -> methods
        return seg.content[`${type}s`] as SegmentContentItem[];
      }
      if (seg.content && Array.isArray(seg.content[type])) {
        return seg.content[type] as SegmentContentItem[];
      }

      // Fall B: API liefert flaches 'children' Array (Legacy GridNode)
      const children = toArray<SegmentChildInput>(seg.children);
      return children
        .filter((c): c is SegmentChildInput & { type: SegmentContentType } => c.type === type)
        .map((c) => ({
          id: c.id || "",
          name: c.name || "Unbenannt",
          slug: c.slug || "",
          type,
          shortDescription: c.shortDescription || "",
          longDescription: c.longDescription || "",
        }));
    };

    return {
      id: seg.id || "",
      name: seg.name || "Unbenanntes Segment",
      slug: seg.slug || "",
      type: AssetType.SEGMENT,
      shortDescription: seg.shortDescription || "",
      longDescription: seg.longDescription || "",
      content: {
        methods: getContentByType(AssetType.METHOD),
        concepts: getContentByType(AssetType.CONCEPT),
        tools: getContentByType(AssetType.TOOL),
        technologies: getContentByType(AssetType.TECHNOLOGY),
      },
    };
  });

  return {
    id: item.id || "",
    name: item.name || "Unbenanntes Cluster",
    slug: item.slug || "",
    type: AssetType.CLUSTER,
    shortDescription: item.shortDescription || "",
    longDescription: item.longDescription || "",
    segments,
  };
}
