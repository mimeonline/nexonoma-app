"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/grid", label: "Grid" },
  { href: "/matrix", label: "Matrix" },
  { href: "/city", label: "City" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (pathname?.startsWith(href + "/") ?? false);

  return (
    <header className="sticky top-0 z-30 bg-[#0B1220]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 text-white">
          <svg
            className="h-8 w-8 text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6A1.125 1.125 0 012.25 11.25v-4.125zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
            />
          </svg>
          <span className="text-lg font-semibold">Nexonoma</span>
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-white/10 text-white shadow-inner shadow-blue-400/20"
                  : "text-slate-200 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-200 transition hover:border-white/30 hover:text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Menü"
          aria-expanded={open}
        >
          <span className="block h-0.5 w-5 bg-current" />
          <span className="mt-1 block h-0.5 w-4 bg-current" />
          <span className="mt-1 block h-0.5 w-5 bg-current" />
        </button>
      </div>

      {open && (
        <div className="md:hidden">
          <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-[#0B1220]/95 p-2 shadow-xl shadow-black/40">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive(item.href)
                    ? "bg-white/10 text-white"
                    : "text-slate-200 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
