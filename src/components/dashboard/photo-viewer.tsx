"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ViewerPhoto {
  src: string;
  /** e.g. "Men's Cotton Shirt" */
  title: string;
  /** e.g. "Washing · Photo 2 of 3" */
  subtitle?: string;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const STEP = 0.5;

/**
 * Full-area photo viewer with zoom (buttons, mouse wheel, double-click), pan by moving
 * the pointer while zoomed, previous/next and a thumbnail strip.
 *
 * Renders `absolute inset-0`, so place it inside a positioned container (e.g. a dialog).
 * Escape closes the viewer only, not the surrounding dialog.
 */
export function PhotoViewer({
  photos,
  index,
  onIndexChange,
  onClose,
}: {
  photos: ViewerPhoto[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState("50% 50%");
  const stripRef = useRef<HTMLDivElement>(null);
  const photo = photos[index];
  const count = photos.length;

  const go = (next: number) => {
    onIndexChange((next + count) % count);
    setZoom(1);
    setOrigin("50% 50%");
  };
  const zoomBy = (delta: number) =>
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(z + delta).toFixed(2))));

  // Keyboard: capture on window so Escape doesn't also close the parent dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const keys: Record<string, () => void> = {
        Escape: onClose,
        ArrowLeft: () => go(index - 1),
        ArrowRight: () => go(index + 1),
        "+": () => zoomBy(STEP),
        "=": () => zoomBy(STEP),
        "-": () => zoomBy(-STEP),
      };
      const action = keys[e.key];
      if (!action) return;
      e.preventDefault();
      e.stopPropagation();
      action();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  });

  // Keep the active thumbnail in view.
  useEffect(() => {
    stripRef.current
      ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
      ?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [index]);

  if (!photo) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col bg-slate-950/95 text-white animate-in fade-in duration-150"
      role="dialog"
      aria-label={`${photo.title} photo viewer`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="truncate font-bold">{photo.title}</p>
          <p className="truncate text-xs text-slate-300">
            {photo.subtitle ? `${photo.subtitle} · ` : ""}
            {index + 1} / {count}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ViewerButton label="Zoom out" onClick={() => zoomBy(-STEP)} disabled={zoom <= MIN_ZOOM}>
            <ZoomOut className="h-4 w-4" />
          </ViewerButton>
          <span className="w-12 text-center font-mono text-xs text-slate-300">
            {Math.round(zoom * 100)}%
          </span>
          <ViewerButton label="Zoom in" onClick={() => zoomBy(STEP)} disabled={zoom >= MAX_ZOOM}>
            <ZoomIn className="h-4 w-4" />
          </ViewerButton>
          <ViewerButton
            label="Reset zoom"
            onClick={() => {
              setZoom(1);
              setOrigin("50% 50%");
            }}
            disabled={zoom === 1}
          >
            <RotateCcw className="h-4 w-4" />
          </ViewerButton>
          <ViewerButton label="Close" onClick={onClose} className="ml-2 bg-white/15">
            <X className="h-4 w-4" />
          </ViewerButton>
        </div>
      </div>

      {/* Stage */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 sm:px-16">
        <div
          className={cn(
            "flex h-full w-full items-center justify-center overflow-hidden rounded-xl",
            zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in",
          )}
          onWheel={(e) => zoomBy(e.deltaY < 0 ? STEP : -STEP)}
          onDoubleClick={() => setZoom((z) => (z > 1 ? 1 : 2.5))}
          onClick={() => zoom === 1 && setZoom(2)}
          onMouseMove={(e) => {
            if (zoom === 1) return;
            const r = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 100;
            const y = ((e.clientY - r.top) / r.height) * 100;
            setOrigin(`${x}% ${y}%`);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={`${photo.title} – photo ${index + 1}`}
            draggable={false}
            className="max-h-full max-w-full select-none rounded-xl object-contain transition-transform duration-150"
            style={{ transform: `scale(${zoom})`, transformOrigin: origin }}
          />
        </div>

        {count > 1 && (
          <>
            <ViewerButton
              label="Previous photo"
              onClick={() => go(index - 1)}
              className="absolute left-2 top-1/2 h-10 w-10 -translate-y-1/2 bg-white/15 sm:left-4"
            >
              <ChevronLeft className="h-5 w-5" />
            </ViewerButton>
            <ViewerButton
              label="Next photo"
              onClick={() => go(index + 1)}
              className="absolute right-2 top-1/2 h-10 w-10 -translate-y-1/2 bg-white/15 sm:right-4"
            >
              <ChevronRight className="h-5 w-5" />
            </ViewerButton>
          </>
        )}
      </div>

      <p className="py-1 text-center text-[11px] text-slate-400">
        Scroll or click to zoom · move the pointer to look around · ← → to browse
      </p>

      {/* Thumbnails */}
      {count > 1 && (
        <div ref={stripRef} className="flex gap-2 overflow-x-auto px-4 pb-4 pt-1 sm:px-5">
          {photos.map((p, i) => (
            <button
              key={i}
              type="button"
              data-index={i}
              onClick={() => go(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition",
                i === index ? "border-[#00B074]" : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ViewerButton({
  label,
  onClick,
  disabled,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={disabled}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/25 disabled:opacity-30 disabled:hover:bg-transparent",
        className,
      )}
    >
      {children}
    </button>
  );
}
