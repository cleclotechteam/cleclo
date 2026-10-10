"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronRight,
  Filter,
  MapPin,
  Clock,
  Shirt,
  Package,
  Truck,
  CheckCircle2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { VendorDataGate } from "@/components/dashboard/vendor-data-gate";
import type { Order, OrderStatus, ServiceSpeed } from "@/lib/vendor-data";
import {
  format,
  isWithinInterval,
  subDays,
  startOfDay,
  endOfDay,
  differenceInDays,
  isSameDay,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


const TABS: { label: string; value: OrderStatus }[] = [
  { label: "New Orders", value: "New Orders" },
  { label: "Accepted Orders", value: "Accepted Orders" },
  { label: "Under Processing", value: "Under Processing" },
  { label: "Ready for Dispatch", value: "Ready for Dispatch" },
  { label: "Completed Orders", value: "Completed Orders" },
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "New Orders":
      return "bg-orange-100 text-orange-700";
    case "Accepted Orders":
      return "bg-blue-100 text-blue-700";
    case "Under Processing":
      return "bg-purple-100 text-purple-700";
    case "Ready for Dispatch":
      return "bg-green-100 text-green-700";
    case "Completed Orders":
      return "bg-slate-100 text-slate-700";
  }
};

const getSpeedColor = (speed: ServiceSpeed) => {
  switch (speed) {
    case "economy":
      return "text-[#00B074] border-[#00B074]/30 bg-[#00B074]/5";
    case "fast":
      return "text-blue-600 border-blue-300 bg-blue-50";
    case "express":
      return "text-orange-600 border-orange-300 bg-orange-50";
  }
};

const getLeftBorderColor = (status: OrderStatus) => {
  switch (status) {
    case "New Orders":
      return "bg-orange-500";
    case "Accepted Orders":
      return "bg-blue-500";
    case "Under Processing":
      return "bg-purple-500";
    case "Ready for Dispatch":
      return "bg-[#00B074]";
    case "Completed Orders":
      return "bg-slate-400";
  }
};

export default function OrdersPage() {
  return (
    <VendorDataGate resource="orders">
      {(orders) => <OrdersView orders={orders} />}
    </VendorDataGate>
  );
}

