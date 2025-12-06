import { Button } from "@/components/ui/atoms/Button";
import { ArrowRight } from "lucide-react";

export function CTABottom() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-nexo-card to-[#0F1522] px-6 py-12 text-center sm:px-12">
      <div className="relative z-10 mx-auto max-w-2xl space-y-6">
        <h2 className="font-[--font-space-grotesk] text-3xl font-bold text-white">Bereit für bessere Entscheidungen?</h2>
        <p className="text-nexo-muted">
          Nexonoma ist derzeit im Proof of Concept Status. Dein Feedback hilft uns, das ultimative Werkzeug für Architekten zu bauen.
        </p>
        <div className="flex justify-center pt-2">
          <Button variant="primary" size="lg" className="group gap-2 bg-white text-nexo-bg hover:bg-slate-200">
            Feedback
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </section>
  );
}
