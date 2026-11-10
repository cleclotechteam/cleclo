"use client";

import { useState } from "react";
import { Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { LedgerEntry, LedgerEntryType } from "@/lib/vendor-data";
import { cn } from "@/lib/utils";
import { DateRangeFilter } from "./date-range-filter";
import { StatusBadge } from "./status-badge";
import { TransactionDetailsDialog } from "./transaction-details-dialog";
import {
  downloadCsv,
  formatDateTime,
  formatINR,
  formatSigned,
  inRange,
  type DateRangeValue,
} from "./earnings-utils";

type TypeFilter = "all" | LedgerEntryType;

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All Transactions" },
  { value: "Order Earning", label: "Earnings" },
  { value: "Settlement", label: "Settlements" },
  { value: "Adjustment", label: "Adjustments" },
];

const PAGE_SIZE = 10;

interface TransactionHistoryProps {
  /** Full ledger; filtered here by type and by date (rule F: each entry's own ledger date). */
  ledger: LedgerEntry[];
  range: DateRangeValue;
  onRangeChange: (range: DateRangeValue) => void;
}

/** Financial ledger: every order earning, settlement and adjustment is its own entry. */
export function TransactionHistory({ ledger, range, onRangeChange }: TransactionHistoryProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<LedgerEntry | null>(null);

  const rows = ledger.filter(
    (e) => (typeFilter === "all" || e.type === typeFilter) && inRange(e.transactionDate, range),
  );
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const visible = rows.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);

  const handleExport = () => {
    downloadCsv(`transaction_history_${format(range.from, "yyyy-MM-dd")}_to_${format(range.to, "yyyy-MM-dd")}.csv`, [
      ["Transaction Date", "Reference ID", "Transaction Type", "Order Value", "Credit/Debit", "Status"],
      ...rows.map((e) => [
        formatDateTime(e.transactionDate),
        e.referenceId,
        e.type,
        e.orderValue === null ? "" : e.orderValue.toFixed(2),
        e.amount.toFixed(2),
        e.status,
      ]),
    ]);
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Transaction History</h2>
          <p className="text-sm text-slate-500">Real-time update of your earnings and payouts</p>
        </div>
        <Button variant="outline" className="gap-2 text-slate-600" onClick={handleExport} disabled={rows.length === 0}>
          <Download className="h-4 w-4" />
          Download Statement
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setTypeFilter(f.value);
                setPage(0);
              }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                typeFilter === f.value
                  ? "border-[#00B074] bg-[#00B074] text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <DateRangeFilter
          value={range}
          onChange={(r) => {
            onRangeChange(r);
            setPage(0);
          }}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="font-semibold text-slate-600">Transaction Date</TableHead>
              <TableHead className="font-semibold text-slate-600">Reference ID</TableHead>
              <TableHead className="font-semibold text-slate-600">Transaction Type</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Order Value</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Credit/Debit</TableHead>
              <TableHead className="font-semibold text-slate-600">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-slate-500">
                  No transactions in this period.
                </TableCell>
              </TableRow>
            )}
            {visible.map((e) => (
              <TableRow key={e.id} className="hover:bg-slate-50">
                <TableCell className="whitespace-nowrap text-slate-600">{formatDateTime(e.transactionDate)}</TableCell>
                <TableCell className="whitespace-nowrap font-medium text-slate-900">
                  {e.referenceId}
                  {e.relatedOrderRef && (
                    <span className="block text-xs font-normal text-slate-500">for {e.relatedOrderRef}</span>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap text-slate-600">{e.type}</TableCell>
                <TableCell className="whitespace-nowrap text-right text-slate-600">
                  {e.orderValue === null ? "—" : formatINR(e.orderValue)}
                </TableCell>
                <TableCell
                  className={cn(
                    "whitespace-nowrap text-right font-bold",
                    e.amount < 0 ? "text-red-600" : "text-[#00B074]",
                  )}
                >
                  {formatSigned(e.amount)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={e.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-[#00B074] hover:bg-emerald-50 hover:text-[#00B074]"
                    onClick={() => setSelected(e)}
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {rows.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>
            Showing {current * PAGE_SIZE + 1}–{Math.min((current + 1) * PAGE_SIZE, rows.length)} of {rows.length}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={current === 0} onClick={() => setPage(current - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={current >= pageCount - 1}
              onClick={() => setPage(current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <TransactionDetailsDialog entry={selected} ledger={ledger} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}
