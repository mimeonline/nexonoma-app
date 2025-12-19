"use client";

import { useEffect, useState } from "react";

type Props = {
  targetId: string;
};

export function ReadingProgress({ targetId }: Props) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const article = document.getElementById(targetId);
    if (!article) return;

    const updateProgress = () => {
      const rect = article.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const total = rect.height - windowHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);

      const percent = total > 0 ? (scrolled / total) * 100 : 0;
      setProgress(percent);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress);
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [targetId]);

  return (
    <div className="fixed top-0 left-0 z-50 h-0.5 w-full bg-white/10">
      <div className="h-full bg-white transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
      {/* <div className="h-full bg-gradient-to-r from-white/70 to-white" style={{ width: `${progress}%` }} /> */}
    </div>
  );
}
