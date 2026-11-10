"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CLEAN_SERVICES, linePayout, type CleanService, type LedgerEntry } from "@/lib/vendor-data";
import { formatINR } from "./earnings-utils";

const SERVICE_COLORS: Record<CleanService, string> = {
  "Dry Cleaning": "#00B074",
  Washing: "#3B82F6",
  "Steam Ironing": "#F59E0B",
};

/**
 * Earnings by Service: each service's share is calculated from vendor payout line items
 * (quantity x vendor rate, rule A) of orders completed in the selected period — never customer prices.
 */
export function EarningsByServiceChart({ entries }: { entries: LedgerEntry[] }) {
  const totals = new Map<CleanService, number>(CLEAN_SERVICES.map((s) => [s, 0]));
  for (const e of entries) {
    if (e.type !== "Order Earning" || !e.items) continue;
    for (const line of e.items) totals.set(line.service, (totals.get(line.service) ?? 0) + linePayout(line));
  }
  const data = CLEAN_SERVICES.map((service) => ({ service, amount: totals.get(service) ?? 0 }));
  const total = data.reduce((n, d) => n + d.amount, 0);

  return (
    <div className="flex h-[400px] flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">Earnings by Service</h3>
        <p className="text-sm font-medium text-slate-500">Breakdown of earnings across your active services.</p>
      </div>

      {total === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
          No completed orders in this period.
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center gap-4 sm:flex-row">
          <div className="relative h-full min-h-[180px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.filter((d) => d.amount > 0)}
                  dataKey="amount"
                  nameKey="service"
                  innerRadius="58%"
                  outerRadius="90%"
                  paddingAngle={2}
                  stroke="#fff"
                  strokeWidth={2}
                  startAngle={90}
                  endAngle={-270}
                >
                  {data
                    .filter((d) => d.amount > 0)
                    .map((d) => (
                      <Cell key={d.service} fill={SERVICE_COLORS[d.service]} />
                    ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const row = payload[0].payload as (typeof data)[number];
                      return (
                        <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm font-bold text-white shadow-xl">
                          {row.service}: {formatINR(row.amount)}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-medium text-slate-500">Total</span>
              <span className="text-base font-bold text-slate-900">{formatINR(total)}</span>
            </div>
          </div>

          <ul className="w-full space-y-3 sm:w-48">
            {data.map((d) => (
              <li key={d.service} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SERVICE_COLORS[d.service] }} />
                  {d.service}
                </span>
                <span className="text-right">
                  <span className="block font-semibold text-slate-900">{formatINR(d.amount)}</span>
                  <span className="block text-xs text-slate-500">{Math.round((d.amount / total) * 100)}%</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
