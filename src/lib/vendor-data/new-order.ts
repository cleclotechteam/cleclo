// New-order acceptance popup (dashboard): types + demo data.
//
// Backend notes:
// - `unitPayout` is the VENDOR PAYOUT rate taken from Cleclo's fixed vendor pricing catalog,
//   never the customer selling price. It is locked: the vendor cannot change it during acceptance.
// - `totalPayout` of the order must equal the sum of quantity x unitPayout over every line.
// - Acceptance confirms the entire order. Partial acceptance is not allowed; if a vendor cannot
//   fulfil an item or service they raise a report instead of accepting.
import { addDays, addHours, setHours, startOfHour } from "date-fns";
import { garmentImage } from "./garment-images";
import { sheetItemName, sheetRate, type SheetItem } from "./sheet-rates";

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
  /** Care / handling note recorded for this item, if any. */
  note?: string;
  /** One photo per piece (customer upload at order time / logistics pickup photos). */
  photos: string[];
}

export interface NewOrderDetails {
  /** Display order ID, e.g. CL-0001. */
  orderId: string;
  speed: "express" | "fast" | "economy";
  /** Turnaround shown to the vendor: Standard / Express 48H / Express 24H. */
  priority: "Standard" | "Express 48H" | "Express 24H";
  customer: string;
  /** Pickup locality only: logistics is managed centrally, so no distance is shown. */
  pickupArea: string;
  /** Order-level instruction from the customer, if any. */
  customerNote?: string;
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

/** An order line whose vendor rate comes from the Cleclo vendor rate sheet. */
const fromSheet = (
  id: string,
  item: SheetItem,
  service: CleanService,
  quantity: number,
  note?: string,
): Omit<NewOrderItem, "photos"> => ({
  id,
  garment: sheetItemName(item),
  service,
  quantity,
  unitPayout: sheetRate(item, service),
  ...(note ? { note } : {}),
});

/** Demo: one photo per piece, each a different shot of the garment. */
const withPhotos = (lines: Omit<NewOrderItem, "photos">[]): NewOrderItem[] =>
  lines.map((l) => ({
    ...l,
    photos: Array.from({ length: l.quantity }, (_, i) => garmentImage(l.garment, i)),
  }));

export function demoNewOrderDetails(): NewOrderDetails {
  const pickupStart = setHours(startOfHour(new Date()), 14);
  return {
    orderId: "CL-0001",
    speed: "express",
    priority: "Express 48H",
    customer: "Mark Wilson",
    pickupArea: "Bandra West, Mumbai 400050",
    customerNote: "Please use mild detergent for the kurtas and keep the suits on hangers.",
    acceptanceWindowSec: 60 * 60, // 1 hour
    pickupStart: pickupStart.toISOString(),
    pickupEnd: addHours(pickupStart, 2).toISOString(),
    deliveryDue: setHours(addDays(pickupStart, 2), 18).toISOString(),
    lines: withPhotos([
      fromSheet("l1", { section: "MEN", item: "Shirt" }, "Washing", 3),
      fromSheet("l2", { section: "MEN", item: "Pyjama" }, "Washing", 2),
      fromSheet("l3", { section: "MEN", item: "Suit Set (2 Pcs)" }, "Dry Cleaning", 2, "Return on hangers"),
      fromSheet("l4", { section: "WOMEN", item: "Kurta" }, "Steam Ironing", 4, "Embroidered – iron on reverse"),
      fromSheet("l5", { section: "MEN", item: "Trousers" }, "Dry Cleaning", 2),
    ]),
  };
}

/** Payout per service, for the breakdown shown before acceptance. */
export const payoutByService = (lines: NewOrderItem[]) =>
  orderServices(lines).map((service) => {
    const own = lines.filter((l) => l.service === service);
    return { service, pieces: orderPieces(own), payout: orderPayout(own) };
  });
