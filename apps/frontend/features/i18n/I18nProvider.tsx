"use client";

import React, { createContext, useContext } from "react";

type I18nContextValue = {
  lang: string;
  dict: any;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ lang, dict, children }: React.PropsWithChildren<I18nContextValue>) {
  return <I18nContext.Provider value={{ lang, dict }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
