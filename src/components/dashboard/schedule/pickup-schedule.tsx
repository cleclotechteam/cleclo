"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  Bike,
  Calendar as CalendarIcon,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  CircleCheck,
  CircleDashed,
  Clock,
  Download,
  MapPin,
  Navigation,
  Package,
  PackageCheck,
  Search,
  StickyNote,
  Truck,
  UserCheck,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VendorDataGate } from "@/components/dashboard/vendor-data-gate";
import type { ScheduleEntry } from "@/lib/vendor-data";
import type {
  HandoverRecord,
  OrderPriority,
  PickupStatus,
  RiderTracking,
} from "@/lib/vendor-data/schedule";
import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import type { DateRange } from "react-day-picker";

/* --------------------------------- Config --------------------------------- */

// Logistics statuses only — processing statuses (Under Processing, Ready for Delivery…)
// belong to the Order Processing workflow, not this screen.
const PICKUP_STATUS: Record<
  PickupStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  not_scheduled: {
    label: "Not Scheduled",
    className: "bg-gray-100 text-gray-700 border-gray-200",
    icon: CircleDashed,
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-100 text-blue-700 border-blue-200",
    icon: CalendarClock,
  },
  rider_assigned: {
    label: "Rider Assigned",
    className: "bg-violet-100 text-violet-700 border-violet-200",
    icon: UserCheck,
  },
  en_route: {
    label: "En Route",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Bike,
  },
  picked_up: {
    label: "Picked Up",
    className: "bg-indigo-100 text-indigo-700 border-indigo-200",
    icon: Truck,
  },
  received_at_outlet: {
    label: "Received at Outlet",
    className: "bg-green-100 text-green-700 border-green-200",
    icon: PackageCheck,
  },
  delayed: {
    label: "Delayed",
    className: "bg-red-100 text-red-700 border-red-200",
    icon: AlertTriangle,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-500 border-slate-200 line-through",
    icon: Ban,
  },
};

const STATUS_ORDER: PickupStatus[] = [
  "not_scheduled",
  "scheduled",
  "rider_assigned",
  "en_route",
  "picked_up",
  "received_at_outlet",
  "delayed",
  "cancelled",
];

const PRIORITIES: OrderPriority[] = ["Standard", "Express 48H", "Express 24H"];

const RIDER_TRACKING: Record<RiderTracking, { label: string; dot: string; text: string }> = {
  assigned: { label: "Assigned", dot: "bg-violet-500", text: "text-violet-700" },
  en_route: { label: "En Route", dot: "bg-amber-500", text: "text-amber-700" },
  arrived: { label: "Arrived", dot: "bg-green-500", text: "text-green-700" },
};

const AWAITING_ASSIGNMENT = "Awaiting Assignment";

/** Statuses where the pickup has not yet physically happened. */
const PRE_PICKUP: PickupStatus[] = ["not_scheduled", "scheduled", "rider_assigned", "en_route"];

const isExpress = (p: OrderPriority) => p !== "Standard";

/** SLA "delayed" alert — derived; never changes the underlying pickup status. */
const isDelayed = (e: ScheduleEntry, now: Date) =>
  e.pickupStatus === "delayed" ||
  (PRE_PICKUP.includes(e.pickupStatus) && new Date(e.slotEnd) < now);

/** Rider has handed the order to the outlet and the vendor still needs to confirm the items. */
const needsHandover = (e: ScheduleEntry) =>
  e.direction === "pickup" &&
  !e.handover &&
  (e.pickupStatus === "picked_up" ||
    (e.pickupStatus !== "cancelled" &&
      e.pickupStatus !== "received_at_outlet" &&
      e.riderTracking === "arrived"));

type KpiKey = "scheduledPickups" | "awaitingPickup" | "scheduledDeliveries" | "completedToday";

