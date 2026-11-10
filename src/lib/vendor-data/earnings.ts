// Earnings: vendor financial ledger + payout/settlement demo data.
//
// Critical Backend Financial Logic (agreed rules; the screens rely on them):
// A. Fixed Vendor Payouts — each garment's payout uses Cleclo's approved vendor rate:
//    Order Payout = Σ (Quantity x Vendor Rate) over the order's item lines. Rates are read-only for
//    vendors and are never the customer selling price.
// B. Pending Clearance — an order stays "Pending" until the configured financial clearance condition
//    is met (successful customer delivery + reconciliation). Demo: clears 48h after completion.
// C. Available for Payout — once cleared, the amount moves into the vendor's available balance
//    ("Cleared" status). This is cleared but UNPAID money only.
// D. Paid Out — after a successful bank settlement the amount moves to Paid Out ("Paid" status) and
//    the unpaid balance is reduced. A settlement is its own ledger entry (a debit from the balance).
// E. Adjustments — refunds, approved deductions and payout corrections are recorded as SEPARATE
//    auditable ledger entries linked to the order. Historical order payouts are never edited.
// F. Date Filters — earnings are dated by order COMPLETION date; payouts by SETTLEMENT date;
//    adjustments by the date they were posted. Weekly earnings and weekly payouts can therefore differ.
import { addDays, addHours, format, isFriday, setHours, setMinutes, startOfDay, subDays } from "date-fns";
import type { CleanService } from "./new-order";

const ISO_LOCAL = "yyyy-MM-dd'T'HH:mm:ss";
const iso = (d: Date) => format(d, ISO_LOCAL);

export type LedgerEntryType = "Order Earning" | "Settlement" | "Adjustment";
/** Pending = awaiting clearance (B), Cleared = available for payout (C), Paid = settled to bank (D). */
export type LedgerStatus = "Pending" | "Cleared" | "Paid";

/** One item line of an order's vendor payout (rule A). */
export interface PayoutLine {
  garment: string;
  service: CleanService;
  quantity: number;
  /** Cleclo's approved vendor rate per piece (₹). Read-only. */
  vendorRate: number;
}

export interface LedgerEntry {
  id: string;
  /** CL-0001 for orders/adjustment targets, PAY-0001 for settlements, ADJ-0001 for adjustments. */
  referenceId: string;
  type: LedgerEntryType;
  /** ISO local date-time of the ledger entry (rule F: completion / settlement / posting date). */
  transactionDate: string;
  /** Total vendor payout associated with the order (null for settlements). */
  orderValue: number | null;
  /** Signed amount: positive = credited to the vendor balance, negative = deducted. */
  amount: number;
  status: LedgerStatus;
  /** When the amount cleared (rule B → C). */
  clearedAt?: string;
  /** Settlement (PAY-xxxx) that paid this entry out (rule D). */
  settlementRef?: string;

  // Order Earning
  items?: PayoutLine[];

  // Settlement
  /** Reference IDs of the order earnings and adjustments included in this payout. */
  includedRefs?: string[];
  paymentMethod?: string;
  /** Masked beneficiary bank account, e.g. XXXX 4821. Never send the full number to the client. */
  bankAccount?: string;
  paymentStatus?: "Paid" | "Processing" | "Failed";
  /** Bank transfer reference (UTR). */
  bankReference?: string;

  // Adjustment
  relatedOrderRef?: string;
  reason?: string;
}

/** @deprecated kept for older imports; the earnings screen now works on ledger entries. */
export type Transaction = LedgerEntry;

export interface UpcomingSettlement {
  /** Cleared, unpaid balance that will go out in the next batch (rule C). */
  expectedPayout: number;
  /** Only set when the payout batch has actually been scheduled. */
  settlementDate: string | null;
  scheduled: boolean;
  paymentMethod: string;
  beneficiaryAccount: string;
}

export interface PayoutOverview {
  upcoming: UpcomingSettlement;
}

export const linePayout = (l: PayoutLine) => l.quantity * l.vendorRate;
export const itemsPayout = (items: PayoutLine[]) => items.reduce((n, l) => n + linePayout(l), 0);

/* --------------------------------- Demo data --------------------------------- */

const BANK_ACCOUNT = "XXXX 4821";
const PAYMENT_METHOD = "Bank Transfer";
/** Rule B (demo): delivery + reconciliation completes 48h after the vendor completes the order. */
const CLEARANCE_HOURS = 48;
const SETTLEMENT_HOUR = 11; // weekly batch, Fridays 11:00 AM

const CATALOG: Omit<PayoutLine, "quantity">[] = [
  { garment: "Men's Cotton Shirt", service: "Washing", vendorRate: 35 },
  { garment: "Men's Pyjama", service: "Washing", vendorRate: 30 },
  { garment: "Bedsheet (Double)", service: "Washing", vendorRate: 60 },
  { garment: "Men's Suit", service: "Dry Cleaning", vendorRate: 150 },
  { garment: "Trousers", service: "Dry Cleaning", vendorRate: 90 },
  { garment: "Silk Saree", service: "Dry Cleaning", vendorRate: 180 },
  { garment: "Women's Kurta", service: "Steam Ironing", vendorRate: 25 },
  { garment: "Formal Shirt", service: "Steam Ironing", vendorRate: 20 },
];

