// Demo data for the vendor dashboard, used until the backend API exists.
// Every date is generated relative to "now" so the default date filters always have rows to show.
// The shapes here are the contract the API responses are expected to follow.
import { demoNewOrderDetails, orderPayout, orderPieces } from "./new-order";
import { sheetRate } from "./sheet-rates";

const MENS_SHIRT = { section: "MEN", item: "Shirt" } as const;

/* ------------------------------ Dashboard overview ------------------------------ */

// Dashboard overview orders (statuses, SLA alerts, pickup schedule) live in ./dashboard.
export * from "./dashboard";

// The alert toast reads id/customer/items/earning/time; the acceptance popup reads `details`
// (item lines with locked vendor payout rates; see ./new-order for the backend notes).
export const demoNewOrderAlert = () => {
  const details = demoNewOrderDetails();
  const pieces = orderPieces(details.lines);
  return {
    id: details.orderId,
    customer: details.customer,
    items: `${pieces} Items`,
    earning: `₹${orderPayout(details.lines)}`,
    time: "Just now",
    details,
  };
};

/* ----------------------------------- Orders ----------------------------------- */

// Order Management types, fixed vendor rate card and demo orders (incl. backend flow notes) live in ./orders.
export { demoOrders } from "./orders";
export type { Order, OrderStatus, ServiceSpeed } from "./orders";

/* ---------------------------------- Schedule ---------------------------------- */

// Pickup & Delivery list data lives in ./schedule (logistics statuses, handover records, SLA notes).
export { demoSchedule } from "./schedule";
export type { ScheduleEntry } from "./schedule";

// Intake verification details are derived from the Pickup & Delivery rows in ./schedule (see ./intake).
export { demoScheduleDetails } from "./intake";
export type { ScheduleDetail } from "./intake";

/* ---------------------------------- Services ---------------------------------- */

// Backend: services and their rates are defined centrally by Cleclo (read-only for
// vendors). Vendors can only toggle `available` based on operational capacity.
const assignedServices = [
  {
    id: 1,
    name: "Drycleaning",
    description:
      "Professional solvent-based care for delicate and structured garments.",
    category: "Dry Clean",
    available: true,
  },
  {
    id: 2,
    name: "Washing",
    description:
      "Professional machine washing with fabric-appropriate detergents and controlled drying for everyday garments.",
    category: "Wash",
    available: true,
  },
  {
    id: 3,
    name: "Steam Ironing",
    description:
      "Precision steam finishing for wrinkle-free, crisp presentation of garments.",
    category: "Iron",
    available: true,
  },
];

export const demoServices = () => assignedServices;

export type AssignedService = (typeof assignedServices)[number];

/* ---------------------------------- Earnings ---------------------------------- */

// Ledger, payout and settlement data (with the financial rules A–F) live in ./earnings.

/* -------------------------------- Notifications -------------------------------- */

const NOTIFICATIONS = [
  {
    id: "CL-0001",
    type: "new_order",
    title: "New Order Assigned",
    customer: "Mark Wilson",
    items: `${orderPieces(demoNewOrderDetails().lines)} Items`,
    earning: `₹${orderPayout(demoNewOrderDetails().lines)}`,
    time: "Just now",
    unread: true,
  },
  {
    id: "CL-0004",
    type: "processing",
    title: "Order Ready for Dispatch",
    customer: "Alice Freeman",
    items: "5 Units • Washing",
    // 5 x Men's Shirt (Washing), vendor rate from the Cleclo rate sheet
    earning: `₹${5 * sheetRate(MENS_SHIRT, "Washing")}`,
    time: "5 min ago",
    unread: true,
  },
  {
    id: "CL-0002",
    type: "completed",
    title: "Order Completed",
    customer: "Sarah Jenkins",
    items: "10 Units • Washing, Steam Ironing",
    // 6 x Men's Shirt (Washing) + 4 x Men's Shirt (Steam Ironing), rates from the Cleclo rate sheet
    earning: `₹${6 * sheetRate(MENS_SHIRT, "Washing") + 4 * sheetRate(MENS_SHIRT, "Steam Ironing")}`,
    time: "1 hour ago",
    unread: false,
  },
];

export const demoNotifications = () => NOTIFICATIONS;

export type VendorNotification = (typeof NOTIFICATIONS)[number];
