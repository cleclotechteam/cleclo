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
} from "lucide-react";
import { ReportProblemModal } from "@/components/dashboard/report-problem-modal";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useVendorData } from "@/lib/vendor-data/use-vendor-data";
import {
  lineTotal,
  orderPayout,
  orderPieces,
  orderServices,
  type CleanService,
  type NewOrderDetails,
} from "@/lib/vendor-data";

interface NewOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Rows shown before "View All Items" expands the table in place. */
const COLLAPSED_ROWS = 3;

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

/** e.g. "21 Oct, 6:00 PM" */
const formatDue = (iso: string) => format(new Date(iso), "d MMM, h:mm a");

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export function NewOrderModal({ open, onOpenChange }: NewOrderModalProps) {
  // Self-contained: the popup loads its own order (lines + locked payout rates).
  const { data: alert, status } = useVendorData("newOrderAlert");
  const order = alert?.details;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg p-0 overflow-hidden bg-slate-50 border-0 max-h-[92vh] flex flex-col gap-0"
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
          The {Math.round(order.acceptanceWindowSec / 60)}-minute acceptance window for this
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

  return (
    <>
      {/* Header */}
      <div className="p-5 pb-4 bg-white shrink-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-slate-900 leading-tight">
                New Order Assigned
              </DialogTitle>
              <p className="text-slate-500 font-medium text-sm">{order.orderId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 -mr-2 -mt-2">
            {isExpress && (
              <Badge
                variant="secondary"
                className="bg-orange-50 text-orange-600 border-orange-100 font-bold px-2 py-0.5 rounded-md flex items-center gap-1.5"
              >
                <Zap className="h-3 w-3 fill-orange-600" />
                EXPRESS
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400"
              onClick={() => onOpenChange(false)}
            >
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Acceptance countdown */}
        <div className="flex items-center justify-between gap-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5">
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
      </div>

      {/* Scrollable body: everything is reviewable without leaving the acceptance screen */}
      <div className="p-4 space-y-4 overflow-y-auto min-h-0 flex-1 scrollbar-primary">
        {/* Services / Pickup / Delivery Due Date */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 bg-white p-3 rounded-xl border border-slate-100 flex flex-col gap-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <Shirt className="h-3.5 w-3.5" /> Services Required
            </div>
            <p className="font-bold text-slate-900 text-sm">{services.join(", ")}</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col gap-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5" /> Scheduled Pickup
            </div>
            <p className="font-bold text-slate-900 text-sm">{pickup}</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col gap-1.5 shadow-sm">
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <CalendarCheck className="h-3.5 w-3.5" /> Delivery Due Date
            </div>
            <p className="font-bold text-slate-900 text-sm">{deliveryDue}</p>
          </div>
        </div>

        {/* Order Item Summary: garment, service, quantity, unit payout, total payout */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Order Item Summary ({pieces} Items)
            </h4>
            {canCollapse && (
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
            )}
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                <th className="text-left font-bold pb-2">Item / Service</th>
                <th className="text-center font-bold pb-2 w-10">Qty</th>
                <th className="text-right font-bold pb-2 w-16">
                  <span className="inline-flex items-center gap-1" title="Fixed Cleclo vendor payout rate">
                    <Lock className="h-2.5 w-2.5" /> Rate
                  </span>
                </th>
                <th className="text-right font-bold pb-2 w-16">Total</th>
              </tr>
            </thead>
            <tbody>
              {visibleLines.map((line) => (
                <tr key={line.id} className="border-b border-slate-50 last:border-0 align-top">
                  <td className="py-2.5 pr-2">
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
                  </td>
                  <td className="py-2.5 text-center font-semibold text-slate-700">
                    {line.quantity}
                  </td>
                  <td className="py-2.5 text-right font-medium text-slate-500">
                    {rupees(line.unitPayout)}
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-900">
                    {rupees(lineTotal(line))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {canCollapse && !showAllItems && (
            <button
              type="button"
              onClick={() => setShowAllItems(true)}
              className="w-full mt-2 py-2 rounded-lg bg-slate-50 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              +{order.lines.length - COLLAPSED_ROWS} more ·{" "}
              {order.lines.slice(COLLAPSED_ROWS).reduce((n, l) => n + l.quantity, 0)} pcs
            </button>
          )}
        </div>

        {/* Total Vendor Payout */}
        <div className="bg-[#00B074]/5 rounded-xl border border-[#00B074]/10 p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#00B074]/10 flex items-center justify-center text-[#00B074]">
              <Banknote className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Vendor Payout
            </span>
          </div>
          <span className="text-xl font-black text-[#00B074] tracking-tight">
            {rupees2(payout)}
          </span>
        </div>
      </div>

      {/* Report Problem Modal: the path for items/services the vendor cannot fulfil */}
      <ReportProblemModal
        open={showReportProblem}
        onOpenChange={setShowReportProblem}
        orderId={order.orderId}
      />

      {/* Footer Actions */}
      <div className="bg-white p-5 pt-3 pb-5 border-t border-slate-100 flex flex-col gap-4 shrink-0">
        <p className="text-center text-[12px] text-slate-400 font-medium leading-tight px-4">
          By accepting, you confirm your capacity to process all listed items within the committed
          timeline.
        </p>
        <div className="grid grid-cols-2 gap-4">
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
        <button
          type="button"
          onClick={() => setShowReportProblem(true)}
          className="flex items-center justify-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
        >
          <AlertTriangle className="h-4 w-4" />
          Report Problem
        </button>
      </div>
    </>
  );
}
