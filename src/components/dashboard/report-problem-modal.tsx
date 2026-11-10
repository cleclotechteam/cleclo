"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Clock,
  CopyMinus,
  CopyPlus,
  Hash,
  PackageX,
  Send,
  Shirt,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  ISSUE_REASONS,
  type IssueReason,
  type IssueReport,
  type OrderItem,
} from "@/lib/vendor-data/orders";

interface ReportProblemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  /** Garments on the order, so the issue can be linked to a specific garment. */
  items?: OrderItem[];
  defaultReason?: IssueReason;
  defaultItemId?: string;
  onSubmitted?: (report: IssueReport) => void;
}

const REASON_ICON: Record<IssueReason, typeof Shirt> = {
  "Missing Garment": CopyMinus,
  "Additional Garment": CopyPlus,
  "Incorrect Service": Shirt,
  "Damaged Garment": PackageX,
  "Quantity Mismatch": Hash,
  "Processing Concern": Wrench,
  "Logistics Delay": Truck,
};

/** Reasons that must be linked to a specific garment. */
const GARMENT_REQUIRED: IssueReason[] = ["Incorrect Service", "Damaged Garment"];
/** Reasons that need photographic evidence. */
const PHOTO_REQUIRED: IssueReason[] = ["Damaged Garment"];
const ENTIRE_ORDER = "entire-order";

/**
 * Structured issue reporting: each issue is linked to the order ID and, where applicable,
 * the specific garment, with photographs, remarks and a timestamp.
 */
export function ReportProblemModal({
  open,
  onOpenChange,
  orderId,
  items = [],
  defaultReason,
  defaultItemId,
  onSubmitted,
}: ReportProblemModalProps) {
  const [reason, setReason] = useState<IssueReason | null>(defaultReason ?? null);
  const [itemId, setItemId] = useState<string>(defaultItemId ?? ENTIRE_ORDER);
  const [remarks, setRemarks] = useState("");
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  const [openedAt, setOpenedAt] = useState<Date>(() => new Date());
  const [wasOpen, setWasOpen] = useState(open);
  const fileRef = useRef<HTMLInputElement>(null);

  // Reset the form each time the modal opens (adjusting state during render, not in an effect).
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setReason(defaultReason ?? null);
      setItemId(defaultItemId ?? ENTIRE_ORDER);
      setRemarks("");
      setPhotos([]);
      setSubmittedAt(null);
      setOpenedAt(new Date());
    }
  }

  const needsGarment = !!reason && GARMENT_REQUIRED.includes(reason) && items.length > 0;
  const needsPhoto = !!reason && PHOTO_REQUIRED.includes(reason);
  const missing: string[] = [];
  if (!reason) missing.push("select a reason");
  if (needsGarment && itemId === ENTIRE_ORDER) missing.push("select the affected garment");
  if (needsPhoto && photos.length === 0) missing.push("add at least one photograph");
  if (remarks.trim().length < 5) missing.push("add remarks");
  const canSubmit = missing.length === 0;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ name: f.name, url: URL.createObjectURL(f) }));
    setPhotos((p) => [...p, ...next].slice(0, 6));
    if (fileRef.current) fileRef.current.value = "";
  };

  const removePhoto = (url: string) => {
    URL.revokeObjectURL(url);
    setPhotos((p) => p.filter((x) => x.url !== url));
  };

  const handleSubmit = () => {
    if (!canSubmit || !reason) return;
    const at = new Date();
    const report: IssueReport = {
      id: `ISS-${at.getTime().toString().slice(-6)}`,
      reason,
      itemId: itemId === ENTIRE_ORDER ? undefined : itemId,
      remarks: remarks.trim(),
      photos: photos.map((p) => p.name),
      reportedAt: at.toISOString(),
      resolved: false,
    };
    // In a real app this is sent to the backend, which opens an exception case for Cleclo.
    onSubmitted?.(report);
    setSubmittedAt(at);
    setTimeout(() => onOpenChange(false), 2000);
  };

  const selectedItem = items.find((i) => i.id === itemId);

  if (submittedAt) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px] p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-black">Issue Reported</DialogTitle>
            <DialogDescription className="text-slate-500">
              {reason} reported for Order {orderId}
              {selectedItem ? ` (${selectedItem.garment} – ${selectedItem.service})` : ""} on{" "}
              {format(submittedAt, "d MMM yyyy, h:mm a")}. Cleclo will review it as per the
              exception-handling process.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden max-h-[90vh] flex flex-col gap-0">
        {/* Header */}
        <div className="bg-red-50 p-5 border-b border-red-100 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-red-900">Report Issue</DialogTitle>
            <DialogDescription className="text-sm text-red-700">
              Order {orderId} • <Clock className="inline h-3.5 w-3.5 -mt-0.5" />{" "}
              {format(openedAt, "d MMM yyyy, h:mm a")}
            </DialogDescription>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Reason */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Reason</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ISSUE_REASONS.map((r) => {
                const Icon = REASON_ICON[r];
                const active = reason === r;
                return (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setReason(r)}
                    className={cn(
                      "p-2.5 rounded-xl border transition-all flex items-center gap-2.5 text-left",
                      active ? "border-[#00B074] bg-[#00B074]/5" : "border-slate-200 hover:border-slate-300 bg-white",
                    )}
                  >
                    <div className={cn("p-1.5 rounded-lg", active ? "bg-[#00B074]/10" : "bg-slate-100")}>
                      <Icon className={cn("h-4 w-4", active ? "text-[#00B074]" : "text-slate-500")} />
                    </div>
                    <span className={cn("text-sm font-medium", active ? "text-[#00B074]" : "text-slate-900")}>{r}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Garment link */}
          {items.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Affected Garment{needsGarment ? "" : " (where applicable)"}
              </p>
              <Select value={itemId} onValueChange={setItemId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ENTIRE_ORDER}>Entire order</SelectItem>
                  {items.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.garment} – {i.service} (Qty {i.qty})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Photos */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Photographs{needsPhoto ? "" : " (optional)"}
            </p>
            <div className="flex flex-wrap gap-2">
              {photos.map((p) => (
                <div key={p.url} className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
                  <img src={p.url} alt={p.name} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(p.url)}
                    className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
                    aria-label={`Remove ${p.name}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {photos.length < 6 && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 text-slate-500 hover:border-[#00B074] hover:text-[#00B074]"
                >
                  <Camera className="h-4 w-4" />
                  <span className="text-[10px] font-medium">Add</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Remarks</p>
            <Textarea
              placeholder="Describe the issue in detail..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="resize-none h-24"
            />
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Items linked to an unresolved issue cannot proceed until Cleclo resolves it as per
              the exception-handling rules. You cannot cancel orders unilaterally after acceptance.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t bg-slate-50 space-y-2">
          {!canSubmit && (
            <p className="text-xs text-slate-500">To submit, {missing.join(", ")}.</p>
          )}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4" />
              Submit Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
