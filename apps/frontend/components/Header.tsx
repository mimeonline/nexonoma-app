"use client";

import { useI18n } from "@/features/i18n/I18nProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", labelKey: "nav.start" },
  { href: "/catalog", labelKey: "nav.catalog" },
  { href: "/grid", labelKey: "nav.structure" },
  { href: "/matrix", labelKey: "nav.preview" },
  { href: "https://nexonoma.de/about", labelKey: "nav.about" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const locale = pathname?.match(/^\/(de|en)(\/|$)/)?.[1];

  function stripLocale(pathname?: string) {
    if (!pathname) return "";

    return pathname.replace(/^\/(de|en)(\/|$)/, "/");
  }

  const isActive = (href: string) => {
    const normalizedPath = stripLocale(pathname);

    return normalizedPath === href || normalizedPath.startsWith(href + "/");
  };

  const withLocale = (href: string) => {
    if (href.startsWith("http")) return href;
    return locale ? `/${locale}${href}` : href;
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
          <span className="text-blue-300 text-lg font-bold tracking-tight sm:block">Nexonoma</span>
        </Link>
        {process.env.NODE_ENV === "development" && (
          <Link href="/sandbox" className="text-nexo-muted hover:text-nexo-aqua transition">
            {t("nav.sandbox")}
          </Link>
        )}
        <nav className="hidden items-center gap-3 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={withLocale(item.href)}
                className={`relative rounded-xl px-4 py-2 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/30 ${
                  active
                    ? "text-blue-300 after:absolute after:inset-x-3 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-blue-500"
                    : "text-slate-200 hover:text-blue-300"
                }`}
              >
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <button
          className="flex h-10 w-10 flex-col justify-between rounded-xl border border-white/10 p-2 text-slate-200 transition hover:border-white/30 hover:text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={t("a11y.menuToggle")}
          aria-expanded={open}
          aria-controls="mobileMenu"
        >
          <span className="block h-0.5 w-full rounded-full bg-slate-200" />
          <span className="block h-0.5 w-full rounded-full bg-slate-200" />
          <span className="block h-0.5 w-full rounded-full bg-slate-200" />
        </button>
      </div>

      {open && (
        <div className="md:hidden">
          <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-nexo-surface/95 p-2 shadow-xl shadow-black/40">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={withLocale(item.href)}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/30 ${
                    active ? "bg-white/10 text-blue-300" : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
