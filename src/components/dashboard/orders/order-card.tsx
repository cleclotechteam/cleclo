"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  formatINR,
  formatOrderDate,
  getOrderServices,
  hasUnresolvedIssues,
  isOrderOverdue,
  LOGISTICS_LABEL,
  orderTotalQty,
  TURNAROUND_LABEL,
  type Order,
} from "@/lib/vendor-data";
import { ReportProblemModal } from "@/components/dashboard/report-problem-modal";
import {
  LogisticsTrackingDialog,
  PayoutBreakdownDialog,
  STAGE_ACCENT,
  StageChip,
  useAcceptanceTimer,
} from "./order-ui";

const TURNAROUND_CHIP = {
  standard: "bg-slate-100 text-slate-700 border-slate-200",
  express48: "bg-orange-50 text-orange-600 border-orange-200",
  express24: "bg-red-50 text-red-600 border-red-200",
} as const;

type Action =
  | { label: string; kind: "accept" | "decline" | "trackPickup" | "trackDelivery" | "report" | "payout" | "confirmReadiness" }
  | { label: string; kind: "link"; href: string };

/**
 * Actions change according to order status. Vendors never get an action that marks a
 * customer pickup or final delivery as completed – those events come from the logistics system.
 */
function getActions(order: Order): { primary?: Action; secondary: Action[] } {
  const details = `/dashboard/orders/${order.id}`;
  const viewDetails: Action = { label: "View Details", kind: "link", href: details };
  switch (order.stage) {
    case "new_assignment":
      return { primary: { label: "Accept Order", kind: "accept" }, secondary: [viewDetails, { label: "Decline", kind: "decline" }] };
    case "awaiting_pickup":
      return { primary: { label: "Track Pickup", kind: "trackPickup" }, secondary: [viewDetails] };
    case "received_at_vendor":
      return {
        primary: { label: "Verify Intake", kind: "link", href: `${details}?action=verify` },
        secondary: [{ label: "Report Discrepancy", kind: "report" }],
      };
    case "intake_verified":
      return { primary: { label: "Start Processing", kind: "link", href: details }, secondary: [viewDetails] };
    case "under_processing":
      return { primary: { label: "Update Progress", kind: "link", href: details }, secondary: [viewDetails] };
    case "ready_for_dispatch":
      return {
        primary: order.readinessConfirmed
          ? { label: "Arrange Handover", kind: "trackDelivery" }
          : { label: "Confirm Readiness", kind: "confirmReadiness" },
        secondary: [viewDetails],
      };
    case "out_for_delivery":
      return { primary: { label: "Track Delivery", kind: "trackDelivery" }, secondary: [viewDetails] };
    case "delivered":
      return {
        primary: { label: "View Order Summary", kind: "link", href: `${details}#order-summary` },
        secondary: [{ label: "View Payout", kind: "payout" }],
      };
    default:
      return { secondary: [viewDetails] };
  }
}

