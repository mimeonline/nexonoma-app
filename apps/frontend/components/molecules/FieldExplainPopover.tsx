"use client";

import { useI18n } from "@/features/i18n/I18nProvider";
import clsx from "clsx";

interface FieldExplainPopoverProps {
  fieldKey: string;
  value?: string;
}

export function FieldExplainPopover({ fieldKey, value }: FieldExplainPopoverProps) {
  const { t, tRaw } = useI18n();

  const fieldLabel = t(`asset.properties.${fieldKey}.label`);
  const fieldDescription = t(`asset.properties.${fieldKey}.description`);

  const enums = tRaw(`asset.enums.${fieldKey}`);
  const properties = tRaw(`asset.properties.${fieldKey}.properties`);

  const enumEntries =
    enums && typeof enums === "object" && !Array.isArray(enums)
      ? (enums as Record<
          string,
          {
            label: string;
            description: string;
          }
        >)
      : undefined;

  const propertyEntries =
    properties && typeof properties === "object" && !Array.isArray(properties)
      ? (properties as Record<
          string,
          {
            label: string;
            description: string;
          }
        >)
      : undefined;

  return (
    <div className="space-y-4">
      {/* Titel */}
      <div className="text-sm font-semibold text-white">{fieldLabel}</div>

      {/* Beschreibung */}
      {fieldDescription && <p className="text-xs text-slate-300 leading-relaxed">{fieldDescription}</p>}

      {/* ENUMS / STUFEN */}
      {enumEntries && (
        <div className="mt-3 pl-3 border-l border-slate-700/60">
          <div className="mb-2 text-[10px] uppercase tracking-wide text-slate-400">Stufen</div>

          <ul className="space-y-3 text-xs">
            {Object.entries(enumEntries).map(([key, e]) => {
              const isActive = key === value;

              return (
                <li key={key} className="grid grid-cols-[6.5rem_1fr] gap-x-3 items-start">
                  <div className="flex items-center gap-2">
                    {isActive && <span className="mt-1 h-2 w-2 rounded-full bg-yellow-400 shrink-0" />}
                    <span className={clsx("font-semibold", isActive ? "text-white" : "text-slate-200")}>{e.label}</span>
                  </div>

                  <div className={clsx("leading-relaxed", isActive ? "text-slate-200" : "text-slate-400")}>{e.description}</div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* PROPERTIES (z. B. useCases) */}
      {propertyEntries && (
        <div className="mt-3 pl-3 border-l border-slate-700/60">
          <div className="mb-2 text-[10px] uppercase tracking-wide text-slate-400">Felder</div>

          <ul className="space-y-3 text-xs">
            {Object.entries(propertyEntries).map(([key, prop]) => (
              <li key={key} className="grid grid-cols-[6.5rem_1fr] gap-x-3 items-start">
                <div className="font-semibold text-slate-100">{prop.label}</div>

                <div className="text-slate-400 leading-relaxed">{prop.description}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
