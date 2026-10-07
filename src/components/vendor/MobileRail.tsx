"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/* Shared helpers for horizontal swipe rails on mobile.
   `useRail` tracks which card is centred; `RailDots` shows and jumps to it. */

export function useRail<T extends HTMLElement = HTMLDivElement>(count: number, onChange?: (i: number) => void) {
  const ref = useRef<T>(null);
  const [index, setIndex] = useState(0);
  const onChangeRef = useRef(onChange);
  const lastRef = useRef(0);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    const rail = ref.current;
    if (!rail) return;
    const onScroll = () => {
      const cards = Array.from(rail.children) as HTMLElement[];
      if (!cards.length) return;
      const mid = rail.scrollLeft + rail.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      const next = Math.min(best, count - 1);
      if (next !== lastRef.current) {
        lastRef.current = next;
        setIndex(next);
        onChangeRef.current?.(next);
      }
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, [count]);

  const goTo = useCallback((i: number) => {
    const rail = ref.current;
    const card = rail?.children[i] as HTMLElement | undefined;
    if (!rail || !card) return;
    rail.scrollTo({ left: card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  }, []);

  return { ref, index, goTo };
}

export function RailDots({
  count,
  index,
  onSelect,
  className = "",
  activeClass = "bg-[#00875A]",
}: {
  count: number;
  index: number;
  onSelect: (i: number) => void;
  className?: string;
  activeClass?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Go to card ${i + 1}`}
          className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? `w-6 ${activeClass}` : "w-1.5 bg-slate-300"}`}
        />
      ))}
    </div>
  );
}

/** Classes for a rail that is horizontal on mobile and hands over to a grid at `bp`. */
export const RAIL_BASE = "flex overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 pb-3 gap-3";
export const RAIL_CARD = "w-[82vw] max-w-[320px] shrink-0 snap-center";
