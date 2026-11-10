"use client";

import { Wallet, TrendingUp, TrendingDown, Hourglass, Calendar, CircleCheck } from "lucide-react";
import { endOfWeek, format, startOfWeek, subWeeks } from "date-fns";
import type { LedgerEntry, UpcomingSettlement } from "@/lib/vendor-data";
import { formatINR, inRange, type DateRangeValue } from "./earnings-utils";

interface EarningsStatsProps {
  entries: LedgerEntry[];
  upcoming: UpcomingSettlement;
  range: DateRangeValue;
}

export function EarningsStats({ entries, upcoming, range }: EarningsStatsProps) {
  const unsettled = entries.filter((e) => e.type !== "Settlement");
  // Rule C: cleared but unpaid.
  const available = unsettled.filter((e) => e.status === "Cleared").reduce((n, e) => n + e.amount, 0);
  // Rule B: not yet cleared.
  const pending = unsettled.filter((e) => e.status === "Pending");
  const pendingAmount = pending.reduce((n, e) => n + e.amount, 0);
  const pendingOrders = pending.filter((e) => e.type === "Order Earning").length;

  // Rule F: weekly earnings by completion date.
  const now = new Date();
  const weekTotal = (from: Date, to: Date) =>
    entries
      .filter((e) => e.type === "Order Earning")
      .filter((e) => {
        const d = new Date(e.transactionDate);
        return d >= from && d <= to;
      })
      .reduce((n, e) => n + e.amount, 0);
  const thisWeek = weekTotal(startOfWeek(now, { weekStartsOn: 1 }), now);
  const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const lastWeek = weekTotal(lastWeekStart, endOfWeek(lastWeekStart, { weekStartsOn: 1 }));
  const change = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : null;

  // Rule D + F: payouts by settlement date, within the selected period.
  const paidOut = entries
    .filter((e) => e.type === "Settlement" && inRange(e.transactionDate, range))
    .reduce((n, e) => n + Math.abs(e.amount), 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Available for Payout */}
      <div className="relative overflow-hidden rounded-xl bg-[#00B074] p-6 text-white shadow-lg shadow-emerald-900/10 transition-all hover:shadow-xl hover:shadow-emerald-900/20">
        <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 flex h-full flex-col justify-between space-y-4">
          <div className="mb-1 flex items-center gap-2 text-emerald-100">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium uppercase tracking-wide">Available for Payout</span>
          </div>
          <div>
            <div className="mb-2 text-3xl font-bold tracking-tight">{formatINR(available)}</div>
            {upcoming.scheduled && upcoming.settlementDate && (
              <div className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                <Calendar className="h-3 w-3" />
                <span>Next settlement: {format(new Date(upcoming.settlementDate), "MMM d")}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Earnings This Week */}
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">Earnings This Week</span>
          {change !== null && (
            <div
              className={
                change >= 0
                  ? "flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600"
                  : "flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-bold text-red-600"
              }
            >
              {change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>
                {change >= 0 ? "+" : ""}
                {change}%
              </span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-slate-900">{formatINR(thisWeek)}</div>
          <div className="text-sm font-medium text-slate-500">
            Compared to last week <span className="text-slate-400">({formatINR(lastWeek)})</span>
          </div>
        </div>
      </div>

      {/* Pending Clearance */}
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pending Clearance</span>
          <Hourglass className="h-4 w-4 text-orange-400" />
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-slate-900">{formatINR(pendingAmount)}</div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            <span>
              {pendingOrders} {pendingOrders === 1 ? "order" : "orders"} pending delivery
            </span>
          </div>
        </div>
      </div>

      {/* Total Paid Out */}
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">Total Paid Out</span>
          <CircleCheck className="h-4 w-4 text-[#00B074]" />
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-slate-900">{formatINR(paidOut)}</div>
          <div className="text-sm font-medium text-slate-500">Settled during selected period</div>
        </div>
      </div>
    </div>
  );
}
