import { LucideIcon, icons } from "lucide-react";

export interface DynamicIconProps extends React.ComponentProps<"svg"> {
  name?: string;
  fallback?: keyof typeof icons;
}

function toPascalCase(value: string) {
  return value
    .trim()
    .replace(/[_\\s]+/g, "-")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export const DynamicIcon = ({ name, fallback = "Layers", ...props }: DynamicIconProps) => {
  const candidates = name ? [name, toPascalCase(name)] : [];

  const matched = candidates.find((candidate) => candidate in icons) ?? fallback;

  const IconComponent = icons[matched as keyof typeof icons] as LucideIcon;

  if (!IconComponent) return null;

  return <IconComponent {...props} />;
};