/** Small deterministic PRNG so every load (ledger + payouts) produces the same demo history. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pad = (n: number) => String(n).padStart(4, "0");

function buildDemoLedger(now: Date) {
  const rand = mulberry32(4821);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const start = startOfDay(subDays(now, 45));

  // Order earnings, dated by completion (rule F).
  const orders: { completedAt: Date; items: PayoutLine[] }[] = [];
  for (let d = 0; d <= 45; d++) {
    const day = addDays(start, d);
    const count = 1 + Math.floor(rand() * 3);
    for (let k = 0; k < count; k++) {
      const completedAt = setMinutes(setHours(day, 10 + Math.floor(rand() * 9)), pick([0, 15, 30, 45]));
      const lineCount = 1 + Math.floor(rand() * 3);
      const items: PayoutLine[] = [];
      for (let l = 0; l < lineCount; l++) {
        const c = pick(CATALOG);
        if (items.some((i) => i.garment === c.garment)) continue;
        items.push({ ...c, quantity: 1 + Math.floor(rand() * 4) });
      }
      if (completedAt <= now) orders.push({ completedAt, items });
    }
  }
  orders.sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime());

  const entries: LedgerEntry[] = orders.map((o, i) => {
    const value = itemsPayout(o.items); // rule A
    const cleared = addHours(o.completedAt, CLEARANCE_HOURS);
    return {
      id: `earn-${i + 1}`,
      referenceId: `CL-${pad(i + 1)}`,
      type: "Order Earning",
      transactionDate: iso(o.completedAt),
      orderValue: value,
      amount: value,
      status: "Pending",
      clearedAt: cleared <= now ? iso(cleared) : undefined,
      items: o.items,
    };
  });

  // Adjustments (rule E): separate entries, the original order payout stays untouched.
  const adjustmentPlan: { index: number; reason: string; sign: 1 | -1 }[] = [
    { index: 6, reason: "Customer refund — damaged garment", sign: -1 },
    { index: 22, reason: "Payout correction — garment missed at intake", sign: 1 },
    { index: entries.length - 5, reason: "Approved deduction — quantity mismatch", sign: -1 },
  ];
  adjustmentPlan.forEach((plan, n) => {
    const order = entries[plan.index];
    if (!order?.items) return;
    const posted = setMinutes(setHours(addDays(new Date(order.transactionDate), 1), 12), 30);
    if (posted > now) return;
    const line = order.items[0];
    const cleared = addHours(posted, 24);
    entries.push({
      id: `adj-${n + 1}`,
      referenceId: `ADJ-${pad(n + 1)}`,
      type: "Adjustment",
      transactionDate: iso(posted),
      orderValue: order.orderValue,
      amount: plan.sign * line.vendorRate,
      status: "Pending",
      clearedAt: cleared <= now ? iso(cleared) : undefined,
      relatedOrderRef: order.referenceId,
      reason: `${plan.reason} (${line.garment}, ${line.service})`,
    });
  });

  // Weekly settlements (rule D): every cleared, unpaid entry before the batch time is paid out.
  let friday = addDays(start, 3);
  while (!isFriday(friday)) friday = addDays(friday, 1);
  let payNo = 0;
  for (; ; friday = addDays(friday, 7)) {
    const settleAt = setHours(friday, SETTLEMENT_HOUR);
    if (settleAt > now) break;
    const eligible = entries.filter(
      (e) => e.type !== "Settlement" && e.clearedAt && !e.settlementRef && new Date(e.clearedAt) < settleAt,
    );
    if (eligible.length === 0) continue;
    const ref = `PAY-${pad(++payNo)}`;
    eligible.forEach((e) => (e.settlementRef = ref));
    entries.push({
      id: `pay-${payNo}`,
      referenceId: ref,
      type: "Settlement",
      transactionDate: iso(settleAt),
      orderValue: null,
      amount: -eligible.reduce((n, e) => n + e.amount, 0),
      status: "Paid",
      clearedAt: iso(settleAt),
      includedRefs: eligible.map((e) => e.referenceId),
      paymentMethod: PAYMENT_METHOD,
      bankAccount: BANK_ACCOUNT,
      paymentStatus: "Paid",
      bankReference: `UTR${format(settleAt, "yyMMdd")}${pad(4821 + payNo)}`,
    });
  }

  for (const e of entries) {
    if (e.type === "Settlement") continue;
    e.status = e.settlementRef ? "Paid" : e.clearedAt ? "Cleared" : "Pending";
  }

  let nextFriday = setHours(startOfDay(now), SETTLEMENT_HOUR);
  while (!isFriday(nextFriday) || nextFriday <= now) nextFriday = addDays(nextFriday, 1);
  const expectedPayout = entries
    .filter((e) => e.type !== "Settlement" && e.status === "Cleared")
    .reduce((n, e) => n + e.amount, 0);
  const scheduled = expectedPayout > 0;

  const payouts: PayoutOverview = {
    upcoming: {
      expectedPayout,
      scheduled,
      settlementDate: scheduled ? iso(nextFriday) : null,
      paymentMethod: PAYMENT_METHOD,
      beneficiaryAccount: BANK_ACCOUNT,
    },
  };

  entries.sort((a, b) => b.transactionDate.localeCompare(a.transactionDate));
  return { entries, payouts };
}

/** Full ledger (order earnings, settlements, adjustments), newest first. */
export const demoTransactions = (): LedgerEntry[] => buildDemoLedger(new Date()).entries;

/** Upcoming settlement summary. Past payouts are the Settlement entries of the ledger. */
export const demoPayouts = (): PayoutOverview => buildDemoLedger(new Date()).payouts;
