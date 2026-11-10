"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Zap,
  Shirt,
  Clock,
  CalendarCheck,
  Banknote,
  ArrowRight,
  Check,
  AlertTriangle,
  Lock,
  Loader2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Package,
  StickyNote,
  User,
  X,
  Images,
  ZoomIn,
  type LucideIcon,
} from "lucide-react";
import { ReportProblemModal } from "@/components/dashboard/report-problem-modal";
import { PhotoViewer } from "@/components/dashboard/photo-viewer";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useVendorData } from "@/lib/vendor-data/use-vendor-data";
import { garmentImage } from "@/lib/vendor-data/garment-images";
import {
  lineTotal,
  orderPayout,
  orderPieces,
  orderServices,
  payoutByService,
  type CleanService,
  type NewOrderDetails,
} from "@/lib/vendor-data";

interface NewOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Long orders show this many rows until "View All Items" expands the table in place. */
const COLLAPSED_ROWS = 8;

const SERVICE_BADGE: Record<CleanService, string> = {
  "Dry Cleaning": "bg-[#F6A6A6]/40 text-[#6b3434]",
  Washing: "bg-[#A8E6A1]/50 text-[#2d5c2a]",
  "Steam Ironing": "bg-[#FFD580]/50 text-[#7c5e10]",
};

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const rupees2 = (n: number) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** e.g. "19 Oct, 2:00–4:00 PM" */
function formatPickup(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const samePeriod = format(start, "a") === format(end, "a");
  return `${format(start, "d MMM")}, ${format(start, samePeriod ? "h:mm" : "h:mm a")}–${format(end, "h:mm a")}`;
}

