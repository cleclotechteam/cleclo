// Dashboard Overview: order status / SLA vocabulary shared by the overview screen and its demo data.
import { differenceInMinutes, isSameDay } from "date-fns";

/** Operational status chips, in lifecycle order (Cancelled can happen at any point). */
export const DASHBOARD_STATUSES = [
  "Assigned",
  "Pending Pickup",
  "Picked Up",
  "Under Processing",
  "Ready for Delivery",
  "Completed",
  "Cancelled",
] as const;
export type DashboardStatus = (typeof DASHBOARD_STATUSES)[number];

export const DASHBOARD_SERVICES = ["Dry Cleaning", "Washing", "Steam Iron"] as const;
export type DashboardService = (typeof DASHBOARD_SERVICES)[number];

export const SLA_ALERTS = ["On Time", "Due Soon", "Overdue"] as const;
export type SlaAlert = (typeof SLA_ALERTS)[number];

/** An order is "Due Soon" once its committed delivery time is this close. */
export const DASHBOARD_DUE_SOON_HOURS = 6;

const TERMINAL: DashboardStatus[] = ["Completed", "Cancelled"];

export const isClosedDashboardStatus = (status: DashboardStatus) => TERMINAL.includes(status);

/**
 * SLA alert for an order, from its committed delivery date/time (`isoDate`).
 * Closed orders (Completed / Cancelled) carry no alert.
 */
export function getSlaAlert(
  order: { status: DashboardStatus; isoDate: string },
  now: Date = new Date(),
): SlaAlert | null {
  if (isClosedDashboardStatus(order.status)) return null;
  const minutesLeft = differenceInMinutes(new Date(order.isoDate), now);
  if (minutesLeft < 0) return "Overdue";
  if (minutesLeft <= DASHBOARD_DUE_SOON_HOURS * 60) return "Due Soon";
  return "On Time";
}

export const isDashboardDueToday = (order: { status: DashboardStatus; isoDate: string }, now: Date = new Date()) =>
  !isClosedDashboardStatus(order.status) && isSameDay(new Date(order.isoDate), now);

/**
 * Statuses a vendor may move an order to from its current status.
 * Assigned orders are moved forward with "Accept" (-> Pending Pickup), not "Update Status".
 * Backend: status changes must be validated server-side against this same sequence
 * and every change should notify the customer / rider app.
 */
export function getNextDashboardStatuses(status: DashboardStatus): DashboardStatus[] {
  if (status === "Assigned" || isClosedDashboardStatus(status)) return [];
  const idx = DASHBOARD_STATUSES.indexOf(status);
  // Forward through the lifecycle up to Completed (index 5).
  return DASHBOARD_STATUSES.slice(idx + 1, 6) as DashboardStatus[];
}

/**
 * Orders that need the vendor to act:
 * - "acceptance": newly Assigned and not yet accepted.
 * - "status-update": the order's real-world state has likely moved on but the status hasn't
 *   (pickup slot has passed while still Pending Pickup, Picked Up not yet moved into processing,
 *   or an open order that is Due Soon / Overdue).
 */
export function getDashboardPendingAction(
  order: { status: DashboardStatus; isoDate: string; pickupDate: Date },
  now: Date = new Date(),
): "acceptance" | "status-update" | null {
  if (order.status === "Assigned") return "acceptance";
  if (isClosedDashboardStatus(order.status)) return null;
  if (order.status === "Pending Pickup") return order.pickupDate < now ? "status-update" : null;
  if (order.status === "Picked Up") return "status-update";
  if (order.status === "Ready for Delivery") return null;
  const alert = getSlaAlert(order, now);
  return alert === "Overdue" || alert === "Due Soon" ? "status-update" : null;
}

/* ------------------------------ Demo data ------------------------------ */

export interface DashboardOrder {
  /** Order ID, e.g. CL-0001. */
  id: string;
  customer: string;
  customerType: "Regular" | "New Customer" | "VIP";
  service: DashboardService;
  /** Number of units (garments) in the order. */
  qty: number;
  /** Scheduled pickup date & time (start of the pickup slot). */
  pickupDate: Date;
  /** Pickup slot label, e.g. "2:00 PM – 4:00 PM". */
  pickupSlot: string;
  /** Rider assigned by the platform; null until one is allocated. */
  rider: string | null;
  /** Committed delivery date & time (ISO). Drives the On Time / Due Soon / Overdue alert. */
  isoDate: string;
  status: DashboardStatus;
}

