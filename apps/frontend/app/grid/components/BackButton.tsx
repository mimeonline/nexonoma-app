import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  href: string;
  label?: string;
};

export function BackButton({ href, label = "Zurück" }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-cyan-400 hover:text-[#4FF4E0]"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
