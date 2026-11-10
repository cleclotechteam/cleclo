// Order Management data: types, fixed vendor rate card and demo orders.
// Dates are generated relative to "now" so countdowns, overdue alerts and the default
// date filter always have something meaningful to show.
//
// Essential Backend Flow & Validation Rules (implemented server-side; mirrored in the UI):
// A. New Order Assignment: When Cleclo assigns an order, it enters New Orders and starts the
//    configured acceptance timer (`acceptanceDeadline`). Acceptance must be atomic: only one
//    vendor can successfully accept the assignment. Expired or declined assignments are routed
//    for reassignment (stage -> "reassigned" / "declined", shown under Order History/Exceptions).
// B. Pickup and Vendor Intake: After acceptance, logistics handles customer pickup. When garments
//    arrive, the vendor verifies each item against the pickup record (`pickupQty`). Missing or
//    additional garments generate a discrepancy case (`issues`).
// C. Processing: Only verified, authorised items can proceed to processing. Vendor updates should
//    record timestamps and the user responsible for each change (`statusLog`).
// D. Ready for Dispatch: After processing and quality checks, the vendor marks the order ready.
//    Logistics collection and handover verification are tracked separately (`logisticsStatus`).
// E. Completion: The order moves to Completed only after delivery confirmation from the logistics
//    system, not merely when the vendor finishes processing.
// F. SLA Monitoring: Track acceptance deadline, pickup commitment and delivery deadline
//    separately. An overdue order retains its actual operational status and receives an
//    additional overdue alert (see `isOrderOverdue`).
//
// Important Logic Checks for Developers:
// - A vendor cannot begin processing before completing intake verification.
// - Vendor payout rates are fixed and cannot be edited (rates come from VENDOR_RATE_CARD only).
// - Item-wise totals must match the overall payout calculation (`payoutMatches`).
// - Order status changes must be timestamped and logged (`statusLog`).
// - Logistics pickup and delivery statuses cannot be manually overridden by vendors.
// - Orders with unresolved discrepancies must follow Cleclo's exception-handling rules before
//   affected items proceed.
// - Processing status (`stage`) and logistics status (`logisticsStatus`) must remain separate.
import { addDays, addMinutes, format, setHours, setMinutes, startOfDay, subDays, subHours, subMinutes } from "date-fns";

/* --------------------------------- Types --------------------------------- */

/** The three primary garment-care services. */
export type ServiceType = "Dry Cleaning" | "Washing" | "Steam Ironing";
export const SERVICE_TYPES: ServiceType[] = ["Dry Cleaning", "Washing", "Steam Ironing"];

/** Turnaround / delivery priority (not a garment-care service). */
export type ServiceSpeed = "standard" | "express48" | "express24";
export const TURNAROUNDS: ServiceSpeed[] = ["standard", "express48", "express24"];
/** Label used in Order Priority / summaries. */
export const TURNAROUND_LABEL: Record<ServiceSpeed, string> = {
  standard: "Standard",
  express48: "Express 48H",
  express24: "Express 24H",
};
/** Label used in the Turnaround filter. */
export const TURNAROUND_FILTER_LABEL: Record<ServiceSpeed, string> = {
  standard: "Standard",
  express48: "Express 48 Hrs",
  express24: "Express 24 Hrs",
};

/**
 * Actual operational (backend) stage of an order. Vendor-controlled transitions:
 * new_assignment -> awaiting_pickup (accept), received_at_vendor -> intake_verified (verify),
 * intake_verified -> under_processing, under_processing -> ready_for_dispatch.
 * received_at_vendor, out_for_delivery and delivered come from the logistics system only.
 */
export type OrderStage =
  | "new_assignment"
  | "awaiting_pickup"
  | "received_at_vendor"
  | "intake_verified"
  | "under_processing"
  | "ready_for_dispatch"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "declined"
  | "reassigned";

/** Order Management tabs (plus the Order History/Exceptions filter). */
export type OrderStatus = "New Orders" | "Accepted" | "Processing" | "Ready for Dispatch" | "Completed" | "Exceptions";

