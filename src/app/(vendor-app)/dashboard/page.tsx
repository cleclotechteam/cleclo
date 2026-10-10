"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  Plus,
  X,
  Bell,
  Package,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { NewOrderModal } from "@/components/dashboard/new-order-modal";
import { cn } from "@/lib/utils";
import {
  format,
  isSameDay,
  subDays,
  isWithinInterval,
  startOfDay,
  endOfDay,
  differenceInDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  addHours,
  addDays,
  subHours,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Static notification data
const STATIC_NOTIFICATION = {
  id: "ORD-8292",
  customer: "Mark Wilson",
  items: "2 Suits Dry Clean",
  earning: "₹280",
  time: "Just now",
};

// Mock data moved from recent-orders.tsx
// Helper to generate dynamic dates
const now = new Date();
const getDeliveryDate = (pickup: Date, type: "Standard" | "Express 48h" | "Express 24h") => {
  const hours = type === "Standard" ? 72 : type === "Express 48h" ? 48 : 24;
  return addHours(pickup, hours);
};

// Mock data moved from recent-orders.tsx
const orders = [
  {
    id: "#ORD-8291",
    customer: "Alice Freeman",
    type: "Regular",
    serviceType: "Standard",
    avatar: "/avatars/alice.png",
    items: "5kg Wash & Fold",
    status: "Under Processing",
    pickupDate: subHours(now, 70), // Standard (72h), picked up 70h ago. Due in 2h. T-2 is NOW. (Borderline)
    dueDate: format(addHours(subHours(now, 70), 72), "MMM dd, h:mm a"),
    isoDate: addHours(subHours(now, 70), 72).toISOString(),
  },
  {
    id: "#ORD-8292",
    customer: "Mark Wilson",
    type: "New Customer",
    serviceType: "Express 24h",
    avatar: "/avatars/mark.png",
    items: "2 Suits Dry Clean",
    status: "Assigned",
    pickupDate: subHours(now, 2), // Picked up 2h ago. Due in 22h.
    dueDate: format(addHours(subHours(now, 2), 24), "MMM dd, h:mm a"),
    isoDate: addHours(subHours(now, 2), 24).toISOString(),
  },
  {
    id: "#ORD-8288",
    customer: "Sarah Jenkins",
    type: "VIP",
    serviceType: "Standard",
    avatar: "/avatars/sarah.png",
    items: "10kg Mixed Load",
    status: "Ready",
    pickupDate: subDays(now, 4),
    dueDate: format(addHours(subDays(now, 4), 72), "MMM dd, h:mm a"),
    isoDate: addHours(subDays(now, 4), 72).toISOString(),
  },
  {
    id: "#ORD-8293",
    customer: "James Doe",
    type: "Regular",
    serviceType: "Express 48h",
    avatar: "/avatars/james.png",
    items: "Wedding Dress Clean",
    status: "Pending Pickup",
    pickupDate: addHours(now, 2), // Future pickup
    dueDate: format(addHours(addHours(now, 2), 48), "MMM dd, h:mm a"),
    isoDate: addHours(addHours(now, 2), 48).toISOString(),
  },
  {
    id: "#ORD-8294",
    customer: "Emily Chen",
    type: "Regular",
    serviceType: "Standard",
    avatar: "/avatars/emily.png",
    items: "3 Curtains",
    status: "Assigned",
    pickupDate: subHours(now, 5),
    dueDate: format(addHours(subHours(now, 5), 72), "MMM dd, h:mm a"),
    isoDate: addHours(subHours(now, 5), 72).toISOString(),
  },
  {
    id: "#ORD-8295",
    customer: "Michael Brown",
    type: "VIP",
    serviceType: "Express 24h",
    avatar: "/avatars/michael.png",
    items: "Premium Suit Clean",
    status: "Assigned",
    pickupDate: subHours(now, 1),
    dueDate: format(addHours(subHours(now, 1), 24), "MMM dd, h:mm a"),
    isoDate: addHours(subHours(now, 1), 24).toISOString(),

  },
  {
    id: "#ORD-8296",
    customer: "Lisa Wang",
    type: "New Customer",
    serviceType: "Standard",
    avatar: "/avatars/lisa.png",
    items: "10kg Wash & Fold",
    status: "Under Processing",
    pickupDate: subHours(now, 71), // Standard (72h), picked up 71h ago. Due in 1h. Overdue (Now > Due-2h).
    dueDate: format(addHours(subHours(now, 71), 72), "MMM dd, h:mm a"),
    isoDate: addHours(subHours(now, 71), 72).toISOString(),
  },
  {
    id: "#ORD-8297",
    customer: "David Miller",
    type: "Regular",
    serviceType: "Standard",
    avatar: "/avatars/david.png",
    items: "2 Winter Coats",
    status: "Under Processing",
    pickupDate: subHours(now, 20),
    dueDate: format(addHours(subHours(now, 20), 72), "MMM dd, h:mm a"),
    isoDate: addHours(subHours(now, 20), 72).toISOString(),
  },
  {
    id: "#ORD-8298",
    customer: "Sophie Turner",
    type: "VIP",
    serviceType: "Express 48h",
    avatar: "/avatars/sophie.png",
    items: "Wedding Saree",
    status: "Ready",
    pickupDate: subHours(now, 50),
    dueDate: format(addHours(subHours(now, 50), 48), "MMM dd, h:mm a"),
    isoDate: addHours(subHours(now, 50), 48).toISOString(),
  },
];

export default function DashboardPage() {
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isExporting, setIsExporting] = useState(false);

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

  const filteredOrders = date?.from
    ? orders.filter((order) => {
      const orderDate = new Date(order.isoDate);
      return isWithinInterval(orderDate, {
        start: startOfDay(date.from!),
        end: endOfDay(date.to || date.from!),
      });
    })
    : orders;

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export delay
    setTimeout(() => {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Order ID,Customer,Items,Status,Due Date\n" +
        filteredOrders
          .map(
            (e) =>
              `${e.id},${e.customer},${e.items.replace(/,/g, "")},${e.status},${e.dueDate}`,
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
    <div className="flex flex-col gap-8 relative">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500 fade-in-0">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-5 w-[400px] flex items-start gap-4 ring-1 ring-slate-200/50 relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-[#3E8940]/10 w-full">
              <div className="h-full bg-[#3E8940] animate-[shrink_120s_linear_forwards] origin-left" />
            </div>
            <div className="h-12 w-12 rounded-full bg-[#f0fdf4] border border-[#dcfce7] flex items-center justify-center shrink-0 shadow-sm">
              <Bell className="h-6 w-6 text-[#16a34a]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h4 className="text-[15px] font-bold text-slate-900 leading-tight">
                    New Order Received!
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {STATIC_NOTIFICATION.time}
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
                  {STATIC_NOTIFICATION.id}
                </span>{" "}
                from{" "}
                <span className="font-semibold text-slate-900">
                  {STATIC_NOTIFICATION.customer}
                </span>
              </p>
              <div className="flex items-center justify-between bg-slate-50/80 border border-slate-100 p-2.5 rounded-lg mb-4 group hover:border-[#3E8940]/20 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-100">
                    <Package className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">
                    {STATIC_NOTIFICATION.items}
                  </span>
                </div>
                <span className="text-sm font-bold text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded-md border border-[#dcfce7]">
                  {STATIC_NOTIFICATION.earning}
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white shadow-md shadow-green-200 h-9 font-semibold text-sm transition-all active:scale-[0.98]"
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
            Welcome back. Here&apos;s your operational overview.
          </p>
        </div>
      </div>

      {/* Toolbar and Data Period Label */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        {/* Date Range Picker */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-[300px] h-12 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900",
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
                    className="justify-start text-xs font-medium text-slate-600 hover:text-[#3E8940] hover:bg-[#3E8940]/5"
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
                    className="justify-start text-xs font-medium text-slate-600 hover:text-[#3E8940] hover:bg-[#3E8940]/5"
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
                    className="justify-start text-xs font-medium text-slate-600 hover:text-[#3E8940] hover:bg-[#3E8940]/5"
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
                    className="justify-start text-xs font-medium text-slate-600 hover:text-[#3E8940] hover:bg-[#3E8940]/5"
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
                        className="bg-[#3E8940] hover:bg-[#3E8940]/90 text-xs h-8 px-4"
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

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 text-slate-700 bg-white border-slate-200 h-12 rounded-xl font-bold px-6 hover:bg-slate-50"
            onClick={handleExport}
            disabled={!date?.from || isExporting}
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
      </div>

      <StatsCards
        orders={filteredOrders}
        selectedFilter={filterStatus}
        onFilterChange={setFilterStatus}
      />

      <RecentOrders
        orders={filteredOrders}
        onOrderClick={() => setShowNewOrder(true)}
        filterStatus={filterStatus}
      />

      <NewOrderModal open={showNewOrder} onOpenChange={setShowNewOrder} />
    </div>
  );
}
