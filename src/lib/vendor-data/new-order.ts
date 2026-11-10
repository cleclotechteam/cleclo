// New-order acceptance popup (dashboard): types + demo data.
//
// Backend notes:
// - `unitPayout` is the VENDOR PAYOUT rate taken from Cleclo's fixed vendor pricing catalog,
//   never the customer selling price. It is locked: the vendor cannot change it during acceptance.
// - `totalPayout` of the order must equal the sum of quantity x unitPayout over every line.
// - Acceptance confirms the entire order. Partial acceptance is not allowed; if a vendor cannot
//   fulfil an item or service they raise a report instead of accepting.
import { addDays, addHours, setHours, startOfHour } from "date-fns";

/** Cleclo offers only these three services. */
export type CleanService = "Dry Cleaning" | "Washing" | "Steam Ironing";

export const CLEAN_SERVICES: CleanService[] = ["Dry Cleaning", "Washing", "Steam Ironing"];

export interface NewOrderItem {
  id: string;
  garment: string;
  service: CleanService;
  quantity: number;
  /** Vendor payout per piece (₹), from Cleclo's fixed vendor pricing catalog. Read-only. */
  unitPayout: number;
}

export interface NewOrderDetails {
  /** Display order ID, e.g. CL-0001. */
  orderId: string;
  speed: "express" | "fast" | "economy";
  /** Seconds the vendor has to accept before the order is reassigned. */
  acceptanceWindowSec: number;
  pickupStart: string; // ISO
  pickupEnd: string; // ISO
  /** Committed completion deadline. */
  deliveryDue: string; // ISO
  lines: NewOrderItem[];
}

export const lineTotal = (item: NewOrderItem) => item.quantity * item.unitPayout;
export const orderPieces = (lines: NewOrderItem[]) => lines.reduce((n, l) => n + l.quantity, 0);
export const orderPayout = (lines: NewOrderItem[]) => lines.reduce((n, l) => n + lineTotal(l), 0);
/** Distinct services in the order, in Cleclo's canonical order. */
export const orderServices = (lines: NewOrderItem[]) =>
  CLEAN_SERVICES.filter((s) => lines.some((l) => l.service === s));

export function demoNewOrderDetails(): NewOrderDetails {
  const pickupStart = setHours(startOfHour(new Date()), 14);
  return {
    orderId: "CL-0001",
    speed: "express",
    acceptanceWindowSec: 180,
    pickupStart: pickupStart.toISOString(),
    pickupEnd: addHours(pickupStart, 2).toISOString(),
    deliveryDue: setHours(addDays(pickupStart, 2), 18).toISOString(),
    lines: [
      { id: "l1", garment: "Men's Cotton Shirt", service: "Washing", quantity: 3, unitPayout: 35 },
      { id: "l2", garment: "Men's Pyjama", service: "Washing", quantity: 2, unitPayout: 30 },
      { id: "l3", garment: "Men's Suit", service: "Dry Cleaning", quantity: 2, unitPayout: 150 },
      { id: "l4", garment: "Women's Kurta", service: "Steam Ironing", quantity: 4, unitPayout: 25 },
      { id: "l5", garment: "Trousers", service: "Dry Cleaning", quantity: 2, unitPayout: 90 },
    ],
  };
}
