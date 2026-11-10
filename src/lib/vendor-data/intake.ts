// Vendor intake (receipt) verification data for /dashboard/schedule/[id].
//
// Backend notes:
// - Logistics pickup records (items, quantities, pickup photos, condition) are written by the
//   logistics partner app and are read-only for the vendor.
// - Vendor receipt verification is recorded per item ID. A reported discrepancy NEVER modifies
//   the original order: it creates a review case for Cleclo's operations team that preserves
//   both the logistics record and the vendor record (item ID, photos, remarks, timestamp).
// - "Confirm Receipt & Complete Verification" may only be accepted once every item is either
//   matched or has a discrepancy recorded. Matched items move into the vendor's processing
//   inventory; items with discrepancies stay flagged for review.
import { addMinutes, format, parseISO } from "date-fns";
import { garmentImage } from "./garment-images";
import {
  demoSchedule,
  type OrderPriority,
  type PickupStatus,
  type ScheduleDirection,
  type ServiceTypeName,
} from "./schedule";

/** Service types as named in the item-card requirements. */
export type IntakeServiceType = ServiceTypeName;

export const INTAKE_COPY = {
  logisticsHeading: "Logistics Pickup Verification",
  logisticsDescription:
    "Items recorded and verified by the logistics partner during customer pickup.",
  vendorHeading: "Vendor Receipt Verification",
  vendorDescription:
    "Match received items against the logistics pickup record and confirm their condition.",
  pickupEvidence: "Pickup Evidence",
  pickupEvidenceDescription:
    "Photograph captured by the logistics partner at customer collection.",
  receiptEvidence: "Receipt Evidence",
  receiptEvidenceDescription: "Photograph captured by the vendor at the outlet.",
  confirmButton: "Confirm Receipt & Complete Verification",
  specialHandlingHeading: "Special Handling Instructions",
  discrepanciesKpi: "Discrepancies Reported",
} as const;

export const DISCREPANCY_TYPES = [
  { type: "Missing Item", example: "Logistics recorded 3 shirts; vendor received 2" },
  { type: "Additional Item", example: "Vendor received an item not listed in the pickup record" },
  { type: "Wrong Item", example: "Garment does not match the recorded item" },
  { type: "Quantity Mismatch", example: "Item count differs from the pickup record" },
  { type: "Pre-existing Damage", example: "Tear, stain, colour bleed or other visible damage" },
  { type: "Incorrect Service", example: "Recorded service differs from the garment's required care" },
  { type: "Other", example: "Additional issue requiring review" },
] as const;

export type DiscrepancyType = (typeof DISCREPANCY_TYPES)[number]["type"];

export const VERIFICATION_WORKFLOW_STEPS = [
  {
    title: "Logistics Pickup Completed",
    description: "Items, quantities and available photographs recorded at customer pickup.",
  },
  {
    title: "Bag Received at Vendor Outlet",
    description: "Vendor confirms bag receipt and checks the bag identifier or seal.",
  },
  {
    title: "Item-by-Item Verification",
    description: "Vendor compares the physical garments with the logistics pickup record.",
  },
  {
    title: "Discrepancy Reporting",
    description: "Any missing, additional, incorrect or damaged item is documented.",
  },
  {
    title: "Receipt Confirmation",
    description:
      "Verified items are accepted into the vendor's processing inventory, with exceptions flagged for review.",
  },
] as const;

export const ORDER_JOURNEY_STAGES = [
  { stage: 1, heading: "Order Placed", description: "Customer successfully places an order through Cleclo." },
  { stage: 2, heading: "Order Accepted", description: "Vendor confirms acceptance of the assigned order." },
  { stage: 3, heading: "Pickup Scheduled", description: "Customer pickup date and time slot confirmed." },
  { stage: 4, heading: "Logistics Partner Assigned", description: "A logistics partner is assigned for customer pickup." },
  { stage: 5, heading: "Picked Up from Customer", description: "Garments collected and item details recorded by the logistics partner." },
  { stage: 6, heading: "In Transit to Vendor", description: "Order is being transported to the vendor outlet." },
  { stage: 7, heading: "Received at Vendor", description: "Garments arrive at the vendor outlet for verification." },
  { stage: 8, heading: "Vendor Intake Verified", description: "Vendor verifies received items against the logistics pickup record." },
  { stage: 9, heading: "Under Processing", description: "Garments undergo Dry Cleaning, Washing or Steam Ironing." },
  { stage: 10, heading: "Quality Check Completed", description: "Garments undergo final inspection and quality verification." },
  { stage: 11, heading: "Ready for Dispatch", description: "Order is processed, packed and ready for collection." },
  { stage: 12, heading: "Delivery Partner Assigned", description: "Logistics partner assigned for return delivery." },
  { stage: 13, heading: "Handover Verified", description: "Vendor and logistics partner verify the completed order before collection." },
  { stage: 14, heading: "Picked Up from Vendor", description: "Logistics partner confirms collection from the vendor outlet." },
  { stage: 15, heading: "Out for Delivery", description: "Order is on its way to the customer's delivery address." },
  { stage: 16, heading: "Delivered", description: "Order successfully delivered to the customer and delivery confirmed." },
] as const;


