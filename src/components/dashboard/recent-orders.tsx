import { isBefore, subHours, format } from "date-fns";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, AlertTriangle, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Under Processing":
      return "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 border-none px-3 font-semibold";
    case "Assigned":
      return "bg-blue-100 text-blue-600 hover:bg-blue-200 border-none px-3 font-semibold";
    case "Ready":
      return "bg-green-100 text-green-600 hover:bg-green-200 border-none px-3 font-semibold";
    case "Pending Pickup":
      return "bg-gray-100 text-gray-600 hover:bg-gray-200 border-none px-3 font-semibold";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

interface RecentOrdersProps {
  orders: any[];
  onOrderClick?: (orderId: string) => void;
  filterStatus: string | null;
}

const STATUS_TITLE_MAP: Record<string, string> = {
  Assigned: "Newly Assigned Orders",
  "Pending Pickup": "Pending Pickups",
  "Under Processing": "Under Processing",
  Ready: "Ready for Delivery",
};

export function RecentOrders({
  orders,
  onOrderClick,
  filterStatus,
}: RecentOrdersProps) {
  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus)
    : orders;

  const currentHeaderTitle = filterStatus
    ? STATUS_TITLE_MAP[filterStatus] || `${filterStatus} Orders`
    : "Recent Orders";

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-[var(--kraft-line)] shadow-xl shadow-[var(--pine)]/5 p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-[var(--pine)]">
          {currentHeaderTitle}
        </h2>
        <Button
          variant="ghost"
          className="text-xs font-bold uppercase tracking-wider text-[var(--stamp)] hover:text-[var(--pine)] hover:bg-[var(--kraft)] rounded-xl"
          asChild
        >
          <Link href="/dashboard/orders">View All</Link>
        </Button>
      </div>

      {/* ── MOBILE CARD VIEW (hidden on md+) ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const deliveryDate = order.isoDate ? new Date(order.isoDate) : null;
            const readyDeadline = deliveryDate ? subHours(deliveryDate, 2) : null;
            const isOverdue = readyDeadline
              ? isBefore(readyDeadline, new Date())
              : false;

            return (
              <div
                key={order.id}
                onClick={() => onOrderClick?.(order.id)}
                className="border rounded-lg p-3 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                {/* Row 1: Order ID + Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {isOverdue && order.status !== "Ready" && (
                      <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                    )}
                    <span className="font-bold text-sm text-black">{order.id}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(order.status)}
                  >
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                    {order.status}
                  </Badge>
                </div>

                {/* Row 2: Customer + Items */}
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage src={order.avatar} alt={order.customer} />
                    <AvatarFallback>
                      {order.customer
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-black truncate">
                      {order.customer}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      {order.items}
                    </span>
                  </div>
                </div>

                {/* Row 3: Due date + Action */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">Due: {order.dueDate}</span>
                    {readyDeadline && (
                      <span
                        className={`text-xs ${isOverdue && order.status !== "Ready"
                            ? "text-red-500 font-medium"
                            : "text-slate-400"
                          }`}
                      >
                        {isOverdue && order.status !== "Ready"
                          ? "Overdue — "
                          : "Ready by: "}
                        {format(readyDeadline, "MMM dd, h:mm a")}
                      </span>
                    )}
                  </div>
                  {order.status === "Assigned" ? (
                    <Button
                      size="sm"
                      className="bg-[#3E8940] hover:bg-[#3E8940]/90 h-8 px-3 font-bold text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOrderClick?.(order.id);
                      }}
                    >
                      Accept
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#3E8940] hover:text-[#3E8940] hover:bg-[#3E8940]/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-slate-500 py-6 text-sm">
            No orders found under &quot;{filterStatus ? STATUS_TITLE_MAP[filterStatus] || filterStatus : "Recent Orders"}&quot;
          </p>
        )}
      </div>

      {/* ── DESKTOP TABLE VIEW (hidden on mobile) ── */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#fbfbfb] border-none bg-[#fbfbfb]">
              <TableHead className="w-[100px] text-xs font-bold uppercase text-[#4FA851] py-3 pl-4">
                Order ID
              </TableHead>
              <TableHead className="text-xs font-bold uppercase text-[#4FA851] py-3">
                Customer
              </TableHead>
              <TableHead className="text-xs font-bold uppercase text-[#4FA851] py-3">
                Items
              </TableHead>
              <TableHead className="text-xs font-bold uppercase text-[#4FA851] py-3">
                Status
              </TableHead>
              <TableHead className="text-xs font-bold uppercase text-[#4FA851] py-3">
                Due Date
              </TableHead>
              <TableHead className="text-xs font-bold uppercase text-[#4FA851] py-3">
                <div className="flex items-center gap-1">
                  Notification
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-slate-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Orders must be marked &apos;Ready&apos; 2 hours before scheduled delivery.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead className="text-right text-xs font-bold uppercase text-[#4FA851] py-3 pr-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const deliveryDate = order.isoDate
                  ? new Date(order.isoDate)
                  : null;
                const readyDeadline = deliveryDate
                  ? subHours(deliveryDate, 2)
                  : null;
                const isOverdue = readyDeadline
                  ? isBefore(readyDeadline, new Date())
                  : false;

                return (
                  <TableRow
                    key={order.id}
                    className="hover:bg-slate-50 border-b cursor-pointer transition-colors"
                    onClick={() => onOrderClick?.(order.id)}
                  >
                    <TableCell className="font-semibold text-black py-3 pl-4">
                      <div className="flex items-center gap-2">
                        {isOverdue && order.status !== "Ready" && (
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>This order is overdue for readiness.</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <span>{order.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={order.avatar}
                            alt={order.customer}
                          />
                          <AvatarFallback>
                            {order.customer
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-black">
                            {order.customer}
                          </span>
                          <span className="text-xs text-[#3E8940] font-medium">
                            {order.type}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium py-3">
                      {order.items}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className={getStatusColor(order.status)}
                      >
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium py-3">
                      <span>{order.dueDate}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      {order.isoDate && readyDeadline ? (
                        <div className="flex flex-col">
                          {isOverdue && order.status !== "Ready" ? (
                            <span className="text-red-600 font-bold text-xs flex items-center gap-1">
                              Overdue
                            </span>
                          ) : null}
                          <span
                            className={`text-xs ${isOverdue && order.status !== "Ready" ? "text-red-500 font-medium" : "text-slate-500"}`}
                          >
                            Ready by: {format(readyDeadline, "MMM dd, h:mm a")}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right py-3 pr-4">
                      {order.status === "Assigned" ? (
                        <Button
                          size="sm"
                          className="bg-[#3E8940] hover:bg-[#3E8940]/90 h-8 px-4 font-bold"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOrderClick?.(order.id);
                          }}
                        >
                          Accept
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#3E8940] hover:text-[#3E8940] hover:bg-[#3E8940]/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-slate-500"
                >
                  No orders found under &quot;{filterStatus ? STATUS_TITLE_MAP[filterStatus] || filterStatus : "Recent Orders"}&quot;
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <p className="text-sm text-[#3E8940]">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#3E8940] hover:bg-[#3E8940]/10"
            >
              <span className="sr-only">Previous page</span>
              <span className="text-lg">‹</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#3E8940] hover:bg-[#3E8940]/10"
            >
              <span className="sr-only">Next page</span>
              <span className="text-lg">›</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile pagination */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t md:hidden">
        <p className="text-xs text-[#3E8940]">
          {filteredOrders.length} of {orders.length} orders
        </p>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#3E8940] hover:bg-[#3E8940]/10"
          >
            <span className="sr-only">Previous page</span>
            <span className="text-base">‹</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#3E8940] hover:bg-[#3E8940]/10"
          >
            <span className="sr-only">Next page</span>
            <span className="text-base">›</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
