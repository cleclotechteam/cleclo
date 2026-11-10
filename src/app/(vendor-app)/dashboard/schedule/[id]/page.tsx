"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  ArrowLeft,
  Box,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  ImageOff,
  Maximize2,
  Package,
  PackagePlus,
  PackageCheck,
  Timer,
  Truck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VendorDataGate } from "@/components/dashboard/vendor-data-gate";
import {
  INTAKE_COPY,
  buildIntakeOrder,
  journeyTimestamps,
  type IntakeItem,
  type ScheduleDetail,
} from "@/lib/vendor-data";
import type { PickupStatus } from "@/lib/vendor-data/schedule";
import { ItemVerificationCard } from "@/components/dashboard/schedule/intake/item-verification-card";
import { EvidenceLightbox } from "@/components/dashboard/schedule/intake/evidence-lightbox";
import {
  DiscrepancyDialog,
  type DiscrepancyTarget,
} from "@/components/dashboard/schedule/intake/discrepancy-dialog";
import { VerificationStepper } from "@/components/dashboard/schedule/intake/verification-stepper";
import { OrderJourney } from "@/components/dashboard/schedule/intake/order-journey";
import {
  formatStamp,
  type DiscrepancyCase,
  type EvidenceFocus,
  type ItemResult,
} from "@/components/dashboard/schedule/intake/types";

const VENDOR_NAME = "Clean Press Laundry";

/** Logistics status labels, matching the Pickup & Delivery list. */
const STATUS_CONFIG: Record<PickupStatus, { label: string; className: string; icon: typeof Clock }> = {
  not_scheduled: { label: "Not Scheduled", className: "bg-gray-100 text-gray-700 border-gray-200", icon: Clock },
  scheduled: { label: "Scheduled", className: "bg-blue-100 text-blue-700 border-blue-200", icon: Timer },
  rider_assigned: {
    label: "Rider Assigned",
    className: "bg-violet-100 text-violet-700 border-violet-200",
    icon: User,
  },
  en_route: { label: "En Route", className: "bg-amber-100 text-amber-700 border-amber-200", icon: Truck },
  picked_up: { label: "Picked Up", className: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: Truck },
  received_at_outlet: {
    label: "Received at Outlet",
    className: "bg-green-100 text-green-700 border-green-200",
    icon: PackageCheck,
  },
  delayed: { label: "Delayed", className: "bg-red-100 text-red-700 border-red-200", icon: AlertTriangle },
  cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-500 border-slate-200", icon: Ban },
};

export default function ScheduleDetailPage() {
  return (
    <VendorDataGate resource="scheduleDetails">
      {(schedules) => <ScheduleDetailView schedules={schedules} />}
    </VendorDataGate>
  );
}

function ScheduleDetailView({ schedules }: { schedules: ScheduleDetail[] }) {
  const params = useParams();
  const router = useRouter();
  const schedule = schedules.find((s) => s.id === params.id);

  if (!schedule) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center">
        <p className="text-slate-500">Order not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return <IntakeVerification key={schedule.id} schedule={schedule} onBack={() => router.back()} />;
}

