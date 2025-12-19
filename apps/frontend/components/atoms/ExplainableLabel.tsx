"use client";

import { InfoPopover } from "@/components/atoms/InfoPopover";
import { FieldExplainPopover } from "@/components/molecules/FieldExplainPopover";
import clsx from "clsx";
import { ReactNode } from "react";

interface ExplainableLabelProps {
  fieldKey: string;
  value?: string;
  children: ReactNode;
  className?: string;
  popoverWidth?: number;
}

export function ExplainableLabel({ fieldKey, value, children, className, popoverWidth = 360 }: ExplainableLabelProps) {
  return (
    <InfoPopover width={popoverWidth} content={<FieldExplainPopover fieldKey={fieldKey} value={value} />}>
      <span
        className={clsx(
          "inline-flex items-center cursor-help",
          "text-slate-200 transition-colors",
          "hover:text-white hover:underline hover:decoration-dotted hover:underline-offset-4",
          className
        )}
      >
        {children}
      </span>
    </InfoPopover>
  );
}
