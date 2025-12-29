import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: false, follow: true },
  };
}

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