/** "Men's Cotton Shirt" -> "Cotton Shirt" for compact photo captions. */
const shortName = (garment: string) => garment.replace(/^(Men|Women|Kid)'s\s+/i, "");

/** e.g. "21 Oct, 6:00 PM" */
const formatDue = (iso: string) => format(new Date(iso), "d MMM, h:mm a");

const formatTime = (seconds: number) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return hrs > 0 ? `${hrs}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
};

/** e.g. "1-hour" or "30-minute" */
const windowLabel = (seconds: number) =>
  seconds % 3600 === 0 ? `${seconds / 3600}-hour` : `${Math.round(seconds / 60)}-minute`;

export function NewOrderModal({ open, onOpenChange }: NewOrderModalProps) {
  // Self-contained: the popup loads its own order (lines + locked payout rates).
  const { data: alert, status } = useVendorData("newOrderAlert");
  const order = alert?.details;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] sm:max-w-6xl p-0 overflow-hidden bg-slate-50 border-0 max-h-[94vh] flex flex-col gap-0"
        showCloseButton={false}
      >
        {order ? (
          // Keyed on open so every fresh popup starts with a full timer and clean state.
          <NewOrderBody
            key={open ? "open" : "closed"}
            order={order}
            open={open}
            onOpenChange={onOpenChange}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 bg-white text-center">
            <DialogTitle className="sr-only">New Order Assigned</DialogTitle>
            {status === "error" ? (
              <>
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <p className="text-sm font-medium text-slate-600">
                  Could not load this order. Please try again.
                </p>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </>
            ) : (
              <Loader2 className="h-8 w-8 text-[#00B074] animate-spin" />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function NewOrderBody({
  order,
  open,
  onOpenChange,
}: {
  order: NewOrderDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [showAllItems, setShowAllItems] = useState(false);
  const [showReportProblem, setShowReportProblem] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [timeLeft, setTimeLeft] = useState(order.acceptanceWindowSec);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const isExpired = timeLeft <= 0;

  useEffect(() => {
    if (!open || isAccepted || isDeclined || isExpired) return;
    const timer = setInterval(() => setTimeLeft((prev) => Math.max(prev - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [open, isAccepted, isDeclined, isExpired]);

  const pieces = orderPieces(order.lines);
  const payout = orderPayout(order.lines);
  const services = orderServices(order.lines);
  const pickup = formatPickup(order.pickupStart, order.pickupEnd);
  const deliveryDue = formatDue(order.deliveryDue);
  const isExpress = order.speed === "express";
  const canCollapse = order.lines.length > COLLAPSED_ROWS;
  const visibleLines =
    showAllItems || !canCollapse ? order.lines : order.lines.slice(0, COLLAPSED_ROWS);

  // Every photo in the order, in item order, for the gallery strip and the zoom viewer.
  const allPhotos = order.lines.flatMap((line) =>
    line.photos.map((src, i) => ({
      src,
      title: line.garment,
      subtitle: `${line.service} · Photo ${i + 1} of ${line.photos.length}`,
      short: `${shortName(line.garment)} ${i + 1}/${line.photos.length}`,
    })),
  );
  const firstPhotoIndex = new Map<string, number>();
  order.lines.reduce((start, line) => {
    firstPhotoIndex.set(line.id, start);
    return start + line.photos.length;
  }, 0);

  // Acceptance always covers the whole order: there is no per-item selection.
  const handleAcceptOrder = () => {
    setIsAccepted(true);
    setTimeout(() => {
      onOpenChange(false);
      router.push("/dashboard/schedule");
    }, 2500);
  };

  if (isAccepted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4 bg-white min-h-[400px]">
        <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300">
          <Check className="h-10 w-10 text-emerald-600" strokeWidth={3} />
        </div>
        <DialogTitle className="text-2xl font-bold text-slate-900 animate-in slide-in-from-bottom-2 duration-300 delay-100">
          Order Accepted!
        </DialogTitle>
        <p className="text-slate-500 font-medium max-w-[300px] animate-in slide-in-from-bottom-2 duration-300 delay-200 text-sm">
          {order.orderId} · {pieces} items. Pickup scheduled for {pickup}. Order moved to
          processing queue.
        </p>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="flex flex-col items-center justify-center py-14 px-6 text-center space-y-4 bg-white min-h-[400px]">
        <div className="h-20 w-20 bg-amber-100 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300">
          <Clock className="h-10 w-10 text-amber-600" />
        </div>
        <DialogTitle className="text-2xl font-bold text-slate-900">
          Order Auto-Reallocated
        </DialogTitle>
        <p className="text-slate-500 font-medium text-sm max-w-[300px]">
          The {windowLabel(order.acceptanceWindowSec)} acceptance window for this
          {isExpress ? " Express" : ""} order has expired. It has been automatically reallocated
          to another partner to maintain customer SLA.
        </p>
        <Button
          className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-6 h-11"
          onClick={() => onOpenChange(false)}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (isDeclined) {
    return (
      <div className="flex flex-col items-center justify-center py-14 px-6 text-center space-y-4 bg-white min-h-[400px]">
        <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>
        <DialogTitle className="text-2xl font-bold text-slate-900">Order Declined</DialogTitle>
        <p className="text-slate-500 font-medium text-sm max-w-[300px]">
          You have declined this order. It has been immediately returned to the allocation engine
          for partner reassignment.
        </p>
        <Button
          className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-6 h-11"
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
      </div>
    );
  }

  const byService = payoutByService(order.lines);

  return (
    <>
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 bg-white shrink-0 border-b border-slate-100">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Bell className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="text-xl font-black text-slate-900 leading-tight">
                  New Order Assigned
                </DialogTitle>
                {isExpress && (
                  <Badge
                    variant="secondary"
                    className="bg-orange-50 text-orange-600 border-orange-100 font-bold px-2 py-0.5 rounded-md flex items-center gap-1.5"
                  >
                    <Zap className="h-3 w-3 fill-orange-600" />
                    EXPRESS
                  </Badge>
                )}
              </div>
              <p className="text-slate-500 font-medium text-sm">
                {order.orderId} · {pieces} Units · {order.priority} · Awaiting Vendor Acceptance
              </p>
            </div>
          </div>

          {/* Acceptance countdown */}
          <div className="flex items-center gap-3 md:shrink-0">
            <div className="flex flex-1 items-center justify-between gap-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl px-3.5 py-2.5">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-amber-950">Acceptance Time Remaining</span>
                  <span className="text-[11px] text-amber-700/90 font-medium">
                    Auto-reallocates if not accepted in time
                  </span>
                </div>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm shadow-xs shrink-0 border",
                  timeLeft < 60
                    ? "bg-red-50 text-red-700 border-red-200 animate-pulse"
                    : "bg-white text-amber-900 border-amber-300/80",
                )}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-slate-400 self-start md:self-center"
              onClick={() => onOpenChange(false)}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable body: everything is reviewable without leaving the acceptance screen */}
      <div className="p-4 sm:p-5 overflow-y-auto min-h-0 flex-1 scrollbar-primary">
        {/* Key facts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <FactCard icon={Package} label="Total Items" value={`${pieces} pcs`} />
          <FactCard
            icon={Banknote}
            label="Total Vendor Payout"
            value={rupees2(payout)}
            valueClassName="text-[#00B074]"
          />
          <FactCard icon={Clock} label="Scheduled Pickup" value={pickup} />
          <FactCard icon={CalendarCheck} label="Delivery Due Date" value={deliveryDue} />
        </div>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[136px_minmax(0,1fr)_300px]">
          {/* All photos: vertical strip on desktop, horizontal scroller on smaller screens */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 min-w-0 lg:flex lg:flex-col lg:max-h-[640px]">
            <div className="mb-2 flex items-center justify-between gap-2 lg:flex-col lg:items-start lg:gap-0.5">
              <h4 className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Images className="h-3.5 w-3.5 text-[#00B074]" /> All Photos
              </h4>
              <span className="text-[11px] font-medium text-slate-400">
                {allPhotos.length} photos · tap to zoom
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:pb-0 lg:pr-1 scrollbar-primary">
              {allPhotos.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setViewerIndex(i)}
                  className="group shrink-0 text-left"
                  aria-label={`Zoom ${photo.title}, ${photo.subtitle}`}
                >
                  <span className="relative block h-20 w-20 overflow-hidden rounded-lg border border-slate-100 lg:h-[104px] lg:w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.src}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 opacity-0 transition group-hover:bg-slate-900/25 group-hover:opacity-100">
                      <ZoomIn className="h-5 w-5 text-white" />
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-[10px] font-medium text-slate-500 w-20 lg:w-full">
                    {photo.short}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Order Item Summary: garment, service, quantity, unit payout, total payout */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm min-w-0">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h4 className="text-sm font-bold text-slate-900">
                Order Item Summary ({pieces} Items)
              </h4>
              {canCollapse ? (
                <button
                  type="button"
                  onClick={() => setShowAllItems((v) => !v)}
                  className="flex items-center gap-1 text-xs font-bold text-[#00B074] hover:underline"
                  aria-expanded={showAllItems}
                >
                  {showAllItems ? (
                    <>
                      Show Less <ChevronUp className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <>
                      View All Items <ChevronDown className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              ) : (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  {order.lines.length} lines · {pieces} Items
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    <th className="text-left font-bold pb-2">Item / Service</th>
                    <th className="text-center font-bold pb-2 w-14">Qty</th>
                    <th className="text-right font-bold pb-2 w-24">
                      <span
                        className="inline-flex items-center gap-1"
                        title="Fixed Cleclo vendor payout rate"
                      >
                        <Lock className="h-2.5 w-2.5" /> Rate
                      </span>
                    </th>
                    <th className="text-right font-bold pb-2 w-24">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleLines.map((line) => (
                    <tr key={line.id} className="border-b border-slate-50 last:border-0 align-top">
                      <td className="py-3 pr-3">
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            onClick={() => setViewerIndex(firstPhotoIndex.get(line.id) ?? 0)}
                            className="group relative h-14 w-14 shrink-0"
                            aria-label={`View ${line.photos.length} photos of ${line.garment}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={line.photos[0] ?? garmentImage(line.garment)}
                              alt={line.garment}
                              className="h-14 w-14 rounded-lg border border-slate-100 object-cover"
                            />
                            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                              x{line.quantity}
                            </span>
                            <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-900/0 opacity-0 transition group-hover:bg-slate-900/30 group-hover:opacity-100">
                              <ZoomIn className="h-4 w-4 text-white" />
                            </span>
                          </button>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 leading-tight">{line.garment}</p>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "mt-1 text-[10px] px-1.5 py-0 font-bold h-5 border-0",
                                SERVICE_BADGE[line.service],
                              )}
                            >
                              {line.service}
                            </Badge>
                            {line.photos.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setViewerIndex(firstPhotoIndex.get(line.id) ?? 0)}
                                className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#00B074] hover:underline"
                              >
                                <Images className="h-3 w-3" />
                                View {line.photos.length} {line.photos.length === 1 ? "photo" : "photos"}
                              </button>
                            )}
                            {line.note && (
                              <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-amber-700">
                                <StickyNote className="h-3 w-3 shrink-0" />
                                {line.note}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center font-semibold text-slate-700">
                        {line.quantity}
                      </td>
                      <td className="py-3 text-right font-medium text-slate-500">
                        {rupees(line.unitPayout)}
                      </td>
                      <td className="py-3 text-right font-bold text-slate-900">
                        {rupees(lineTotal(line))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200">
                    <td className="pt-3 font-bold text-slate-900">Total Vendor Payout</td>
                    <td className="pt-3 text-center font-bold text-slate-900">{pieces}</td>
                    <td />
                    <td className="pt-3 text-right text-base font-black text-[#00B074]">
                      {rupees2(payout)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {canCollapse && !showAllItems && (
              <button
                type="button"
                onClick={() => setShowAllItems(true)}
                className="w-full mt-3 py-2 rounded-lg bg-slate-50 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                +{order.lines.length - COLLAPSED_ROWS} more ·{" "}
                {order.lines.slice(COLLAPSED_ROWS).reduce((n, l) => n + l.quantity, 0)} pcs
              </button>
            )}

            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Lock className="h-3 w-3 shrink-0" />
              Rates are Cleclo&apos;s fixed vendor payout rates and cannot be changed.
            </p>
          </div>

          {/* Order details */}
          <div className="space-y-3">
            <DetailCard icon={Shirt} label="Services Required">
              <div className="flex flex-wrap gap-1.5">
                {services.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className={cn("text-[11px] px-2 py-0.5 font-bold border-0", SERVICE_BADGE[s])}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </DetailCard>

            <DetailCard icon={Zap} label="Order Priority">
              <p className="font-bold text-slate-900 text-sm">{order.priority}</p>
            </DetailCard>

            <DetailCard icon={User} label="Customer & Pickup Area">
              <p className="font-bold text-slate-900 text-sm">{order.customer}</p>
              <p className="mt-0.5 flex items-start gap-1 text-xs text-slate-500">
                <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                {order.pickupArea}
              </p>
            </DetailCard>

            <DetailCard icon={Banknote} label="Payout by Service">
              <ul className="space-y-1.5 text-sm">
                {byService.map((row) => (
                  <li key={row.service} className="flex items-center justify-between gap-2">
                    <span className="text-slate-600">
                      {row.service}{" "}
                      <span className="text-xs text-slate-400">({row.pieces} pcs)</span>
                    </span>
                    <span className="font-semibold text-slate-900">{rupees(row.payout)}</span>
                  </li>
                ))}
                <li className="flex items-center justify-between gap-2 border-t border-slate-100 pt-1.5">
                  <span className="font-bold text-slate-900">Total Vendor Payout</span>
                  <span className="font-black text-[#00B074]">{rupees2(payout)}</span>
                </li>
              </ul>
            </DetailCard>

            {order.customerNote && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center gap-2 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                  <StickyNote className="h-3.5 w-3.5" /> Customer Instructions
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-amber-900">{order.customerNote}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {viewerIndex !== null && (
        <PhotoViewer
          photos={allPhotos}
          index={viewerIndex}
          onIndexChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

      {/* Report Problem Modal: the path for items/services the vendor cannot fulfil */}
      <ReportProblemModal
        open={showReportProblem}
        onOpenChange={setShowReportProblem}
        orderId={order.orderId}
      />

      {/* Footer Actions */}
      <div className="bg-white px-5 sm:px-6 py-4 border-t border-slate-100 flex flex-col gap-3 shrink-0 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1.5 md:max-w-sm">
          <p className="text-[12px] text-slate-500 font-medium leading-snug text-center md:text-left">
            By accepting, you confirm your capacity to process all listed items within the committed
            timeline.
          </p>
          <button
            type="button"
            onClick={() => setShowReportProblem(true)}
            className="flex items-center justify-center md:justify-start gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
          >
            <AlertTriangle className="h-4 w-4" />
            Report Problem
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:w-[420px] md:shrink-0">
          <Button
            variant="outline"
            className="h-12 border-slate-200 text-slate-700 font-bold text-base hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl transition-all"
            onClick={() => setIsDeclined(true)}
          >
            Decline Order
          </Button>
          <Button
            className="h-12 bg-[#00B074] hover:bg-[#00B074]/90 text-white font-bold text-base shadow-lg shadow-emerald-500/20 rounded-xl"
            onClick={handleAcceptOrder}
          >
            Accept Order <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );
}

function FactCard({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-100 flex flex-col gap-1.5 shadow-sm min-w-0">
      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5 shrink-0" /> {label}
      </div>
      <p className={cn("font-bold text-slate-900 text-base leading-tight", valueClassName)}>{value}</p>
    </div>
  );
}

function DetailCard({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
      <div className="mb-1.5 flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5 shrink-0" /> {label}
      </div>
      {children}
    </div>
  );
}
