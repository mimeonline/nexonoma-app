import { Badge } from "@/components/ui/atoms/Badge";
import { cn } from "@/lib/utils";
interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string | string[] | React.ReactNode; // Umbenannt von subtitle
  badge?: string;
  align?: "left" | "center";
}

export function SectionTitle({ title, description, badge, align = "left", className, ...props }: SectionTitleProps) {
  const descriptionLines = Array.isArray(description)
    ? description.filter((line) => typeof line === "string" && line.trim().length > 0)
    : null;
  const hasDescriptionLines = Boolean(descriptionLines && descriptionLines.length > 0);

  return (
    <div className={cn("mb-10 flex flex-col gap-3", align === "center" && "items-center text-center", className)} {...props}>
      {badge && (
        <Badge variant="ocean" size="lg">
          {badge}
        </Badge>
      )}

      <h1 className="text-3xl font-bold text-white sm:text-4xl leading-tight">{title}</h1>

      {hasDescriptionLines ? (
        <div data-slot="description" className="max-w-2xl text-lg text-nexo-muted leading-relaxed space-y-2">
          {(descriptionLines as string[]).map((line, index) => (
            <p key={`${line}-${index}`}>{line}</p>
          ))}
        </div>
      ) : description && !Array.isArray(description) ? (
        <div data-slot="description" className="max-w-2xl text-lg text-nexo-muted leading-relaxed">
          {typeof description === "string" ? <p className="whitespace-pre-line">{description}</p> : description}
        </div>
      ) : null}
    </div>
  );
}