export function OrderCard({
  order,
  onAccept,
  onDecline,
  onConfirmReadiness,
}: {
  order: Order;
  onAccept: (order: Order) => void;
  onDecline: (order: Order) => void;
  onConfirmReadiness: (order: Order) => void;
}) {
  const router = useRouter();
  const timer = useAcceptanceTimer(order.stage === "new_assignment" ? order.acceptanceDeadline : undefined);
  const [tracking, setTracking] = useState<"pickup" | "delivery" | null>(null);
  const [showPayout, setShowPayout] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const overdue = isOrderOverdue(order);
  const services = getOrderServices(order);
  const { primary, secondary } = getActions(order);
  const isNew = order.stage === "new_assignment";
  const showLogistics = ["ready_for_dispatch", "out_for_delivery", "awaiting_pickup"].includes(order.stage);

  const run = (a: Action) => {
    switch (a.kind) {
      case "link":
        router.push(a.href);
        break;
      case "accept":
        onAccept(order);
        break;
      case "decline":
        onDecline(order);
        break;
      case "trackPickup":
        setTracking("pickup");
        break;
      case "trackDelivery":
        setTracking("delivery");
        break;
      case "report":
        setShowReport(true);
        break;
      case "payout":
        setShowPayout(true);
        break;
      case "confirmReadiness":
        onConfirmReadiness(order);
        break;
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className={cn("absolute bottom-0 left-0 top-0 w-1.5 rounded-l-full", STAGE_ACCENT[order.stage])} />

      <div className="space-y-4 pl-3">
        {/* Header: ID, status, turnaround, payout */}
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Link href={`/dashboard/orders/${order.id}`} className="text-lg font-bold tracking-tight text-slate-900 hover:text-[#00B074]">
              {order.id}
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <StageChip stage={order.stage} />
              <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", TURNAROUND_CHIP[order.serviceSpeed])}>
                {TURNAROUND_LABEL[order.serviceSpeed]}
              </span>
              {overdue && (
                <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                  <AlertTriangle className="h-3 w-3" /> Overdue
                </span>
              )}
              {hasUnresolvedIssues(order) && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  Open Discrepancy
                </span>
              )}
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Vendor Payout</p>
            <p className="text-2xl font-black text-[#00B074]">{formatINR(order.totalPayout)}</p>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <Field label="Customer">
              <p className="text-base font-bold text-slate-900">{order.customerName}</p>
            </Field>
            <Field label="Items / Quantity">
              <p className="text-sm font-medium text-slate-800">
                {order.items.map((i) => `${i.qty} ${i.qty > 1 ? i.garmentPlural : i.garment}`).join(" · ")}
              </p>
              <p className="text-sm text-slate-600">Total: {orderTotalQty(order)} pcs</p>
            </Field>
            <Field label="Services Required">
              <div className="flex flex-wrap gap-1.5">
                {services.map((s) => (
                  <span key={s} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </Field>
          </div>
          <div className="space-y-3">
            <Field label="Scheduled Pickup">
              <p className="text-sm font-medium text-slate-800">{formatOrderDate(order.pickupAt)}</p>
            </Field>
            <Field label="Delivery Deadline">
              <p className={cn("text-sm font-medium", overdue ? "text-red-600" : "text-slate-800")}>
                {formatOrderDate(order.deliveryDueAt)}
              </p>
            </Field>
            <Field label="Service Area">
              <p className="text-sm font-medium text-slate-800">{order.locality}</p>
            </Field>
          </div>
        </div>

        {/* Acceptance countdown (new orders) */}
        {isNew && order.acceptanceDeadline && (
          <div className={cn("flex items-center justify-between rounded-xl px-4 py-3", timer.expired ? "bg-slate-100" : "bg-red-50/60")}>
            <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Clock className="h-4 w-4 text-slate-400" />
              Acceptance Time Remaining
            </span>
            <span className={cn("font-mono text-lg font-bold", timer.expired ? "text-slate-500 text-sm" : "text-red-600")}>
              {timer.expired ? "Expired – routing for reassignment" : timer.label}
            </span>
          </div>
        )}

        {/* Precise logistics status */}
        {showLogistics && (
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm">
            <Truck className="h-4 w-4 text-[#00B074]" />
            <span className="text-slate-500">Logistics Status:</span>
            <span className="font-semibold text-slate-800">{LOGISTICS_LABEL[order.logisticsStatus]}</span>
          </div>
        )}

        {order.exceptionNote && (
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{order.exceptionNote}</div>
        )}

        {/* Status-dependent actions */}
        <div className="flex flex-col gap-2 sm:flex-row">
          {primary && (
            <Button
              className="h-10 flex-1 rounded-xl bg-[#00B074] font-bold text-white hover:bg-[#00B074]/90"
              onClick={() => run(primary)}
              disabled={primary.kind === "accept" && timer.expired}
            >
              {primary.label}
            </Button>
          )}
          {secondary.map((a) => (
            <Button
              key={a.label}
              variant="outline"
              className={cn(
                "h-10 flex-1 rounded-xl font-semibold",
                a.kind === "decline" || a.kind === "report"
                  ? "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  : "border-slate-200 text-slate-700",
              )}
              onClick={() => run(a)}
              disabled={a.kind === "decline" && timer.expired}
            >
              {a.label}
            </Button>
          ))}
        </div>
      </div>

      {tracking && (
        <LogisticsTrackingDialog order={order} leg={tracking} open onOpenChange={(o) => !o && setTracking(null)} />
      )}
      <PayoutBreakdownDialog order={order} open={showPayout} onOpenChange={setShowPayout} />
      <ReportProblemModal
        open={showReport}
        onOpenChange={setShowReport}
        orderId={order.id}
        items={order.items}
        defaultReason="Quantity Mismatch"
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      {children}
    </div>
  );
}
