export default function GridLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-h-[calc(100vh-var(--header))]">
      <aside className="w-56 shrink-0 border-r border-nexo-border ml-4 pt-4">{/* Left Rail */}Menu </aside>

      <section className="flex-1 overflow-auto">{children}</section>
    </div>
  );
}
