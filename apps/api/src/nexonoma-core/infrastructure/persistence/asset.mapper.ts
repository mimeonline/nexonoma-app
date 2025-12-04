import { Injectable } from '@nestjs/common';
import {
  AssetBlock,
  AssetBlockProps,
} from '../../domain/entities/asset.entity';
import {
  ContentAsset,
  ContentAssetProps,
} from '../../domain/entities/content-asset.entity';
import { ContextAsset } from '../../domain/entities/context-asset.entity';
import {
  StructuralAsset,
  StructuralAssetProps,
} from '../../domain/entities/structural-asset.entity';
import { AssetStatus, AssetType } from '../../domain/types/asset-enums';

@Injectable()
export class AssetMapper {
  /**
   * Wandelt ein rohes Neo4j-Node-Objekt (Properties) in eine Domain-Entity um.
   */
  static toDomain(nodeProps: any): AssetBlock {
    if (!nodeProps) {
      throw new Error('AssetMapper: Node properties cannot be null/undefined');
    }

    // 1. Gemeinsame Basis-Daten mappen
    const baseProps: AssetBlockProps = {
      id: nodeProps.id,
      slug: nodeProps.slug,
      name: nodeProps.name,
      type: nodeProps.type as AssetType,
      status: (nodeProps.status as AssetStatus) || AssetStatus.DRAFT, // Fallback
      version: nodeProps.version || '0.0.1',
      language: nodeProps.language || 'en',
      license: nodeProps.license,

      // Neo4j speichert Dates oft als ISO-Strings oder Neo4j-DateTime-Objekte.
      // Wir erzwingen hier JS-Dates.
      createdAt: new Date(nodeProps.createdAt || Date.now()),
      updatedAt: new Date(nodeProps.updatedAt || Date.now()),

      author: nodeProps.author || 'Unknown',
      contributor: AssetMapper.parseArray(nodeProps.contributor),

      shortDescription: nodeProps.shortDescription || '',
      longDescription: nodeProps.longDescription || '',
      tags: AssetMapper.parseArray(nodeProps.tags),
      abbreviation: nodeProps.abbreviation,

      organizationalLevel: AssetMapper.parseArray(
        nodeProps.organizationalLevel,
      ),
      customFields: AssetMapper.parseJson(nodeProps.customFields, {}),

      icon: nodeProps.icon,
      image: nodeProps.image,
    };

    // 2. Unterscheidung nach Typ (Polymorphismus)
    switch (baseProps.type) {
      // --- A) Structural Assets ---
      case AssetType.MACRO_CLUSTER:
      case AssetType.CLUSTER:
      case AssetType.SEGMENT:
      case AssetType.CLUSTER_VIEW:
        return AssetMapper.toStructuralAsset(baseProps, nodeProps);

      // --- B) Content Assets ---
      case AssetType.CONCEPT:
      case AssetType.METHOD:
      case AssetType.TOOL:
      case AssetType.TECHNOLOGY:
        return AssetMapper.toContentAsset(baseProps, nodeProps);

      // --- C) Context Assets (Roles) ---
      case AssetType.ROLE:
        return new ContextAsset(baseProps);

      default:
        // Fallback für unbekannte Typen (damit die App nicht crasht)
        console.warn(
          `Unknown AssetType '${baseProps.type}' for ID ${baseProps.id}. Returning plain ContextAsset.`,
        );
        return new ContextAsset(baseProps);
    }
  }

  // --- Helper für spezifische Typen ---

  private static toStructuralAsset(
    base: AssetBlockProps,
    props: any,
  ): StructuralAsset {
    const structProps: StructuralAssetProps = {
      ...base,
      category: props.category,
      clusterSlug: props.clusterSlug,
      framework: props.framework,
      parentId: props.parentId, // Falls in den Node-Props gespeichert
    };
    return new StructuralAsset(structProps);
  }

  private static toContentAsset(
    base: AssetBlockProps,
    props: any,
  ): ContentAsset {
    const contentProps: ContentAssetProps = {
      ...base,

      // Komplexe JSON-Objekte parsen (Neo4j speichert keine Nested Objects)
      useCases: AssetMapper.parseJson(props.useCases, []),
      scenarios: AssetMapper.parseJson(props.scenarios, []),
      examples: AssetMapper.parseJson(props.examples, []),
      resources: AssetMapper.parseJson(props.resources, []),
      tradeoffMatrix: AssetMapper.parseJson(props.tradeoffMatrix, []),
      metrics: AssetMapper.parseJson(props.metrics, []),

      // Klassifizierungen
      maturityLevel: props.maturityLevel,
      complexityLevel: props.complexityLevel,
      impact: props.impact,
      decisionType: props.decisionType,
      organizationalMaturity: props.organizationalMaturity,
      valueStreamStage: props.valueStreamStage,
      cognitiveLoad: props.cognitiveLoad,

      // Listen (Arrays)
      principles: AssetMapper.parseArray(props.principles),
      inputs: AssetMapper.parseArray(props.inputs),
      outputs: AssetMapper.parseArray(props.outputs),
      integration: AssetMapper.parseArray(props.integration),
      architecturalDrivers: AssetMapper.parseArray(props.architecturalDrivers),
      bottleneckTags: AssetMapper.parseArray(props.bottleneckTags),
      benefits: AssetMapper.parseArray(props.benefits),
      limitations: AssetMapper.parseArray(props.limitations),
      alternatives: AssetMapper.parseArray(props.alternatives),
      requiredSkills: AssetMapper.parseArray(props.requiredSkills),
      implementationSteps: AssetMapper.parseArray(props.implementationSteps),
      preconditions: AssetMapper.parseArray(props.preconditions),
      risks: AssetMapper.parseArray(props.risks),
      bestPractices: AssetMapper.parseArray(props.bestPractices),
      antiPatterns: AssetMapper.parseArray(props.antiPatterns),
      techDebts: AssetMapper.parseArray(props.techDebts),
      misuseExamples: AssetMapper.parseArray(props.misuseExamples),
      traps: AssetMapper.parseArray(props.traps),
      constraints: AssetMapper.parseArray(props.constraints),

      // Tool Specifics
      vendor: props.vendor,
    };
    return new ContentAsset(contentProps);
  }

  // --- Utility Helper ---

  /**
   * Versucht einen JSON-String zu parsen.
   * Gibt den Fallback-Wert zurück, wenn es kein String ist oder Fehler wirft.
   */
  private static parseJson(value: any, fallback: any): any {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error('Failed to parse JSON property:', value);
        return fallback;
      }
    }
    // Falls es schon ein Objekt ist (z.B. durch Driver-Konvertierung)
    return value || fallback;
  }

  /**
   * Stellt sicher, dass wir ein Array zurückbekommen.
   */
  private static parseArray(value: any): any[] {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string') {
      // Versuch, Strings wie "['a','b']" zu parsen, falls nötig
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  }
}
