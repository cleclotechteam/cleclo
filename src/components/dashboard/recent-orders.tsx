"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ChevronDown, Eye, RefreshCw, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  getNextDashboardStatuses,
  getSlaAlert,
  type DashboardOrder,
  type DashboardStatus,
} from "@/lib/vendor-data";
import { AlertChip, STATUS_COLORS, StatusChip } from "./stats-cards";

/* ------------------------------ shared helpers ------------------------------ */

/** Display format for pickup / due date-times, e.g. "19 Oct 2026, 2:00 PM". */
export const formatDateTime = (d: Date | string) => format(new Date(d), "dd MMM yyyy, h:mm a");
export const formatQty = (qty: number) => `${qty} ${qty === 1 ? "Unit" : "Units"}`;
const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

export interface OrderActionHandlers {
  onAccept: (id: string) => void;
  onView: (id: string) => void;
  onUpdateStatus: (id: string, status: DashboardStatus) => void;
}

export function UpdateStatusMenu({
  order,
  onUpdateStatus,
  className,
}: {
  order: DashboardOrder;
  onUpdateStatus: OrderActionHandlers["onUpdateStatus"];
  className?: string;
}) {
  const next = getNextDashboardStatuses(order.status);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={next.length === 0}
          className={cn(
            "h-8 gap-1 border-[#00B074]/30 px-2.5 text-xs font-bold text-[#00B074] hover:bg-[#00B074]/10 hover:text-[#00B074]",
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Update Status
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuLabel className="text-xs text-slate-500">Move {order.id} to</DropdownMenuLabel>
        {next.map((status) => (
          <DropdownMenuItem key={status} onSelect={() => onUpdateStatus(order.id, status)}>
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[status].fg }}
            />
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function OrderActions({ order, onAccept, onView, onUpdateStatus }: { order: DashboardOrder } & OrderActionHandlers) {
  return (
    <div className="flex items-center justify-end gap-2">
      {order.status === "Assigned" && (
        <Button
          size="sm"
          className="h-8 bg-[#00B074] px-3 text-xs font-bold hover:bg-[#00B074]/90"
          onClick={(e) => {
            e.stopPropagation();
            onAccept(order.id);
          }}
        >
          <Check className="h-3.5 w-3.5" />
          Accept
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="h-8 px-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
        onClick={(e) => {
          e.stopPropagation();
          onView(order.id);
        }}
      >
        <Eye className="h-3.5 w-3.5" />
        View
      </Button>
      {order.status !== "Assigned" && <UpdateStatusMenu order={order} onUpdateStatus={onUpdateStatus} />}
    </div>
  );
}

/* ------------------------------ order details dialog ------------------------------ */

export function OrderDetailsDialog({
  order,
  onOpenChange,
  ...handlers
}: {
  order: DashboardOrder | null;
  onOpenChange: (open: boolean) => void;
} & OrderActionHandlers) {
  const rows: [string, ReactNode][] = order
    ? [
        ["Customer", `${order.customer} (${order.customerType})`],
        ["Service", order.service],
        ["Qty", formatQty(order.qty)],
        ["Pickup Date", `${formatDateTime(order.pickupDate)} (${order.pickupSlot})`],
        ["Assigned Rider", order.rider ?? "Awaiting rider assignment"],
        ["Due Date", formatDateTime(order.isoDate)],
        ["Status", <StatusChip key="s" status={order.status} />],
        ["Alerts", <AlertChip key="a" alert={getSlaAlert(order)} />],
      ]
    : [];
  return (
    <Dialog open={!!order} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {order && (
          <>
            <DialogHeader>
              <DialogTitle>{order.id}</DialogTitle>
              <DialogDescription>Order details</DialogDescription>
            </DialogHeader>
            <dl className="divide-y divide-slate-100 rounded-xl border border-slate-100">
              {rows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="text-right font-semibold text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
            <DialogFooter className="gap-2">
              {order.status === "Assigned" ? (
                <Button
                  className="bg-[#00B074] font-bold hover:bg-[#00B074]/90"
                  onClick={() => handlers.onAccept(order.id)}
                >
                  <Check className="h-4 w-4" />
                  Accept
                </Button>
              ) : (
                <UpdateStatusMenu order={order} onUpdateStatus={handlers.onUpdateStatus} className="h-9" />
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------ Recent Orders table ------------------------------ */

const PAGE_SIZE = 6;

interface RecentOrdersProps extends OrderActionHandlers {
  orders: DashboardOrder[];
  totalCount: number;
  title: string;
  /** Quick Search & Filters bar rendered above the table. */
  filters?: ReactNode;
}

export function RecentOrders({ orders, totalCount, title, filters, ...handlers }: RecentOrdersProps) {
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const visible = orders.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);
  const emptyText = `No orders found under "${title}"`;

  const pager = (
    <div className="mt-4 flex items-center justify-between border-t pt-3">
      <p className="text-xs text-[#00B074] md:text-sm">
        Showing {visible.length} of {orders.length} orders
        {orders.length !== totalCount && ` (${totalCount} total)`}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#00B074] hover:bg-[#00B074]/10"
          disabled={current === 0}
          onClick={() => setPage(current - 1)}
        >
          <span className="sr-only">Previous page</span>
          <span className="text-lg">‹</span>
        </Button>
        <span className="text-xs text-slate-500">
          {current + 1} / {pageCount}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#00B074] hover:bg-[#00B074]/10"
          disabled={current >= pageCount - 1}
          onClick={() => setPage(current + 1)}
        >
          <span className="sr-only">Next page</span>
          <span className="text-lg">›</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full rounded-3xl border border-[var(--kraft-line)] bg-white/90 p-4 shadow-xl shadow-[var(--pine)]/5 backdrop-blur-xl md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[var(--pine)]">{title}</h2>
        <Button
          variant="ghost"
          className="rounded-xl text-xs font-bold uppercase tracking-wider text-[var(--stamp)] hover:bg-[var(--kraft)] hover:text-[var(--pine)]"
          asChild
        >
          <Link href="/dashboard/orders">View All</Link>
        </Button>
      </div>

      {filters}

      {/* ── MOBILE CARD VIEW ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {visible.length > 0 ? (
          visible.map((order) => (
            <div
              key={order.id}
              onClick={() => handlers.onView(order.id)}
              className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-slate-50"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-black">{order.id}</span>
                <StatusChip status={order.status} />
              </div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-black">{order.customer}</p>
                  <p className="text-xs text-slate-500">
                    {order.service} · {formatQty(order.qty)}
                  </p>
                </div>
                <AlertChip alert={getSlaAlert(order)} />
              </div>
              <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <span>
                  <span className="block font-semibold text-slate-700">Pickup Date</span>
                  {formatDateTime(order.pickupDate)}
                </span>
                <span>
                  <span className="block font-semibold text-slate-700">Due Date</span>
                  {formatDateTime(order.isoDate)}
                </span>
              </div>
              <OrderActions order={order} {...handlers} />
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-sm text-slate-500">{emptyText}</p>
        )}
      </div>

      {/* ── DESKTOP TABLE VIEW ── */}
      <div className="hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#fbfbfb] hover:bg-[#fbfbfb]">
              {["Order ID", "Customer", "Service", "Qty", "Pickup Date", "Due Date", "Status", "Alerts"].map(
                (h, i) => (
                  <TableHead
                    key={h}
                    className={cn("py-3 text-xs font-bold uppercase text-[#009463]", i === 0 && "pl-4")}
                  >
                    {h}
                  </TableHead>
                ),
              )}
              <TableHead className="py-3 pr-4 text-right text-xs font-bold uppercase text-[#009463]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length > 0 ? (
              visible.map((order) => (
                <TableRow
                  key={order.id}
                  className="cursor-pointer border-b transition-colors hover:bg-slate-50"
                  onClick={() => handlers.onView(order.id)}
                >
                  <TableCell className="py-3 pl-4 font-semibold text-black">{order.id}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{initials(order.customer)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-black">{order.customer}</span>
                        <span className="text-xs font-medium text-[#00B074]">{order.customerType}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 font-medium">{order.service}</TableCell>
                  <TableCell className="py-3 font-medium">{formatQty(order.qty)}</TableCell>
                  <TableCell className="py-3 text-sm">{formatDateTime(order.pickupDate)}</TableCell>
                  <TableCell className="py-3 text-sm">{formatDateTime(order.isoDate)}</TableCell>
                  <TableCell className="py-3">
                    <StatusChip status={order.status} />
                  </TableCell>
                  <TableCell className="py-3">
                    <AlertChip alert={getSlaAlert(order)} />
                  </TableCell>
                  <TableCell className="py-3 pr-4 text-right">
                    <OrderActions order={order} {...handlers} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-slate-500">
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pager}
    </div>
  );
}
