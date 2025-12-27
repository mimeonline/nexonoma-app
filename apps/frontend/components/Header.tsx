"use client";

import { Logo } from "@/components/atoms/Logo"; // Pfad ggf. anpassen
import { useI18n } from "@/features/i18n/I18nProvider";
import { Menu, X } from "lucide-react"; // Installiere lucide-react falls nötig
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", labelKey: "nav.start" },
  { href: "/catalog", labelKey: "nav.catalog" },
  { href: "/grid", labelKey: "nav.structure" },
  { href: "/preview", labelKey: "nav.preview" },
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
    // Exakte Übereinstimmung für Home, Prefix für andere
    if (href === "/") return normalizedPath === "/";
    return normalizedPath === href || normalizedPath.startsWith(href + "/");
  };

  const withLocale = (href: string) => {
    if (href.startsWith("http")) return href;
    return locale ? `/${locale}${href}` : href;
  };

  return (
    <>
      {/* FIXED HEADER WRAPPER */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0B1220]/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* 1. LOGO */}
          <div className="flex items-center gap-4">
            <Link href={withLocale("/")} className="group transition-opacity hover:opacity-90">
              {/* Hier nutzen wir deine neue Logo Komponente */}
              <Logo className="h-8 w-8" withText={true} />
            </Link>

            {/* Sandbox Link (Dev only) */}
            {process.env.NODE_ENV === "development" && (
              <Link
                href="/sandbox"
                className="hidden md:block rounded-full bg-nexo-surface px-3 py-1 text-xs font-mono text-nexo-muted hover:text-nexo-aqua transition border border-white/5"
              >
                {t("nav.sandbox")}
              </Link>
            )}
          </div>

          {/* 2. DESKTOP NAV */}
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={withLocale(item.href)}
                  className={`text-sm font-medium transition-colors ${active ? "text-blue-300" : "text-gray-400 hover:text-white"}`}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          {/* 3. MOBILE MENU TOGGLE */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-300 transition hover:bg-white/5 hover:text-white md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={t("a11y.menuToggle")}
            aria-expanded={open}
            aria-controls="mobileMenu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* 4. MOBILE MENU DROPDOWN */}
        {open && (
          <div className="border-t border-white/5 bg-[#0B1220] px-4 pt-4 pb-8 md:hidden shadow-2xl">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={withLocale(item.href)}
                    className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                      active ? "bg-blue-500/10 text-blue-300" : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              })}
              {/* Mobile Sandbox Link */}
              {process.env.NODE_ENV === "development" && (
                <Link href="/sandbox" className="mt-4 block text-center text-xs font-mono text-gray-500" onClick={() => setOpen(false)}>
                  [ Dev Sandbox ]
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* PLATZHALTER: Verhindert, dass Content unter den Header rutscht */}
      <div className="h-[72px]" aria-hidden="true" />
    </>
  );
}
