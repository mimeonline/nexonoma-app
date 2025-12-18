export default function GridLayout({ children }: { children: React.ReactNode }) {
  return <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">{children}</div>;
}
