"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatINR, type DailyEarning } from "./earnings-utils";

/** Earnings Overview: vendor earnings per day, by order completion date (rule F). */
export function EarningsChart({ data }: { data: DailyEarning[] }) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const hasData = data.some((d) => d.amount > 0);

  return (
    <div className="flex h-[400px] flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Earnings Overview</h3>
          <p className="text-sm font-medium text-slate-500">Track your daily earnings over the selected period.</p>
        </div>
        <div className="flex shrink-0 rounded-lg bg-slate-100 p-1">
          {(["chart", "table"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors",
                view === v ? "bg-[#00B074] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200",
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 w-full flex-1">
        {!hasData ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No completed orders in this period.
          </div>
        ) : view === "chart" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                dy={10}
                interval="preserveStartEnd"
                minTickGap={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload as DailyEarning;
                    return (
                      <div className="rounded-lg bg-[#00B074] px-3 py-2 text-sm font-bold text-white shadow-xl">
                        {formatINR(row.amount)}
                        <div className="text-xs font-medium text-emerald-50">
                          {row.orders} {row.orders === 1 ? "order" : "orders"}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="amount" radius={[8, 8, 8, 8]} maxBarSize={32}>
                {data.map((entry) => (
                  <Cell key={entry.key} fill={entry.isToday ? "#00B074" : "#CBEFE1"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full overflow-y-auto rounded-lg border border-slate-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-semibold text-slate-600">Date</TableHead>
                  <TableHead className="font-semibold text-slate-600">Orders</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((d) => (
                  <TableRow key={d.key}>
                    <TableCell className="text-slate-700">{format(new Date(`${d.key}T12:00:00`), "EEE, d MMM yyyy")}</TableCell>
                    <TableCell className="text-slate-600">{d.orders}</TableCell>
                    <TableCell className="text-right font-semibold text-slate-900">{formatINR(d.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
