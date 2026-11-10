"use client";

import { useState } from "react";
import { VendorDataGate } from "@/components/dashboard/vendor-data-gate";
import type { LedgerEntry, PayoutOverview } from "@/lib/vendor-data";
import { DateRangeFilter } from "./date-range-filter";
import { EarningsStats } from "./earnings-stats";
import { EarningsChart } from "./earnings-chart";
import { EarningsByServiceChart } from "./earnings-by-service-chart";
import { PayoutSettlement } from "./payout-settlement";
import { TransactionHistory } from "./transaction-history";
import { dailyEarnings, inRange, presetRange, type DateRangeValue } from "./earnings-utils";

export function EarningsOverview() {
  return (
    <VendorDataGate resource="transactions">
      {(ledger) => (
        <VendorDataGate resource="payouts">
          {(payouts) => <EarningsOverviewView ledger={ledger} payouts={payouts} />}
        </VendorDataGate>
      )}
    </VendorDataGate>
  );
}

function EarningsOverviewView({ ledger, payouts }: { ledger: LedgerEntry[]; payouts: PayoutOverview }) {
  // Global date range: drives the charts, Total Paid Out, the settlement statement and the ledger.
  const [range, setRange] = useState<DateRangeValue>(() => presetRange("7d"));

  // Rule F: order earnings are filtered by completion date (their ledger date).
  const earningsInRange = ledger.filter((e) => e.type === "Order Earning" && inRange(e.transactionDate, range));

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Overview</h1>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      <EarningsStats entries={ledger} upcoming={payouts.upcoming} range={range} />

      <div className="grid gap-6 lg:grid-cols-2">
        <EarningsChart data={dailyEarnings(earningsInRange, range)} />
        <EarningsByServiceChart entries={earningsInRange} />
      </div>

      <PayoutSettlement ledger={ledger} upcoming={payouts.upcoming} range={range} />

      <TransactionHistory ledger={ledger} range={range} onRangeChange={setRange} />
    </div>
  );
}
