import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex flex-col items-center gap-3 text-sm text-slate-400/80">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="https://nexonoma.de/about" className="hover:text-accent-primary transition-colors">
          Über Nexonoma
        </Link>
        <span className="text-slate-600">•</span>
        <Link href="https://nexonoma.de/feedback" className="hover:text-accent-primary transition-colors">
          Feedback
        </Link>
        <span className="text-slate-600">•</span>
        <Link href="https://nexonoma.de/datenschutz" className="hover:text-accent-primary transition-colors">
          Datenschutz
        </Link>
        <span className="text-slate-600">•</span>
        <Link href="https://nexonoma.de/impressum" className="hover:text-accent-primary transition-colors">
          Impressum
        </Link>
      </div>
      <div className="text-slate-500">© {new Date().getFullYear()} Nexonoma</div>
    </div>
  );
}
