"use client";

import { useRef, useState } from "react";
import { AlertTriangle, Camera, Clock, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DISCREPANCY_TYPES, type DiscrepancyType } from "@/lib/vendor-data";
import { formatStamp, type DiscrepancyCase } from "./types";

export interface DiscrepancyTarget {
  /** Item ID being reported (auto-generated for an additional item). */
  itemId: string;
  itemName?: string;
  /** True when the vendor received an item not listed in the pickup record. */
  additional?: boolean;
  /** Receipt photo already captured on the item card, attached by default. */
  receiptPhoto?: string;
}

interface DiscrepancyDialogProps {
  target: DiscrepancyTarget | null;
  caseId: string;
  onCancel: () => void;
  onSubmit: (c: DiscrepancyCase) => void;
}

export function DiscrepancyDialog({ target, caseId, onCancel, onSubmit }: DiscrepancyDialogProps) {
  return (
    <Dialog open={!!target} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        {target && (
          <DiscrepancyForm
            key={target.itemId}
            target={target}
            caseId={caseId}
            onCancel={onCancel}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function DiscrepancyForm({
  target,
  caseId,
  onCancel,
  onSubmit,
}: {
  target: DiscrepancyTarget;
  caseId: string;
  onCancel: () => void;
  onSubmit: (c: DiscrepancyCase) => void;
}) {
  const [type, setType] = useState<DiscrepancyType | "">(target.additional ? "Additional Item" : "");
  const [itemName, setItemName] = useState(target.itemName ?? "");
  const [remarks, setRemarks] = useState("");
  const [photos, setPhotos] = useState<string[]>(target.receiptPhoto ? [target.receiptPhoto] : []);
  const fileRef = useRef<HTMLInputElement>(null);

  const example = DISCREPANCY_TYPES.find((d) => d.type === type)?.example;
  // A missing garment cannot be photographed, so photographs are optional only for that type.
  const photosRequired = type !== "Missing Item";
  const canSubmit =
    type !== "" &&
    itemName.trim() !== "" &&
    remarks.trim() !== "" &&
    (!photosRequired || photos.length > 0);

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...urls]);
  };

  const submit = () => {
    if (type === "" || !canSubmit) return;
    onSubmit({
      caseId,
      itemId: target.itemId,
      itemName: itemName.trim(),
      type,
      remarks: remarks.trim(),
      photos,
      reportedAt: formatStamp(new Date()),
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Report Discrepancy
        </DialogTitle>
        <DialogDescription>
          Review case {caseId} will be created for Cleclo&apos;s operations team.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Item ID</Label>
            <Input value={target.itemId} readOnly className="bg-slate-50 font-mono text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="disc-item-name">Item</Label>
            <Input
              id="disc-item-name"
              value={itemName}
              readOnly={!target.additional}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Blue Denim Jacket"
              className={!target.additional ? "bg-slate-50" : undefined}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Discrepancy Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as DiscrepancyType)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select discrepancy type" />
            </SelectTrigger>
            <SelectContent>
              {DISCREPANCY_TYPES.map((d) => (
                <SelectItem key={d.type} value={d.type}>
                  {d.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {example && (
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Example:</span> {example}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>
            Photographs{" "}
            {!photosRequired && <span className="font-normal text-slate-400">(optional)</span>}
          </Label>
          <div className="flex flex-wrap gap-2">
            {photos.map((src, i) => (
              <div key={src + i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Discrepancy photo ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 hover:border-[#00B074] hover:text-[#00B074]"
            >
              <Camera className="h-4 w-4" />
              <span className="text-[10px] font-semibold">Add</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              hidden
              onChange={(e) => {
                addPhotos(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="disc-remarks">Vendor Remarks</Label>
          <Textarea
            id="disc-remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Describe what was found during physical inspection"
          />
        </div>

        <p className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          Timestamp is recorded automatically when the report is submitted.
        </p>

        <div className="flex gap-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Reporting a discrepancy does not modify the original order. It creates a review case
            for Cleclo&apos;s operations team, preserving both the logistics and vendor records.
          </p>
        </div>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="bg-amber-500 hover:bg-amber-500/90"
          disabled={!canSubmit}
          onClick={submit}
        >
          Submit Discrepancy
        </Button>
      </DialogFooter>
    </>
  );
}
