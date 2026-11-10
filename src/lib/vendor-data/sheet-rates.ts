// Lookups into the vendor rate card from the Cleclo master sheet (./vendor-rate-card).
// Every vendor rate shown anywhere in the app (new-order popup, Order Management, Earnings)
// must come through here, so no screen can show a rate that isn't in the sheet.
import { VENDOR_RATES, type RateSection, type RateService } from "./vendor-rate-card";

export type { RateSection };

/** Service names used across the app, mapped to the rate card's columns. */
export type SheetServiceName = "Dry Cleaning" | "Drycleaning" | "Washing" | "Steam Ironing";

const SERVICE_KEY: Record<SheetServiceName, RateService> = {
  "Dry Cleaning": "drycleaning",
  Drycleaning: "drycleaning",
  Washing: "washing",
  "Steam Ironing": "steamIroning",
};

/** A specific item in the sheet, e.g. { section: "MEN", item: "Shirt" }. */
export interface SheetItem {
  section: RateSection;
  item: string;
}

/**
 * Vendor payout (₹ per unit, as written in the sheet) for a sheet item and service.
 * Throws if the item isn't in the sheet or the sheet doesn't offer that service for it,
 * so demo data can never fall back to a made-up rate.
 */
export function sheetRate({ section, item }: SheetItem, service: SheetServiceName): number {
  const entry = VENDOR_RATES.find(
    (r) => r.section === section && r.item.toLowerCase() === item.trim().toLowerCase(),
  );
  if (!entry) throw new Error(`"${section} / ${item}" is not in the vendor rate sheet`);
  const rate = entry.vendor[SERVICE_KEY[service]];
  if (rate === undefined) {
    throw new Error(`The vendor rate sheet has no ${service} rate for "${section} / ${item}"`);
  }
  return rate;
}

const SECTION_PREFIX: Record<RateSection, string> = {
  MEN: "Men's ",
  WOMEN: "Women's ",
  KIDS: "Kids ",
  HOUSEHOLD: "",
};

/** Display name for a sheet item, e.g. MEN/Shirt -> "Men's Shirt", HOUSEHOLD/Bath Towel -> "Bath Towel". */
export const sheetItemName = ({ section, item }: SheetItem) => `${SECTION_PREFIX[section]}${item}`;
