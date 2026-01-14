import { ContentTemplate, type AssetContent } from "@/features/content/templates/Content";

const mockAsset: AssetContent = {
  title: "Snowflake",
  typeLabel: "Tool",
  tags: ["#data-warehouse", "#cloud-native", "#sql"],
  heroDescription:
    "Snowflake ist eine cloudbasierte Plattform für Datenmanagement und Analytik. Sie ermöglicht es Organisationen, Daten zu speichern, zu verarbeiten und zu analysieren, ohne sich um die zugrunde liegende Infrastruktur kümmern zu müssen.",
  heroNote: "„Dieser Baustein bündelt Grundinformationen, Kontext und Beziehungen – als neutrale Referenz im Modell.“",
  actionLabel: "360° Detailansicht öffnen",
  actionHint: "Vertiefung mit Einordnung, Trade-offs und Beispielen.",
  structurePaths: [
    {
      id: "path-1",
      domain: ["Governance", "Platforms"],
      title: "Data Strategy → Platforms → Warehouses",
      context: "Kontext: Delivery",
      href: "/catalog",
    },
    {
      id: "path-2",
      domain: ["AI Impact", "Foundations"],
      title: "Organizational Impact → Storage",
      context: "Kontext: Platform",
      href: "/catalog",
    },
  ],
  relations: [
    {
      id: "relation-1",
      shortLabel: "SQL",
      title: "SQL Standard",
      subtitle: "Technologische Grundlage",
      href: "/catalog",
    },
    {
      id: "relation-2",
      shortLabel: "dbt",
      title: "dbt (Data Build Tool)",
      subtitle: "Häufige Kombination",
      href: "/catalog",
    },
    {
      id: "relation-3",
      shortLabel: "AZ",
      title: "Azure Synapse",
      subtitle: "Markt-Alternative",
      href: "/catalog",
    },
  ],
  facts: [
    { id: "fact-2", label: "Org Level", value: "Enterprise" },
    { id: "fact-3", label: "Decision", value: "Technical" },
    { id: "fact-4", label: "Complexity", value: "Medium" },
    { id: "fact-5", label: "Stage", value: "Delivery" },
    { id: "fact-6", label: "Reifegrad", value: "ESTABLISHED", tone: "accent" },
    { id: "fact-7", label: "Kognitive Last", value: "MEDIUM", tone: "warning" },
  ],
  longDescription:
    "Snowflake bietet eine einheitliche Plattform für Datenmanagement und Analytik. Es ermöglicht Organisationen, Daten zu lagern, zu verarbeiten und zu analysieren, ohne sich um die zugrunde liegende Infrastruktur kümmern zu müssen. Die Architektur ist skalierbar und unterstützt moderne Datenanwendungen.",
};

export default async function ContentAssetPage({ params }: PageProps<"/[lang]/content/[assetType]/[slug]">) {
  const { lang } = await params;

  return <ContentTemplate lang={lang} asset={mockAsset} />;
}
