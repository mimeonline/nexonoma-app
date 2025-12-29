import { MetadataRoute } from "next";
import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { SEO_BASE_URL, SEO_SUPPORTED_LOCALES } from "./[lang]/seo";

type ContentIndexEntry = {
  locales: Set<(typeof SEO_SUPPORTED_LOCALES)[number]>;
  updatedAt?: Date;
};

const CONTENT_ROOT = path.join(process.cwd(), "../../content");
const ROUTES = ["", "/catalog", "/grid"] as const;

const isValidDate = (value: unknown) => {
  if (typeof value !== "string") return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
};

const walkContent = async () => {
  const entries = new Map<string, ContentIndexEntry>();

  await Promise.all(
    SEO_SUPPORTED_LOCALES.map(async (locale) => {
      const localeDir = path.join(CONTENT_ROOT, locale);
      let contentTypes: string[] = [];
      try {
        contentTypes = (await readdir(localeDir, { withFileTypes: true }))
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name);
      } catch {
        return;
      }

      await Promise.all(
        contentTypes.map(async (contentType) => {
          const contentTypeDir = path.join(localeDir, contentType);
          let assetTypes: string[] = [];
          try {
            assetTypes = (await readdir(contentTypeDir, { withFileTypes: true }))
              .filter((dirent) => dirent.isDirectory())
              .map((dirent) => dirent.name);
          } catch {
            return;
          }

          await Promise.all(
            assetTypes.map(async (assetType) => {
              const assetDir = path.join(contentTypeDir, assetType);
              let files: string[] = [];
              try {
                files = (await readdir(assetDir, { withFileTypes: true }))
                  .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".md"))
                  .map((dirent) => dirent.name);
              } catch {
                return;
              }

              await Promise.all(
                files.map(async (file) => {
                  const slug = file.replace(/\.md$/, "");
                  const routeKey = `/content/${contentType}/${assetType}/${slug}`;
                  const filePath = path.join(assetDir, file);

                  let updatedAt: Date | undefined;
                  try {
                    const fileContents = await readFile(filePath, "utf8");
                    const { data } = matter(fileContents);
                    if (isValidDate(data.updatedAt)) {
                      updatedAt = new Date(data.updatedAt);
                    }
                  } catch {
                    // ignore frontmatter errors for sitemap
                  }

                  const entry = entries.get(routeKey) ?? { locales: new Set<(typeof SEO_SUPPORTED_LOCALES)[number]>() };
                  entry.locales.add(locale);
                  if (updatedAt && (!entry.updatedAt || updatedAt > entry.updatedAt)) {
                    entry.updatedAt = updatedAt;
                  }
                  entries.set(routeKey, entry);
                })
              );
            })
          );
        })
      );
    })
  );

  return entries;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SEO_BASE_URL;
  const locales = SEO_SUPPORTED_LOCALES;

  const makeUrl = (lang: (typeof locales)[number], route: string) => `${baseUrl}/${lang}${route}`;

  const staticEntries = ROUTES.flatMap((route) => {
    const alternates = {
      languages: Object.fromEntries(locales.map((lang) => [lang, makeUrl(lang, route)])),
    };

    return locales.map((lang) => ({
      url: makeUrl(lang, route),
      lastModified: new Date(),
      alternates,
    }));
  });

  const contentEntries = await walkContent();
  const dynamicEntries = Array.from(contentEntries.entries()).flatMap(([route, entry]) => {
    const localesForRoute = Array.from(entry.locales);
    const alternates = {
      languages: Object.fromEntries(localesForRoute.map((lang) => [lang, makeUrl(lang, route)])),
    };

    return localesForRoute.map((lang) => ({
      url: makeUrl(lang, route),
      lastModified: entry.updatedAt ?? new Date(),
      alternates,
    }));
  });

  return [...staticEntries, ...dynamicEntries];
}
