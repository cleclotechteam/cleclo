"use client";

import { useState } from "react";
import { Download, History, Landmark } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LedgerEntry, UpcomingSettlement } from "@/lib/vendor-data";
import { StatusBadge } from "./status-badge";
import { TransactionDetailsDialog } from "./transaction-details-dialog";
import {
  downloadCsv,
  formatDate,
  formatDateTime,
  formatINR,
  inRange,
  rangeLabel,
  type DateRangeValue,
} from "./earnings-utils";

interface PayoutSettlementProps {
  ledger: LedgerEntry[];
  upcoming: UpcomingSettlement;
  range: DateRangeValue;
}

/** Payouts are dated by settlement date (rule F); each settlement is a Paid ledger entry (rule D). */
export function PayoutSettlement({ ledger, upcoming, range }: PayoutSettlementProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selected, setSelected] = useState<LedgerEntry | null>(null);

  const settlements = ledger.filter((e) => e.type === "Settlement");
  const lastSettlement = settlements[0];
  const inPeriod = settlements.filter((s) => inRange(s.transactionDate, range));

  const downloadStatement = () => {
    if (inPeriod.length === 0) {
      toast.info(`No settlements in ${rangeLabel(range)}.`);
      return;
    }
    const byRef = new Map(ledger.map((e) => [e.referenceId, e]));
    downloadCsv(`settlement_statement_${format(range.from, "yyyy-MM-dd")}_to_${format(range.to, "yyyy-MM-dd")}.csv`, [
      ["Payout Reference", "Settlement Date", "Bank Account", "Payment Status", "Included Reference ID", "Transaction Type", "Transaction Date", "Credit/Debit"],
      ...inPeriod.flatMap((s) =>
        (s.includedRefs ?? []).map((ref) => {
          const e = byRef.get(ref);
          return [
            s.referenceId,
            formatDateTime(s.transactionDate),
            s.bankAccount ?? "",
            s.paymentStatus ?? "",
            ref,
            e?.type ?? "",
            e ? formatDateTime(e.transactionDate) : "",
            e ? e.amount.toFixed(2) : "",
          ];
        }),
      ),
    ]);
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-slate-900">Payout &amp; Settlement</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2 text-slate-600" onClick={downloadStatement}>
            <Download className="h-4 w-4" />
            Download Settlement Statement
          </Button>
          <Button className="gap-2 bg-[#00B074] hover:bg-[#00B074]/90" onClick={() => setHistoryOpen(true)}>
            <History className="h-4 w-4" />
            View Payout History
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Upcoming Settlement */}
        <div className="rounded-xl border border-slate-100 p-5 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-slate-900">Upcoming Settlement</h3>
            {upcoming.scheduled ? (
              <StatusBadge status="Scheduled" />
            ) : (
              <StatusBadge status="Pending" />
            )}
          </div>
          <div className="space-y-3 px-1">
            <div>
              <p className="text-sm text-slate-500">Expected Payout</p>
              <p className="text-3xl font-bold tracking-tight text-[#00B074]">{formatINR(upcoming.expectedPayout)}</p>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">Settlement Date</span>
              <span className="font-semibold text-slate-900">
                {/* Only show a date once the payout batch has actually been scheduled. */}
                {upcoming.scheduled && upcoming.settlementDate ? formatDate(upcoming.settlementDate) : "Not yet scheduled"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">Payment Method</span>
              <span className="font-semibold text-slate-900">{upcoming.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">Beneficiary Account</span>
              <span className="font-semibold text-slate-900">{upcoming.beneficiaryAccount}</span>
            </div>
          </div>
        </div>

        {/* Last Settlement */}
        <div className="flex flex-col rounded-xl border border-slate-100 bg-slate-50/60 p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Landmark className="h-4 w-4 text-slate-500" />
            <h3 className="text-base font-bold text-slate-900">Last Settlement</h3>
          </div>
          {lastSettlement ? (
            <div className="flex flex-1 flex-col justify-between gap-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Payout Reference</span>
                  <span className="font-semibold text-slate-900">{lastSettlement.referenceId}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Settlement Date</span>
                  <span className="font-semibold text-slate-900">{formatDate(lastSettlement.transactionDate)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="font-semibold text-slate-900">{formatINR(Math.abs(lastSettlement.amount))}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Payment Status</span>
                  <StatusBadge status={lastSettlement.paymentStatus ?? "Paid"} />
                </div>
              </div>
              <Button variant="outline" size="sm" className="self-start" onClick={() => setSelected(lastSettlement)}>
                View Details
              </Button>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No settlements yet.</p>
          )}
        </div>
      </div>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payout History</DialogTitle>
            <DialogDescription>All bank settlements, by settlement date.</DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto rounded-lg border border-slate-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-semibold text-slate-600">Payout Reference</TableHead>
                  <TableHead className="font-semibold text-slate-600">Settlement Date</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">Orders</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">Amount</TableHead>
                  <TableHead className="font-semibold text-slate-600">Bank Account</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {settlements.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-slate-900">{s.referenceId}</TableCell>
                    <TableCell className="whitespace-nowrap text-slate-600">{formatDate(s.transactionDate)}</TableCell>
                    <TableCell className="text-right text-slate-600">
                      {(s.includedRefs ?? []).filter((r) => r.startsWith("CL-")).length}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold text-slate-900">
                      {formatINR(Math.abs(s.amount))}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-slate-600">{s.bankAccount}</TableCell>
                    <TableCell>
                      <StatusBadge status={s.paymentStatus ?? "Paid"} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#00B074] hover:bg-emerald-50 hover:text-[#00B074]"
                        onClick={() => setSelected(s)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <TransactionDetailsDialog entry={selected} ledger={ledger} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}