export const STAGE_TAB: Record<OrderStage, OrderStatus> = {
  new_assignment: "New Orders",
  awaiting_pickup: "Accepted",
  received_at_vendor: "Accepted",
  intake_verified: "Processing",
  under_processing: "Processing",
  ready_for_dispatch: "Ready for Dispatch",
  out_for_delivery: "Ready for Dispatch",
  delivered: "Completed",
  cancelled: "Exceptions",
  declined: "Exceptions",
  reassigned: "Exceptions",
};

/** Status label shown on order cards. */
export const STAGE_CARD_LABEL: Record<OrderStage, string> = {
  new_assignment: "New Order",
  awaiting_pickup: "Accepted",
  received_at_vendor: "Received at Vendor",
  intake_verified: "Intake Verified",
  under_processing: "Under Processing",
  ready_for_dispatch: "Ready for Dispatch",
  out_for_delivery: "Out for Delivery",
  delivered: "Completed",
  cancelled: "Cancelled",
  declined: "Declined",
  reassigned: "Reassigned",
};

/** Current stage label shown in the order detail header / status panel. */
export const STAGE_LABEL: Record<OrderStage, string> = {
  new_assignment: "New Assignment",
  awaiting_pickup: "Awaiting Pickup",
  received_at_vendor: "Received at Vendor",
  intake_verified: "Intake Verified",
  under_processing: "Under Processing",
  ready_for_dispatch: "Ready for Dispatch",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  declined: "Declined",
  reassigned: "Reassigned",
};

/** Compact summary state shown under the detail header. */
export const STAGE_SUMMARY: Record<OrderStage, string> = {
  new_assignment: "Awaiting Vendor Acceptance",
  awaiting_pickup: "Awaiting Logistics Pickup",
  received_at_vendor: "Intake Verification Pending",
  intake_verified: "Ready to Start Processing",
  under_processing: "Processing in Progress",
  ready_for_dispatch: "Awaiting Logistics Collection",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered to Customer",
  cancelled: "Order Cancelled",
  declined: "Declined by Vendor",
  reassigned: "Reassigned to Another Vendor",
};

/** Logistics status, owned by the logistics system (read-only for vendors). */
export type LogisticsStatus =
  | "not_scheduled"
  | "pickup_scheduled"
  | "pickup_in_progress"
  | "delivered_to_vendor"
  | "awaiting_collection"
  | "partner_en_route"
  | "collected"
  | "out_for_delivery"
  | "delivered";

export const LOGISTICS_LABEL: Record<LogisticsStatus, string> = {
  not_scheduled: "Pickup not yet scheduled",
  pickup_scheduled: "Pickup scheduled with logistics partner",
  pickup_in_progress: "Logistics partner collecting from customer",
  delivered_to_vendor: "Garments delivered to vendor",
  awaiting_collection: "Awaiting logistics collection",
  partner_en_route: "Logistics partner en route for collection",
  collected: "Collected by logistics partner",
  out_for_delivery: "Out for delivery to customer",
  delivered: "Delivered to customer",
};

export type PayoutStatus = "Estimated" | "Confirmed" | "Paid";

export interface OrderItem {
  id: string;
  garment: string;
  garmentPlural: string;
  service: ServiceType;
  /** Quantity on the logistics pickup record. */
  qty: number;
  /** Fixed vendor rate (₹ per unit) from VENDOR_RATE_CARD. Read-only. */
  rate: number;
}

export interface StatusLogEntry {
  at: string;
  by: string;
  action: string;
  source: "Vendor" | "Logistics" | "Cleclo";
}

export interface IssueReport {
  id: string;
  reason: IssueReason;
  itemId?: string;
  remarks: string;
  photos: string[];
  reportedAt: string;
  resolved: boolean;
}

export const ISSUE_REASONS = [
  "Missing Garment",
  "Additional Garment",
  "Incorrect Service",
  "Damaged Garment",
  "Quantity Mismatch",
  "Processing Concern",
  "Logistics Delay",
] as const;
export type IssueReason = (typeof ISSUE_REASONS)[number];

