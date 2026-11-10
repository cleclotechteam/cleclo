"use client";

import { useState } from "react";
import { AlertTriangle, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { IssueReason, Order } from "@/lib/vendor-data";

/**
 * Vendor intake: verify each garment against the logistics pickup record.
 * Intake can only be confirmed when every count matches and every item is in acceptable
 * condition; otherwise the vendor must raise a discrepancy (Missing / Additional / Damaged).
 */
export function IntakeVerificationDialog({
  order,
  open,
  onOpenChange,
  onVerified,
  onDiscrepancy,
}: {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
  onDiscrepancy: (reason: IssueReason, itemId?: string) => void;
}) {
  const [received, setReceived] = useState<Record<string, string>>(() =>
    Object.fromEntries(order.items.map((i) => [i.id, String(i.qty)])),
  );
  const [conditionOk, setConditionOk] = useState<Record<string, boolean>>({});

  const rows = order.items.map((i) => {
    const raw = received[i.id] ?? "";
    const qty = raw === "" ? NaN : Number(raw);
    const diff = Number.isFinite(qty) ? qty - i.qty : NaN;
    return { item: i, raw, diff, ok: !!conditionOk[i.id] };
  });
  const allCounted = rows.every((r) => Number.isFinite(r.diff));
  const firstMismatch = rows.find((r) => Number.isFinite(r.diff) && r.diff !== 0);
  const allMatch = allCounted && !firstMismatch;
  const allConditionOk = rows.every((r) => r.ok);
  const unresolved = order.issues.some((i) => !i.resolved);
  const canVerify = allMatch && allConditionOk && !unresolved;

  const raiseDiscrepancy = () => {
    if (firstMismatch) {
      onDiscrepancy(firstMismatch.diff < 0 ? "Missing Garment" : "Additional Garment", firstMismatch.item.id);
    } else {
      const damaged = rows.find((r) => !r.ok);
      onDiscrepancy(damaged ? "Damaged Garment" : "Quantity Mismatch", damaged?.item.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px]">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#00B074]/10 p-2 text-[#00B074]">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold text-slate-900">Verify Received Items – {order.id}</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              Check and verify the item count and condition against the pickup record. Report any mismatches if found.
            </DialogDescription>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] text-sm">
            <thead>
              <tr className="border-b text-[11px] uppercase tracking-wider text-slate-500">
                <th className="py-2 pr-3 text-left font-semibold">Garment / Service</th>
                <th className="py-2 px-3 text-center font-semibold">Pickup Record</th>
                <th className="py-2 px-3 text-center font-semibold">Received</th>
                <th className="py-2 pl-3 text-center font-semibold">Condition OK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(({ item, raw, diff, ok }) => (
                <tr key={item.id}>
                  <td className="py-2.5 pr-3">
                    <p className="font-semibold text-slate-900">{item.garment}</p>
                    <p className="text-xs text-slate-500">{item.service}</p>
                  </td>
                  <td className="py-2.5 px-3 text-center font-medium">{item.qty}</td>
                  <td className="py-2.5 px-3">
                    <Input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={raw}
                      onChange={(e) => setReceived((r) => ({ ...r, [item.id]: e.target.value }))}
                      className={cn(
                        "mx-auto h-9 w-20 text-center",
                        Number.isFinite(diff) && diff !== 0 && "border-red-300 text-red-600",
                      )}
                      aria-label={`Received quantity for ${item.garment}`}
                    />
                  </td>
                  <td className="py-2.5 pl-3 text-center">
                    <Checkbox
                      checked={ok}
                      onCheckedChange={(v) => setConditionOk((c) => ({ ...c, [item.id]: v === true }))}
                      aria-label={`Condition OK for ${item.garment}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(firstMismatch || unresolved) && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {unresolved
              ? "This order has an unresolved discrepancy. Affected items cannot proceed until Cleclo resolves it."
              : "Received quantity does not match the pickup record. Missing or additional garments must be reported as a discrepancy."}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={raiseDiscrepancy}
          >
            Report Discrepancy
          </Button>
          <Button
            className="flex-1 bg-[#00B074] font-bold text-white hover:bg-[#00B074]/90"
            disabled={!canVerify}
            onClick={onVerified}
          >
            Confirm Intake Verified
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
