// apps/frontend/app/sandbox/enterprise-city/page.tsx
"use client";

import EnterpriseCityPreview from "./EnterpriseCityPreview";

export default function EnterpriseCityPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
      <div className="w-full max-w-5xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Nexonoma · Enterprise City Preview</h1>
          <p className="text-sm text-slate-400">
            Simple 2D-Preview des Enterprise-City-Konzepts auf einem HTML5-Canvas. Ein Stadtblock entspricht einem Cluster, ein Gebäude einem
            Content-Block.
          </p>
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <EnterpriseCityPreview />
        </section>
      </div>
    </main>
  );
}
