"use client";

import { useRef } from "react";
import { AlertTriangle, Camera, CheckCircle2, ImageOff, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { INTAKE_COPY, type IntakeItem } from "@/lib/vendor-data";
import type { DiscrepancyCase, EvidenceFocus, ItemResult } from "./types";

interface ItemVerificationCardProps {
  item: IntakeItem;
  pickupDone: boolean;
  /** Vendor can act on the card (bag received and verification not yet completed). */
  editable: boolean;
  result?: ItemResult;
  discrepancy?: DiscrepancyCase;
  receiptPhoto?: string;
  onReceiptPhoto: (url: string) => void;
  onMatch: () => void;
  onReset: () => void;
  onReportDiscrepancy: () => void;
  onEnlarge: (focus: EvidenceFocus) => void;
}

const chip = "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold";

export function ItemVerificationCard({
  item,
  pickupDone,
  editable,
  result,
  discrepancy,
  receiptPhoto,
  onReceiptPhoto,
  onMatch,
  onReset,
  onReportDiscrepancy,
  onEnlarge,
}: ItemVerificationCardProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const needsPhoto = item.receiptPhotoRequired && !receiptPhoto;

  const status =
    result === "matched"
      ? { label: "Matched", className: "bg-green-100 text-green-700" }
      : result === "discrepancy"
        ? { label: "Discrepancy Reported", className: "bg-red-100 text-red-700" }
        : { label: "Pending", className: "bg-orange-100 text-orange-600" };

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border-2 bg-white p-4 transition-colors",
        result === "matched"
          ? "border-green-300"
          : result === "discrepancy"
            ? "border-red-200"
            : "border-slate-200",
      )}
    >
      {/* Identity */}
      <div className="flex items-start justify-between gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.pickupPhoto}
          alt={item.name}
          className="h-16 w-16 shrink-0 rounded-xl border border-slate-100 object-cover"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900">{item.name}</h3>
          <dl className="mt-1 space-y-0.5 text-xs text-slate-500">
            <div>
              <dt className="inline">Item ID: </dt>
              <dd className="inline font-mono text-slate-700">{item.id}</dd>
            </div>
            <div>
              <dt className="inline">Service: </dt>
              <dd className="inline text-slate-700">{item.service}</dd>
            </div>
            <div>
              <dt className="inline">Quantity: </dt>
              <dd className="inline text-slate-700">{item.quantity} pc</dd>
            </div>
          </dl>
        </div>
        <span className={cn(chip, status.className, "shrink-0")}>{status.label}</span>
      </div>

      {/* Special handling, attached to this item */}
      {item.specialHandling && (
        <div className="mt-3 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="text-xs font-bold text-amber-900">{INTAKE_COPY.specialHandlingHeading}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-amber-800">{item.specialHandling}</p>
          </div>
        </div>
      )}

      {/* Photographic evidence */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <EvidenceTile
          label={INTAKE_COPY.pickupEvidence}
          description={INTAKE_COPY.pickupEvidenceDescription}
          src={pickupDone ? item.pickupPhoto : undefined}
          emptyText="Awaiting pickup"
          onEnlarge={() => onEnlarge("pickup")}
        />
        <EvidenceTile
          label={INTAKE_COPY.receiptEvidence}
          description={INTAKE_COPY.receiptEvidenceDescription}
          src={receiptPhoto}
          emptyText={item.receiptPhotoRequired ? "Photo required" : "Optional"}
          required={item.receiptPhotoRequired}
          onEnlarge={() => onEnlarge("receipt")}
          action={
            editable && !result ? (
              <>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#00B074] hover:underline"
                >
                  <Camera className="h-3.5 w-3.5" />
                  {receiptPhoto ? "Retake Photo" : "Capture Photo"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onReceiptPhoto(URL.createObjectURL(f));
                    e.target.value = "";
                  }}
                />
              </>
            ) : null
          }
        />
      </div>

      {/* Records */}
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="font-semibold text-slate-800">Logistics Record</p>
          <p className="text-slate-500">Collected: {pickupDone ? `${item.quantity} pc` : "—"}</p>
          <p className="text-slate-500">Condition: {pickupDone ? item.pickupCondition : "—"}</p>
          <span
            className={cn(
              chip,
              "mt-1",
              pickupDone ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500",
            )}
          >
            {pickupDone ? "Recorded" : "Awaiting Pickup"}
          </span>
        </div>
        <div>
          <p className="font-semibold text-slate-800">Vendor Receipt</p>
          <p className="text-slate-500">
            Received:{" "}
            {result === "matched"
              ? `${item.quantity} pc`
              : discrepancy?.type === "Missing Item"
                ? "0 pc"
                : result
                  ? `${item.quantity} pc`
                  : "—"}
          </p>
          <p className="text-slate-500">
            Condition:{" "}
            {result === "matched"
              ? "As recorded"
              : discrepancy
                ? discrepancy.type
                : "Pending inspection"}
          </p>
          <span
            className={cn(
              chip,
              "mt-1",
              result === "matched"
                ? "bg-green-100 text-green-700"
                : result === "discrepancy"
                  ? "bg-red-100 text-red-700"
                  : "bg-orange-100 text-orange-600",
            )}
          >
            {result === "matched" ? "Verified" : result === "discrepancy" ? "Under Review" : "Pending Check"}
          </span>
        </div>
      </div>

      {/* Verification result */}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-xs font-semibold text-slate-800">Verification Result</p>
        <div role="radiogroup" aria-label={`Verification result for ${item.id}`} className="mt-2 space-y-1.5">
          <RadioOption
            label="Item Received & Matched"
            checked={result === "matched"}
            disabled={!editable || result === "discrepancy" || needsPhoto}
            onSelect={() => (result === "matched" ? onReset() : onMatch())}
          />
          <RadioOption
            label="Report Discrepancy"
            checked={result === "discrepancy"}
            disabled={!editable || !!result}
            onSelect={onReportDiscrepancy}
            tone="red"
          />
        </div>
        {editable && needsPhoto && !result && (
          <p className="mt-2 text-[11px] font-medium text-amber-700">
            Capture the receipt photograph before marking this item as matched.
          </p>
        )}
        {discrepancy && (
          <div className="mt-2 rounded-lg bg-red-50 p-2 text-[11px] text-red-700">
            <span className="font-bold">{discrepancy.caseId}</span> · {discrepancy.type} ·{" "}
            {discrepancy.reportedAt}
          </div>
        )}
      </div>
    </div>
  );
}

