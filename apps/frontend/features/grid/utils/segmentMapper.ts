import type { Cluster, MacroCluster, Segment, SegmentContentItem, SegmentContentType } from "@/types/grid";
import { toArray } from "@/utils/data-normalization";

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
    type: "macroCluster",
    shortDescription: "",
    longDescription: "",
    clusters: [],
  } as unknown as MacroCluster; // Cast, da wir nur die Basis-Daten für Breadcrumbs brauchen
}

/**
 * Bereinigt die Cluster-Daten und stellt sicher, dass Segmente und Inhalte
 * korrekt strukturiert sind.
 */
export function mapToClusterDetail(item: any): Cluster {
  // Mapping der Segmente
  const segments: Segment[] = toArray(item.segments || item.children).map((seg: any) => {
    // Hilfsfunktion um Content nach Typ zu filtern (falls API generisch 'children' liefert)
    const getContentByType = (type: SegmentContentType): SegmentContentItem[] => {
      // Fall A: API liefert bereits strukturiertes 'content' Objekt
      if (seg.content && Array.isArray(seg.content[type + "s"])) {
        // methods -> methods
        return seg.content[type + "s"];
      }
      if (seg.content && Array.isArray(seg.content[type])) {
        return seg.content[type];
      }

      // Fall B: API liefert flaches 'children' Array (Legacy GridNode)
      const children = toArray<any>(seg.children);
      return children
        .filter((c) => c.type === type)
        .map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          type: c.type,
          shortDescription: c.shortDescription || "",
          longDescription: c.longDescription || "",
        }));
    };

    return {
      id: seg.id || "",
      name: seg.name || "Unbenanntes Segment",
      slug: seg.slug || "",
      type: "segment",
      shortDescription: seg.shortDescription || "",
      longDescription: seg.longDescription || "",
      content: {
        methods: getContentByType("method"),
        concepts: getContentByType("concept"),
        tools: getContentByType("tool"),
        technologies: getContentByType("technology"),
      },
    };
  });

  return {
    id: item.id || "",
    name: item.name || "Unbenanntes Cluster",
    slug: item.slug || "",
    type: "cluster",
    shortDescription: item.shortDescription || "",
    longDescription: item.longDescription || "",
    segments,
  };
}
