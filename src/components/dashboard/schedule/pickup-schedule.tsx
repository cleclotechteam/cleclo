"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Package,
  Truck,
  CheckCircle2,
  Timer,
  ArrowRight,
  Phone,
  Filter,
  ChevronLeft,
  ChevronRight,
  Star,
  Info,
  Download,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format,
  isSameDay,
  subDays,
  isWithinInterval,
  differenceInDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// ... existing code ...

const SCHEDULE_DATA = [
  {
    id: "PU-001",
    orderId: "#284-9321",
    customer: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    address: "452 Maple Ave, Apt 4B",
    city: "San Francisco, CA 94110",
    date: "Feb 07, 2026",
    isoDate: "2026-02-07T10:00:00",
    items: 5,
    status: "pickup_scheduled",
    type: "pickup",
    rating: 4.8,
    note: "Coffee stain on front",
    deliveryType: "Standard",
    driver: "John Doe",
    orderItems: [
      {
        name: "White Shirt",
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=800&auto=format&fit=crop&q=60",
      },
      {
        name: "Black Trousers",
        quantity: 3,
        image:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "PU-002",
    orderId: "#284-9318",
    customer: "Michael Chen",
    phone: "+1 (555) 234-5678",
    address: "789 Oak Street, Suite 12",
    city: "San Francisco, CA 94102",
    date: "Feb 07, 2026",
    isoDate: "2026-02-07T14:30:00",
    items: 3,
    status: "in_workshop",
    type: "pickup",
    rating: 4.9,
    note: "Oil stain on white shirt collar",
    deliveryType: "Express 24h",
    driver: "Mike Smith",
    orderItems: [
      {
        name: "White Shirt",
        quantity: 3,
        image:
          "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=800&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "DL-001",
    orderId: "#284-9310",
    customer: "Emily Davis",
    phone: "+1 (555) 345-6789",
    address: "156 Pine Road",
    city: "San Francisco, CA 94108",
    date: "Feb 06, 2026",
    isoDate: "2026-02-06T09:00:00",
    items: 8,
    status: "ready_for_delivery",
    type: "delivery",
    rating: 4.7,
    deliveryType: "Standard",
  },
  {
    id: "PU-003",
    orderId: "#284-9325",
    customer: "James Wilson",
    phone: "+1 (555) 456-7890",
    address: "321 Cedar Lane, Unit 5",
    city: "San Francisco, CA 94114",
    date: "Feb 08, 2026",
    isoDate: "2026-02-08T11:00:00",
    items: 4,
    status: "picked_up",
    type: "pickup",
    rating: 5.0,
    note: "Delicate silk items",
    deliveryType: "Express 48h",
    driver: "Sarah Wilson",
    orderItems: [
      {
        name: "Silk Blouse",
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=60",
      },
      {
        name: "Silk Scarf",
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=800&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "DL-002",
    orderId: "#284-9305",
    customer: "Lisa Anderson",
    phone: "+1 (555) 567-8901",
    address: "888 Birch Boulevard",
    city: "San Francisco, CA 94117",
    date: "Feb 07, 2026",
    isoDate: "2026-02-07T16:00:00",
    items: 6,
    status: "ready_for_delivery",
    type: "delivery",
    rating: 4.6,
    deliveryType: "Express 24h",
  },
  {
    id: "DL-003",
    orderId: "#284-9308",
    customer: "Robert Taylor",
    phone: "+1 (555) 678-9012",
    address: "456 Pine St",
    city: "San Francisco, CA 94109",
    date: "Feb 06, 2026",
    isoDate: "2026-02-06T15:00:00",
    items: 3,
    status: "completed",
    type: "delivery",
    rating: 4.8,
    deliveryType: "Express 48h",
  },
  {
    id: "PU-005",
    orderId: "#284-9330",
    customer: "Michael Brown",
    rating: 4.7,
    phone: "+1 (555) 456-7890",
    address: "220 Elm St, Apt 5C",
    city: "San Francisco, CA 94103",
    date: "Feb 07, 2026",
    isoDate: "2026-02-07T09:30:00",
    items: 2,
    status: "not_scheduled",
    type: "pickup",
    note: "Color bleed risk on red dress",
    deliveryType: "Standard",
    orderItems: [
      {
        name: "Red Dress",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=60",
      },
      {
        name: "Cotton T-Shirt",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "PU-006",
    orderId: "#284-9335",
    customer: "David Lee",
    rating: 4.5,
    phone: "+1 (555) 987-6543",
    address: "789 Pine St",
    city: "San Francisco, CA 94108",
    date: "Feb 08, 2026",
    isoDate: "2026-02-08T13:00:00",
    items: 7,
    status: "not_scheduled",
    type: "pickup",
    note: "Grass stains on knees",
    deliveryType: "Express 24h",
    orderItems: [
      {
        name: "Blue Jeans",
        quantity: 4,
        image:
          "https://images.unsplash.com/photo-1604176354204-9268737828fa?w=800&auto=format&fit=crop&q=60",
      },
      {
        name: "Kids T-Shirt",
        quantity: 3,
        image:
          "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=800&auto=format&fit=crop&q=60",
      },
    ],
  },
];

const getStatusConfig = (status: string, type: string) => {
  switch (status) {
    case "not_scheduled":
      return {
        label: "Not Scheduled",
        className: "bg-gray-100 text-gray-700 border-gray-200",
        icon: Clock,
      };
    case "pickup_scheduled":
      return {
        label: "Pickup Scheduled",
        className: "bg-blue-100 text-blue-700 border-blue-200",
        icon: Timer,
      };
    case "picked_up":
      return {
        label: "Picked Up",
        className: "bg-indigo-100 text-indigo-700 border-indigo-200",
        icon: Truck,
      };
    case "in_workshop":
      return {
        label: "In Workshop",
        className: "bg-orange-100 text-orange-700 border-orange-200",
        icon: Package,
      };
    case "ready_for_delivery":
      return {
        label: "Ready for Delivery",
        className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: CheckCircle2,
      };
    case "completed":
      return {
        label: "Completed",
        className: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle2,
      };
    default:
      return {
        label: "Unknown",
        className: "bg-gray-100 text-gray-700 border-gray-200",
        icon: Clock,
      };
  }
};

const getTypeConfig = (type: string) => {
  switch (type) {
    case "pickup":
      return {
        label: "Pickup",
        className: "bg-purple-50 text-purple-700",
      };
    case "delivery":
      return {
        label: "Delivery",
        className: "bg-emerald-50 text-emerald-700",
      };
    default:
      return {
        label: type,
        className: "bg-gray-50 text-gray-700",
      };
  }
};

const getDeliveryBadgeColor = (type?: string) => {
  switch (type) {
    case "Express 24h":
      return "bg-red-100 text-red-700 border-red-200";
    case "Express 48h":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-blue-50 text-blue-700 border-blue-200";
  }
};

export function PickupSchedule() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pickups" | "completed" | "express" | "deliveries"
  >("all");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [verifiedItems, setVerifiedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const filteredSchedule = SCHEDULE_DATA.filter((s) => {
    if (s.isoDate && date?.from) {
      const orderDate = new Date(s.isoDate);
      return isWithinInterval(orderDate, {
        start: date.from,
        end: date.to || date.from,
      });
    }
    return false;
  });

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export delay
    setTimeout(() => {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "ID,Order ID,Customer,Phone,Address,City,Date,Items,Status,Type,Rating,Delivery Type,Driver,Note\n" +
        filteredSchedule
          .map(
            (e) =>
              `${e.id},${e.orderId},"${e.customer}",${e.phone},"${e.address}","${e.city}",${e.date},${e.items},${e.status},${e.type},${e.rating},${e.deliveryType},"${e.driver || ""}",${e.note || ""}`,
          )
          .join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      const rangeStr = date?.from
        ? `${format(date.from, "yyyy-MM-dd")}_to_${date.to ? format(date.to, "yyyy-MM-dd") : format(date.from, "yyyy-MM-dd")}`
        : "all_time";
      link.setAttribute("download", `pickup_schedule_${rangeStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
    }, 1000);
  };

  const handleOpenVerification = (order: any) => {
    setSelectedOrder(order);
    setVerifiedItems({});
    setIsVerificationOpen(true);
  };

  const handleVerifyItem = (itemName: string) => {
    setVerifiedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const handleConfirmVerification = () => {
    setIsVerificationOpen(false);
    // Here you would typically make an API call to update the status
    console.log("Verified items:", verifiedItems);
  };

  const todayPickups = filteredSchedule.filter(
    (s) => s.type === "pickup",
  ).length;
  const completed = filteredSchedule.filter(
    (s) => s.status === "completed",
  ).length;
  const expressOrders = filteredSchedule.filter(
    (s) => s.deliveryType && s.deliveryType.toLowerCase().includes("express"),
  ).length;
  const deliveriesToday = filteredSchedule.filter(
    (s) => s.type === "delivery",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl text-black font-bold tracking-tight">
            Pickup & Delivery Schedule
          </h1>
          <p className="text-primary mt-1">
            Monitor and manage pickup assignments, delivery routing and service
            timelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 text-black w-fit hover:text-black bg-white h-10 border-slate-200 hover:bg-slate-50"
            onClick={handleExport}
            disabled={!date?.from || isExporting}
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span className="font-medium inline">
              {isExporting ? "Exporting..." : "Export Order Data"}
            </span>
          </Button>
        </div>
      </div>

      {/* Data Period Label */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal w-full sm:w-[300px] h-10 md:h-12 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-slate-500" />
              <span className="flex-1">
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
              </span>
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
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
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className={cn(
            "bg-white p-4 rounded-xl border shadow-sm cursor-pointer transition-all hover:border-purple-200 hover:shadow-md",
            activeFilter === "pickups"
              ? "border-purple-500 ring-1 ring-purple-500 bg-purple-50/50"
              : "border-slate-100",
          )}
          onClick={() =>
            setActiveFilter(activeFilter === "pickups" ? "all" : "pickups")
          }
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Truck className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {todayPickups}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Scheduled Pickups
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "bg-white p-4 rounded-xl border shadow-sm cursor-pointer transition-all hover:border-blue-200 hover:shadow-md",
            activeFilter === "deliveries"
              ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/50"
              : "border-slate-100",
          )}
          onClick={() =>
            setActiveFilter(
              activeFilter === "deliveries" ? "all" : "deliveries",
            )
          }
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {deliveriesToday}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Scheduled Deliveries
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "bg-white p-4 rounded-xl border shadow-sm cursor-pointer transition-all hover:border-orange-200 hover:shadow-md",
            activeFilter === "express"
              ? "border-orange-500 ring-1 ring-orange-500 bg-orange-50/50"
              : "border-slate-100",
          )}
          onClick={() =>
            setActiveFilter(activeFilter === "express" ? "all" : "express")
          }
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Timer className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {expressOrders}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Express Priority Orders
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "bg-white p-4 rounded-xl border shadow-sm cursor-pointer transition-all hover:border-green-200 hover:shadow-md",
            activeFilter === "completed"
              ? "border-green-500 ring-1 ring-green-500 bg-green-50/50"
              : "border-slate-100",
          )}
          onClick={() =>
            setActiveFilter(activeFilter === "completed" ? "all" : "completed")
          }
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{completed}</p>
              <p className="text-xs text-slate-500 font-medium">
                Completed Today
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Today's Schedule</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid md:grid-cols-14 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider rounded-t-xl">
          <div className="col-span-2">Pickup Date</div>
          <div className="col-span-1">Customer Rating</div>
          <div className="col-span-2">Assigned Agent</div>
          <div className="col-span-2">Special Instructions</div>
          <div className="col-span-2">Service Type</div>
          <div className="col-span-1 text-center">Item Count</div>
          <div className="col-span-2 text-center">Pickup Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
          {filteredSchedule
            .filter((s) => {
              // Apply active filter
              if (activeFilter === "pickups") {
                return s.type === "pickup";
              }
              if (activeFilter === "completed") {
                return s.status === "completed";
              }
              if (activeFilter === "express") {
                return (
                  s.deliveryType &&
                  s.deliveryType.toLowerCase().includes("express")
                );
              }
              if (activeFilter === "deliveries") {
                return s.type === "delivery";
              }
              return true;
            })
            .filter(
              (s) =>
                s.status === "pickup_scheduled" ||
                s.status === "picked_up" ||
                s.status === "in_workshop" ||
                s.status === "ready_for_delivery" ||
                s.status === "completed" ||
                s.status === "not_scheduled",
            )
            .sort((a, b) => {
              const getStatusWeight = (status: string) => {
                if (status === "not_scheduled") return 0;
                if (status === "pickup_scheduled") return 1;
                if (status === "picked_up") return 2;
                if (status === "in_workshop") return 3;
                if (status === "ready_for_delivery") return 4;
                if (status === "completed") return 5;
                return 6;
              };
              return getStatusWeight(a.status) - getStatusWeight(b.status);
            })
            .map((schedule, index) => {
              const statusConfig = getStatusConfig(
                schedule.status,
                schedule.type,
              );
              const typeConfig = getTypeConfig(schedule.type);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={schedule.id}
                  className={cn(
                    "group px-6 py-4 hover:bg-slate-50/80 transition-all cursor-pointer",
                    schedule.status === "completed" && "opacity-60",
                  )}
                >
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-14 gap-4 items-center">
                    {/* Date */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                            schedule.type === "pickup"
                              ? "bg-purple-50"
                              : "bg-emerald-50",
                          )}
                        >
                          {schedule.type === "pickup" ? (
                            <Truck className="h-5 w-5 text-purple-600" />
                          ) : (
                            <Package className="h-5 w-5 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm whitespace-nowrap">
                            {schedule.date}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customer */}
                    <div className="col-span-1">
                      <div className="flex items-center gap-1.5 text-amber-500 text-sm mt-0.5">
                        <span className="font-bold">{schedule.rating}</span>
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      </div>
                      <div className="flex flex-col mt-0.5">
                        <span className="text-xs text-slate-400 font-medium">
                          {schedule.orderId}
                        </span>
                        <span className="text-[9px] text-slate-400/70 leading-tight">
                          Customer rating based on past orders
                        </span>
                      </div>
                    </div>

                    {/* Driver */}
                    <div className="col-span-2">
                      {schedule.driver ? (
                        <p className="font-medium text-slate-900 text-sm">
                          {schedule.driver}
                        </p>
                      ) : (
                        <p className="font-medium text-red-500 text-sm italic">
                          Not Assigned
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="col-span-2 relative group">
                      <p className="text-sm text-slate-600 italic truncate cursor-help">
                        {schedule.note || "-"}
                      </p>
                      {schedule.note && (
                        <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                          <p className="font-medium mb-1">Note:</p>
                          {schedule.note}
                          {/* Arrow */}
                          <div className="absolute top-full left-4 -mt-px border-4 border-transparent border-t-slate-900"></div>
                        </div>
                      )}
                    </div>

                    {/* Speed */}
                    <div className="col-span-2">
                      <Badge
                        className={cn(
                          "border px-2.5 py-0.5 whitespace-nowrap",
                          getDeliveryBadgeColor(schedule.deliveryType),
                        )}
                      >
                        {schedule.deliveryType === "Express 24h" ? (
                          <>
                            Express 24H <span className="ml-1">⚡⚡</span>
                          </>
                        ) : schedule.deliveryType === "Express 48h" ? (
                          <>
                            Express 48H <span className="ml-1">⚡</span>
                          </>
                        ) : (
                          "Standard"
                        )}
                      </Badge>
                    </div>

                    {/* Items */}
                    <div className="col-span-1 text-center">
                      <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                        {schedule.items}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex justify-center">
                      <Badge
                        className={cn(
                          "gap-1 px-2.5 py-1 text-[11px] font-semibold border whitespace-nowrap",
                          statusConfig.className,
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        className="h-8 px-4 bg-[#3E8940] hover:bg-[#3E8940]/90 text-xs font-semibold"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/schedule/${schedule.id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center",
                            schedule.type === "pickup"
                              ? "bg-purple-50"
                              : "bg-emerald-50",
                          )}
                        >
                          {schedule.type === "pickup" ? (
                            <Truck className="h-5 w-5 text-purple-600" />
                          ) : (
                            <Package className="h-5 w-5 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {schedule.date}
                          </p>
                          <Badge
                            className={cn(
                              "mt-1 border-0 px-2 py-0 text-[10px] uppercase font-bold",
                              typeConfig.className,
                            )}
                          >
                            {typeConfig.label}
                          </Badge>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          "gap-1 px-2 py-1 text-[10px] font-semibold border",
                          statusConfig.className,
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <div className="pl-13">
                      <div className="flex items-center gap-1.5 text-amber-500 text-sm mt-0.5">
                        <span className="text-slate-500 text-xs">Rating:</span>
                        <span className="font-bold">{schedule.rating}</span>
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 font-medium">
                        {schedule.orderId}
                      </div>
                      {/* Item Count */}
                      <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                        <Package className="h-3.5 w-3.5" />
                        <span>{schedule.items} items</span>
                      </div>
                      {/* Assigned Agent */}
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                        <span className="text-slate-400 font-medium">Agent:</span>
                        {schedule.driver ? (
                          <span className="font-semibold text-slate-700">{schedule.driver}</span>
                        ) : (
                          <span className="font-semibold text-red-500 italic">Not Assigned</span>
                        )}
                      </div>
                      {/* Service Type */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-xs text-slate-400 font-medium">Service:</span>
                        <Badge
                          className={cn(
                            "border px-2 py-0 text-[10px] font-semibold",
                            getDeliveryBadgeColor(schedule.deliveryType),
                          )}
                        >
                          {schedule.deliveryType === "Express 24h" ? (
                            <>Express 24H <span className="ml-1">⚡⚡</span></>
                          ) : schedule.deliveryType === "Express 48h" ? (
                            <>Express 48H <span className="ml-1">⚡</span></>
                          ) : (
                            "Standard"
                          )}
                        </Badge>
                      </div>
                      {/* Special Instructions */}
                      {schedule.note && (
                        <div className="flex items-start gap-1.5 mt-1.5 text-xs">
                          <span className="text-slate-400 font-medium shrink-0">Note:</span>
                          <span className="text-slate-600 italic">{schedule.note}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="h-8 px-4 bg-[#3E8940] hover:bg-[#3E8940]/90 gap-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/schedule/${schedule.id}`);
                        }}
                      >
                        View
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verify Items</DialogTitle>
            <DialogDescription>
              Please verify the items for {selectedOrder?.orderId}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 py-4">
            {selectedOrder?.orderItems
              ?.flatMap((item: any) =>
                Array.from({ length: item.quantity }).map((_, i) => ({
                  ...item,
                  uniqueId: `${item.name}-${i}`,
                })),
              )
              .map((item: any, index: number) => (
                <div
                  key={index}
                  className={cn(
                    "relative flex flex-col items-center border rounded-lg p-2 cursor-pointer transition-all",
                    verifiedItems[item.uniqueId]
                      ? "border-green-500 bg-green-50"
                      : "border-slate-200 hover:border-slate-300",
                  )}
                  onClick={() => handleVerifyItem(item.uniqueId)}
                >
                  {item.image && (
                    <div className="h-20 w-20 rounded-md overflow-hidden mb-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <p className="font-medium text-xs text-slate-900 text-center truncate w-full">
                    {item.name}
                  </p>
                  {verifiedItems[item.uniqueId] && (
                    <div className="absolute top-1 right-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
            {(!selectedOrder?.orderItems ||
              selectedOrder.orderItems.length === 0) && (
                <p className="text-sm text-slate-500 italic text-center py-4 col-span-3">
                  No items to verify.
                </p>
              )}
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-[#3E8940] hover:bg-[#3E8940]/90"
              onClick={handleConfirmVerification}
            >
              Verify &{" "}
              {selectedOrder?.status === "in_progress" ? "Complete" : "Start"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
