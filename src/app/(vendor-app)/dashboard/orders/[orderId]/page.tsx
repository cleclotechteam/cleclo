"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Box,
  CheckCircle2,
  CircleCheck,
  ClipboardList,
  FileText,
  History,
  Info,
  Lock,
  MapPin,
  Navigation,
  Package,
  Play,
  Settings,
  Truck,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VendorDataGate } from "@/components/dashboard/vendor-data-gate";
import { ReportProblemModal } from "@/components/dashboard/report-problem-modal";
import { OrderItemsTable } from "@/components/dashboard/orders/order-items-table";
import { IntakeVerificationDialog } from "@/components/dashboard/orders/intake-verification-dialog";
import {
  LogisticsTrackingDialog,
  STAGE_BADGE,
  useAcceptanceTimer,
} from "@/components/dashboard/orders/order-ui";
import {
  formatINR,
  formatOrderDate,
  formatOrderDateShort,
  getOrderServices,
  hasUnresolvedIssues,
  isOrderOverdue,
  LOGISTICS_LABEL,
  orderTotalQty,
  STAGE_LABEL,
  STAGE_SUMMARY,
  TURNAROUND_LABEL,
  type IssueReason,
  type IssueReport,
  type Order,
  type OrderStage,
  type StatusLogEntry,
} from "@/lib/vendor-data";

const VENDOR_USER = "Ramesh K. (Vendor Staff)";

/** Update Order Status workflow (vendor receipt verification included). */
const WORKFLOW = [
  { title: "Order Accepted", description: "Vendor accepts the assigned order." },
  {
    title: "Received & Verified",
    description: "Vendor physically receives and verifies all garments against the logistics pickup record.",
  },
  { title: "Under Processing", description: "Garments undergo Dry Cleaning, Washing or Steam Ironing as assigned." },
  { title: "Ready for Dispatch", description: "Processing, quality inspection and packaging are completed." },
];

/** Steps completed and the step currently in progress, derived from the actual backend stage. */
const STAGE_PROGRESS: Partial<Record<OrderStage, { done: number; current: number | null }>> = {
  new_assignment: { done: 0, current: 0 },
  awaiting_pickup: { done: 1, current: null },
  received_at_vendor: { done: 1, current: 1 },
  intake_verified: { done: 2, current: null },
  under_processing: { done: 2, current: 2 },
  ready_for_dispatch: { done: 4, current: null },
  out_for_delivery: { done: 4, current: null },
  delivered: { done: 4, current: null },
};

type StageAction = "accept" | "trackPickup" | "verify" | "startProcessing" | "markReady" | "trackCollection" | "trackDelivery" | "summary";

/** Green button / action, changing automatically according to the order's current stage. */
const STAGE_BUTTON: Partial<Record<OrderStage, { label: string; action: StageAction; icon: typeof Truck; note: string }>> = {
  new_assignment: {
    label: "Accept Order",
    action: "accept",
    icon: CircleCheck,
    note: "Review order items and service details before accepting. The order will be auto-reassigned if not accepted within the stipulated time.",
  },
  awaiting_pickup: {
    label: "Track Pickup",
    action: "trackPickup",
    icon: Truck,
    note: "Cleclo's logistics partner will collect the garments from the customer. You will be notified once the pickup is completed.",
  },
  received_at_vendor: {
    label: "Verify Received Items",
    action: "verify",
    icon: Box,
    note: "Check and verify the item count and condition against the pickup record. Report any mismatches if found.",
  },
  intake_verified: {
    label: "Start Processing",
    action: "startProcessing",
    icon: Play,
    note: "Begin cleaning, washing or steam ironing as per the assigned services.",
  },
  under_processing: {
    label: "Mark Ready for Dispatch",
    action: "markReady",
    icon: CheckCircle2,
    note: "Processing in progress. Complete quality checks and pack the garments before marking the order ready.",
  },
  ready_for_dispatch: {
    label: "Track Logistics Collection",
    action: "trackCollection",
    icon: Truck,
    note: "The order is ready for collection. You will be notified once the logistics partner picks up the order.",
  },
  out_for_delivery: {
    label: "Track Delivery",
    action: "trackDelivery",
    icon: Navigation,
    note: "The order has been collected and is on its way to the customer. Final delivery will be updated by the logistics partner.",
  },
  delivered: {
    label: "View Order Summary",
    action: "summary",
    icon: FileText,
    note: "The order has been successfully delivered to the customer. You can now view the order summary and payout details.",
  },
};

