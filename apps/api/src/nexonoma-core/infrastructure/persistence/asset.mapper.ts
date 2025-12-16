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
// Importiere deinen Helper
import { LocalizationHelper } from '../../../shared/common/utils/localization.helper';

@Injectable()
export class AssetMapper {
  /**
   * Wandelt das projizierte Objekt (assetData) in eine Domain-Entity um.
   * @param data - Das Ergebnis der Neo4j Query (bereits inkl. COALESCE Werten)
   * @param locale - Die angeforderte Sprache (für Parsing der komplexen JSON-Felder)
   */
  static toDomain(data: any, locale: string): AssetBlock {
    if (!data) {
      throw new Error('AssetMapper: Data properties cannot be null/undefined');
    }

    // 1. Gemeinsame Basis-Daten mappen
    // HINWEIS: data.name und data.shortDescription sind dank der Query
    // bereits in der korrekten Sprache (String).
    const baseProps: AssetBlockProps = {
      id: data.id,
      slug: data.slug,
      name: data.name,
      type: data.type as AssetType,
      status: (data.status as AssetStatus) || AssetStatus.DRAFT,
      version: data.version || '1.0.0',
      language: locale, // Wir setzen hier die angeforderte Sprache
      license: data.license,

      createdAt: new Date(data.createdAt || Date.now()),
      updatedAt: new Date(data.updatedAt || Date.now()),

      author: data.author || 'Unknown',
      contributor: AssetMapper.parseArray(data.contributor),

      shortDescription: data.shortDescription || '',
      longDescription: data.longDescription || '',

      // Tags bleiben (vorerst) Map oder Array, je nach Definition.
      // Hier nutzen wir parseArray als Fallback, falls die Logik komplexer ist.
      tags: LocalizationHelper.parseMapAndLocalize(data.tags, locale),
      abbreviation: data.abbreviation,

      organizationalLevel: AssetMapper.parseArray(data.organizationalLevel),

      icon: data.icon,
      image: data.image,
    };

    // 2. Unterscheidung nach Typ
    switch (baseProps.type) {
      case AssetType.MACRO_CLUSTER:
      case AssetType.CLUSTER:
      case AssetType.SEGMENT:
      case AssetType.CLUSTER_VIEW:
        return AssetMapper.toStructuralAsset(baseProps, data);

      case AssetType.CONCEPT:
      case AssetType.METHOD:
      case AssetType.TOOL:
      case AssetType.TECHNOLOGY:
        return AssetMapper.toContentAsset(baseProps, data, locale);

      case AssetType.ROLE:
        return new ContextAsset(baseProps);

      default:
        console.warn(
          `Unknown AssetType '${baseProps.type}' for ID ${baseProps.id}. Returning plain ContextAsset.`,
        );
        return new ContextAsset(baseProps);
    }
  }

  private static toStructuralAsset(
    base: AssetBlockProps,
    props: any,
  ): StructuralAsset {
    const structProps: StructuralAssetProps = {
      ...base,
      category: props.category,
      clusterSlug: props.clusterSlug,
      framework: props.framework,
      parentId: props.parentId,
    };
    return new StructuralAsset(structProps);
  }

  private static toContentAsset(
    base: AssetBlockProps,
    props: any,
    locale: string,
  ): ContentAsset {
    const contentProps: ContentAssetProps = {
      ...base,

      // --- KOMPLEXE JSON FELDER ---
      // Diese sind in der DB als JSON-String gespeichert und müssen
      // geparst UND lokalisiert werden.
      useCases: LocalizationHelper.parseAndLocalize(props.useCases, locale),
      scenarios: LocalizationHelper.parseAndLocalize(props.scenarios, locale),
      examples: LocalizationHelper.parseAndLocalize(props.examples, locale),
      resources: LocalizationHelper.parseAndLocalize(props.resources, locale),
      tradeoffMatrix: LocalizationHelper.parseAndLocalize(
        props.tradeoffMatrix,
        locale,
      ),
      metrics: LocalizationHelper.parseAndLocalize(props.metrics, locale),

      // Klassifizierungen
      maturityLevel: props.maturityLevel,
      complexityLevel: props.complexityLevel,
      impact: props.impact,
      decisionType: props.decisionType,
      organizationalMaturity: props.organizationalMaturity,
      valueStreamStage: props.valueStreamStage,
      cognitiveLoad: props.cognitiveLoad,

      // --- FLAT I18N LISTEN ---
      // Dank "getI18nProjection" in der Query sind diese Felder hier bereits
      // echte Arrays in der korrekten Sprache (z.B. ["Vorteil A", "Vorteil B"]).
      // Wir müssen sie also nicht mehr parsen oder lokalisieren, nur zuweisen.
      // Wir nutzen dennoch parseArray zur Sicherheit (falls null).
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

      vendor: props.vendor,
    };
    return new ContentAsset(contentProps);
  }

  // --- Utility Helper ---

  private static parseArray(value: any): any[] {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    return [];
  }

  // parseJson wird hier nicht mehr für die i18n Felder benötigt,
  // da LocalizationHelper das übernimmt.
  private static parseJson(value: any, fallback: any): any {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return fallback;
      }
    }
    return value || fallback;
  }
}
