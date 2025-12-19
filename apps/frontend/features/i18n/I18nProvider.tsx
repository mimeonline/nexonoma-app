// features/i18n/I18nProvider.tsx
"use client";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import React, { createContext, useContext, useMemo } from "react";

type TranslationParams = Record<string, string | number>;

type I18nContextValue = {
  lang: string;
  dict: Dictionary;
  t: (key: string, params?: TranslationParams) => string;
  tRaw: (key: string) => unknown;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(template: string, params?: TranslationParams) {
  if (!params) return template;
  return Object.entries(params).reduce(
    (value, [param, replacement]) => value.replace(new RegExp(`\\{${param}\\}`, "g"), String(replacement)),
    template
  );
}

function resolveKey(dict: Dictionary, key: string) {
  const segments = key.split(".").filter(Boolean);
  let current: unknown = dict;

  for (const segment of segments) {
    if (typeof current === "object" && current !== null && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }

  return typeof current === "string" ? current : undefined;
}

function resolveKeyRaw(dict: Dictionary, key: string) {
  const segments = key.split(".").filter(Boolean);
  let current: unknown = dict;

  for (const segment of segments) {
    if (typeof current === "object" && current !== null && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }

  return current;
}

function buildTranslator(dict: Dictionary) {
  return (key: string, params?: TranslationParams) => {
    const value = resolveKey(dict, key);
    if (value === undefined) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[i18n] missing translation for key "${key}"`);
      }
      return key;
    }

    return interpolate(value, params);
  };
}

type I18nProviderProps = {
  lang: string;
  dict: Dictionary;
};

export function I18nProvider({ lang, dict, children }: React.PropsWithChildren<I18nProviderProps>) {
  const t = useMemo(() => buildTranslator(dict), [dict]);
  const tRaw = useMemo(() => (key: string) => resolveKeyRaw(dict, key), [dict]);
  return <I18nContext.Provider value={{ lang, dict, t, tRaw }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
export type AssetEnumType =
  | "types"
  | "organizationalLevel"
  | "status"
  | "maturityLevel"
  | "organizationalMaturity"
  | "complexityLevel"
  | "cognitiveLoad"
  | "impacts"
  | "decisionType"
  | "valueStreamStage";

export function enumAssetKey(enumType: AssetEnumType, value?: string): string {
  if (!value) return "common.dash";

  return `asset.enums.${enumType}.${value}.label`;
}

export function useEnumAssetLabel() {
  const { t } = useI18n();

  return (enumType: AssetEnumType, value?: string): string => (value ? t(enumAssetKey(enumType, value)) : t("common.dash"));
}

export function useEnumAssetLabels(sep = ", ") {
  const { t } = useI18n();

  return (enumType: AssetEnumType, values?: string[]): string => {
    if (!values?.length) return t("common.dash");
    return values.map((v) => t(enumAssetKey(enumType, v))).join(sep);
  };
}
