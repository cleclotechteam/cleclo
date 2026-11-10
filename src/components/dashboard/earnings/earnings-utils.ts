import {
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfDay,
  format,
  isWithinInterval,
  startOfDay,
  subDays,
} from "date-fns";
import type { LedgerEntry } from "@/lib/vendor-data";

export type RangePreset = "today" | "7d" | "30d" | "custom";

export interface DateRangeValue {
  preset: RangePreset;
  from: Date;
  to: Date;
}

export const RANGE_PRESETS: { value: RangePreset; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "custom", label: "Custom Range" },
];

export function presetRange(preset: Exclude<RangePreset, "custom">, now = new Date()): DateRangeValue {
  const to = endOfDay(now);
  const days = preset === "today" ? 0 : preset === "7d" ? 6 : 29;
  return { preset, from: startOfDay(subDays(now, days)), to };
}

export const inRange = (isoDate: string, range: DateRangeValue) =>
  isWithinInterval(new Date(isoDate), { start: startOfDay(range.from), end: endOfDay(range.to) });

export function rangeLabel(range: DateRangeValue) {
  const preset = RANGE_PRESETS.find((p) => p.value === range.preset);
  if (range.preset !== "custom" && preset) return preset.label;
  if (differenceInCalendarDays(range.to, range.from) === 0) return format(range.from, "d MMM yyyy");
  return `${format(range.from, "d MMM")} – ${format(range.to, "d MMM yyyy")}`;
}

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

/** ₹1,240.50 */
export const formatINR = (n: number) => inr.format(n);
/** + ₹450.00 / − ₹90.00 */
export const formatSigned = (n: number) => `${n < 0 ? "−" : "+"} ${inr.format(Math.abs(n))}`;
/** 19 Oct 2026, 2:00 PM */
export const formatDateTime = (isoDate: string) => format(new Date(isoDate), "d MMM yyyy, h:mm a");
/** 24 Oct 2026 */
export const formatDate = (isoDate: string) => format(new Date(isoDate), "d MMM yyyy");

export interface DailyEarning {
  key: string;
  label: string;
  amount: number;
  orders: number;
  isToday: boolean;
}

/** Rule F: earnings are grouped by order completion date (Order Earning entries only). */
export function dailyEarnings(entries: LedgerEntry[], range: DateRangeValue): DailyEarning[] {
  const days = eachDayOfInterval({ start: startOfDay(range.from), end: startOfDay(range.to) });
  const short = days.length <= 7;
  const today = format(new Date(), "yyyy-MM-dd");
  const map = new Map(
    days.map((d) => {
      const key = format(d, "yyyy-MM-dd");
      return [
        key,
        { key, label: format(d, short ? "EEE" : "d MMM"), amount: 0, orders: 0, isToday: key === today },
      ];
    }),
  );
  for (const e of entries) {
    if (e.type !== "Order Earning") continue;
    const row = map.get(e.transactionDate.slice(0, 10));
    if (row) {
      row.amount += e.amount;
      row.orders += 1;
    }
  }
  return [...map.values()];
}

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
