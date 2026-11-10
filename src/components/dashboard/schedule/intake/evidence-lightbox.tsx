"use client";

import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { INTAKE_COPY, type IntakeItem } from "@/lib/vendor-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { EvidenceFocus } from "./types";

interface EvidenceLightboxProps {
  item: IntakeItem | null;
  receiptPhoto?: string;
  pickupAvailable: boolean;
  focus: EvidenceFocus;
  onClose: () => void;
}

/** Enlarged side-by-side view so the vendor can compare colour, design and visible condition. */
export function EvidenceLightbox({
  item,
  receiptPhoto,
  pickupAvailable,
  focus,
  onClose,
}: EvidenceLightboxProps) {
  const panels = [
    {
      key: "pickup" as const,
      label: INTAKE_COPY.pickupEvidence,
      description: INTAKE_COPY.pickupEvidenceDescription,
      src: pickupAvailable ? item?.pickupPhoto : undefined,
    },
    {
      key: "receipt" as const,
      label: INTAKE_COPY.receiptEvidence,
      description: INTAKE_COPY.receiptEvidenceDescription,
      src: receiptPhoto,
    },
  ];

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {item?.name}{" "}
            <span className="font-medium text-slate-500">· {item?.id}</span>
          </DialogTitle>
          <DialogDescription>
            Compare garment colour, design and visible condition.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {panels.map((p) => (
            <figure
              key={p.key}
              className={cn(
                "overflow-hidden rounded-xl border-2 bg-slate-50",
                p.key === focus ? "border-[#00B074]" : "border-slate-200",
              )}
            >
              <div className="flex aspect-square items-center justify-center bg-slate-100">
                {p.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.src} alt={`${p.label} – ${item?.name}`} className="h-full w-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <ImageOff className="h-8 w-8" />
                    <span className="text-xs font-medium">No photograph yet</span>
                  </div>
                )}
              </div>
              <figcaption className="p-3">
                <p className="text-sm font-bold text-slate-900">{p.label}</p>
                <p className="text-xs text-slate-500">{p.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