function IntakeVerification({
  schedule,
  onBack,
}: {
  schedule: ScheduleDetail;
  onBack: () => void;
}) {
  const intake = useMemo(() => buildIntakeOrder(schedule, VENDOR_NAME), [schedule]);
  const items = intake.items;
  const totalItems = items.length;
  const isPickupDone = intake.pickupDone;

  const [bagReceivedAt, setBagReceivedAt] = useState<string | null>(intake.initial.bagReceivedAt);
  const [bagChecked, setBagChecked] = useState(false);
  const [results, setResults] = useState<Record<string, ItemResult>>(intake.initial.results);
  const [receiptPhotos, setReceiptPhotos] = useState<Record<string, string>>({});
  const [cases, setCases] = useState<DiscrepancyCase[]>(intake.initial.cases);
  const [discrepancyTarget, setDiscrepancyTarget] = useState<DiscrepancyTarget | null>(null);
  const [lightbox, setLightbox] = useState<{ item: IntakeItem; focus: EvidenceFocus } | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkConfirmed, setBulkConfirmed] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [completion, setCompletion] = useState<{ at: string; by: string } | null>(
    intake.initial.completion,
  );

  const bagReceived = isPickupDone && bagReceivedAt !== null;
  const editable = bagReceived && !completion && !intake.cancelled;

  const logisticsVerifiedCount = isPickupDone ? totalItems : 0;
  const matchedCount = items.filter((i) => results[i.id] === "matched").length;
  const resolvedCount = items.filter((i) => results[i.id]).length;
  const allResolved = totalItems > 0 && resolvedCount === totalItems;
  const flaggedItemCount = items.filter((i) => results[i.id] === "discrepancy").length;
  const remaining = totalItems - resolvedCount;

  // Items the bulk action may mark as matched: still pending and not waiting on a required photo.
  const bulkEligible = items.filter(
    (i) => !results[i.id] && (!i.receiptPhotoRequired || receiptPhotos[i.id]),
  );
  const bulkExcluded = remaining - bulkEligible.length;

  const caseByItem = Object.fromEntries(cases.map((c) => [c.itemId, c]));
  const nextCaseId = `RC-${intake.orderRef}-${String(cases.length + 1).padStart(2, "0")}`;
  const additionalCount = cases.filter((c) => !items.some((i) => i.id === c.itemId)).length;

  const statusConfig = STATUS_CONFIG[schedule.logisticsStatus];
  const StatusIcon = statusConfig.icon;

  /* ------------------------------ actions ------------------------------ */

  const setResult = (id: string, r: ItemResult | null) =>
    setResults((prev) => {
      const next = { ...prev };
      if (r) next[id] = r;
      else delete next[id];
      return next;
    });

  const submitDiscrepancy = (c: DiscrepancyCase) => {
    setCases((prev) => [...prev, c]);
    if (items.some((i) => i.id === c.itemId)) setResult(c.itemId, "discrepancy");
    setDiscrepancyTarget(null);
  };

  const runBulkVerify = () => {
    setResults((prev) => {
      const next = { ...prev };
      bulkEligible.forEach((i) => (next[i.id] = "matched"));
      return next;
    });
    setBulkOpen(false);
    setBulkConfirmed(false);
  };

  const completeVerification = () => {
    setCompletion({ at: formatStamp(new Date()), by: VENDOR_NAME });
    setConfirmOpen(false);
  };

  /* ------------------------------ journey ------------------------------ */

  const base = intake.baseStage;
  const completedThrough = Math.max(base, completion ? 8 : bagReceived ? 7 : 0);
  const timestamps = journeyTimestamps(schedule, base);
  if (base < 8) {
    if (bagReceivedAt) {
      timestamps[6] ??= bagReceivedAt;
      timestamps[7] = bagReceivedAt;
    }
    if (completion) timestamps[8] = completion.at;
  }
  const journeyNotes: Record<number, string> = {};
  if (isPickupDone && schedule.direction === "pickup") journeyNotes[5] = `${totalItems} items recorded by ${schedule.driver ?? "the logistics partner"}`;
  if (completion && cases.length > 0)
    journeyNotes[8] = `${cases.length} discrepanc${cases.length === 1 ? "y" : "ies"} flagged for review`;

  const stepsDone = [
    isPickupDone,
    bagReceived,
    allResolved,
    allResolved, // every exception documented (or none found)
    !!completion,
  ];

  const kpis = [
    { label: "Total Items", value: `${totalItems}`, icon: Box, tone: "bg-blue-50 text-blue-600" },
    {
      label: "Logistics Verified",
      value: `${logisticsVerifiedCount}/${totalItems}`,
      icon: Truck,
      tone: "bg-purple-50 text-purple-600",
    },
    {
      label: "Vendor Verified",
      value: `${matchedCount}/${totalItems}`,
      icon: ClipboardCheck,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: INTAKE_COPY.discrepanciesKpi,
      value: `${cases.length}`,
      icon: AlertTriangle,
      tone: cases.length > 0 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600",
    },
  ];

  const handlingItems = items.filter((i) => i.specialHandling);

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Order {schedule.orderId}</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-500">Status:</span>
              <Badge className={cn("gap-1 border px-2.5 py-1 text-xs font-semibold", statusConfig.className)}>
                <StatusIcon className="h-3 w-3" />
                {statusConfig.label}
              </Badge>
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {schedule.date}
            </span>
            <span className="flex items-center gap-1">
              <Package className="h-3.5 w-3.5" />
              {totalItems} Items • Placed on {schedule.date}
            </span>
          </div>
        </div>
      </div>

      {intake.cancelled && (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-600">
          <Ban className="h-4 w-4 shrink-0" />
          This pickup was cancelled. No intake verification is required.
          {schedule.note && <span className="text-slate-500">({schedule.note})</span>}
        </div>
      )}
      {schedule.direction === "delivery" && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Return delivery order. Intake verification was completed when the order was received at the outlet.
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", k.tone)}>
                <k.icon className="h-5 w-5" />
              </span>
              <p className="text-2xl font-bold text-slate-900">{k.value}</p>
            </div>
            <p className="mt-2 text-xs font-medium text-slate-500">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Recommended Final Workflow */}
      <VerificationStepper done={stepsDone} />

      {/* Logistics Pickup Verification */}
      <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className={cn("border-b border-slate-100 p-4", isPickupDone ? "bg-blue-50" : "bg-slate-50")}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  isPickupDone ? "bg-blue-500" : "bg-slate-400",
                )}
              >
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{INTAKE_COPY.logisticsHeading}</h2>
                <p className="text-xs text-slate-500">{INTAKE_COPY.logisticsDescription}</p>
              </div>
            </div>
            <span className={cn("text-sm font-semibold", isPickupDone ? "text-blue-600" : "text-slate-400")}>
              {logisticsVerifiedCount}/{totalItems}
            </span>
          </div>
        </div>
        <div className="p-4">
          {!isPickupDone && (
            <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 p-3">
              <p className="flex items-center gap-2 text-xs font-medium text-amber-700">
                <Clock className="h-4 w-4" />
                Verification will begin once the pickup is completed.
              </p>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex gap-3 rounded-xl border p-3",
                  isPickupDone ? "border-blue-200 bg-blue-50/40" : "border-slate-200 bg-slate-50",
                )}
              >
                <button
                  type="button"
                  title={`Enlarge ${INTAKE_COPY.pickupEvidence}`}
                  onClick={() => setLightbox({ item, focus: "pickup" })}
                  className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white"
                >
                  {isPickupDone ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.pickupPhoto} alt={item.name} className="h-full w-full object-cover" />
                      <Maximize2 className="absolute right-1 top-1 h-3 w-3 text-white opacity-0 drop-shadow group-hover:opacity-100" />
                    </>
                  ) : (
                    <ImageOff className="h-5 w-5 text-slate-300" />
                  )}
                </button>
                <div className="min-w-0 flex-1 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        isPickupDone ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {isPickupDone ? "Recorded" : "Awaiting Pickup"}
                    </span>
                  </div>
                  <p className="font-mono text-slate-600">{item.id}</p>
                  <p className="text-slate-500">
                    {item.service} · {item.quantity} pc
                  </p>
                  {isPickupDone && <p className="truncate text-slate-500">Condition: {item.pickupCondition}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor Receipt Verification */}
      <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-green-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00B074]">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{INTAKE_COPY.vendorHeading}</h2>
                <p className="text-xs text-slate-500">{INTAKE_COPY.vendorDescription}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-green-600">
              {matchedCount}/{totalItems}
            </span>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
            <p className="flex items-center gap-2 text-xs font-medium text-emerald-700">
              <AlertCircle className="h-4 w-4" />
              Confirm item condition, quantity and visible damage before proceeding.
            </p>
          </div>

          {/* Step 2: bag receipt */}
          <div
            className={cn(
              "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
              bagReceived ? "border-green-200 bg-green-50/60" : "border-slate-200 bg-slate-50",
            )}
          >
            <div className="flex items-center gap-3">
              <PackageCheck className={cn("h-6 w-6", bagReceived ? "text-green-600" : "text-slate-400")} />
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Bag ID: <span className="font-mono">{intake.bagId}</span>
                </p>
                <p className="text-xs text-slate-500">
                  {bagReceived
                    ? `Bag received and seal checked · ${bagReceivedAt}`
                    : isPickupDone
                      ? "Check the bag identifier and seal before opening the bag."
                      : "Bag receipt can be confirmed once the logistics partner delivers the order."}
                </p>
              </div>
            </div>
            {!bagReceived && (
              <div className="flex flex-col gap-2 sm:items-end">
                <label
                  className={cn(
                    "flex items-center gap-2 text-xs font-medium",
                    isPickupDone ? "text-slate-700" : "text-slate-400",
                  )}
                >
                  <Checkbox
                    checked={bagChecked}
                    disabled={!isPickupDone}
                    onCheckedChange={(v) => setBagChecked(v === true)}
                  />
                  Bag identifier matches and seal is intact
                </label>
                <Button
                  size="sm"
                  disabled={!isPickupDone || !bagChecked}
                  className="bg-[#00B074] hover:bg-[#00B074]/90"
                  onClick={() => setBagReceivedAt(formatStamp(new Date()))}
                >
                  Confirm Bag Received
                </Button>
              </div>
            )}
          </div>

          {/* Step 3: item-by-item */}
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <ItemVerificationCard
                key={item.id}
                item={item}
                pickupDone={isPickupDone}
                editable={editable}
                result={results[item.id]}
                discrepancy={caseByItem[item.id]}
                receiptPhoto={receiptPhotos[item.id]}
                onReceiptPhoto={(url) => setReceiptPhotos((p) => ({ ...p, [item.id]: url }))}
                onMatch={() => setResult(item.id, "matched")}
                onReset={() => setResult(item.id, null)}
                onReportDiscrepancy={() =>
                  setDiscrepancyTarget({
                    itemId: item.id,
                    itemName: item.name,
                    receiptPhoto: receiptPhotos[item.id],
                  })
                }
                onEnlarge={(focus) => setLightbox({ item, focus })}
              />
            ))}
          </div>

          {editable && (
            <Button
              variant="outline"
              className="w-full border-dashed"
              onClick={() =>
                setDiscrepancyTarget({
                  itemId: `CL-${intake.orderRef}-${String(totalItems + additionalCount + 1).padStart(2, "0")}`,
                  additional: true,
                })
              }
            >
              <PackagePlus className="mr-2 h-4 w-4" />
              Report Additional Item
            </Button>
          )}

          {/* Step 4: discrepancy review cases */}
          {cases.length > 0 && (
            <div className="rounded-xl border border-red-100 bg-red-50/50 p-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-red-800">
                <AlertTriangle className="h-4 w-4" />
                {INTAKE_COPY.discrepanciesKpi} ({cases.length})
              </h3>
              <p className="mt-0.5 text-xs text-red-700/80">
                Sent to Cleclo&apos;s operations team for review. The original order is unchanged.
              </p>
              <ul className="mt-3 space-y-2">
                {cases.map((c) => (
                  <li key={c.caseId} className="flex gap-3 rounded-lg border border-red-100 bg-white p-3">
                    <div className="flex -space-x-2">
                      {c.photos.slice(0, 2).map((src, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={src + i}
                          src={src}
                          alt=""
                          className="h-10 w-10 rounded-md border-2 border-white object-cover"
                        />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">
                          {c.caseId} · {c.type}
                        </p>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                          Under Review
                        </span>
                      </div>
                      <p className="text-slate-600">
                        <span className="font-mono">{c.itemId}</span> · {c.itemName} · {c.photos.length} photo
                        {c.photos.length === 1 ? "" : "s"}
                      </p>
                      <p className="mt-0.5 text-slate-500">{c.remarks}</p>
                      <p className="mt-0.5 text-slate-400">{c.reportedAt}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Step 5: receipt confirmation */}
          {!completion ? (
            <div className="space-y-3 border-t border-slate-100 pt-4">
              {editable && remaining > 1 && (
                <Button variant="outline" className="h-11 w-full" onClick={() => setBulkOpen(true)}>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Bulk Verify Remaining Items ({remaining})
                </Button>
              )}
              <Button
                className="h-12 w-full bg-[#00B074] text-base font-bold shadow-lg shadow-emerald-900/10 hover:bg-[#00B074]/90"
                disabled={!editable || !allResolved}
                onClick={() => setConfirmOpen(true)}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                {INTAKE_COPY.confirmButton}
              </Button>
              {!allResolved && (
                <p className="text-center text-xs text-slate-500">
                  {!isPickupDone
                    ? "Available after logistics pickup and bag receipt."
                    : !bagReceived
                      ? "Confirm bag receipt to begin item-by-item verification."
                      : `${remaining} of ${totalItems} item${totalItems === 1 ? "" : "s"} still need to be matched or reported.`}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-center">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                <span className="text-sm font-semibold text-green-700">
                  Receipt confirmed: {matchedCount} item{matchedCount === 1 ? "" : "s"} accepted into processing
                  inventory
                  {cases.length > 0 &&
                    `, ${cases.length} exception${cases.length === 1 ? "" : "s"} flagged for review`}
                  .
                </span>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Verified By: <span className="font-bold text-slate-900">{completion.by}</span>
                </p>
                <p className="text-xs font-medium text-slate-400">Verified at: {completion.at}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Info cards */}
      {(handlingItems.length > 0 || schedule.driver) && (
        <div className="grid gap-4 md:grid-cols-2">
          {handlingItems.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-2xl border border-amber-200/50 bg-linear-to-br from-amber-50 to-orange-50 p-5 shadow-sm"
            >
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-amber-100/50" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200/50">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-amber-900">{INTAKE_COPY.specialHandlingHeading}</h3>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-amber-700">{item.specialHandling}</p>
                  <p className="mt-2 inline-flex rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                    {item.name} · <span className="ml-1 font-mono">{item.id}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}

          {schedule.driver && (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-linear-to-br from-slate-50 to-slate-100 p-5 shadow-sm">
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-slate-200/50" />
              <div className="relative flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-200/50">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Assigned Driver</p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">{schedule.driver}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cleclo Order Journey */}
      <OrderJourney completedThrough={completedThrough} timestamps={timestamps} notes={journeyNotes} />

      {/* Dialogs */}
      <DiscrepancyDialog
        target={discrepancyTarget}
        caseId={nextCaseId}
        onCancel={() => setDiscrepancyTarget(null)}
        onSubmit={submitDiscrepancy}
      />

      <EvidenceLightbox
        item={lightbox?.item ?? null}
        focus={lightbox?.focus ?? "pickup"}
        pickupAvailable={isPickupDone}
        receiptPhoto={lightbox ? receiptPhotos[lightbox.item.id] : undefined}
        onClose={() => setLightbox(null)}
      />

      <Dialog
        open={bulkOpen}
        onOpenChange={(open) => {
          setBulkOpen(open);
          if (!open) setBulkConfirmed(false);
        }}
      >
        <DialogContent className="sm:max-w-115">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-[#00B074]" />
              Bulk Verification
            </DialogTitle>
            <DialogDescription className="pt-2 leading-relaxed text-slate-600">
              {bulkEligible.length} remaining item{bulkEligible.length === 1 ? "" : "s"} will be marked as Item
              Received &amp; Matched.
              {bulkExcluded > 0 &&
                ` ${bulkExcluded} item${bulkExcluded === 1 ? " needs" : "s need"} a receipt photograph and must be verified individually.`}
            </DialogDescription>
          </DialogHeader>
          <label className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-900">
            <Checkbox
              className="mt-0.5"
              checked={bulkConfirmed}
              onCheckedChange={(v) => setBulkConfirmed(v === true)}
            />
            I confirm that the physical item count and condition have been checked.
          </label>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setBulkOpen(false)}>
              Back to Inspection
            </Button>
            <Button
              className="bg-[#00B074] hover:bg-[#00B074]/90"
              disabled={!bulkConfirmed || bulkEligible.length === 0}
              onClick={runBulkVerify}
            >
              Verify {bulkEligible.length} Item{bulkEligible.length === 1 ? "" : "s"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-115">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              {INTAKE_COPY.confirmButton}
            </DialogTitle>
            <DialogDescription className="pt-2 leading-relaxed text-slate-600">
              {matchedCount} item{matchedCount === 1 ? "" : "s"} will be accepted into your processing inventory.
              {flaggedItemCount + additionalCount > 0 &&
                ` ${cases.length} discrepanc${cases.length === 1 ? "y" : "ies"} will remain flagged for review by Cleclo's operations team.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Back to Inspection
            </Button>
            <Button className="bg-[#00B074] hover:bg-[#00B074]/90" onClick={completeVerification}>
              Confirm Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
