"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  X,
  Bell,
  Package,
  Calendar as CalendarIcon,
  ChevronDown,
  Search,
  Bike,
  Clock,
  AlarmClock,
  AlertTriangle,
  CalendarClock,
  Check,
} from "lucide-react";
import { StatsCards, StatusChip, AlertChip, ALERT_COLORS, STATUS_COLORS } from "@/components/dashboard/stats-cards";
import {
  RecentOrders,
  OrderDetailsDialog,
  UpdateStatusMenu,
  formatDateTime,
  formatQty,
} from "@/components/dashboard/recent-orders";
import { NewOrderModal } from "@/components/dashboard/new-order-modal";
import { cn } from "@/lib/utils";
import { VendorDataGate } from "@/components/dashboard/vendor-data-gate";
import {
  DASHBOARD_STATUSES,
  getSlaAlert,
  getDashboardPendingAction,
  isDashboardDueToday,
  type DashboardOrder,
  type DashboardStatus,
} from "@/lib/vendor-data";
import { useVendorData } from "@/lib/vendor-data/use-vendor-data";
import {
  format,
  subDays,
  isWithinInterval,
  isToday,
  startOfDay,
  endOfDay,
  differenceInDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type SlaFilter = "due-today" | "approaching" | "overdue";

const SLA_TILES: {
  key: SlaFilter;
  label: string;
  icon: typeof Clock;
  color: { fg: string; bg: string };
  match: (o: DashboardOrder) => boolean;
}[] = [
  {
    key: "due-today",
    label: "Due Today",
    icon: CalendarClock,
    color: STATUS_COLORS.Assigned,
    match: (o) => isDashboardDueToday(o),
  },
  {
    key: "approaching",
    label: "Approaching Deadline",
    icon: AlarmClock,
    color: ALERT_COLORS["Due Soon"],
    match: (o) => getSlaAlert(o) === "Due Soon",
  },
  {
    key: "overdue",
    label: "Overdue",
    icon: AlertTriangle,
    color: ALERT_COLORS.Overdue,
    match: (o) => getSlaAlert(o) === "Overdue",
  },
];

const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;

export default function DashboardPage() {
  return (
    <VendorDataGate resource="dashboardOrders">
      {(orders) => <DashboardView initialOrders={orders} />}
    </VendorDataGate>
  );
}

function SectionCard({
  title,
  description,
  right,
  children,
  className,
}: {
  title: string;
  description: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-[var(--kraft-line)] bg-white/90 p-4 shadow-xl shadow-[var(--pine)]/5 md:p-6",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[var(--pine)]">{title}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function DashboardView({ initialOrders }: { initialOrders: DashboardOrder[] }) {
  const { data: newOrderAlert } = useVendorData("newOrderAlert");
  const [orders, setOrders] = useState(initialOrders);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);

  // Quick Search & Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<DashboardStatus | null>(null);
  const [slaFilter, setSlaFilter] = useState<SlaFilter | null>(null);
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isExporting, setIsExporting] = useState(false);
  // Clock for SLA alerts / pickup slots; ticks every minute so the dashboard stays real time.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  // Show notification on page load (but NOT the popup)
  useEffect(() => {
    const notifTimer = setTimeout(() => {
      setShowNotification(true);
    }, 500);

    return () => clearTimeout(notifTimer);
  }, []);

  // Auto-hide notification after 2 minutes
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 120000); // 2 minutes
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  /* ---------------- order actions (local until the API exists) ---------------- */
  const setStatus = (id: string, status: DashboardStatus) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  const handleAccept = (id: string) => {
    setStatus(id, "Pending Pickup");
    toast.success(`${id} accepted`, { description: "Status updated to Pending Pickup." });
  };
  const handleUpdateStatus = (id: string, status: DashboardStatus) => {
    setStatus(id, status);
    toast.success(`${id} updated`, { description: `Status updated to ${status}.` });
  };
  const handlers = {
    onAccept: handleAccept,
    onView: setViewOrderId,
    onUpdateStatus: handleUpdateStatus,
  };
  const viewOrder = orders.find((o) => o.id === viewOrderId) ?? null;

  /* ---------------- derived lists ---------------- */
  // Date range filter: by when the order came in (future pickups count as today) so in-progress orders stay visible.
  const dateFilteredOrders = useMemo(
    () =>
      date?.from
        ? orders.filter((order) => {
          const orderDate = new Date(Math.min(order.pickupDate.getTime(), now.getTime()));
          return isWithinInterval(orderDate, {
            start: startOfDay(date.from!),
            end: endOfDay(date.to || date.from!),
          });
        })
        : orders,
    [orders, date, now],
  );

  const tableOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sla = SLA_TILES.find((t) => t.key === slaFilter);
    return dateFilteredOrders.filter(
      (o) =>
        (!q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)) &&
        (!filterStatus || o.status === filterStatus) &&
        (!sla || sla.match(o)),
    );
  }, [dateFilteredOrders, search, filterStatus, slaFilter]);

  const todaysPickups = orders
    .filter((o) => (o.status === "Assigned" || o.status === "Pending Pickup") && isToday(o.pickupDate))
    .sort((a, b) => a.pickupDate.getTime() - b.pickupDate.getTime());

  const awaitingAcceptance = orders.filter((o) => getDashboardPendingAction(o) === "acceptance");
  const awaitingStatusUpdate = orders.filter((o) => getDashboardPendingAction(o) === "status-update");

  const hasFilters = !!search || !!filterStatus || !!slaFilter || !!date;
  const clearFilters = () => {
    setSearch("");
    setFilterStatus(null);
    setSlaFilter(null);
    setDate(undefined);
  };

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export delay
    setTimeout(() => {
      const header = ["Order ID", "Customer", "Service", "Qty", "Pickup Date", "Due Date", "Status", "Alerts"];
      const rows = tableOrders.map((o) => [
        o.id,
        o.customer,
        o.service,
        formatQty(o.qty),
        formatDateTime(o.pickupDate),
        formatDateTime(o.isoDate),
        o.status,
        getSlaAlert(o) ?? "",
      ]);
      const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.setAttribute("href", url);
      const rangeStr = date?.from
        ? `${format(date.from, "yyyy-MM-dd")}_to_${date.to ? format(date.to, "yyyy-MM-dd") : format(date.from, "yyyy-MM-dd")}`
        : "all_time";
      link.setAttribute("download", `orders_report_${rangeStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExporting(false);
    }, 1000);
  };

  const quickFilters = (
    <div className="mb-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-3 md:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[var(--pine)]">Quick Search &amp; Filters</h3>
          <p className="text-xs text-slate-500">
            Search by Order ID, customer name, status and date range.
          </p>
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs font-semibold text-slate-500 hover:text-[#00B074]"
            onClick={clearFilters}
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}
      </div>
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_200px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID or customer name"
            className="h-10 bg-white pl-9"
          />
        </div>
        <Select
          value={filterStatus ?? "all"}
          onValueChange={(v) => setFilterStatus(v === "all" ? null : (v as DashboardStatus))}
        >
          <SelectTrigger className="h-10 w-full bg-white">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {DASHBOARD_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[s].fg }} />
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="min-w-0">
              <Popover>    
                <PopoverTrigger asChild>    
                  <Button    
                    variant="outline"    
                    className={cn(    
                      "justify-start text-left font-normal w-full md:w-[300px] h-10 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900",    
                      !date && "text-muted-foreground",    
                    )}    
                  >    
                    <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />    
                    {date?.from ? (    
                      date.to ? (    
                        <>    
                          {format(date.from, "LLL dd, y")} -{" "}    
                          {format(date.to, "LLL dd, y")}    
                        </>    
                      ) : (    
                        format(date.from, "LLL dd, y")    
                      )    
                    ) : (    
                      <span>Pick a date range</span>    
                    )}    
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />    
                  </Button>    
                </PopoverTrigger>    
                <PopoverContent className="w-auto p-0" align="start">    
                  <div className="flex">    
                    <div className="border-r border-slate-100 p-2 flex flex-col gap-1 w-[140px] bg-slate-50/50">    
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">    
                        Presets    
                      </span>    
                      <Button    
                        variant="ghost"    
                        size="sm"    
                        className="justify-start text-xs font-medium text-slate-600 hover:text-[#00B074] hover:bg-[#00B074]/5"    
                        onClick={() =>    
                          setDate({    
                            from: subDays(new Date(), 7),    
                            to: new Date(),    
                          })    
                        }    
                      >    
                        Last 7 Days    
                      </Button>    
                      <Button    
                        variant="ghost"    
                        size="sm"    
                        className="justify-start text-xs font-medium text-slate-600 hover:text-[#00B074] hover:bg-[#00B074]/5"    
                        onClick={() =>    
                          setDate({    
                            from: startOfWeek(new Date()),    
                            to: endOfWeek(new Date()),    
                          })    
                        }    
                      >    
                        This Week    
                      </Button>    
                      <Button    
                        variant="ghost"    
                        size="sm"    
                        className="justify-start text-xs font-medium text-slate-600 hover:text-[#00B074] hover:bg-[#00B074]/5"    
                        onClick={() =>    
                          setDate({    
                            from: startOfMonth(new Date()),    
                            to: endOfMonth(new Date()),    
                          })    
                        }    
                      >    
                        This Month    
                      </Button>    
                      <Button    
                        variant="ghost"    
                        size="sm"    
                        className="justify-start text-xs font-medium text-slate-600 hover:text-[#00B074] hover:bg-[#00B074]/5"    
                        onClick={() =>    
                          setDate({    
                            from: startOfMonth(subMonths(new Date(), 1)),    
                            to: endOfMonth(subMonths(new Date(), 1)),    
                          })    
                        }    
                      >    
                        Last Month    
                      </Button>    
                    </div>    
                    <div className="p-0">    
                      <Calendar    
                        initialFocus    
                        mode="range"    
                        defaultMonth={date?.from}    
                        selected={date}    
                        onSelect={setDate}    
                        numberOfMonths={2}    
                        className="p-3"    
                      />    
                      <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">    
                        <p className="text-[10px] text-slate-400 font-medium">    
                          {date?.from && date?.to    
                            ? `${differenceInDays(date.to, date.from) + 1} days selected`    
                            : "Select a range"}    
                        </p>    
                        <div className="flex gap-2">    
                          <Button    
                            size="sm"    
                            variant="ghost"    
                            className="text-xs h-8"    
                            onClick={() => setDate(undefined)}    
                          >    
                            Reset    
                          </Button>    
                          <Button    
                            size="sm"    
                            className="bg-[#00B074] hover:bg-[#00B074]/90 text-xs h-8 px-4"    
                            onClick={() => document.body.click()}    
                          >    
                            Apply    
                          </Button>    
                        </div>    
                      </div>    
                    </div>    
                  </div>    
                </PopoverContent>    
              </Popover>
        </div>
      </div>
      {slaFilter && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
          SLA:
          <button
            type="button"
            onClick={() => setSlaFilter(null)}
            className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-semibold ring-1 ring-slate-200 hover:bg-slate-100"
          >
            {SLA_TILES.find((t) => t.key === slaFilter)?.label}
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-8 relative">
      {/* Notification */}
      {showNotification && newOrderAlert && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500 fade-in-0">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-5 w-[400px] max-w-[calc(100vw-2rem)] flex items-start gap-4 ring-1 ring-slate-200/50 relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-[#00B074]/10 w-full">
              <div className="h-full bg-[#00B074] animate-[shrink_120s_linear_forwards] origin-left" />
            </div>
            <div className="h-12 w-12 rounded-full bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center shrink-0 shadow-sm">
              <Bell className="h-6 w-6 text-[#00B074]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h4 className="text-[15px] font-bold text-slate-900 leading-tight">
                    New Order Received!
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {newOrderAlert.time}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mt-1 -mr-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                  onClick={() => setShowNotification(false)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                Order{" "}
                <span className="font-semibold text-slate-900">
                  {newOrderAlert.id}
                </span>{" "}
                from{" "}
                <span className="font-semibold text-slate-900">
                  {newOrderAlert.customer}
                </span>
              </p>
              <div className="flex items-center justify-between bg-slate-50/80 border border-slate-100 p-2.5 rounded-lg mb-4 group hover:border-[#00B074]/20 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-100">
                    <Package className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {newOrderAlert.items}
                  </span>
                </div>
                <span className="text-sm font-bold text-[#00B074] bg-[#f0fdf4] px-2 py-0.5 rounded-md border border-[#dcfce7]">
                  {newOrderAlert.earning}
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-[#00B074] hover:bg-[#15803d] text-white shadow-md shadow-green-200 h-9 font-semibold text-sm transition-all active:scale-[0.98]"
                  onClick={() => {
                    setShowNewOrder(true);
                    setShowNotification(false);
                  }}
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  className="px-4 border-slate-200 hover:bg-slate-50 hover:text-slate-700 h-9 font-medium text-sm text-slate-600 transition-colors"
                  onClick={() => setShowNotification(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl text-black font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-primary mt-1">
            Track assigned orders, manage daily operations and monitor delivery timelines in real time.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 text-slate-700 bg-white border-slate-200 h-12 rounded-xl font-bold px-6 hover:bg-slate-50 self-start md:self-auto"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
              Exporting...
            </span>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </>
          )}
        </Button>
      </div>

      <StatsCards
        orders={dateFilteredOrders}
        selectedFilter={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {/* SLA Monitoring */}
      <SectionCard
        title="SLA Monitoring"
        description="Orders due today, approaching deadline and overdue."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {SLA_TILES.map((tile) => {
            const list = orders.filter(tile.match);
            const active = slaFilter === tile.key;
            return (
              <div
                key={tile.key}
                className="rounded-2xl border-[1.5px] p-3 transition-shadow"
                style={{
                  borderColor: active ? tile.color.fg : `${tile.color.fg}40`,
                  backgroundColor: active ? tile.color.bg : undefined,
                }}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 text-left"
                  onClick={() => setSlaFilter(active ? null : tile.key)}
                  title="Filter Recent Orders"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: tile.color.bg }}
                    >
                      <tile.icon className="h-4 w-4" style={{ color: tile.color.fg }} />
                    </span>
                    <span className="text-sm font-bold text-slate-800">{tile.label}</span>
                  </span>
                  <span className="text-2xl font-extrabold" style={{ color: tile.color.fg }}>
                    {list.length}
                  </span>
                </button>
                <ul className="mt-3 space-y-1.5">
                  {list.length === 0 && <li className="text-xs text-slate-400">No orders</li>}
                  {list.slice(0, 4).map((o) => (
                    <li key={o.id}>
                      <button
                        type="button"
                        onClick={() => setViewOrderId(o.id)}
                        className="flex w-full items-center justify-between gap-2 rounded-lg bg-white px-2.5 py-1.5 text-left text-xs ring-1 ring-slate-100 hover:ring-slate-200"
                      >
                        <span className="min-w-0 truncate">
                          <span className="font-bold text-slate-900">{o.id}</span>{" "}
                          <span className="text-slate-500">{o.customer}</span>
                        </span>
                        <span className="shrink-0 font-medium text-slate-600">
                          {format(new Date(o.isoDate), "dd MMM, h:mm a")}
                        </span>
                      </button>
                    </li>
                  ))}
                  {list.length > 4 && (
                    <li className="text-xs text-slate-400">+{list.length - 4} more</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Pickup Schedule */}
        <SectionCard
          title="Today's Pickup Schedule"
          description="Upcoming pickups with customer name, pickup slot and assigned rider."
          right={
            <span className="rounded-full bg-[#00B074]/10 px-2.5 py-1 text-xs font-bold text-[#00B074]">
              {todaysPickups.length}
            </span>
          }
        >
          {todaysPickups.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No pickups scheduled for today.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {todaysPickups.map((o) => {
                const slotPassed = o.pickupDate < now;
                return (
                  <li key={o.id} className="flex items-center gap-3 py-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[o.status].bg }}
                    >
                      <Clock className="h-4 w-4" style={{ color: STATUS_COLORS[o.status].fg }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {o.customer} <span className="font-medium text-slate-400">· {o.id}</span>
                      </p>
                      <p className={cn("text-xs", slotPassed ? "font-semibold text-red-600" : "text-slate-500")}>
                        {o.pickupSlot}
                        {slotPassed && " · slot started"}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <Bike className="h-3.5 w-3.5" />
                        {o.rider ?? "Awaiting rider assignment"}
                      </p>
                    </div>
                    <StatusChip status={o.status} className="hidden sm:inline-flex" />
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>

        {/* Pending Actions */}
        <SectionCard
          title="Pending Actions"
          description="Orders awaiting vendor acceptance or status updates."
          right={
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
              {awaitingAcceptance.length + awaitingStatusUpdate.length}
            </span>
          }
        >
          <div className="space-y-4">
            {[
              { label: "Awaiting acceptance", list: awaitingAcceptance },
              { label: "Awaiting status update", list: awaitingStatusUpdate },
            ].map((group) => (
              <div key={group.label}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {group.label} ({group.list.length})
                </p>
                {group.list.length === 0 ? (
                  <p className="text-xs text-slate-400">Nothing pending.</p>
                ) : (
                  <ul className="space-y-2">
                    {group.list.map((o) => (
                      <li
                        key={o.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2"
                      >
                        <button
                          type="button"
                          className="min-w-0 text-left"
                          onClick={() => setViewOrderId(o.id)}
                        >
                          <p className="text-sm font-bold text-slate-900">
                            {o.id} <span className="font-medium text-slate-500">{o.customer}</span>
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <StatusChip status={o.status} className="py-0.5" />
                            {getSlaAlert(o) !== "On Time" && <AlertChip alert={getSlaAlert(o)} />}
                          </div>
                        </button>
                        {o.status === "Assigned" ? (
                          <Button
                            size="sm"
                            className="h-8 bg-[#00B074] px-3 text-xs font-bold hover:bg-[#00B074]/90"
                            onClick={() => handleAccept(o.id)}
                          >
                            <Check className="h-3.5 w-3.5" />
                            Accept
                          </Button>
                        ) : (
                          <UpdateStatusMenu order={o} onUpdateStatus={handleUpdateStatus} />
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <RecentOrders
        title="Recent Orders"
        orders={tableOrders}
        totalCount={orders.length}
        filters={quickFilters}
        {...handlers}
      />

      <OrderDetailsDialog
        order={viewOrder}
        onOpenChange={(open) => !open && setViewOrderId(null)}
        {...handlers}
      />

      <NewOrderModal open={showNewOrder} onOpenChange={setShowNewOrder} />
    </div>
  );
}