function EvidenceTile({
  label,
  description,
  src,
  emptyText,
  required,
  onEnlarge,
  action,
}: {
  label: string;
  description: string;
  src?: string;
  emptyText: string;
  required?: boolean;
  onEnlarge: () => void;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onEnlarge}
        title={`Enlarge ${label}`}
        className={cn(
          "group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border bg-slate-50",
          required && !src ? "border-dashed border-amber-300" : "border-slate-200",
        )}
      >
        {src ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={label} className="h-full w-full object-cover" />
            <span className="absolute right-1.5 top-1.5 rounded-md bg-black/50 p-1 text-white opacity-80 group-hover:opacity-100">
              <Maximize2 className="h-3 w-3" />
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-1 text-slate-400">
            <ImageOff className="h-5 w-5" />
            <span className="text-[10px] font-semibold">{emptyText}</span>
          </span>
        )}
      </button>
      <p className="mt-1.5 text-[11px] font-bold text-slate-800">{label}</p>
      <p className="text-[10px] leading-snug text-slate-500">{description}</p>
      {action}
    </div>
  );
}

function RadioOption({
  label,
  checked,
  disabled,
  onSelect,
  tone = "green",
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onSelect: () => void;
  tone?: "green" | "red";
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled && !checked}
      onClick={() => !disabled && onSelect()}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
        disabled && !checked ? "cursor-not-allowed text-slate-400" : "text-slate-800 hover:bg-slate-50",
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
          checked
            ? tone === "green"
              ? "border-[#00B074] bg-[#00B074]"
              : "border-red-500 bg-red-500"
            : "border-slate-300",
        )}
      >
        {checked && <CheckCircle2 className="h-3 w-3 text-white" />}
      </span>
      {label}
    </button>
  );
}
