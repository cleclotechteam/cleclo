"use client";

import { AlertTriangle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatINR,
  itemPayout,
  orderItemsPayout,
  orderTotalQty,
  payoutMatches,
  type Order,
} from "@/lib/vendor-data";

/**
 * Item-wise vendor payout breakdown: Vendor Payout = Item Quantity x Fixed Vendor Rate.
 * Rates are read-only (Cleclo fixed vendor payout catalog) and the item-wise total is
 * checked against the order's total payout.
 */
export function OrderItemsTable({
  order,
  className,
  highlightItemIds = [],
}: {
  order: Order;
  className?: string;
  highlightItemIds?: string[];
}) {
  const total = orderItemsPayout(order);
  const matches = payoutMatches(order);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500">
              <th className="py-3 pr-4 text-left font-semibold">Garment / Service</th>
              <th className="py-3 px-4 text-center font-semibold">Qty</th>
              <th className="py-3 px-4 text-right font-semibold">Rate</th>
              <th className="py-3 pl-4 text-right font-semibold">Payout</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <tr
                key={item.id}
                className={cn(highlightItemIds.includes(item.id) && "bg-amber-50/60")}
              >
                <td className="py-3 pr-4">
                  <p className="font-semibold text-slate-900">{item.garment}</p>
                  <p className="text-xs text-slate-500">{item.service}</p>
                </td>
                <td className="py-3 px-4 text-center font-medium text-slate-800">{item.qty}</td>
                <td className="py-3 px-4 text-right text-slate-700">
                  <span className="inline-flex items-center gap-1">
                    <Lock className="h-3 w-3 text-slate-300" aria-label="Fixed rate" />
                    {formatINR(item.rate, 0)}
                  </span>
                </td>
                <td className="py-3 pl-4 text-right font-semibold text-slate-900">
                  {formatINR(itemPayout(item), 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        <div>
          <p className="text-base font-bold text-slate-900">Total Vendor Payout</p>
          <p className="text-xs text-slate-500">
            {orderTotalQty(order)} Units • Fixed vendor rates (read-only)
          </p>
        </div>
        <p className="text-2xl font-bold text-[#00B074]">{formatINR(order.totalPayout)}</p>
      </div>

      {!matches && (
        <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Item-wise total ({formatINR(total)}) does not match the order payout. Raise this with
          Cleclo before proceeding.
        </div>
      )}
    </div>
  );
}
