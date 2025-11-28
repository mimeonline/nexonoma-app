import Link from "next/link";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";

type LandingCardProps = {
  title: string;
  description: string;
  href: string;
};

export function LandingCard({ title, description, href }: LandingCardProps) {
  return (
    <Link href={href} className="group block h-full focus:outline-none">
      <Card className="h-full border-white/10 bg-gradient-to-b from-[#162238] via-[#131C2E] to-[#0F182A] transition duration-200 group-hover:-translate-y-1 group-hover:border-white/20 group-hover:shadow-[0_20px_60px_-25px_rgba(76,107,255,0.35)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-sm text-slate-200">
              {title.slice(0, 1)}
            </span>
            {title}
          </CardTitle>
          <CardDescription className="mt-2 text-base text-slate-200/80">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Button className="bg-[#1F2A40] group-hover:bg-[#243353]">
            Öffnen
          </Button>
          <span className="text-xs font-medium text-slate-300/70">
            {href}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