function OrdersView({ orders: ORDERS }: { orders: Order[] }) {
  const [activeTab, setActiveTab] = useState<OrderStatus>("New Orders");
  const [serviceFilter, setServiceFilter] = useState<ServiceSpeed | "all">(
    "all",
  );
  const [liveUpdates, setLiveUpdates] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isExporting, setIsExporting] = useState(false);

  const filteredOrders = ORDERS.filter((order) => {
    const matchesTab = order.status === activeTab;
    const matchesService =
      serviceFilter === "all" || order.serviceSpeed === serviceFilter;

    let matchesDate = true;
    if (date?.from && order.isoDate) {
      const orderDate = new Date(order.isoDate);
      matchesDate = isWithinInterval(orderDate, {
        start: startOfDay(date.from),
        end: endOfDay(date.to || date.from),
      });
    }

    return matchesTab && matchesService && matchesDate;
  });

  const getTabCount = (status: OrderStatus) => {
    return ORDERS.filter((o) => o.status === status).length;
  };

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export delay
    setTimeout(() => {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Order ID,Customer,Items,Service,Status,Earning,Date\n" +
        filteredOrders
          .map(
            (o) =>
              `${o.id},${o.customerName},"${o.items.replace(/,/g, " ")}",${o.service},${o.status},"${o.earning}",${o.isoDate}`,
          )
          .join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      const rangeStr = date?.from
        ? `${format(date.from, "yyyy-MM-dd")}_to_${date.to ? format(date.to, "yyyy-MM-dd") : format(date.from, "yyyy-MM-dd")}`
        : "all_time";
      link.setAttribute("download", `orders_report_${rangeStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
    }, 1000);
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Orders Dashboard
          </h1>
          <p className="text-slate-500">
            Review, accept and manage laundry orders while tracking your
            earnings in real time.
          </p>
        </div>
        <button
          onClick={() => setLiveUpdates(!liveUpdates)}
          className="flex items-center w-fit gap-2 bg-white px-3 py-1.5 rounded-full border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
      <div className="flex items-center gap-6 border-b pb-1 overflow-x-auto">
        {TABS.map((tab) => {
          const count = getTabCount(tab.value);
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex items-center gap-2 pb-3 px-1 border-b-2 transition-all whitespace-nowrap",
                isActive
                  ? "border-[#00B074] text-[#00B074] font-bold"
                  : "border-transparent text-slate-500 font-medium hover:text-slate-700 hover:border-slate-300",
              )}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={cn(
                    "px-2 py-0.5 text-xs rounded-full",
                    isActive
                      ? "bg-[#00B074] text-white"
                      : "bg-slate-200 text-slate-600",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select defaultValue="delivery">
          <SelectTrigger className="w-[180px] bg-white border-slate-200 h-10 rounded-xl font-medium text-slate-700">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="delivery">Delivery Type</SelectItem>
            <SelectItem value="pickup">Pickup Type</SelectItem>
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
                    {format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}
                  </>
                ) : (
                  format(date.from, "LLL dd")
                )
              ) : (
                "Pick a date"
              )}
              <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex gap-2 p-3 border-b border-slate-100">
              <div className="flex-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  From
                </span>
                <div className="text-xs font-semibold text-slate-800 border border-slate-200 rounded-md px-2 py-1.5 mt-1 bg-slate-50">
                  {date?.from
                    ? format(date.from, "MMM dd, yyyy")
                    : "Select date"}
                </div>
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  To
                </span>
                <div className="text-xs font-semibold text-slate-800 border border-slate-200 rounded-md px-2 py-1.5 mt-1 bg-slate-50">
                  {date?.to ? format(date.to, "MMM dd, yyyy") : "-"}
                </div>
              </div>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate as any}
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

        <div className="h-8 w-px bg-slate-200 mx-1" />

        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          {(["all", "economy", "fast", "express"] as const).map((speed) => (
            <button
              key={speed}
              onClick={() => setServiceFilter(speed)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize",
                serviceFilter === speed
                  ? "bg-[#00B074]/10 text-[#00B074] font-bold shadow-sm"
                  : "text-slate-600 hover:bg-slate-200",
              )}
            >
              {speed === "all" ? "All" : speed}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
            <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              No orders found
            </h3>
            <p className="text-slate-500">
              {activeTab === "New Orders"
                ? "No new orders at the moment. Check back soon!"
                : `No ${activeTab} orders matching your filters.`}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="group relative bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Left Border Line */}
              <div
                className={cn(
                  "absolute left-0 top-0 bottom-0 w-1.5 rounded-l-full",
                  getLeftBorderColor(order.status),
                )}
              />

              <div className="flex flex-col md:flex-row gap-5 pl-4">
                {/* Left Section: Info */}
                <div className="flex-2 space-y-2">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      Order #{order.id.replace("ORD-", "")}
                    </h3>
                    <p className="text-sm font-semibold text-[#00B074]">
                      {order.status.split(" ")[0]} |{" "}
                      {order.serviceSpeed === "economy"
                        ? "Standard"
                        : order.serviceSpeed.charAt(0).toUpperCase() +
                        order.serviceSpeed.slice(1)}
                    </p>
                  </div>

                  <div className="space-y-1 mt-3">
                    <p className="text-sm font-medium text-slate-700">
                      <span className="text-slate-500 font-bold">Items:</span>{" "}
                      {order.items}
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      <span className="text-slate-500 font-bold">
                        Customer:
                      </span>{" "}
                      {order.customerName}
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      <span className="text-slate-500 font-bold">Service:</span>{" "}
                      {order.service}
                    </p>
                  </div>
                </div>

                {/* Right Section: Details & Status */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Detail Column 1 */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-700">
                      <span className="text-slate-500 font-bold">Pickup:</span>{" "}
                      {order.pickupTime}
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      <span className="text-slate-500 font-bold">
                        Delivery:
                      </span>{" "}
                      {order.deliveryTime}
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      <span className="text-slate-500 font-bold">
                        Location:
                      </span>{" "}
                      {order.locality} ({order.distance} away)
                    </p>
                  </div>

                  {/* Detail Column 2 (Earning & Actions) */}
                  <div className="flex flex-col justify-between items-end text-right h-full py-1">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
                        Estimated Earnings
                      </p>
                      <p className="text-2xl font-black text-[#00B074]">
                        {order.earning}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      {order.status === "New Orders" && (
                        <Button
                          size="sm"
                          className="bg-[#00B074] hover:bg-[#00B074]/90 h-8 text-xs font-bold px-4"
                        >
                          Accept Order
                        </Button>
                      )}
                      {order.status === "Accepted Orders" && (
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 h-8 text-xs font-bold px-4"
                        >
                          Start Processing
                        </Button>
                      )}
                      {order.status === "Under Processing" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 h-8 text-xs font-bold px-4"
                        >
                          Mark Ready
                        </Button>
                      )}
                      {order.status === "Ready for Dispatch" && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 h-8 text-xs font-bold px-4"
                        >
                          Complete Delivery
                        </Button>
                      )}
                      {order.status === "Completed Orders" && (
                        <Badge className="bg-green-100 text-green-700 border-none gap-1 py-1 px-3">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed
                        </Badge>
                      )}
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="flex items-center text-[#00B074] text-xs font-bold cursor-pointer hover:underline"
                      >
                        View Details{" "}
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredOrders.length > 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-center justify-between text-slate-600 text-sm">
          <span>
            Showing <strong>{filteredOrders.length}</strong> {activeTab} orders
            {serviceFilter !== "all" && ` • ${serviceFilter} service`}
          </span>
          <span className="font-semibold text-[#00B074]">
            Total Earnings: ₹
            {filteredOrders.reduce(
              (sum, o) => sum + parseInt(o.earning.replace(/[₹,]/g, "")),
              0,
            )}
          </span>
        </div>
      )}
    </div>
  );
}