/** Timestamp format used across intake verification, e.g. 19 Oct 2026, 2:00 PM. */
export const formatStamp = (d: Date) => format(d, "dd MMM yyyy, h:mm a");

type ScheduleRow = ReturnType<typeof demoSchedule>[number];

/** Order detail for the intake verification screen, keyed by the Pickup & Delivery row ID. */
export interface ScheduleDetail {
  /** Pickup & Delivery row ID, e.g. PU-005 / DL-001. */
  id: string;
  /** Cleclo Order ID, e.g. CL-0005. */
  orderId: string;
  customer: string;
  direction: ScheduleDirection;
  /** Logistics status from the Pickup & Delivery list (never a processing status). */
  logisticsStatus: PickupStatus;
  priority: OrderPriority;
  /** Logistics partner (rider); null while awaiting assignment by Cleclo logistics. */
  driver: string | null;
  note?: string;
  /** Slot date, e.g. 19 Oct 2026. */
  date: string;
  /** Slot start, ISO local string. */
  slotStart: string;
  orderItems: { name: string; quantity: number; image: string }[];
  /** Vendor handover already recorded on the Pickup & Delivery screen, if any. */
  handover?: ScheduleRow["handover"];
}

const photoFor = (name: string) => garmentImage(name);

/** Detail rows derived from the Pickup & Delivery list so IDs and order numbers always match. */
export function demoScheduleDetails(): ScheduleDetail[] {
  return demoSchedule().map((e) => ({
    id: e.id,
    orderId: e.orderId,
    customer: e.customer,
    direction: e.direction,
    logisticsStatus: e.pickupStatus,
    priority: e.priority,
    driver: e.rider,
    note: e.note,
    date: format(parseISO(e.slotStart), "dd MMM yyyy"),
    slotStart: e.slotStart,
    orderItems: e.orderItems.map((i) => ({ ...i, image: photoFor(i.name) })),
    handover: e.handover,
  }));
}

/** One physical garment, identified by its unique item ID. */
export interface IntakeItem {
  /** Unique item ID, e.g. CL-0005-01. */
  id: string;
  name: string;
  service: IntakeServiceType;
  /** Pieces per item ID (each garment gets its own ID, so normally 1). */
  quantity: number;
  /** Photo captured by the logistics partner at customer collection. */
  pickupPhoto: string;
  /** Condition noted by the logistics partner at pickup. */
  pickupCondition: string;
  /** Vendor must capture a receipt photo before marking this item as matched. */
  receiptPhotoRequired: boolean;
  /** Special handling instruction attached to this item (stays visible through processing). */
  specialHandling?: string;
}

export type IntakeItemResult = "matched" | "discrepancy";

/** A review case raised for Cleclo's operations team. It never modifies the original order. */
export interface DiscrepancyCase {
  caseId: string;
  itemId: string;
  itemName: string;
  type: DiscrepancyType;
  remarks: string;
  photos: string[];
  /** e.g. 19 Oct 2026, 2:00 PM */
  reportedAt: string;
}

export interface IntakeOrder {
  /** Short order reference used in bag/case IDs, e.g. 0005. */
  orderRef: string;
  /** Identifier printed on the sealed pickup bag. */
  bagId: string;
  items: IntakeItem[];
  /** Logistics pickup has happened (items, photos and condition are recorded). */
  pickupDone: boolean;
  cancelled: boolean;
  /** Journey stages completed before any vendor action on this screen. */
  baseStage: number;
  /** State already recorded for this order (bag receipt, verification results, cases). */
  initial: {
    bagReceivedAt: string | null;
    results: Record<string, IntakeItemResult>;
    cases: DiscrepancyCase[];
    completion: { at: string; by: string } | null;
  };
}

const SERVICE_BY_GARMENT: Record<string, IntakeServiceType> = {
  "Red Dress": "Drycleaning",
  "Silk Blouse": "Drycleaning",
  "Silk Scarf": "Drycleaning",
  "Black Trousers": "Drycleaning",
  "Wool Coat": "Drycleaning",
  Saree: "Drycleaning",
  Blazer: "Drycleaning",
  "Suit (2-piece)": "Drycleaning",
  Tie: "Drycleaning",
  "White Shirt": "Steam Ironing",
  "Formal Shirt": "Steam Ironing",
  Kurta: "Steam Ironing",
};

/**
 * Special handling instructions attached to one garment per order. PU-005 uses the
 * client-approved wording; the others carry the customer's note onto the relevant item.
 */
