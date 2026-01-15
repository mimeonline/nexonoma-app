import Script from "next/script";

type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>;

export const JsonLd = ({ data, id }: { data: JsonLdValue; id: string }) => (
  <Script id={id} type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

export type WebSiteInput = {
  url: string;
  name: string;
};

export const buildWebSite = ({ url, name }: WebSiteInput) => ({
  "@type": "WebSite",
  "@id": `${url}#website`,
  url,
  name,
});

export type WebPageInput = {
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  webSite: WebSiteInput;
  additionalType?: string;
  about?: Array<{ "@type": string; name: string }>;
};

export const buildWebPage = ({ name, description, url, inLanguage, webSite, additionalType, about }: WebPageInput) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name,
  description,
  url,
  inLanguage,
  ...(additionalType ? { additionalType } : {}),
  ...(about && about.length > 0 ? { about } : {}),
  isPartOf: buildWebSite(webSite),
});

export type DefinedTermInput = {
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  webSite: WebSiteInput;
  about?: Array<{ "@type": string; name: string }>;
};

export const buildDefinedTerm = ({ name, description, url, inLanguage, webSite, about }: DefinedTermInput) => ({
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  name,
  description,
  url,
  inLanguage,
  ...(about && about.length > 0 ? { about } : {}),
  isPartOf: buildWebSite(webSite),
});

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export const buildBreadcrumbList = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
