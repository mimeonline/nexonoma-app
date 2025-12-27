import React from "react";

interface LogoProps {
  className?: string; // Bestimmt die Größe des ICONS (z.B. "w-8 h-8")
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8", withText = true }) => {
  return (
    // Der äußere Container hat KEINE feste Breite, damit der Text Platz hat
    <div className="flex items-center gap-3 select-none">
      {/* Hier wenden wir die Größe (className) nur auf das Icon an */}
      <div className={`${className} shrink-0`}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
          <defs>
            <linearGradient id="nex-grad-react" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" />
              <stop offset="1" stopColor="#2DD4BF" />
            </linearGradient>
          </defs>
          <circle cx="8" cy="8" r="3" fill="url(#nex-grad-react)" />
          <circle cx="8" cy="24" r="3" fill="url(#nex-grad-react)" />
          <path d="M8 8V24" stroke="url(#nex-grad-react)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="8" r="3" fill="url(#nex-grad-react)" opacity="0.9" />
          <circle cx="24" cy="24" r="3" fill="url(#nex-grad-react)" opacity="0.9" />
          <path d="M24 8V24" stroke="url(#nex-grad-react)" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <path d="M8 8L24 24" stroke="url(#nex-grad-react)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="16" cy="16" r="4" fill="#0B1220" stroke="url(#nex-grad-react)" strokeWidth="2" />
        </svg>
      </div>

      {/* Der Text steht daneben und nimmt sich so viel Platz wie er braucht */}
      {withText && <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">Nexonoma</span>}
    </div>
  );
};
