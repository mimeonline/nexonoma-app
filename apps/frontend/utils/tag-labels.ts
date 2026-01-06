const CARD_TAG_OVERRIDES: Record<string, string> = {
  "Software Engineering": "Software Eng.",
  "Maschinelles Lernen": "ML",
  "Access Control": "Access Ctrl",
};

export function formatTagLabel(label: string, variant: "card" | "detail" = "card"): string {
  if (variant === "card") {
    return CARD_TAG_OVERRIDES[label] || label;
  }
  return label;
}
