"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Download,
  History,
  Package,
  Search,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { VendorDataGate } from "@/components/dashboard/vendor-data-gate";
import { OrderCard } from "@/components/dashboard/orders/order-card";
import {
  formatINR,
  formatOrderDate,
  getOrderServices,
  orderTotalQty,
  SERVICE_TYPES,
  STAGE_CARD_LABEL,
  STAGE_TAB,
  TURNAROUND_FILTER_LABEL,
  TURNAROUND_LABEL,
  TURNAROUNDS,
  type Order,
  type OrderStatus,
  type ServiceSpeed,
  type ServiceType,
} from "@/lib/vendor-data";
import {
  differenceInDays,
  endOfDay,
  format,
  isSameDay,
  isWithinInterval,
  startOfDay,
  subDays,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Tab = Exclude<OrderStatus, "Exceptions">;

/** Tabs with their entry / exit triggers (Critical Status Logic). */
const TABS: { value: Tab; entry: string; exit: string }[] = [
  { value: "New Orders", entry: "Order assigned to vendor", exit: "Accepted, declined or reassigned" },
  { value: "Accepted", entry: "Vendor accepts order", exit: "Vendor intake verified" },
  { value: "Processing", entry: "Intake verification completed", exit: "Quality check and packing completed" },
  { value: "Ready for Dispatch", entry: "Vendor marks order ready", exit: "Delivery confirmed" },
  { value: "Completed", entry: "Customer delivery confirmed", exit: "Final state" },
];

/** Service Type filter labels (as specified for the filter bar). */
const SERVICE_FILTER_LABEL: Record<ServiceType, string> = {
  "Dry Cleaning": "Drycleaning",
  Washing: "Washing",
  "Steam Ironing": "Steam Ironing",
};

type DateBasis = "order" | "pickup" | "delivery";
const DATE_BASIS_LABEL: Record<DateBasis, string> = {
  order: "Order Date",
  pickup: "Pickup Date",
  delivery: "Delivery Due Date",
};

const dateFor = (o: Order, basis: DateBasis) =>
  new Date(basis === "order" ? o.isoDate : basis === "pickup" ? o.pickupAt : o.deliveryDueAt);

export default function OrdersPage() {
  return (
    <VendorDataGate resource="orders">
      {(orders) => <OrdersView initialOrders={orders} />}
    </VendorDataGate>
  );
}

function OrdersView({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<OrderStatus>("New Orders");
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState<ServiceType | "all">("all");
  const [turnaroundFilter, setTurnaroundFilter] = useState<ServiceSpeed | "all">("all");
  const [dateBasis, setDateBasis] = useState<DateBasis>("order");
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isExporting, setIsExporting] = useState(false);

  const query = search.trim().toLowerCase();
  const filteredOrders = orders.filter((order) => {
    if (STAGE_TAB[order.stage] !== activeTab) return false;
    if (query && !order.id.toLowerCase().includes(query) && !order.customerName.toLowerCase().includes(query)) return false;
    if (serviceFilter !== "all" && !order.items.some((i) => i.service === serviceFilter)) return false;
    if (turnaroundFilter !== "all" && order.serviceSpeed !== turnaroundFilter) return false;
    if (date?.from) {
      return isWithinInterval(dateFor(order, dateBasis), {
        start: startOfDay(date.from),
        end: endOfDay(date.to || date.from),
      });
    }
    return true;
  });

  const getTabCount = (status: OrderStatus) => orders.filter((o) => STAGE_TAB[o.stage] === status).length;

  const resetFilters = () => {
    setSearch("");
    setServiceFilter("all");
    setTurnaroundFilter("all");
  };

  // Every vendor status change is timestamped and logged with the responsible user.
  const log = (action: string): Order["statusLog"][number] => ({
    at: new Date().toISOString(),
    by: "Ramesh K. (Vendor Staff)",
    action,
    source: "Vendor",
  });

  // Acceptance is atomic on the backend: only one vendor can accept an assignment.
  const handleAccept = (order: Order) => {
    if (order.acceptanceDeadline && new Date(order.acceptanceDeadline) <= new Date()) {
      toast.error(`${order.id}: acceptance window has expired. The order is being reassigned.`);
      return;
    }
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? { ...o, stage: "awaiting_pickup", logisticsStatus: "pickup_scheduled", acceptanceDeadline: undefined, statusLog: [...o.statusLog, log("Order accepted")] }
          : o,
      ),
    );
    toast.success(`${order.id} accepted. Cleclo's logistics partner will collect the garments.`);
  };

  const handleDecline = (order: Order) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              stage: "declined",
              acceptanceDeadline: undefined,
              exceptionNote: "Declined by vendor. Routed for reassignment.",
              statusLog: [...o.statusLog, log("Order declined")],
            }
          : o,
      ),
    );
    toast(`${order.id} declined and routed for reassignment.`, {
      description: "It remains available under Order History/Exceptions.",
    });
  };

  const handleConfirmReadiness = (order: Order) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? { ...o, readinessConfirmed: true, logisticsStatus: "awaiting_collection", statusLog: [...o.statusLog, log("Readiness confirmed for handover")] }
          : o,
      ),
    );
    toast.success(`${order.id}: readiness confirmed. Logistics collection will be arranged.`);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
      const header = [
        "Order ID",
        "Customer",
        "Items",
        "Total Qty",
        "Services Required",
        "Turnaround",
        "Status",
        "Order Date",
        "Scheduled Pickup",
        "Delivery Due",
        "Total Vendor Payout",
      ];
      const rows = filteredOrders.map((o) =>
        [
          o.id,
          o.customerName,
          o.items.map((i) => `${i.qty} ${i.garment} (${i.service})`).join("; "),
          orderTotalQty(o),
          getOrderServices(o).join("; "),
          TURNAROUND_LABEL[o.serviceSpeed],
          STAGE_CARD_LABEL[o.stage],
          formatOrderDate(o.isoDate),
          formatOrderDate(o.pickupAt),
          formatOrderDate(o.deliveryDueAt),
          o.totalPayout.toFixed(2),
        ]
          .map(esc)
          .join(","),
      );
      const blob = new Blob([[header.map(esc).join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const rangeStr = date?.from
        ? `${format(date.from, "yyyy-MM-dd")}_to_${format(date.to ?? date.from, "yyyy-MM-dd")}`
        : "all_time";
      link.download = `orders_${dateBasis}_${rangeStr}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 600);
  };

  const activeMeta = TABS.find((t) => t.value === activeTab);
  const exceptionsCount = getTabCount("Exceptions");
  const filtersActive = query !== "" || serviceFilter !== "all" || turnaroundFilter !== "all";

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
          <p className="text-slate-500">
            Manage assigned orders, track processing progress, monitor delivery deadlines and view your order-wise payouts.
          </p>
        </div>
        <button
          onClick={() => setLiveUpdates(!liveUpdates)}
          className="flex items-center w-fit gap-2 bg-white px-3 py-1.5 rounded-full border shadow-sm hover:shadow-md transition-shadow cursor-pointer shrink-0"
        >
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-colors",
              liveUpdates ? "bg-[#00B074] animate-pulse" : "bg-slate-300",
            )}
          />
          <span className="text-sm font-medium text-slate-700">
            Live Updates {liveUpdates ? "On" : "Off"}
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-end justify-between gap-4 border-b">
        <div className="flex items-center gap-6 pb-1 overflow-x-auto">
          {TABS.map((tab) => {
            const count = getTabCount(tab.value);
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "flex items-center gap-1.5 pb-3 px-1 border-b-2 transition-all whitespace-nowrap",
                  isActive
                    ? "border-[#00B074] text-[#00B074] font-bold"
                    : "border-transparent text-slate-500 font-medium hover:text-slate-700 hover:border-slate-300",
                )}
              >
                {tab.value} ({count})
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setActiveTab("Exceptions")}
          className={cn(
            "mb-2 flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap",
            activeTab === "Exceptions"
              ? "border-[#00B074] bg-[#00B074]/10 text-[#00B074]"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
          )}
        >
          <History className="h-3.5 w-3.5" />
          Order History/Exceptions ({exceptionsCount})
        </button>
      </div>

      {/* Tab context */}
      <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {activeTab === "New Orders" ? (
          <p>
            <span className="font-semibold text-slate-800">Awaiting Acceptance</span> — Orders assigned to the vendor but not yet accepted or declined.
          </p>
        ) : activeTab === "Exceptions" ? (
          <p>Orders that are cancelled, declined or reassigned.</p>
        ) : activeMeta ? (
          <p>
            <span className="font-semibold text-slate-800">Entry Trigger:</span> {activeMeta.entry}
            <span className="mx-2 text-slate-300">|</span>
            <span className="font-semibold text-slate-800">Exit Trigger:</span> {activeMeta.exit}
          </p>
        ) : null}
        {activeTab === "Processing" && (
          <p className="mt-1 text-xs text-slate-500">
            An order should not move to Processing simply because it has been accepted. It must first be physically received and verified.
          </p>
        )}
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="order-search" className="text-sm font-medium text-slate-600">
            Search Orders
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="order-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Order ID or Customer Name"
              className="h-10 rounded-xl pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-600">Service Type</p>
            <Select value={serviceFilter} onValueChange={(v) => setServiceFilter(v as ServiceType | "all")}>
              <SelectTrigger className="h-10 w-full rounded-xl bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {SERVICE_TYPES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {SERVICE_FILTER_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-slate-600">Turnaround</p>
            <Select value={turnaroundFilter} onValueChange={(v) => setTurnaroundFilter(v as ServiceSpeed | "all")}>
              <SelectTrigger className="h-10 w-full rounded-xl bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Turnarounds</SelectItem>
                {TURNAROUNDS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {TURNAROUND_FILTER_LABEL[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
          <Select value={dateBasis} onValueChange={(v) => setDateBasis(v as DateBasis)}>
            <SelectTrigger className="h-10 w-[190px] rounded-xl bg-white font-medium text-slate-700">
              <span className="text-slate-400">Date:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(DATE_BASIS_LABEL) as DateBasis[]).map((b) => (
                <SelectItem key={b} value={b}>
                  {DATE_BASIS_LABEL[b]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="bg-white border-slate-200 h-10 rounded-xl font-medium text-slate-700 px-4"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {date?.from ? (
                  date.to &&
                  differenceInDays(date.to, date.from) === 7 &&
                  isSameDay(date.to, new Date()) ? (
                    "Last 7 Days"
                  ) : date.to ? (
                    <>
                      {format(date.from, "d MMM yyyy")} - {format(date.to, "d MMM yyyy")}
                    </>
                  ) : (
                    format(date.from, "d MMM yyyy")
                  )
                ) : (
                  "All Dates"
                )}
                <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex items-end gap-2 p-3 border-b border-slate-100">
                <div className="flex-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {DATE_BASIS_LABEL[dateBasis]} From
                  </span>
                  <div className="text-xs font-semibold text-slate-800 border border-slate-200 rounded-md px-2 py-1.5 mt-1 bg-slate-50">
                    {date?.from ? format(date.from, "d MMM yyyy") : "Select date"}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">To</span>
                  <div className="text-xs font-semibold text-slate-800 border border-slate-200 rounded-md px-2 py-1.5 mt-1 bg-slate-50">
                    {date?.to ? format(date.to, "d MMM yyyy") : "-"}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setDate(undefined)}>
                  Clear
                </Button>
              </div>
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            className="bg-white border-slate-200 h-10 rounded-xl font-medium text-slate-700 px-4"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export Data"}
          </Button>

          <Button
            variant="outline"
            className="ml-auto h-10 rounded-full border-slate-200 px-5 text-slate-700"
            onClick={resetFilters}
            disabled={!filtersActive}
          >
            Reset
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          Filtering by <span className="font-semibold text-slate-700">{DATE_BASIS_LABEL[dateBasis]}</span>
          {date?.from
            ? `: ${format(date.from, "d MMM yyyy")} – ${format(date.to ?? date.from, "d MMM yyyy")}`
            : " (all dates)"}
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No orders found</h3>
            <p className="text-slate-500">
              {activeTab === "New Orders" && !filtersActive
                ? "No new orders at the moment. Check back soon!"
                : "No orders matching your filters."}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onConfirmReadiness={handleConfirmReadiness}
            />
          ))
        )}
      </div>

      {/* Summary */}
      {filteredOrders.length > 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col gap-1 sm:flex-row sm:items-center justify-between text-slate-600 text-sm">
          <span>
            Showing <strong>{filteredOrders.length}</strong> {activeTab === "Exceptions" ? "Order History/Exceptions" : activeTab} orders •{" "}
            {filteredOrders.reduce((s, o) => s + orderTotalQty(o), 0)} Units
          </span>
          <span className="font-semibold text-[#00B074]">
            Total Vendor Payout: {formatINR(filteredOrders.reduce((sum, o) => sum + o.totalPayout, 0))}
          </span>
        </div>
      )}
    </div>
  );
}
