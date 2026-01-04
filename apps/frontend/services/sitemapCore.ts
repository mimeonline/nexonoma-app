import { SEO_SUPPORTED_LOCALES } from "@/app/[lang]/seo";
import { createNexonomaApi } from "@/services/api";
import { AssetStatus } from "@/types/nexonoma";
import {
  CORE_TYPE_ORDER,
  dedupeEntries,
  formatLastmod,
  isValidSlug,
  sortEntriesByTypeThenSlug,
  type SitemapEntry,
  type SortableSitemapEntry,
  type SitemapVariant,
  urlForAsset,
} from "@/utils/sitemap";

const isPublished = (status?: string) => status === AssetStatus.PUBLISHED;

const toTypeKey = (value?: string, fallback?: string) => (value ? value.toString().toUpperCase() : fallback ?? "");

const toMacroClusters = (input: unknown) => (Array.isArray(input) ? input : []);

const toClusters = (input: unknown) => (Array.isArray(input) ? input : []);

const toSegments = (input: unknown) => (Array.isArray(input) ? input : []);

export const buildCoreSitemapEntries = async (baseUrl: string, variant: SitemapVariant): Promise<SitemapEntry[]> => {
  const entries: SortableSitemapEntry[] = [];

  await Promise.all(
    SEO_SUPPORTED_LOCALES.map(async (locale) => {
      const api = createNexonomaApi(locale);

      let macros: unknown[] = [];
      try {
        macros = toMacroClusters(await api.getMacroClusters());
      } catch {
        return;
      }

      await Promise.all(
        macros.map(async (macro) => {
          const macroRecord = macro as Record<string, unknown>;
          const macroSlug = typeof macroRecord.slug === "string" ? macroRecord.slug : "";
          const macroType = toTypeKey(macroRecord.type as string | undefined, "MACRO_CLUSTER");
          const macroUpdatedAt = typeof macroRecord.updatedAt === "string" ? macroRecord.updatedAt : undefined;
          const macroStatus = typeof macroRecord.status === "string" ? macroRecord.status : undefined;

          if (isValidSlug(macroSlug) && isPublished(macroStatus)) {
            const lastmod = formatLastmod(macroUpdatedAt);
            if (lastmod) {
              const loc = urlForAsset({ type: macroType, slug: macroSlug }, { baseUrl, locale, variant });
              if (loc) {
                entries.push({ loc, lastmod, type: macroType, slug: macroSlug, locale });
              }
            }
          }

          if (!isValidSlug(macroSlug)) return;

          let macroDetail: unknown;
          try {
            macroDetail = await api.getClusters(macroSlug);
          } catch {
            return;
          }

          const macroDetailRecord = macroDetail as Record<string, unknown> | null;
          const clusters = toClusters(macroDetailRecord?.clusters ?? macroDetailRecord?.children);

          await Promise.all(
            clusters.map(async (cluster) => {
              const clusterRecord = cluster as Record<string, unknown>;
              const clusterSlug = typeof clusterRecord.slug === "string" ? clusterRecord.slug : "";
              const clusterType = toTypeKey(clusterRecord.type as string | undefined, "CLUSTER");
              const clusterUpdatedAt = typeof clusterRecord.updatedAt === "string" ? clusterRecord.updatedAt : undefined;
              const clusterStatus = typeof clusterRecord.status === "string" ? clusterRecord.status : undefined;

              if (isValidSlug(clusterSlug) && isPublished(clusterStatus)) {
                const lastmod = formatLastmod(clusterUpdatedAt);
                if (lastmod) {
                  const loc = urlForAsset(
                    { type: clusterType, slug: clusterSlug, macroSlug },
                    { baseUrl, locale, variant }
                  );
                  if (loc) {
                    entries.push({ loc, lastmod, type: clusterType, slug: clusterSlug, locale });
                  }
                }
              }

              if (!isValidSlug(clusterSlug)) return;

              let clusterDetail: unknown;
              try {
                clusterDetail = await api.getSegments(clusterSlug);
              } catch {
                return;
              }

              const clusterDetailRecord = clusterDetail as Record<string, unknown> | null;
              const segments = toSegments(clusterDetailRecord?.segments ?? clusterDetailRecord?.children);

              segments.forEach((segment) => {
                const segmentRecord = segment as Record<string, unknown>;
                const segmentSlug = typeof segmentRecord.slug === "string" ? segmentRecord.slug : "";
                const segmentUpdatedAt = typeof segmentRecord.updatedAt === "string" ? segmentRecord.updatedAt : undefined;
                const segmentStatus = typeof segmentRecord.status === "string" ? segmentRecord.status : undefined;
                const segmentType = toTypeKey(segmentRecord.type as string | undefined, "SEGMENT");

                if (!isValidSlug(segmentSlug) || !isPublished(segmentStatus)) return;

                const lastmod = formatLastmod(segmentUpdatedAt);
                if (!lastmod) return;

                const loc = urlForAsset(
                  { type: segmentType, slug: segmentSlug, macroSlug, clusterSlug },
                  { baseUrl, locale, variant }
                );
                if (!loc) return;

                entries.push({ loc, lastmod, type: segmentType, slug: segmentSlug, locale });
              });
            })
          );
        })
      );
    })
  );

  const ordered = sortEntriesByTypeThenSlug(entries, CORE_TYPE_ORDER);
  return dedupeEntries(ordered).map(({ loc, lastmod }) => ({ loc, lastmod }));
};