const PICKUP_SLOT_HOURS = 2;

export const formatDashboardPickupSlot = (start: Date) => {
  const end = new Date(start.getTime() + PICKUP_SLOT_HOURS * 3_600_000);
  const fmt = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${fmt(start)} – ${fmt(end)}`;
};

/** Every date is relative to "now" so the SLA alerts and today's pickup schedule always have rows. */
export function demoDashboardOrders(): DashboardOrder[] {
  const now = new Date();
  const hours = (h: number) => new Date(now.getTime() + h * 3_600_000);
  const todayAt = (h: number, dayOffset = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(h, 0, 0, 0);
    return d;
  };
  const order = (
    o: Omit<DashboardOrder, "pickupSlot" | "isoDate"> & { due: Date },
  ): DashboardOrder => {
    const { due, ...rest } = o;
    return { ...rest, pickupSlot: formatDashboardPickupSlot(o.pickupDate), isoDate: due.toISOString() };
  };

  return [
    order({ id: "CL-0012", customer: "Mark Wilson", customerType: "New Customer", service: "Dry Cleaning", qty: 2, pickupDate: todayAt(16), rider: "Ravi Kumar", status: "Assigned", due: new Date(todayAt(16).getTime() + 24 * 3_600_000) }),
    order({ id: "CL-0011", customer: "Emily Chen", customerType: "Regular", service: "Washing", qty: 6, pickupDate: todayAt(18), rider: null, status: "Assigned", due: new Date(todayAt(18).getTime() + 72 * 3_600_000) }),
    order({ id: "CL-0010", customer: "Michael Brown", customerType: "VIP", service: "Steam Iron", qty: 8, pickupDate: todayAt(10, 1), rider: "Arjun Singh", status: "Assigned", due: new Date(todayAt(10, 1).getTime() + 24 * 3_600_000) }),
    order({ id: "CL-0009", customer: "James Doe", customerType: "Regular", service: "Dry Cleaning", qty: 1, pickupDate: todayAt(14), rider: "Suresh Yadav", status: "Pending Pickup", due: new Date(todayAt(14).getTime() + 48 * 3_600_000) }),
    order({ id: "CL-0008", customer: "Priya Sharma", customerType: "Regular", service: "Washing", qty: 4, pickupDate: hours(-3), rider: "Ravi Kumar", status: "Picked Up", due: hours(45) }),
    order({ id: "CL-0007", customer: "Lisa Wang", customerType: "New Customer", service: "Washing", qty: 10, pickupDate: hours(-73), rider: "Arjun Singh", status: "Under Processing", due: hours(-1) }),
    order({ id: "CL-0006", customer: "Alice Freeman", customerType: "Regular", service: "Washing", qty: 5, pickupDate: hours(-68), rider: "Suresh Yadav", status: "Under Processing", due: hours(4) }),
    order({ id: "CL-0005", customer: "David Miller", customerType: "Regular", service: "Dry Cleaning", qty: 2, pickupDate: hours(-20), rider: "Ravi Kumar", status: "Under Processing", due: hours(52) }),
    order({ id: "CL-0004", customer: "Sarah Jenkins", customerType: "VIP", service: "Steam Iron", qty: 12, pickupDate: hours(-45), rider: "Arjun Singh", status: "Ready for Delivery", due: hours(3) }),
    order({ id: "CL-0003", customer: "Sophie Turner", customerType: "VIP", service: "Dry Cleaning", qty: 1, pickupDate: hours(-28), rider: "Suresh Yadav", status: "Ready for Delivery", due: hours(20) }),
    order({ id: "CL-0002", customer: "Rahul Verma", customerType: "Regular", service: "Washing", qty: 7, pickupDate: hours(-96), rider: "Ravi Kumar", status: "Completed", due: hours(-24) }),
    order({ id: "CL-0001", customer: "Neha Gupta", customerType: "New Customer", service: "Steam Iron", qty: 3, pickupDate: hours(-80), rider: null, status: "Cancelled", due: hours(-56) }),
  ];
}
