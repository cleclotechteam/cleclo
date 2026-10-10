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

type OrderStatus =
  | "New Orders"
  | "Accepted Orders"
  | "Under Processing"
  | "Ready for Dispatch"
  | "Completed Orders";
type ServiceSpeed = "economy" | "fast" | "express";

interface Order {
  id: string;
  status: OrderStatus;
  serviceSpeed: ServiceSpeed;
  items: string;
  service: string;
  detergent: string;
  pickupTime: string;
  deliveryTime: string;
  address: string;
  locality: string;
  distance: string;
  earning: string;
  customerName: string;
  isoDate: string;
}

const ORDERS: Order[] = [
  // New Orders
  {
    id: "ORD-4920",
    status: "New Orders",
    serviceSpeed: "economy",
    items: "3 Shirts • 2 Jeans • 1 Silk Scarf",
    service: "Dry Cleaning",
    detergent: "Standard detergent",
    pickupTime: "Today at 2:00 PM",
    deliveryTime: "Tomorrow at 10:00 AM",
    address: "123 Maple St, Downtown",
    locality: "Punjabi Bagh",
    distance: "1.2 km",
    earning: "₹140",
    customerName: "John Smith",
    isoDate: "2026-02-07T14:00:00",
  },
  {
    id: "ORD-4921",
    status: "New Orders",
    serviceSpeed: "fast",
    items: "1 Bedsheet • 4 Pillow Cases",
    service: "Dry Cleaning",
    detergent: "Delicate items",
    pickupTime: "Today at 4:30 PM",
    deliveryTime: "Tomorrow at 12:00 PM",
    address: "456 Oak Ave, Uptown",
    locality: "Uptown",
    distance: "3.5 km",
    earning: "₹220",
    customerName: "Sarah Johnson",
    isoDate: "2026-02-07T16:30:00",
  },
  {
    id: "ORD-4925",
    status: "New Orders",
    serviceSpeed: "express",
    items: "4 Curtains • 2 Sofa Covers",
    service: "Wash & Fold",
    detergent: "Heavy duty",
    pickupTime: "Today at 5:00 PM",
    deliveryTime: "Today at 9:00 PM",
    address: "789 Pine Ln, Suburbs",
    locality: "South Delhi",
    distance: "5.0 km",
    earning: "₹500",
    customerName: "Mike Chen",
    isoDate: "2026-02-07T17:00:00",
  },
  // Accepted Orders
  {
    id: "ORD-4918",
    status: "Accepted Orders",
    serviceSpeed: "economy",
    items: "1 Suit • 2 Ties",
    service: "Dry Clean",
    detergent: "Premium care",
    pickupTime: "Today at 11:00 AM",
    deliveryTime: "Wed at 2:00 PM",
    address: "321 Cedar Rd",
    locality: "Janakpuri",
    distance: "2.1 km",
    earning: "₹350",
    customerName: "David Wilson",
    isoDate: "2026-02-07T11:00:00",
  },
  {
    id: "ORD-4916",
    status: "Accepted Orders",
    serviceSpeed: "fast",
    items: "2 Dresses • 3 Blouses",
    service: "Wash & Iron",
    detergent: "Gentle care",
    pickupTime: "Today at 1:00 PM",
    deliveryTime: "Tomorrow at 3:00 PM",
    address: "555 Elm Street",
    locality: "Rajouri Garden",
    distance: "1.8 km",
    earning: "₹280",
    customerName: "Emily Brown",
    isoDate: "2026-02-07T13:00:00",
  },
  // Processing Orders
  {
    id: "ORD-4912",
    status: "Under Processing",
    serviceSpeed: "economy",
    items: "5 Jeans • 8 T-Shirts",
    service: "Wash & Fold",
    detergent: "Standard",
    pickupTime: "Yesterday at 3:00 PM",
    deliveryTime: "Tomorrow at 11:00 AM",
    address: "888 Birch Ave",
    locality: "Pitampura",
    distance: "4.2 km",
    earning: "₹420",
    customerName: "Alex Turner",
    isoDate: "2026-02-06T15:00:00",
  },
  {
    id: "ORD-4910",
    status: "Under Processing",
    serviceSpeed: "express",
    items: "1 Wedding Dress",
    service: "Premium Dry Clean",
    detergent: "Delicate fabrics",
    pickupTime: "Today at 9:00 AM",
    deliveryTime: "Today at 6:00 PM",
    address: "999 Willow Lane",
    locality: "Gurgaon",
    distance: "2.5 km",
    earning: "₹800",
    customerName: "Lisa Anderson",
    isoDate: "2026-02-07T09:00:00",
  },
  {
    id: "ORD-4908",
    status: "Under Processing",
    serviceSpeed: "fast",
    items: "10 Uniforms",
    service: "Wash & Iron",
    detergent: "Commercial grade",
    pickupTime: "Yesterday at 5:00 PM",
    deliveryTime: "Tomorrow at 9:00 AM",
    address: "444 Oak Street",
    locality: "Dwarka",
    distance: "3.0 km",
    earning: "₹600",
    customerName: "Corporate Client",
    isoDate: "2026-02-06T17:00:00",
  },
  {
    id: "ORD-4905",
    status: "Under Processing",
    serviceSpeed: "economy",
    items: "2 Blankets • 1 Comforter",
    service: "Heavy Wash",
    detergent: "Deep clean",
    pickupTime: "2 days ago",
    deliveryTime: "Tomorrow at 4:00 PM",
    address: "222 Pine Road",
    locality: "Rohini",
    distance: "5.5 km",
    earning: "₹380",
    customerName: "Robert Kim",
    isoDate: "2026-02-05T14:00:00", // approx 2 PM
  },
  {
    id: "ORD-4902",
    status: "Under Processing",
    serviceSpeed: "economy",
    items: "6 Shirts • 4 Pants",
    service: "Wash & Iron",
    detergent: "Standard",
    pickupTime: "Yesterday at 2:00 PM",
    deliveryTime: "Tomorrow at 2:00 PM",
    address: "111 Maple Drive",
    locality: "Paschim Vihar",
    distance: "1.9 km",
    earning: "₹320",
    customerName: "James Lee",
    isoDate: "2026-02-06T14:00:00",
  },
  // Ready Orders
  {
    id: "ORD-4900",
    status: "Ready for Dispatch",
    serviceSpeed: "fast",
    items: "2 Jackets • 2 Pants",
    service: "Dry Clean",
    detergent: "Premium",
    pickupTime: "2 days ago",
    deliveryTime: "Today at 12:00 PM",
    address: "777 Cherry St",
    locality: "Vikaspuri",
    distance: "2.8 km",
    earning: "₹450",
    customerName: "Tom Harris",
    isoDate: "2026-02-05T10:00:00",
  },
  {
    id: "ORD-4898",
    status: "Ready for Dispatch",
    serviceSpeed: "economy",
    items: "6 Curtains",
    service: "Steam Clean",
    detergent: "Fabric refresh",
    pickupTime: "3 days ago",
    deliveryTime: "Today at 3:00 PM",
    address: "333 Walnut Ave",
    locality: "Moti Nagar",
    distance: "4.0 km",
    earning: "₹520",
    customerName: "Nancy White",
    isoDate: "2026-02-04T10:00:00",
  },
  // Completed Orders
  {
    id: "ORD-4895",
    status: "Completed Orders",
    serviceSpeed: "express",
    items: "1 Party Dress • Accessories",
    service: "Express Clean",
    detergent: "Delicate",
    pickupTime: "Yesterday",
    deliveryTime: "Yesterday at 8:00 PM",
    address: "666 Spruce Lane",
    locality: "Kirti Nagar",
    distance: "3.2 km",
    earning: "₹650",
    customerName: "Jennifer Davis",
    isoDate: "2026-02-06T10:00:00",
  },
  {
    id: "ORD-4890",
    status: "Completed Orders",
    serviceSpeed: "economy",
    items: "4 Bedsheets • 8 Towels",
    service: "Wash & Fold",
    detergent: "Fresh scent",
    pickupTime: "2 days ago",
    deliveryTime: "Yesterday at 10:00 AM",
    address: "123 Ash Road",
    locality: "Tilak Nagar",
    distance: "2.0 km",
    earning: "₹300",
    customerName: "Chris Martin",
    isoDate: "2026-02-05T09:00:00",
  },
];

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
      return "text-[#3E8940] border-[#3E8940]/30 bg-[#3E8940]/5";
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
      return "bg-[#3E8940]";
    case "Completed Orders":
      return "bg-slate-400";
  }
};

export default function OrdersPage() {
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
              liveUpdates ? "bg-[#3E8940] animate-pulse" : "bg-slate-300",
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
                  ? "border-[#3E8940] text-[#3E8940] font-bold"
                  : "border-transparent text-slate-500 font-medium hover:text-slate-700 hover:border-slate-300",
              )}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={cn(
                    "px-2 py-0.5 text-xs rounded-full",
                    isActive
                      ? "bg-[#3E8940] text-white"
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
                  ? "bg-[#3E8940]/10 text-[#3E8940] font-bold shadow-sm"
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
                    <p className="text-sm font-semibold text-[#3E8940]">
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
                      <p className="text-2xl font-black text-[#3E8940]">
                        {order.earning}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      {order.status === "New Orders" && (
                        <Button
                          size="sm"
                          className="bg-[#3E8940] hover:bg-[#3E8940]/90 h-8 text-xs font-bold px-4"
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
                        className="flex items-center text-[#3E8940] text-xs font-bold cursor-pointer hover:underline"
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
          <span className="font-semibold text-[#3E8940]">
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