export interface Order {
  id: string;
  stage: OrderStage;
  logisticsStatus: LogisticsStatus;
  serviceSpeed: ServiceSpeed;
  customerName: string;
  address: string;
  locality: string;
  items: OrderItem[];
  /** Order placed / assigned (ISO). Also used by the date filter. */
  isoDate: string;
  pickupAt: string;
  deliveryDueAt: string;
  /** Only for new assignments: when the acceptance window closes. */
  acceptanceDeadline?: string;
  /** Ready for Dispatch: vendor has confirmed readiness for handover. */
  readinessConfirmed?: boolean;
  /** Total vendor payout as returned by the backend; must equal the sum of item payouts. */
  totalPayout: number;
  payoutStatus: PayoutStatus;
  statusLog: StatusLogEntry[];
  issues: IssueReport[];
  exceptionNote?: string;
}

/* ---------------------------- Fixed rate card ---------------------------- */

/** Cleclo's fixed vendor payout catalog (₹ per unit). Vendors cannot edit these rates. */
export const VENDOR_RATE_CARD: Record<string, { plural: string; rates: Partial<Record<ServiceType, number>> }> = {
  Shirt: { plural: "Shirts", rates: { "Dry Cleaning": 25, Washing: 15, "Steam Ironing": 10 } },
  Jeans: { plural: "Jeans", rates: { "Dry Cleaning": 30, Washing: 20, "Steam Ironing": 12 } },
  "Silk Scarf": { plural: "Silk Scarves", rates: { "Dry Cleaning": 35 } },
  "Men's Jeans": { plural: "Men's Jeans", rates: { Washing: 35, "Dry Cleaning": 45 } },
  "Men's Denim": { plural: "Men's Denim", rates: { Washing: 30, "Dry Cleaning": 40 } },
  Bedsheet: { plural: "Bedsheets", rates: { Washing: 40, "Steam Ironing": 20 } },
  "Pillow Cover": { plural: "Pillow Covers", rates: { Washing: 10, "Steam Ironing": 5 } },
  Curtain: { plural: "Curtains", rates: { "Dry Cleaning": 90, Washing: 60 } },
  Suit: { plural: "Suits", rates: { "Dry Cleaning": 180 } },
  Tie: { plural: "Ties", rates: { "Dry Cleaning": 30 } },
  Saree: { plural: "Sarees", rates: { "Dry Cleaning": 120, "Steam Ironing": 25 } },
  Kurta: { plural: "Kurtas", rates: { Washing: 25, "Steam Ironing": 12 } },
  "T-Shirt": { plural: "T-Shirts", rates: { Washing: 15, "Steam Ironing": 8 } },
  Trouser: { plural: "Trousers", rates: { "Dry Cleaning": 40, Washing: 20, "Steam Ironing": 10 } },
  Towel: { plural: "Towels", rates: { Washing: 12 } },
  Blazer: { plural: "Blazers", rates: { "Dry Cleaning": 150 } },
};

let itemSeq = 0;
function item(garment: string, service: ServiceType, qty: number): OrderItem {
  const entry = VENDOR_RATE_CARD[garment];
  const rate = entry?.rates[service];
  if (!entry || rate === undefined) throw new Error(`No fixed rate for ${garment} / ${service}`);
  itemSeq += 1;
  return { id: `IT-${itemSeq}`, garment, garmentPlural: entry.plural, service, qty, rate };
}

/* -------------------------------- Helpers -------------------------------- */

/** Vendor Payout = Item Quantity x Fixed Vendor Rate. */
export const itemPayout = (i: OrderItem) => i.qty * i.rate;
export const orderTotalQty = (o: Pick<Order, "items">) => o.items.reduce((s, i) => s + i.qty, 0);
export const orderItemsPayout = (o: Pick<Order, "items">) => o.items.reduce((s, i) => s + itemPayout(i), 0);
/** Item-wise totals must match the overall payout calculation. */
export const payoutMatches = (o: Order) => orderItemsPayout(o) === o.totalPayout;
export const getOrderServices = (o: Pick<Order, "items">): ServiceType[] =>
  SERVICE_TYPES.filter((s) => o.items.some((i) => i.service === s));
export const isOrderOverdue = (o: Order, now = new Date()) =>
  !["delivered", "cancelled", "declined", "reassigned"].includes(o.stage) && new Date(o.deliveryDueAt) < now;
export const hasUnresolvedIssues = (o: Order) => o.issues.some((i) => !i.resolved);