const SPECIAL_HANDLING: Record<string, { garment: string; instruction?: string; condition: string }> = {
  "PU-005": {
    garment: "Red Dress",
    instruction:
      "Potential colour bleeding identified for Red Dress. Inspect before processing and handle separately as per fabric-care guidelines.",
    condition: "Good, colour bleed risk noted",
  },
  "PU-001": { garment: "White Shirt", condition: "Coffee stain on front" },
  "PU-002": { garment: "White Shirt", condition: "Oil stain on collar" },
  "PU-003": { garment: "Silk Scarf", condition: "Good, delicate fabric" },
  "PU-006": { garment: "Blue Jeans", condition: "Grass stains on knees" },
};

const PICKUP_BASE_STAGE: Record<PickupStatus, number> = {
  not_scheduled: 2, // placed + accepted
  scheduled: 3,
  rider_assigned: 4,
  en_route: 4,
  delayed: 4,
  picked_up: 5, // picked up, in transit to vendor
  received_at_outlet: 7,
  cancelled: 2,
};

const DELIVERY_BASE_STAGE: Record<PickupStatus, number> = {
  not_scheduled: 10, // quality check done, packing in progress
  scheduled: 11,
  rider_assigned: 12,
  en_route: 12,
  delayed: 12,
  picked_up: 14, // out for delivery next
  received_at_outlet: 16,
  cancelled: 11,
};

/** Expands an order into one verifiable record per physical garment, plus any recorded state. */
export function buildIntakeOrder(detail: ScheduleDetail, vendorName: string): IntakeOrder {
  const orderRef = detail.orderId.replace(/^CL-/, "");
  const handling = SPECIAL_HANDLING[detail.id];
  const instruction = handling?.instruction ?? detail.note;
  let seq = 0;
  let handlingAttached = false;

  const items: IntakeItem[] = detail.orderItems.flatMap((line) =>
    Array.from({ length: line.quantity }, () => {
      seq += 1;
      const attach =
        !!handling && !!instruction && !handlingAttached && handling.garment === line.name;
      if (attach) handlingAttached = true;
      return {
        id: `${detail.orderId}-${String(seq).padStart(2, "0")}`,
        name: line.name,
        service: SERVICE_BY_GARMENT[line.name] ?? "Washing",
        quantity: 1,
        pickupPhoto: line.image,
        pickupCondition: attach ? handling.condition : "Good, no visible damage",
        receiptPhotoRequired: attach,
        specialHandling: attach ? instruction : undefined,
      };
    }),
  );

  const isDelivery = detail.direction === "delivery";
  const status = detail.logisticsStatus;
  const cancelled = status === "cancelled";
  const pickupDone = isDelivery || status === "picked_up" || status === "received_at_outlet";
  const baseStage = (isDelivery ? DELIVERY_BASE_STAGE : PICKUP_BASE_STAGE)[status];
  const slot = parseISO(detail.slotStart);

  const initial: IntakeOrder["initial"] = {
    bagReceivedAt: null,
    results: {},
    cases: [],
    completion: null,
  };

  if (isDelivery) {
    // Outbound orders were verified at intake before processing.
    const at = formatStamp(addMinutes(slot, -2 * 24 * 60));
    initial.bagReceivedAt = at;
    items.forEach((i) => (initial.results[i.id] = "matched"));
    initial.completion = { at, by: vendorName };
  } else if (status === "received_at_outlet") {
    const handover = detail.handover;
    const at = handover ? formatStamp(parseISO(handover.confirmedAt)) : formatStamp(slot);
    initial.bagReceivedAt = at;
    if (handover) {
      // Carry the handover already recorded on the Pickup & Delivery screen into item results.
      for (const r of handover.received) {
        items
          .filter((i) => i.name === r.name)
          .forEach((u, idx) => {
            if (idx < r.received) {
              initial.results[u.id] = "matched";
              return;
            }
            initial.results[u.id] = "discrepancy";
            initial.cases.push({
              caseId: `RC-${orderRef}-${String(initial.cases.length + 1).padStart(2, "0")}`,
              itemId: u.id,
              itemName: u.name,
              type: "Missing Item",
              remarks: handover.discrepancyNote || "Item not received.",
              photos: [],
              reportedAt: at,
            });
          });
      }
      initial.completion = { at, by: vendorName };
    }
  }

  return { orderRef, bagId: `BAG-${orderRef}`, items, pickupDone, cancelled, baseStage, initial };
}

/** Demo timestamps for journey stages completed before this screen (spaced back from the slot). */
export function journeyTimestamps(detail: ScheduleDetail, completedThrough: number) {
  const slot = parseISO(detail.slotStart);
  const out: Record<number, string> = {};
  for (let st = 1; st <= completedThrough; st++) {
    out[st] = formatStamp(addMinutes(slot, -(completedThrough - st) * 45));
  }
  return out;
}