/** KPI definitions (also used as click-to-filter predicates). */
const makeKpiMatch = (now: Date): Record<KpiKey, (e: ScheduleEntry) => boolean> => ({
  scheduledPickups: (e) =>
    e.direction === "pickup" && e.pickupStatus !== "not_scheduled" && e.pickupStatus !== "cancelled",
  awaitingPickup: (e) =>
    e.direction === "pickup" &&
    (["scheduled", "rider_assigned", "en_route", "delayed"] as PickupStatus[]).includes(e.pickupStatus),
  scheduledDeliveries: (e) =>
    e.direction === "delivery" && e.pickupStatus !== "not_scheduled" && e.pickupStatus !== "cancelled",
  completedToday: (e) => !!e.completedAt && isSameDay(new Date(e.completedAt), now),
});

/* -------------------------------- Formatting ------------------------------- */

const timePart = (d: Date, withMeridiem: boolean) => {
  const t = d.getMinutes() === 0 ? format(d, "h") : format(d, "h:mm");
  return withMeridiem ? `${t} ${format(d, "a")}` : t;
};

/** "19 Oct 2026, 2–4 PM" */
const formatSlot = (startIso: string, endIso: string) => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const sameMeridiem = format(start, "a") === format(end, "a");
  const range = sameMeridiem
    ? `${timePart(start, false)}–${timePart(end, true)}`
    : `${timePart(start, true)}–${timePart(end, true)}`;
  return `${format(start, "d MMM yyyy")}, ${range}`;
};

/** Committed delivery date and time, e.g. "21 Oct 2026, 6:00 PM" */
const formatDue = (iso: string) => format(new Date(iso), "d MMM yyyy, h:mm a");

/* -------------------------------- Component -------------------------------- */

export function PickupSchedule() {
  return (
    <VendorDataGate resource="schedule">
      {(schedule) => <PickupScheduleView initialSchedule={schedule} />}
    </VendorDataGate>
  );
}

type DirectionTab = "all" | "pickup" | "delivery";
type PriorityFilter = "all" | "express" | OrderPriority;
type KpiFilter = "none" | KpiKey;