export default function OrderDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { orderId } = use(params);
  const query = use(searchParams);
  const id = decodeURIComponent(orderId);

  return (
    <VendorDataGate resource="orders">
      {(orders) => {
        const order = orders.find((o) => o.id === id);
        if (!order) return <OrderNotFound id={id} />;
        return <OrderDetailView key={order.id} initialOrder={order} openVerify={query.action === "verify"} />;
      }}
    </VendorDataGate>
  );
}

function OrderNotFound({ id }: { id: string }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <Package className="h-10 w-10 text-slate-300" />
      <h1 className="text-lg font-bold text-slate-900">Order {id} not found</h1>
      <p className="text-sm text-slate-500">It may have been reassigned or is not assigned to your outlet.</p>
      <Button asChild className="mt-2 rounded-xl bg-[#00B074] hover:bg-[#00B074]/90">
        <Link href="/dashboard/orders">Back to Order Management</Link>
      </Button>
    </div>
  );
}

function OrderDetailView({ initialOrder, openVerify }: { initialOrder: Order; openVerify: boolean }) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [showReport, setShowReport] = useState(false);
  const [reportDefaults, setReportDefaults] = useState<{ reason?: IssueReason; itemId?: string }>({});
  const [showVerify, setShowVerify] = useState(openVerify && initialOrder.stage === "received_at_vendor");
  const [showReady, setShowReady] = useState(false);
  const [tracking, setTracking] = useState<"pickup" | "delivery" | null>(null);
  const [summaryFlash, setSummaryFlash] = useState(false);

  const timer = useAcceptanceTimer(order.stage === "new_assignment" ? order.acceptanceDeadline : undefined);
  const totalQty = orderTotalQty(order);
  const services = getOrderServices(order);
  const overdue = isOrderOverdue(order);
  const unresolved = hasUnresolvedIssues(order);
  const button = STAGE_BUTTON[order.stage];
  const progress = STAGE_PROGRESS[order.stage];

  /** Every status change is timestamped and logged with the responsible user. */
  const transition = (patch: Partial<Order>, action: string) => {
    const entry: StatusLogEntry = { at: new Date().toISOString(), by: VENDOR_USER, action, source: "Vendor" };
    setOrder((o) => ({ ...o, ...patch, statusLog: [...o.statusLog, entry] }));
  };

  const openReport = (reason?: IssueReason, itemId?: string) => {
    setReportDefaults({ reason, itemId });
    setShowReport(true);
  };

  const handleIssue = (report: IssueReport) => {
    const item = order.items.find((i) => i.id === report.itemId);
    setOrder((o) => ({
      ...o,
      issues: [...o.issues, report],
      statusLog: [
        ...o.statusLog,
        {
          at: report.reportedAt,
          by: VENDOR_USER,
          action: `Issue reported: ${report.reason}${item ? ` – ${item.garment} (${item.service})` : ""}`,
          source: "Vendor",
        },
      ],
    }));
  };

  const runAction = (action: StageAction) => {
    switch (action) {
      case "accept":
        if (timer.expired) {
          toast.error("Acceptance window has expired. The order is being reassigned.");
          return;
        }
        // Atomic on the backend: only one vendor can successfully accept the assignment.
        transition({ stage: "awaiting_pickup", logisticsStatus: "pickup_scheduled", acceptanceDeadline: undefined }, "Order accepted");
        toast.success(`${order.id} accepted.`);
        break;
      case "trackPickup":
        setTracking("pickup");
        break;
      case "verify":
        setShowVerify(true);
        break;
      case "startProcessing":
        // A vendor cannot begin processing before completing intake verification,
        // and items with unresolved discrepancies cannot proceed.
        if (order.stage !== "intake_verified" || unresolved) return;
        transition({ stage: "under_processing" }, "Processing started");
        toast.success("Processing started.");
        break;
      case "markReady":
        setShowReady(true);
        break;
      case "trackCollection":
      case "trackDelivery":
        setTracking("delivery");
        break;
      case "summary":
        document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth", block: "start" });
        setSummaryFlash(true);
        setTimeout(() => setSummaryFlash(false), 1500);
        break;
    }
  };

  const buttonDisabled =
    (button?.action === "accept" && timer.expired) || (button?.action === "startProcessing" && unresolved);

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-full border-slate-200 bg-white" asChild>
            <Link href="/dashboard/orders" aria-label="Back to Order Management">
              <ArrowLeft className="h-5 w-5 text-slate-700" />
            </Link>
          </Button>
          <div className="space-y-1.5">
            <h1 className="flex flex-wrap items-center gap-x-2 text-2xl font-bold text-slate-900">
              <span>Order {order.id}</span>
              <span className="font-light text-slate-300">|</span>
              <span
                className={cn(
                  "rounded-md border px-2.5 py-0.5 text-sm font-bold uppercase tracking-wide",
                  STAGE_BADGE[order.stage],
                )}
              >
                {STAGE_LABEL[order.stage]}
              </span>
            </h1>
            <p className="text-sm font-medium text-slate-500">
              {totalQty} Units • {TURNAROUND_LABEL[order.serviceSpeed]} • {STAGE_SUMMARY[order.stage]}
            </p>
            <div className="flex flex-wrap gap-2">
              {overdue && (
                <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                  <AlertTriangle className="h-3 w-3" /> Overdue – delivery deadline passed
                </span>
              )}
              {unresolved && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  Unresolved discrepancy – awaiting Cleclo review
                </span>
              )}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-fit gap-2 border-red-200 font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => openReport()}
        >
          <AlertTriangle className="h-4 w-4" />
          Report Issue
        </Button>
      </div>

      {order.exceptionNote && (
        <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <History className="mt-0.5 h-4 w-4 shrink-0" />
          {order.exceptionNote}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer & Pickup Details */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-[#00B074] p-2 text-white">
                <User className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Customer &amp; Pickup Details</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Customer</p>
                  <p className="font-bold text-slate-900">{order.customerName}</p>
                </div>
                <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00B074]" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{order.locality}</p>
                    <p className="text-xs text-slate-500">{order.address}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs font-bold text-[#00B074] hover:underline"
                    >
                      Open in Maps
                    </a>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 self-start">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#00B074]">Scheduled Pickup</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{formatOrderDateShort(order.pickupAt)}</p>
                </div>
                <div className={cn("rounded-xl p-3", overdue ? "bg-red-50" : "bg-slate-50")}>
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", overdue ? "text-red-600" : "text-[#00B074]")}>
                    Delivery Due
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{formatOrderDateShort(order.deliveryDueAt)}</p>
                </div>
                <div className="col-span-2 flex items-center gap-2 rounded-xl border border-slate-100 p-3 text-xs">
                  <Truck className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="text-slate-500">Logistics:</span>
                  <span className="font-semibold text-slate-800">{LOGISTICS_LABEL[order.logisticsStatus]}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#00B074]/10 p-2 text-[#00B074]">
                  <Package className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Order Items</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">{totalQty} Items</span>
            </div>
            <OrderItemsTable
              order={order}
              highlightItemIds={order.issues.filter((i) => !i.resolved && i.itemId).map((i) => i.itemId!)}
            />
            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
              <Lock className="h-3 w-3" />
              Rates are fixed as per Cleclo&apos;s vendor payout catalog and cannot be edited.
            </p>
          </div>

          {/* Reported issues */}
          {order.issues.length > 0 && (
            <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Reported Issues</h2>
              </div>
              <ul className="divide-y divide-slate-100">
                {order.issues.map((issue) => {
                  const item = order.items.find((i) => i.id === issue.itemId);
                  return (
                    <li key={issue.id} className="py-3 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">
                          {issue.reason}
                          <span className="font-normal text-slate-500">
                            {" "}
                            • {order.id}
                            {item ? ` • ${item.garment} (${item.service})` : " • Entire order"}
                          </span>
                        </p>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            issue.resolved ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700",
                          )}
                        >
                          {issue.resolved ? "Resolved" : "Under Cleclo review"}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-600">{issue.remarks}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatOrderDate(issue.reportedAt)} • {issue.photos.length} photo{issue.photos.length === 1 ? "" : "s"}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Status log */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-[#00B074]/10 p-2 text-[#00B074]">
                <ClipboardList className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Status History</h2>
            </div>
            <ol className="relative space-y-4 border-l border-slate-200 pl-5">
              {[...order.statusLog].reverse().map((e, i) => (
                <li key={`${e.at}-${i}`} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[26px] top-1 h-3 w-3 rounded-full border-2 border-white",
                      e.source === "Vendor" ? "bg-[#00B074]" : e.source === "Logistics" ? "bg-sky-500" : "bg-slate-400",
                    )}
                  />
                  <p className="text-sm font-semibold text-slate-900">{e.action}</p>
                  <p className="text-xs text-slate-500">
                    {formatOrderDate(e.at)} • {e.by} • {e.source}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div
            id="order-summary"
            className={cn(
              "scroll-mt-24 space-y-5 rounded-2xl border bg-white p-6 shadow-sm transition-colors",
              summaryFlash ? "border-[#00B074] ring-2 ring-[#00B074]/30" : "border-slate-100",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#00B074]/10 p-2 text-[#00B074]">
                <Info className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
            </div>

            <dl className="space-y-3 text-sm">
              <SummaryRow label="Order Date" value={formatOrderDate(order.isoDate)} />
              <SummaryRow label="Order Priority" value={TURNAROUND_LABEL[order.serviceSpeed]} />
              <SummaryRow label="Total Items" value={`${totalQty} Units`} />
              <SummaryRow label="Services Required" value={services.join(", ")} />
              <SummaryRow label="Scheduled Pickup" value={formatOrderDate(order.pickupAt)} />
              <SummaryRow label="Delivery Due" value={formatOrderDate(order.deliveryDueAt)} />
              <div className="flex items-center justify-between border-t pt-3">
                <dt className="font-bold text-slate-500">Total Vendor Payout</dt>
                <dd className="text-2xl font-bold text-[#00B074]">{formatINR(order.totalPayout)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-medium text-slate-500">Payout Status</dt>
                <dd>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-bold",
                      order.payoutStatus === "Paid"
                        ? "bg-green-50 text-green-700"
                        : order.payoutStatus === "Confirmed"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-600",
                    )}
                  >
                    {order.payoutStatus}
                  </span>
                </dd>
              </div>
            </dl>
            <p className="text-right text-xs font-medium text-slate-400">Payout as per settlement cycle.</p>
          </div>

          {/* Update Order Status */}
          <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Update Order Status</h2>

            <ol className="space-y-0">
              {WORKFLOW.map((step, i) => {
                const done = !!progress && i < progress.done;
                const current = progress?.current === i;
                const last = i === WORKFLOW.length - 1;
                return (
                  <li key={step.title} className="relative flex gap-3 pb-5 last:pb-0">
                    {!last && (
                      <span
                        className={cn(
                          "absolute left-[15px] top-8 bottom-0 w-0.5",
                          done ? "bg-[#00B074]" : "bg-slate-100",
                        )}
                      />
                    )}
                    <div
                      className={cn(
                        "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white",
                        done
                          ? "border-[#00B074] bg-[#00B074] text-white"
                          : current
                            ? "border-[#00B074] text-[#00B074]"
                            : "border-slate-200 text-slate-300",
                      )}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                    </div>
                    <div>
                      <p className={cn("text-sm font-bold", done || current ? "text-slate-900" : "text-slate-400")}>
                        {i + 1}. {step.title}
                      </p>
                      <p className={cn("text-xs leading-relaxed", done || current ? "text-slate-500" : "text-slate-400")}>
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {button ? (
              <>
                <Button
                  className="h-12 w-full bg-[#00B074] text-base font-bold text-white shadow-md shadow-emerald-900/10 hover:bg-[#00B074]/90"
                  disabled={buttonDisabled}
                  onClick={() => runAction(button.action)}
                >
                  <button.icon className="mr-2 h-5 w-5" />
                  {button.label}
                </Button>

                {order.stage === "new_assignment" && order.acceptanceDeadline && (
                  <div className={cn("flex items-center justify-between rounded-xl px-4 py-2.5 text-sm", timer.expired ? "bg-slate-100" : "bg-red-50/60")}>
                    <span className="font-medium text-slate-700">Acceptance Time Remaining</span>
                    <span className={cn("font-mono font-bold", timer.expired ? "text-slate-500" : "text-red-600")}>
                      {timer.expired ? "Expired" : timer.label}
                    </span>
                  </div>
                )}

                {button.action === "startProcessing" && unresolved && (
                  <p className="text-xs font-medium text-amber-700">
                    Processing is blocked until the reported discrepancy is resolved by Cleclo.
                  </p>
                )}

                <div className="flex gap-3 rounded-xl bg-slate-50 p-4">
                  <Settings className="h-5 w-5 shrink-0 text-slate-400" />
                  <p className="text-sm leading-relaxed text-slate-500">{button.note}</p>
                </div>
              </>
            ) : (
              <div className="flex gap-3 rounded-xl bg-slate-50 p-4">
                <History className="h-5 w-5 shrink-0 text-slate-400" />
                <p className="text-sm leading-relaxed text-slate-500">
                  This order is {STAGE_LABEL[order.stage].toLowerCase()} and is kept under Order History/Exceptions. No further action is required.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ReportProblemModal
        open={showReport}
        onOpenChange={setShowReport}
        orderId={order.id}
        items={order.items}
        defaultReason={reportDefaults.reason}
        defaultItemId={reportDefaults.itemId}
        onSubmitted={handleIssue}
      />

      {order.stage === "received_at_vendor" && (
        <IntakeVerificationDialog
          order={order}
          open={showVerify}
          onOpenChange={setShowVerify}
          onVerified={() => {
            setShowVerify(false);
            transition({ stage: "intake_verified" }, "Received items verified against pickup record");
            toast.success("Intake verified. You can now start processing.");
          }}
          onDiscrepancy={(reason, itemId) => {
            setShowVerify(false);
            openReport(reason, itemId);
          }}
        />
      )}

      <MarkReadyDialog
        open={showReady}
        onOpenChange={setShowReady}
        onConfirm={() => {
          setShowReady(false);
          transition({ stage: "ready_for_dispatch", logisticsStatus: "awaiting_collection", readinessConfirmed: true }, "Marked ready for dispatch (quality check and packing completed)");
          toast.success("Order marked ready for dispatch. Logistics collection will be arranged.");
        }}
      />

      {tracking && (
        <LogisticsTrackingDialog order={order} leg={tracking} open onOpenChange={(o) => !o && setTracking(null)} />
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="font-medium text-slate-500">{label}</dt>
      <dd className="text-right font-bold text-slate-900">{value}</dd>
    </div>
  );
}

function MarkReadyDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  const [qc, setQc] = useState(false);
  const [packed, setPacked] = useState(false);

  const change = (o: boolean) => {
    if (!o) {
      setQc(false);
      setPacked(false);
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogTitle className="text-lg font-bold text-slate-900">Mark Ready for Dispatch</DialogTitle>
        <DialogDescription className="text-sm text-slate-500">
          Processing, quality inspection and packaging are completed.
        </DialogDescription>
        <div className="space-y-3">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700">
            <Checkbox checked={qc} onCheckedChange={(v) => setQc(v === true)} />
            Quality inspection completed for all garments
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-700">
            <Checkbox checked={packed} onCheckedChange={(v) => setPacked(v === true)} />
            Garments packed and tagged for handover
          </label>
        </div>
        <Button
          className="h-11 w-full bg-[#00B074] font-bold text-white hover:bg-[#00B074]/90"
          disabled={!qc || !packed}
          onClick={() => {
            onConfirm();
            setQc(false);
            setPacked(false);
          }}
        >
          Confirm Ready for Dispatch
        </Button>
      </DialogContent>
    </Dialog>
  );
}
