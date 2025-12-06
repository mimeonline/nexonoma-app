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
        <span className="w-fit rounded-full border border-nexo-ocean/20 bg-nexo-ocean/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-nexo-ocean shadow-[0_0_10px_-3px_rgba(56,189,248,0.3)]">
          {badge}
        </span>
      )}

      <h2 className="font-[--font-space-grotesk] text-3xl font-bold text-white sm:text-4xl leading-tight">{title}</h2>

      {description && <p className="max-w-2xl text-lg text-nexo-muted leading-relaxed">{description}</p>}
    </div>
  );
}
