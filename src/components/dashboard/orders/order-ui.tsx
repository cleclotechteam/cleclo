"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Lock, Truck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  formatOrderDate,
  LOGISTICS_LABEL,
  STAGE_CARD_LABEL,
  type LogisticsStatus,
  type Order,
  type OrderStage,
} from "@/lib/vendor-data";
import { OrderItemsTable } from "./order-items-table";

/* ------------------------------ Status colours ------------------------------ */

export const STAGE_BADGE: Record<OrderStage, string> = {
  new_assignment: "bg-blue-50 text-blue-700 border-blue-200",
  awaiting_pickup: "bg-amber-50 text-amber-700 border-amber-200",
  received_at_vendor: "bg-violet-50 text-violet-700 border-violet-200",
  intake_verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  under_processing: "bg-orange-50 text-orange-700 border-orange-200",
  ready_for_dispatch: "bg-purple-50 text-purple-700 border-purple-200",
  out_for_delivery: "bg-sky-50 text-sky-700 border-sky-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  declined: "bg-red-50 text-red-700 border-red-200",
  reassigned: "bg-slate-100 text-slate-600 border-slate-200",
};

export const STAGE_ACCENT: Record<OrderStage, string> = {
  new_assignment: "bg-blue-500",
  awaiting_pickup: "bg-amber-500",
  received_at_vendor: "bg-violet-500",
  intake_verified: "bg-emerald-500",
  under_processing: "bg-orange-500",
  ready_for_dispatch: "bg-purple-500",
  out_for_delivery: "bg-sky-500",
  delivered: "bg-[#00B074]",
  cancelled: "bg-slate-300",
  declined: "bg-red-400",
  reassigned: "bg-slate-300",
};

export function StageChip({ stage, className }: { stage: OrderStage; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        STAGE_BADGE[stage],
        className,
      )}
    >
      {STAGE_CARD_LABEL[stage]}
    </span>
  );
}

/* ------------------------------ Countdown ------------------------------ */

/** Re-renders every `intervalMs` with the current time. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** Remaining acceptance time; `expired` once the configured window has closed. */
export function useAcceptanceTimer(deadline?: string) {
  const now = useNow(1000);
  if (!deadline) return { remaining: 0, expired: false, label: "" };
  const remaining = new Date(deadline).getTime() - now.getTime();
  return { remaining, expired: remaining <= 0, label: formatCountdown(remaining) };
}

/* ------------------------------ Payout breakdown ------------------------------ */

export function PayoutBreakdownDialog({
  order,
  open,
  onOpenChange,
}: {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogTitle className="text-lg font-bold text-slate-900">
          Vendor Payout – {order.id}
        </DialogTitle>
        <DialogDescription className="text-sm text-slate-500">
          Payout Status: <span className="font-semibold text-slate-700">{order.payoutStatus}</span> •
          Payout as per settlement cycle.
        </DialogDescription>
        <OrderItemsTable order={order} />
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------ Logistics tracking ------------------------------ */

const PICKUP_STEPS: LogisticsStatus[] = ["pickup_scheduled", "pickup_in_progress", "delivered_to_vendor"];
const DELIVERY_STEPS: LogisticsStatus[] = ["awaiting_collection", "partner_en_route", "collected", "out_for_delivery", "delivered"];

/**
 * Read-only view of the logistics status. Pickup and delivery events come from the
 * logistics system and cannot be manually overridden by vendors.
 */
export function LogisticsTrackingDialog({
  order,
  leg,
  open,
  onOpenChange,
}: {
  order: Order;
  leg: "pickup" | "delivery";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const steps = leg === "pickup" ? PICKUP_STEPS : DELIVERY_STEPS;
  const current = steps.indexOf(order.logisticsStatus);
  const reached = current === -1 ? (leg === "pickup" && order.stage !== "awaiting_pickup" ? steps.length - 1 : -1) : current;
  const logisticsEvents = order.statusLog.filter((e) => e.source === "Logistics");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#00B074]/10 p-2 text-[#00B074]">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {leg === "pickup" ? "Track Pickup" : "Logistics Tracking"} – {order.id}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              {leg === "pickup" ? "Scheduled Pickup" : "Delivery Due"}:{" "}
              {formatOrderDate(leg === "pickup" ? order.pickupAt : order.deliveryDueAt)}
            </DialogDescription>
          </div>
        </div>

        <ol className="space-y-3">
          {steps.map((s, i) => {
            const done = i <= reached;
            return (
              <li key={s} className="flex items-center gap-3 text-sm">
                {done ? (
                  <CheckCircle2 className="h-5 w-5 text-[#00B074]" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-300" />
                )}
                <span className={cn(done ? "font-semibold text-slate-900" : "text-slate-400", i === reached && "text-[#00B074]")}>
                  {LOGISTICS_LABEL[s]}
                </span>
              </li>
            );
          })}
        </ol>

        {logisticsEvents.length > 0 && (
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
            {logisticsEvents.map((e, i) => (
              <p key={i}>
                <span className="font-semibold text-slate-800">{formatOrderDate(e.at)}</span> – {e.action}
              </p>
            ))}
          </div>
        )}

        <p className="flex items-start gap-2 text-xs text-slate-500">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Pickup and delivery statuses are updated by Cleclo&apos;s logistics partner and cannot be changed by the vendor.
        </p>
      </DialogContent>
    </Dialog>
  );
}