function PickupScheduleView({ initialSchedule }: { initialSchedule: ScheduleEntry[] }) {
  const router = useRouter();
  const [now] = useState(() => new Date());
  const [entries, setEntries] = useState<ScheduleEntry[]>(initialSchedule);

  // Filters
  const [tab, setTab] = useState<DirectionTab>("all");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfDay(now),
    to: endOfDay(now),
  });
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [status, setStatus] = useState<PickupStatus | "all">("all");
  const [rider, setRider] = useState<string>("all");
  const [delayedOnly, setDelayedOnly] = useState(false);
  const [kpi, setKpi] = useState<KpiFilter>("none");

  const [isExporting, setIsExporting] = useState(false);
  const [handoverOrder, setHandoverOrder] = useState<ScheduleEntry | null>(null);

  const riders = useMemo(
    () =>
      Array.from(new Set(entries.map((e) => e.rider).filter((r): r is string => !!r))).sort(),
    [entries],
  );

  // Rows inside the selected date range (KPIs and alerts are based on this).
  const inRange = useMemo(
    () =>
      entries.filter((e) => {
        if (!date?.from) return true;
        return isWithinInterval(new Date(e.slotStart), {
          start: startOfDay(date.from),
          end: endOfDay(date.to || date.from),
        });
      }),
    [entries, date],
  );

  const pickupsInRange = inRange.filter((e) => e.direction === "pickup");
  const deliveriesInRange = inRange.filter((e) => e.direction === "delivery");

  const kpiMatch = useMemo(() => makeKpiMatch(now), [now]);

  const kpis = [
    {
      key: "scheduledPickups" as const,
      label: "Scheduled Pickups",
      value: pickupsInRange.filter(kpiMatch.scheduledPickups).length,
      icon: Truck,
      iconWrap: "bg-purple-100",
      iconColor: "text-purple-600",
      active: "border-purple-500 ring-1 ring-purple-500 bg-purple-50/50",
      hover: "hover:border-purple-200",
    },
    {
      key: "awaitingPickup" as const,
      label: "Awaiting Pickup",
      value: pickupsInRange.filter(kpiMatch.awaitingPickup).length,
      icon: Clock,
      iconWrap: "bg-amber-100",
      iconColor: "text-amber-600",
      active: "border-amber-500 ring-1 ring-amber-500 bg-amber-50/50",
      hover: "hover:border-amber-200",
    },
    {
      key: "scheduledDeliveries" as const,
      label: "Scheduled Deliveries",
      value: deliveriesInRange.filter(kpiMatch.scheduledDeliveries).length,
      icon: Package,
      iconWrap: "bg-blue-100",
      iconColor: "text-blue-600",
      active: "border-blue-500 ring-1 ring-blue-500 bg-blue-50/50",
      hover: "hover:border-blue-200",
    },
    {
      key: "completedToday" as const,
      label: "Completed Today",
      // Always "today", independent of the date range filter.
      value: entries.filter(kpiMatch.completedToday).length,
      icon: CircleCheck,
      iconWrap: "bg-green-100",
      iconColor: "text-green-600",
      active: "border-green-500 ring-1 ring-green-500 bg-green-50/50",
      hover: "hover:border-green-200",
    },
  ];

  // SLA alerts (separate from KPIs / statuses).
  const expressCount = inRange.filter(
    (e) => isExpress(e.priority) && e.pickupStatus !== "cancelled",
  ).length;
  const delayedCount = inRange.filter((e) => isDelayed(e, now)).length;

  const tabCounts = {
    all: inRange.length,
    pickup: pickupsInRange.length,
    delivery: deliveriesInRange.length,
  };

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = kpi === "completedToday" ? entries : inRange;
    return base
      .filter((e) => (tab === "all" ? true : e.direction === tab))
      .filter((e) => (kpi === "none" ? true : kpiMatch[kpi](e)))
      .filter((e) =>
        !q
          ? true
          : e.orderId.toLowerCase().includes(q) ||
            e.orderId.replace("-", "").toLowerCase().includes(q.replace("-", "")) ||
            e.customer.toLowerCase().includes(q),
      )
      .filter((e) =>
        priority === "all"
          ? true
          : priority === "express"
            ? isExpress(e.priority)
            : e.priority === priority,
      )
      .filter((e) => (status === "all" ? true : e.pickupStatus === status))
      .filter((e) =>
        rider === "all" ? true : rider === AWAITING_ASSIGNMENT ? !e.rider : e.rider === rider,
      )
      .filter((e) => (delayedOnly ? isDelayed(e, now) : true))
      .sort((a, b) => {
        // SLA first: delayed, then express, then by slot time. Cancelled sink to the bottom.
        const weight = (e: ScheduleEntry) =>
          e.pickupStatus === "cancelled" ? 3 : isDelayed(e, now) ? 0 : isExpress(e.priority) ? 1 : 2;
        return (
          weight(a) - weight(b) ||
          new Date(a.slotStart).getTime() - new Date(b.slotStart).getTime()
        );
      });
  }, [entries, inRange, tab, kpi, kpiMatch, search, priority, status, rider, delayedOnly, now]);

  const hasActiveFilters =
    search !== "" ||
    priority !== "all" ||
    status !== "all" ||
    rider !== "all" ||
    delayedOnly ||
    kpi !== "none";

  const clearFilters = () => {
    setSearch("");
    setPriority("all");
    setStatus("all");
    setRider("all");
    setDelayedOnly(false);
    setKpi("none");
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
      const header = [
        "Order ID",
        "Customer",
        "Type",
        "Pickup Date & Time",
        "Service Type",
        "Qty",
        "Order Priority",
        "Assigned Rider",
        "Pickup Status",
        "Delivery Due",
        "Special Instructions",
      ];
      const body = rows.map((e) =>
        [
          e.orderId,
          e.customer,
          e.direction === "pickup" ? "Pickup" : "Delivery",
          formatSlot(e.slotStart, e.slotEnd),
          e.serviceTypes.join(", "),
          `${e.qty} Units`,
          e.priority,
          e.rider ?? AWAITING_ASSIGNMENT,
          PICKUP_STATUS[e.pickupStatus].label,
          formatDue(e.deliveryDue),
          e.note ?? "",
        ]
          .map(esc)
          .join(","),
      );
      const blob = new Blob([[header.map(esc).join(","), ...body].join("\n")], {
        type: "text/csv;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const rangeStr = date?.from
        ? `${format(date.from, "yyyy-MM-dd")}_to_${format(date.to ?? date.from, "yyyy-MM-dd")}`
        : "all_time";
      link.download = `pickup_delivery_${rangeStr}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 600);
  };

  const handleHandoverConfirmed = (orderId: string, record: HandoverRecord) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === orderId
          ? {
              ...e,
              pickupStatus: "received_at_outlet",
              riderTracking: "arrived",
              completedAt: record.confirmedAt,
              handover: record,
            }
          : e,
      ),
    );
    setHandoverOrder(null);
    toast.success(
      record.hasDiscrepancy
        ? "Handover confirmed with discrepancies recorded."
        : "Handover confirmed. All items received.",
    );
  };

  const goToDetails = (id: string) => router.push(`/dashboard/schedule/${id}`);

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl text-black font-bold tracking-tight">
              Pickup & Delivery Overview
            </h1>
            <p className="text-primary mt-1">
              Track incoming orders, monitor scheduled pickups and deliveries and manage order handovers with real-time status updates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2 text-black w-fit hover:text-black bg-white h-10 border-slate-200 hover:bg-slate-50"
              onClick={handleExport}
              disabled={isExporting || rows.length === 0}
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span className="font-medium inline">
                {isExporting ? "Exporting..." : "Export Order Data"}
              </span>
            </Button>
          </div>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <DateRangePicker date={date} onChange={setDate} now={now} />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            const isActive = kpi === k.key;
            return (
              <button
                key={k.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setKpi(isActive ? "none" : k.key)}
                className={cn(
                  "bg-white p-4 rounded-xl border shadow-sm text-left transition-all hover:shadow-md",
                  k.hover,
                  isActive ? k.active : "border-slate-100",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                      k.iconWrap,
                    )}
                  >
                    <Icon className={cn("h-5 w-5", k.iconColor)} />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-slate-900 leading-none">
                    {k.value}
                  </p>
                </div>
                <p className="mt-3 text-sm text-slate-600 font-medium">{k.label}</p>
              </button>
            );
          })}
        </div>

        {/* SLA alerts — Express is a service turnaround category, shown as a priority alert/filter, not a logistics KPI. */}
        {(expressCount > 0 || delayedCount > 0) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-1">
              SLA Alerts
            </span>
            {expressCount > 0 && (
              <button
                type="button"
                aria-pressed={priority === "express"}
                onClick={() => setPriority(priority === "express" ? "all" : "express")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  priority === "express"
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100",
                )}
              >
                <Zap className="h-3.5 w-3.5" />
                Express Priority Orders
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px]",
                    priority === "express" ? "bg-white/25" : "bg-orange-100",
                  )}
                >
                  {expressCount}
                </span>
              </button>
            )}
            {delayedCount > 0 && (
              <button
                type="button"
                aria-pressed={delayedOnly}
                onClick={() => setDelayedOnly((v) => !v)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  delayedOnly
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
                )}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                Delayed Pickups
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px]",
                    delayedOnly ? "bg-white/25" : "bg-red-100",
                  )}
                >
                  {delayedCount}
                </span>
              </button>
            )}
          </div>
        )}

        {/* Schedule */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm min-w-0">
          <div className="p-4 border-b border-slate-100 flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-bold text-slate-900">Today&apos;s Schedule</h2>
              <Tabs value={tab} onValueChange={(v) => setTab(v as DirectionTab)}>
                <TabsList>
                  <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
                  <TabsTrigger value="pickup">Pickup ({tabCounts.pickup})</TabsTrigger>
                  <TabsTrigger value="delivery">Delivery ({tabCounts.delivery})</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Search & Filters */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_auto_auto_auto_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Cleclo Order ID"
                  aria-label="Search by Cleclo Order ID"
                  className="h-10 pl-9 bg-white"
                />
              </div>
              <Select value={priority} onValueChange={(v) => setPriority(v as PriorityFilter)}>
                <SelectTrigger className="h-10 w-full lg:w-[160px] bg-white" aria-label="Priority">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="express">Express (All)</SelectItem>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={(v) => setStatus(v as PickupStatus | "all")}>
                <SelectTrigger className="h-10 w-full lg:w-[170px] bg-white" aria-label="Pickup Status">
                  <SelectValue placeholder="Pickup Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pickup Statuses</SelectItem>
                  {STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {PICKUP_STATUS[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={rider} onValueChange={setRider}>
                <SelectTrigger className="h-10 w-full lg:w-[170px] bg-white" aria-label="Rider">
                  <SelectValue placeholder="Rider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Riders</SelectItem>
                  {riders.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                  <SelectItem value={AWAITING_ASSIGNMENT}>{AWAITING_ASSIGNMENT}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                className="h-10 gap-1.5 text-slate-600"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
              <Search className="h-6 w-6 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No orders match these filters.</p>
              {hasActiveFilters && (
                <Button variant="link" className="text-[#00B074]" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[1180px] text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="px-4 py-3 pl-6">Order ID</th>
                      <th className="px-3 py-3">Customer</th>
                      <th className="px-3 py-3">Pickup Date & Time</th>
                      <th className="px-3 py-3">Service Type</th>
                      <th className="px-3 py-3">Qty</th>
                      <th className="px-3 py-3">Order Priority</th>
                      <th className="px-3 py-3">Assigned Rider</th>
                      <th className="px-3 py-3">Pickup Status</th>
                      <th className="px-3 py-3">Delivery Due</th>
                      <th className="px-4 py-3 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map((e) => {
                      const delayed = isDelayed(e, now);
                      const express = isExpress(e.priority);
                      return (
                        <tr
                          key={e.id}
                          className={cn(
                            "align-middle transition-colors hover:bg-slate-50/80 border-l-4",
                            delayed
                              ? "border-l-red-500 bg-red-50/40"
                              : express && e.pickupStatus !== "cancelled"
                                ? "border-l-orange-400 bg-orange-50/30"
                                : "border-l-transparent",
                            e.pickupStatus === "cancelled" && "opacity-60",
                          )}
                        >
                          <td className="px-4 py-4 pl-5">
                            <div className="flex items-center gap-2">
                              <DirectionIcon direction={e.direction} />
                              <span className="font-semibold text-slate-900 whitespace-nowrap">
                                {e.orderId}
                              </span>
                              {e.note && <NotesButton entry={e} />}
                            </div>
                          </td>
                          <td className="px-3 py-4">
                            <p className="font-medium text-slate-900 whitespace-nowrap">{e.customer}</p>
                            <p className="flex items-center gap-1 text-xs text-slate-400 whitespace-nowrap">
                              <MapPin className="h-3 w-3" />
                              {e.city}
                            </p>
                          </td>
                          <td className="px-3 py-4">
                            <span className="whitespace-nowrap font-medium text-slate-800">
                              {formatSlot(e.slotStart, e.slotEnd)}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-slate-700">{e.serviceTypes.join(", ")}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-slate-700">{e.qty} Units</td>
                          <td className="px-3 py-4">
                            <PriorityBadge priority={e.priority} />
                          </td>
                          <td className="px-3 py-4">
                            <RiderCell entry={e} />
                          </td>
                          <td className="px-3 py-4">
                            <StatusCell entry={e} delayed={delayed} now={now} />
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-slate-700">
                            {formatDue(e.deliveryDue)}
                          </td>
                          <td className="px-4 py-4 pr-6">
                            <div className="flex items-center justify-end gap-2">
                              {needsHandover(e) && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-3 text-xs font-semibold border-[#00B074] text-[#00B074] hover:bg-[#00B074]/5 hover:text-[#00B074]"
                                  onClick={() => setHandoverOrder(e)}
                                >
                                  Confirm Handover
                                </Button>
                              )}
                              <Button
                                size="sm"
                                className="h-8 px-4 bg-[#00B074] hover:bg-[#00B074]/90 text-xs font-semibold"
                                onClick={() => goToDetails(e.id)}
                              >
                                View Details
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-slate-100">
                {rows.map((e) => {
                  const delayed = isDelayed(e, now);
                  const express = isExpress(e.priority);
                  return (
                    <div
                      key={e.id}
                      className={cn(
                        "px-4 py-4 space-y-3 border-l-4",
                        delayed
                          ? "border-l-red-500 bg-red-50/40"
                          : express && e.pickupStatus !== "cancelled"
                            ? "border-l-orange-400 bg-orange-50/30"
                            : "border-l-transparent",
                        e.pickupStatus === "cancelled" && "opacity-60",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <DirectionIcon direction={e.direction} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-900">{e.orderId}</span>
                              {e.note && <NotesButton entry={e} />}
                            </div>
                            <p className="text-xs text-slate-500 truncate">{e.customer}</p>
                          </div>
                        </div>
                        <StatusCell entry={e} delayed={delayed} now={now} />
                      </div>

                      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                        <MobileField label="Pickup Date & Time">
                          {formatSlot(e.slotStart, e.slotEnd)}
                        </MobileField>
                        <MobileField label="Delivery Due">{formatDue(e.deliveryDue)}</MobileField>
                        <MobileField label="Service Type">{e.serviceTypes.join(", ")}</MobileField>
                        <MobileField label="Qty">{e.qty} Units</MobileField>
                        <MobileField label="Order Priority">
                          <PriorityBadge priority={e.priority} />
                        </MobileField>
                        <MobileField label="Assigned Rider">
                          <RiderCell entry={e} />
                        </MobileField>
                      </dl>

                      <div className="flex gap-2 pt-1">
                        {needsHandover(e) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs font-semibold border-[#00B074] text-[#00B074] hover:bg-[#00B074]/5 hover:text-[#00B074]"
                            onClick={() => setHandoverOrder(e)}
                          >
                            Confirm Handover
                          </Button>
                        )}
                        <Button
                          size="sm"
                          className="h-8 px-4 bg-[#00B074] hover:bg-[#00B074]/90 gap-1.5 text-xs font-semibold"
                          onClick={() => goToDetails(e.id)}
                        >
                          View Details
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <HandoverDialog
          key={handoverOrder?.id ?? "none"}
          order={handoverOrder}
          onClose={() => setHandoverOrder(null)}
          onConfirm={handleHandoverConfirmed}
        />
      </div>
    </TooltipProvider>
  );
}

/* ------------------------------- Sub-components ------------------------------ */

function DirectionIcon({ direction }: { direction: ScheduleEntry["direction"] }) {
  const pickup = direction === "pickup";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
            pickup ? "bg-purple-50" : "bg-blue-50",
          )}
          aria-label={pickup ? "Pickup" : "Delivery"}
        >
          {pickup ? (
            <Truck className="h-4 w-4 text-purple-600" />
          ) : (
            <Package className="h-4 w-4 text-blue-600" />
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent>{pickup ? "Pickup" : "Delivery"}</TooltipContent>
    </Tooltip>
  );
}

function NotesButton({ entry }: { entry: ScheduleEntry }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-amber-600 hover:bg-amber-50"
          aria-label={`Special Instructions for ${entry.orderId}`}
        >
          <StickyNote className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Special Instructions
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {entry.orderId} · {entry.customer}
        </p>
        <p className="mt-2 text-sm text-slate-800 whitespace-pre-wrap">{entry.note}</p>
      </PopoverContent>
    </Popover>
  );
}

function PriorityBadge({ priority }: { priority: OrderPriority }) {
  const cls =
    priority === "Express 24H"
      ? "bg-red-100 text-red-700 border-red-200"
      : priority === "Express 48H"
        ? "bg-orange-100 text-orange-700 border-orange-200"
        : "bg-slate-100 text-slate-700 border-slate-200";
  return (
    <Badge className={cn("gap-1 border px-2.5 py-0.5 whitespace-nowrap", cls)}>
      {priority !== "Standard" && <Zap className="h-3 w-3" />}
      {priority}
    </Badge>
  );
}

function RiderCell({ entry }: { entry: ScheduleEntry }) {
  if (!entry.rider) {
    return (
      <span className="font-medium text-red-500 italic whitespace-nowrap">{AWAITING_ASSIGNMENT}</span>
    );
  }
  const tracking = entry.riderTracking ? RIDER_TRACKING[entry.riderTracking] : null;
  return (
    <div>
      <p className="font-medium text-slate-900 whitespace-nowrap">{entry.rider}</p>
      {tracking && (
        <p className={cn("mt-0.5 flex items-center gap-1.5 text-xs font-medium", tracking.text)}>
          <span className="relative flex h-2 w-2">
            {entry.riderTracking === "en_route" && (
              <span
                className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
                  tracking.dot,
                )}
              />
            )}
            <span className={cn("relative inline-flex h-2 w-2 rounded-full", tracking.dot)} />
          </span>
          <Navigation className="h-3 w-3" />
          {tracking.label}
        </p>
      )}
    </div>
  );
}

function StatusCell({
  entry,
  delayed,
  now,
}: {
  entry: ScheduleEntry;
  delayed: boolean;
  now: Date;
}) {
  const cfg = PICKUP_STATUS[entry.pickupStatus];
  const Icon = cfg.icon;
  // SLA alert shown alongside — never replaces — the underlying status.
  const showSlaFlag = delayed && entry.pickupStatus !== "delayed";
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1">
        <Badge
          className={cn(
            "gap-1 px-2.5 py-1 text-[11px] font-semibold border whitespace-nowrap",
            cfg.className,
          )}
        >
          <Icon className="h-3 w-3" />
          {cfg.label}
        </Badge>
        {showSlaFlag && (
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600"
                aria-label="SLA alert: slot time passed"
              >
                <AlertTriangle className="h-3 w-3" />
              </span>
            </TooltipTrigger>
            <TooltipContent>
              SLA alert: slot ended {format(new Date(entry.slotEnd), "h:mm a")}
              {isSameDay(new Date(entry.slotEnd), now) ? "" : ` on ${format(new Date(entry.slotEnd), "d MMM")}`}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {entry.completedAt && entry.direction === "delivery" && (
        <span className="flex items-center gap-1 text-[11px] text-green-700">
          <CheckCircle2 className="h-3 w-3" />
          Delivered {format(new Date(entry.completedAt), "h:mm a")}
        </span>
      )}
      {entry.handover && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                "flex items-center gap-1 text-[11px] cursor-default",
                entry.handover.hasDiscrepancy ? "text-orange-600" : "text-green-700",
              )}
            >
              {entry.handover.hasDiscrepancy ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <CheckCircle2 className="h-3 w-3" />
              )}
              {entry.handover.hasDiscrepancy ? "Discrepancy recorded" : "Handover confirmed"}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="font-semibold">
              Confirmed {format(new Date(entry.handover.confirmedAt), "d MMM yyyy, h:mm a")}
            </p>
            {entry.handover.received.map((r) => (
              <p key={r.name}>
                {r.name}: {r.received}/{r.expected}
              </p>
            ))}
            {entry.handover.discrepancyNote && <p className="mt-1">{entry.handover.discrepancyNote}</p>}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

function MobileField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-slate-400 font-medium">{label}</dt>
      <dd className="mt-0.5 text-slate-700 font-medium">{children}</dd>
    </div>
  );
}

function DateRangePicker({
  date,
  onChange,
  now,
}: {
  date: DateRange | undefined;
  onChange: (d: DateRange | undefined) => void;
  now: Date;
}) {
  const presets: { label: string; range: DateRange }[] = [
    { label: "Today", range: { from: startOfDay(now), to: endOfDay(now) } },
    { label: "Tomorrow", range: { from: startOfDay(addDays(now, 1)), to: endOfDay(addDays(now, 1)) } },
    { label: "Last 7 Days", range: { from: subDays(now, 7), to: now } },
    { label: "This Week", range: { from: startOfWeek(now), to: endOfWeek(now) } },
    { label: "This Month", range: { from: startOfMonth(now), to: endOfMonth(now) } },
  ];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal w-full sm:w-[300px] h-10 md:h-12 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
          <span className="flex-1">
            {date?.from ? (
              date.to && !isSameDay(date.from, date.to) ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col sm:flex-row">
          <div className="border-b sm:border-b-0 sm:border-r border-slate-100 p-2 flex sm:flex-col flex-wrap gap-1 sm:w-[140px] bg-slate-50/50">
            <span className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
              Presets
            </span>
            {presets.map((p) => (
              <Button
                key={p.label}
                variant="ghost"
                size="sm"
                className="justify-start text-xs font-medium text-slate-600 hover:text-[#00B074] hover:bg-[#00B074]/5"
                onClick={() => onChange(p.range)}
              >
                {p.label}
              </Button>
            ))}
          </div>
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onChange}
            numberOfMonths={1}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

function HandoverDialog({
  order,
  onClose,
  onConfirm,
}: {
  order: ScheduleEntry | null;
  onClose: () => void;
  onConfirm: (id: string, record: HandoverRecord) => void;
}) {
  const [received, setReceived] = useState<Record<string, number>>(() =>
    Object.fromEntries((order?.orderItems ?? []).map((i) => [i.name, i.quantity])),
  );
  const [note, setNote] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

  if (!order) return null;

  const lines = order.orderItems.map((i) => ({
    name: i.name,
    expected: i.quantity,
    received: received[i.name] ?? 0,
  }));
  const hasDiscrepancy = lines.some((l) => l.received !== l.expected);
  const totalExpected = lines.reduce((s, l) => s + l.expected, 0);
  const totalReceived = lines.reduce((s, l) => s + l.received, 0);
  const canConfirm = acknowledged && (!hasDiscrepancy || note.trim().length > 0);

  const setQty = (name: string, value: number) =>
    setReceived((prev) => ({ ...prev, [name]: Math.max(0, Math.min(99, value)) }));

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Handover Confirmation</DialogTitle>
          <DialogDescription>
            Confirm the actual items received from the rider for {order.orderId}
            {order.rider ? ` (${order.rider})` : ""} and record any discrepancies.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-[1fr_70px_120px] gap-2 bg-slate-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <span>Item</span>
            <span className="text-center">Expected</span>
            <span className="text-center">Received</span>
          </div>
          {lines.map((l) => {
            const mismatch = l.received !== l.expected;
            return (
              <div
                key={l.name}
                className={cn(
                  "grid grid-cols-[1fr_70px_120px] items-center gap-2 border-t border-slate-100 px-3 py-2 text-sm",
                  mismatch && "bg-orange-50/60",
                )}
              >
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  {mismatch && <AlertTriangle className="h-3.5 w-3.5 text-orange-500 shrink-0" />}
                  {l.name}
                </span>
                <span className="text-center text-slate-600">{l.expected}</span>
                <div className="flex items-center justify-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setQty(l.name, l.received - 1)}
                    aria-label={`Decrease ${l.name}`}
                  >
                    −
                  </Button>
                  <Input
                    type="number"
                    min={0}
                    value={l.received}
                    onChange={(e) => setQty(l.name, Number(e.target.value) || 0)}
                    className="h-7 w-12 px-1 text-center"
                    aria-label={`${l.name} received`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setQty(l.name, l.received + 1)}
                    aria-label={`Increase ${l.name}`}
                  >
                    +
                  </Button>
                </div>
              </div>
            );
          })}
          <div className="grid grid-cols-[1fr_70px_120px] gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold">
            <span>Total</span>
            <span className="text-center">{totalExpected}</span>
            <span className={cn("text-center", hasDiscrepancy && "text-orange-600")}>
              {totalReceived}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="handover-note" className="text-sm font-medium text-slate-800">
            Discrepancy notes{hasDiscrepancy ? " (required)" : " (optional)"}
          </label>
          <Textarea
            id="handover-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. 1 pillow cover missing, stain not mentioned by customer, damaged button"
            rows={3}
          />
          {hasDiscrepancy && (
            <p className="text-xs text-orange-600">
              Received quantities differ from the order. Describe the discrepancy before confirming.
            </p>
          )}
        </div>

        <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
          <Checkbox
            checked={acknowledged}
            onCheckedChange={(v) => setAcknowledged(v === true)}
            className="mt-0.5"
          />
          I confirm these are the items physically received from the rider.
        </label>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-[#00B074] hover:bg-[#00B074]/90"
            disabled={!canConfirm}
            onClick={() =>
              onConfirm(order.id, {
                confirmedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
                received: lines,
                discrepancyNote: note.trim(),
                hasDiscrepancy,
              })
            }
          >
            Confirm Handover
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
