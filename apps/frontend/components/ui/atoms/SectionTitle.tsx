import { Badge } from "@/components/ui/atoms/Badge";
import { cn } from "@/lib/utils";
interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string; // Umbenannt von subtitle
  badge?: string;
  align?: "left" | "center";
}

export function SectionTitle({ title, description, badge, align = "left", className, ...props }: SectionTitleProps) {
  return (
    <div className={cn("mb-10 flex flex-col gap-3", align === "center" && "items-center text-center", className)} {...props}>
      {badge && (
        <Badge variant="ocean" size="lg">
          {badge}
        </Badge>
      )}

      <h2 className="font-[--font-space-grotesk] text-3xl font-bold text-white sm:text-4xl leading-tight">{title}</h2>

      {description && <p className="max-w-2xl text-lg text-nexo-muted leading-relaxed">{description}</p>}
    </div>
  );
}