export const formatINR = (n: number, decimals = 2) =>
  `₹${n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
/** Absolute date format, e.g. 19 Oct 2026, 2:00 PM */
export const formatOrderDate = (iso: string) => format(new Date(iso), "d MMM yyyy, h:mm a");
/** Short absolute date format, e.g. 19 Oct, 2:00 PM */
export const formatOrderDateShort = (iso: string) => format(new Date(iso), "d MMM, h:mm a");

/* ------------------------------- Demo data ------------------------------- */

const VENDOR_USER = "Ramesh K. (Vendor Staff)";

export function demoOrders(): Order[] {
  itemSeq = 0;
  const now = new Date();
  const today = startOfDay(now);
  const at = (dayOffset: number, h: number, m = 0) => setMinutes(setHours(addDays(today, dayOffset), h), m).toISOString();
  const iso = (d: Date) => d.toISOString();

  const build = (o: Omit<Order, "totalPayout" | "issues" | "statusLog"> & Partial<Pick<Order, "issues" | "statusLog">>): Order => ({
    ...o,
    issues: o.issues ?? [],
    statusLog: o.statusLog ?? [],
    totalPayout: orderItemsPayout(o),
  });

  const assignedLog = (when: string): StatusLogEntry => ({ at: when, by: "Cleclo Operations", action: "Order assigned to vendor", source: "Cleclo" });
  const acceptedLog = (when: string): StatusLogEntry => ({ at: when, by: VENDOR_USER, action: "Order accepted", source: "Vendor" });
  const receivedLog = (when: string): StatusLogEntry => ({ at: when, by: "Cleclo Logistics", action: "Garments delivered to vendor", source: "Logistics" });
  const verifiedLog = (when: string): StatusLogEntry => ({ at: when, by: VENDOR_USER, action: "Received items verified against pickup record", source: "Vendor" });
  const processingLog = (when: string): StatusLogEntry => ({ at: when, by: VENDOR_USER, action: "Processing started", source: "Vendor" });
  const readyLog = (when: string): StatusLogEntry => ({ at: when, by: VENDOR_USER, action: "Marked ready for dispatch", source: "Vendor" });
  const collectedLog = (when: string): StatusLogEntry => ({ at: when, by: "Cleclo Logistics", action: "Collected by logistics partner", source: "Logistics" });
  const deliveredLog = (when: string): StatusLogEntry => ({ at: when, by: "Cleclo Logistics", action: "Delivery confirmed", source: "Logistics" });

  const orders: Order[] = [
    // ---------------- New Orders (3) ----------------
    build({
      id: "CL-00001",
      stage: "new_assignment",
      logisticsStatus: "not_scheduled",
      serviceSpeed: "express48",
      customerName: "John Smith",
      address: "House 14, Road 41, West Punjabi Bagh, New Delhi 110026",
      locality: "Punjabi Bagh",
      items: [item("Shirt", "Dry Cleaning", 3), item("Jeans", "Dry Cleaning", 2), item("Silk Scarf", "Dry Cleaning", 1)],
      isoDate: iso(subMinutes(now, 2)),
      pickupAt: at(0, 14),
      deliveryDueAt: at(2, 10),
      acceptanceDeadline: iso(addMinutes(now, 3)),
      payoutStatus: "Estimated",
      statusLog: [assignedLog(iso(subMinutes(now, 2)))],
    }),
    build({
      id: "CL-00002",
      stage: "new_assignment",
      logisticsStatus: "not_scheduled",
      serviceSpeed: "standard",
      customerName: "Sarah Johnson",
      address: "B-22, Rajouri Garden, New Delhi 110027",
      locality: "Rajouri Garden",
      items: [item("Bedsheet", "Washing", 1), item("Pillow Cover", "Washing", 4), item("Kurta", "Steam Ironing", 3)],
      isoDate: iso(subMinutes(now, 6)),
      pickupAt: at(0, 16, 30),
      deliveryDueAt: at(3, 12),
      acceptanceDeadline: iso(addMinutes(now, 9)),
      payoutStatus: "Estimated",
      statusLog: [assignedLog(iso(subMinutes(now, 6)))],
    }),
    build({
      id: "CL-00003",
      stage: "new_assignment",
      logisticsStatus: "not_scheduled",
      serviceSpeed: "express24",
      customerName: "Mike Chen",
      address: "Flat 7C, Greater Kailash II, New Delhi 110048",
      locality: "Greater Kailash",
      items: [item("Curtain", "Dry Cleaning", 4), item("Saree", "Steam Ironing", 2)],
      isoDate: iso(subMinutes(now, 1)),
      pickupAt: at(0, 17),
      deliveryDueAt: at(1, 17),
      acceptanceDeadline: iso(addMinutes(now, 14)),
      payoutStatus: "Estimated",
      statusLog: [assignedLog(iso(subMinutes(now, 1)))],
    }),

    // ---------------- Accepted (2) ----------------
    build({
      id: "CL-00004",
      stage: "awaiting_pickup",
      logisticsStatus: "pickup_scheduled",
      serviceSpeed: "standard",
      customerName: "Emily Davis",
      address: "12, Ashok Vihar Phase 1, New Delhi 110052",
      locality: "Ashok Vihar",
      items: [item("Suit", "Dry Cleaning", 1), item("Tie", "Dry Cleaning", 2)],
      isoDate: iso(subHours(now, 3)),
      pickupAt: at(0, 18),
      deliveryDueAt: at(3, 18),
      payoutStatus: "Estimated",
      statusLog: [assignedLog(iso(subHours(now, 3))), acceptedLog(iso(subHours(now, 2.9)))],
    }),
    build({
      id: "CL-00005",
      stage: "received_at_vendor",
      logisticsStatus: "delivered_to_vendor",
      serviceSpeed: "express48",
      customerName: "Arjun Mehta",
      address: "45, Model Town III, New Delhi 110009",
      locality: "Model Town",
      items: [item("Men's Jeans", "Washing", 1), item("Men's Denim", "Washing", 4)],
      isoDate: iso(subHours(now, 7)),
      pickupAt: iso(subHours(now, 3)),
      deliveryDueAt: at(1, 10),
      payoutStatus: "Estimated",
      statusLog: [
        assignedLog(iso(subHours(now, 7))),
        acceptedLog(iso(subHours(now, 6.8))),
        { at: iso(subHours(now, 3)), by: "Cleclo Logistics", action: "Picked up from customer", source: "Logistics" },
        receivedLog(iso(subHours(now, 1))),
      ],
    }),

    // ---------------- Processing (5) ----------------
    build({
      id: "CL-00006",
      stage: "intake_verified",
      logisticsStatus: "delivered_to_vendor",
      serviceSpeed: "standard",
      customerName: "Priya Sharma",
      address: "C-9, Janakpuri, New Delhi 110058",
      locality: "Janakpuri",
      items: [item("Saree", "Dry Cleaning", 2), item("Kurta", "Steam Ironing", 4)],
      isoDate: iso(subDays(now, 1)),
      pickupAt: at(-1, 15),
      deliveryDueAt: at(2, 11),
      payoutStatus: "Estimated",
      statusLog: [
        assignedLog(at(-1, 9)),
        acceptedLog(at(-1, 9, 4)),
        receivedLog(at(-1, 17)),
        verifiedLog(at(0, 9, 15)),
      ],
    }),
    build({
      id: "CL-00007",
      stage: "under_processing",
      logisticsStatus: "delivered_to_vendor",
      serviceSpeed: "express24",
      customerName: "Robert Wilson",
      address: "88, Paschim Vihar, New Delhi 110063",
      locality: "Paschim Vihar",
      items: [item("Blazer", "Dry Cleaning", 1), item("Trouser", "Dry Cleaning", 2), item("Shirt", "Steam Ironing", 3)],
      isoDate: iso(subDays(now, 1)),
      pickupAt: at(-1, 12),
      deliveryDueAt: iso(subHours(now, 1)),
      payoutStatus: "Estimated",
      statusLog: [
        assignedLog(at(-1, 8)),
        acceptedLog(at(-1, 8, 3)),
        receivedLog(at(-1, 14)),
        verifiedLog(at(-1, 14, 30)),
        processingLog(at(-1, 15)),
      ],
    }),
    build({
      id: "CL-00008",
      stage: "under_processing",
      logisticsStatus: "delivered_to_vendor",
      serviceSpeed: "standard",
      customerName: "Lisa Anderson",
      address: "21, Tilak Nagar, New Delhi 110018",
      locality: "Tilak Nagar",
      items: [item("T-Shirt", "Washing", 6), item("Towel", "Washing", 4)],
      isoDate: iso(subDays(now, 2)),
      pickupAt: at(-2, 13),
      deliveryDueAt: at(1, 13),
      payoutStatus: "Estimated",
      statusLog: [
        assignedLog(at(-2, 10)),
        acceptedLog(at(-2, 10, 6)),
        receivedLog(at(-2, 15)),
        verifiedLog(at(-2, 15, 20)),
        processingLog(at(-1, 10)),
      ],
    }),
    build({
      id: "CL-00009",
      stage: "under_processing",
      logisticsStatus: "delivered_to_vendor",
      serviceSpeed: "express48",
      customerName: "Neha Kapoor",
      address: "5, Vikaspuri, New Delhi 110018",
      locality: "Vikaspuri",
      items: [item("Shirt", "Washing", 5), item("Trouser", "Steam Ironing", 3)],
      isoDate: iso(subDays(now, 1)),
      pickupAt: at(-1, 11),
      deliveryDueAt: at(1, 11),
      payoutStatus: "Estimated",
      statusLog: [
        assignedLog(at(-1, 7, 30)),
        acceptedLog(at(-1, 7, 35)),
        receivedLog(at(-1, 13)),
        verifiedLog(at(-1, 13, 20)),
        processingLog(at(-1, 14)),
      ],
    }),
    build({
      id: "CL-00010",
      stage: "under_processing",
      logisticsStatus: "delivered_to_vendor",
      serviceSpeed: "standard",
      customerName: "Vikram Singh",
      address: "17, Shalimar Bagh, New Delhi 110088",
      locality: "Shalimar Bagh",
      items: [item("Curtain", "Washing", 2), item("Bedsheet", "Steam Ironing", 2)],
      isoDate: iso(subDays(now, 2)),
      pickupAt: at(-2, 16),
      deliveryDueAt: at(2, 16),
      payoutStatus: "Estimated",
      statusLog: [
        assignedLog(at(-2, 11)),
        acceptedLog(at(-2, 11, 2)),
        receivedLog(at(-2, 18)),
        verifiedLog(at(-1, 9)),
        processingLog(at(-1, 9, 30)),
      ],
    }),

    // ---------------- Ready for Dispatch (2) ----------------
    build({
      id: "CL-00011",
      stage: "ready_for_dispatch",
      logisticsStatus: "partner_en_route",
      serviceSpeed: "express48",
      customerName: "Amit Patel",
      address: "33, Karol Bagh, New Delhi 110005",
      locality: "Karol Bagh",
      items: [item("Suit", "Dry Cleaning", 2), item("Shirt", "Steam Ironing", 4)],
      isoDate: iso(subDays(now, 2)),
      pickupAt: at(-2, 10),
      deliveryDueAt: at(0, 20),
      readinessConfirmed: true,
      payoutStatus: "Confirmed",
      statusLog: [
        assignedLog(at(-2, 8)),
        acceptedLog(at(-2, 8, 5)),
        receivedLog(at(-2, 12)),
        verifiedLog(at(-2, 12, 30)),
        processingLog(at(-2, 13)),
        readyLog(at(0, 9)),
      ],
    }),
    build({
      id: "CL-00012",
      stage: "out_for_delivery",
      logisticsStatus: "out_for_delivery",
      serviceSpeed: "standard",
      customerName: "Kavya Reddy",
      address: "9, Dwarka Sector 10, New Delhi 110075",
      locality: "Dwarka",
      items: [item("Kurta", "Washing", 4), item("Saree", "Steam Ironing", 2)],
      isoDate: iso(subDays(now, 3)),
      pickupAt: at(-3, 14),
      deliveryDueAt: at(0, 19),
      readinessConfirmed: true,
      payoutStatus: "Confirmed",
      statusLog: [
        assignedLog(at(-3, 9)),
        acceptedLog(at(-3, 9, 2)),
        receivedLog(at(-3, 16)),
        verifiedLog(at(-3, 16, 30)),
        processingLog(at(-2, 9)),
        readyLog(at(-1, 18)),
        collectedLog(at(0, 10)),
      ],
    }),

    // ---------------- Completed (2) ----------------
    build({
      id: "CL-00013",
      stage: "delivered",
      logisticsStatus: "delivered",
      serviceSpeed: "standard",
      customerName: "David Brown",
      address: "62, Rohini Sector 7, New Delhi 110085",
      locality: "Rohini",
      items: [item("Shirt", "Washing", 4), item("Trouser", "Washing", 2)],
      isoDate: iso(subDays(now, 5)),
      pickupAt: at(-5, 12),
      deliveryDueAt: at(-2, 12),
      payoutStatus: "Paid",
      statusLog: [
        assignedLog(at(-5, 9)),
        acceptedLog(at(-5, 9, 3)),
        receivedLog(at(-5, 14)),
        verifiedLog(at(-5, 14, 20)),
        processingLog(at(-4, 9)),
        readyLog(at(-3, 17)),
        collectedLog(at(-2, 9)),
        deliveredLog(at(-2, 11)),
      ],
    }),
    build({
      id: "CL-00014",
      stage: "delivered",
      logisticsStatus: "delivered",
      serviceSpeed: "express24",
      customerName: "Chris Martin",
      address: "4, Tilak Nagar, New Delhi 110018",
      locality: "Tilak Nagar",
      items: [item("Bedsheet", "Washing", 4), item("Towel", "Washing", 8)],
      isoDate: iso(subDays(now, 4)),
      pickupAt: at(-4, 10),
      deliveryDueAt: at(-3, 10),
      payoutStatus: "Confirmed",
      statusLog: [
        assignedLog(at(-4, 8)),
        acceptedLog(at(-4, 8, 1)),
        receivedLog(at(-4, 12)),
        verifiedLog(at(-4, 12, 15)),
        processingLog(at(-4, 12, 30)),
        readyLog(at(-4, 22)),
        collectedLog(at(-3, 7)),
        deliveredLog(at(-3, 9, 30)),
      ],
    }),

    // ---------------- Order History / Exceptions ----------------
    build({
      id: "CL-00015",
      stage: "declined",
      logisticsStatus: "not_scheduled",
      serviceSpeed: "express24",
      customerName: "Rahul Verma",
      address: "11, Pitampura, New Delhi 110034",
      locality: "Pitampura",
      items: [item("Blazer", "Dry Cleaning", 2)],
      isoDate: iso(subDays(now, 1)),
      pickupAt: at(-1, 18),
      deliveryDueAt: at(0, 18),
      payoutStatus: "Estimated",
      exceptionNote: "Declined by vendor – capacity full. Routed for reassignment.",
      statusLog: [
        assignedLog(at(-1, 15)),
        { at: at(-1, 15, 4), by: VENDOR_USER, action: "Order declined (capacity full)", source: "Vendor" },
      ],
    }),
    build({
      id: "CL-00016",
      stage: "reassigned",
      logisticsStatus: "not_scheduled",
      serviceSpeed: "standard",
      customerName: "Sneha Gupta",
      address: "27, Subhash Nagar, New Delhi 110027",
      locality: "Subhash Nagar",
      items: [item("Shirt", "Steam Ironing", 6)],
      isoDate: iso(subDays(now, 2)),
      pickupAt: at(-2, 17),
      deliveryDueAt: at(1, 17),
      payoutStatus: "Estimated",
      exceptionNote: "Acceptance window expired. Reassigned by Cleclo.",
      statusLog: [
        assignedLog(at(-2, 12)),
        { at: at(-2, 12, 15), by: "Cleclo Operations", action: "Acceptance window expired – reassigned", source: "Cleclo" },
      ],
    }),
    build({
      id: "CL-00017",
      stage: "cancelled",
      logisticsStatus: "not_scheduled",
      serviceSpeed: "express48",
      customerName: "Manish Arora",
      address: "3, Moti Nagar, New Delhi 110015",
      locality: "Moti Nagar",
      items: [item("Jeans", "Washing", 3)],
      isoDate: iso(subDays(now, 3)),
      pickupAt: at(-3, 11),
      deliveryDueAt: at(-1, 11),
      payoutStatus: "Estimated",
      exceptionNote: "Cancelled by customer before pickup.",
      statusLog: [
        assignedLog(at(-3, 8)),
        acceptedLog(at(-3, 8, 2)),
        { at: at(-3, 10), by: "Cleclo Operations", action: "Order cancelled by customer", source: "Cleclo" },
      ],
    }),
  ];
  return orders;
}
