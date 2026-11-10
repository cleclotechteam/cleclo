"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { itemsPayout, linePayout, type LedgerEntry } from "@/lib/vendor-data";
import { StatusBadge } from "./status-badge";
import { formatDateTime, formatINR, formatSigned } from "./earnings-utils";

interface TransactionDetailsDialogProps {
  entry: LedgerEntry | null;
  /** Full ledger, used to resolve included orders and linked adjustments. */
  ledger: LedgerEntry[];
  onOpenChange: (open: boolean) => void;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-900">{children}</span>
    </div>
  );
}

export function TransactionDetailsDialog({ entry, ledger, onOpenChange }: TransactionDetailsDialogProps) {
  return (
    <Dialog open={entry !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {entry && (
          <>
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-center gap-3">
                {entry.referenceId}
                <StatusBadge status={entry.status} />
              </DialogTitle>
              <DialogDescription>
                {entry.type} · {formatDateTime(entry.transactionDate)}
              </DialogDescription>
            </DialogHeader>
            {entry.type === "Order Earning" && <OrderDetails entry={entry} ledger={ledger} />}
            {entry.type === "Settlement" && <SettlementDetails entry={entry} ledger={ledger} />}
            {entry.type === "Adjustment" && <AdjustmentDetails entry={entry} />}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Item-wise vendor payout breakdown: Order Payout = Σ Quantity x Vendor Rate (rule A). */
function OrderDetails({ entry, ledger }: { entry: LedgerEntry; ledger: LedgerEntry[] }) {
  const items = entry.items ?? [];
  const adjustments = ledger.filter((e) => e.type === "Adjustment" && e.relatedOrderRef === entry.referenceId);
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-slate-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="font-semibold text-slate-600">Garment</TableHead>
              <TableHead className="font-semibold text-slate-600">Service</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Qty</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Vendor Rate</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Payout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((l) => (
              <TableRow key={l.garment}>
                <TableCell className="font-medium text-slate-900">{l.garment}</TableCell>
                <TableCell className="text-slate-600">{l.service}</TableCell>
                <TableCell className="text-right text-slate-600">{l.quantity}</TableCell>
                <TableCell className="text-right text-slate-600">{formatINR(l.vendorRate)}</TableCell>
                <TableCell className="text-right font-semibold text-slate-900">{formatINR(linePayout(l))}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableCell colSpan={4} className="font-semibold text-slate-700">
                Total Vendor Payout
              </TableCell>
              <TableCell className="text-right font-bold text-[#00B074]">{formatINR(itemsPayout(items))}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg border border-slate-100 px-4 py-2">
        <Row label="Completed On">{formatDateTime(entry.transactionDate)}</Row>
        <Row label="Cleared On">{entry.clearedAt ? formatDateTime(entry.clearedAt) : "Awaiting delivery & reconciliation"}</Row>
        <Row label="Paid In Settlement">{entry.settlementRef ?? "Not yet settled"}</Row>
      </div>

      {adjustments.length > 0 && (
        <div className="rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700">Linked Adjustments</p>
          {adjustments.map((a) => (
            <Row key={a.id} label={`${a.referenceId} · ${a.reason ?? ""}`}>
              {formatSigned(a.amount)}
            </Row>
          ))}
          <p className="mt-1 text-xs text-slate-500">
            Adjustments are recorded as separate ledger entries; the original order payout above is unchanged.
          </p>
        </div>
      )}
    </div>
  );
}

function SettlementDetails({ entry, ledger }: { entry: LedgerEntry; ledger: LedgerEntry[] }) {
  const included = (entry.includedRefs ?? [])
    .map((ref) => ledger.find((e) => e.referenceId === ref))
    .filter((e): e is LedgerEntry => Boolean(e));
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-100 px-4 py-2">
        <Row label="Payout Reference">{entry.referenceId}</Row>
        <Row label="Settlement Date">{formatDateTime(entry.transactionDate)}</Row>
        <Row label="Amount Paid">{formatINR(Math.abs(entry.amount))}</Row>
        <Row label="Payment Method">{entry.paymentMethod}</Row>
        <Row label="Bank Account">{entry.bankAccount}</Row>
        {entry.bankReference && <Row label="Bank Reference (UTR)">{entry.bankReference}</Row>}
        <Row label="Payment Status">
          <StatusBadge status={entry.paymentStatus ?? "Paid"} />
        </Row>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-slate-900">Included Orders ({included.length})</p>
        <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-100">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="font-semibold text-slate-600">Reference ID</TableHead>
                <TableHead className="font-semibold text-slate-600">Transaction Type</TableHead>
                <TableHead className="font-semibold text-slate-600">Transaction Date</TableHead>
                <TableHead className="text-right font-semibold text-slate-600">Credit/Debit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {included.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium text-slate-900">{e.referenceId}</TableCell>
                  <TableCell className="text-slate-600">{e.type}</TableCell>
                  <TableCell className="whitespace-nowrap text-slate-600">{formatDateTime(e.transactionDate)}</TableCell>
                  <TableCell className={e.amount < 0 ? "text-right font-semibold text-red-600" : "text-right font-semibold text-slate-900"}>
                    {formatSigned(e.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function AdjustmentDetails({ entry }: { entry: LedgerEntry }) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-slate-100 px-4 py-2">
        <Row label="Adjustment Reference">{entry.referenceId}</Row>
        <Row label="Related Order">{entry.relatedOrderRef}</Row>
        <Row label="Reason">{entry.reason}</Row>
        {entry.orderValue !== null && <Row label="Original Order Value">{formatINR(entry.orderValue)}</Row>}
        <Row label={entry.amount < 0 ? "Amount Deducted" : "Amount Credited"}>{formatSigned(entry.amount)}</Row>
        <Row label="Paid In Settlement">{entry.settlementRef ?? "Not yet settled"}</Row>
      </div>
      <p className="text-xs text-slate-500">
        Adjustments are separate, auditable ledger entries. The original order payout is never changed.
      </p>
    </div>
  );
}
