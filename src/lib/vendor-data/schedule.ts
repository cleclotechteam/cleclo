// Pickup & Delivery (Order Onboard) demo data.
//
// Cleclo keeps three workflows separate:
//   1. Order Acceptance – vendor accepts or declines a newly assigned order (not on this screen).
//   2. Pickup & Delivery Logistics – vendor tracks rider assignments, pickup slots and handovers (this data).
//   3. Order Processing – vendor updates cleaning progress, item readiness and completion (All Orders screen).
// Rider assignment and route management remain with Cleclo's logistics system; vendors only get visibility.
// `pickupStatus` is therefore a LOGISTICS status, separate from processing statuses such as
// Under Processing or Ready for Delivery, and `priority` (Express) is a service turnaround
// category, not a logistics status — it can overlap with any pickup/delivery status.
// SLA alerts (express, delayed) are derived on the client and never overwrite `pickupStatus`.
import { addDays, addHours, addMinutes, format, startOfDay } from "date-fns";

const ISO_LOCAL = "yyyy-MM-dd'T'HH:mm:ss";

export type ScheduleDirection = "pickup" | "delivery";

export type PickupStatus =
  | "not_scheduled"
  | "scheduled"
  | "rider_assigned"
  | "en_route"
  | "picked_up"
  | "received_at_outlet"
  | "delayed"
  | "cancelled";

export type OrderPriority = "Standard" | "Express 48H" | "Express 24H";

export type ServiceTypeName = "Drycleaning" | "Washing" | "Steam Ironing";

/** Live rider tracking, only present when Cleclo's logistics system provides it. */
export type RiderTracking = "assigned" | "en_route" | "arrived";

export interface ScheduleItem {
  name: string;
  quantity: number;
}

/** Recorded when the vendor confirms the items actually received from the rider. */
export interface HandoverRecord {
  confirmedAt: string;
  received: { name: string; expected: number; received: number }[];
  /** Free-text discrepancy note; empty when everything matched. */
  discrepancyNote: string;
  hasDiscrepancy: boolean;
}

export interface ScheduleEntry {
  id: string;
  /** Cleclo Order ID, e.g. CL-0001. */
  orderId: string;
  customer: string;
  phone: string;
  address: string;
  city: string;
  /** Inbound pickup (customer → outlet) or outbound delivery (outlet → customer). */
  direction: ScheduleDirection;
  /** Scheduled slot (date + time window), ISO local strings. */
  slotStart: string;
  slotEnd: string;
  serviceTypes: ServiceTypeName[];
  qty: number;
  priority: OrderPriority;
  /** null = Awaiting Assignment (assigned by Cleclo logistics, never by the vendor). */
  rider: string | null;
  riderTracking: RiderTracking | null;
  pickupStatus: PickupStatus;
  /** Committed delivery date and time. */
  deliveryDue: string;
  /** Special instructions from the customer. */
  note?: string;
  orderItems: ScheduleItem[];
  /** When the logistics leg finished (received at outlet / delivered to customer). */
  completedAt?: string;
  handover?: HandoverRecord;
}

export function demoSchedule(): ScheduleEntry[] {
  const today = startOfDay(new Date());
  const at = (day: number, hour: number, minute = 0) =>
    format(addMinutes(addHours(addDays(today, day), hour), minute), ISO_LOCAL);

  return [
    {
      id: "PU-001",
      orderId: "CL-0001",
      customer: "Sarah Johnson",
      phone: "+91 98765 43210",
      address: "452 Maple Ave, Apt 4B",
      city: "Bengaluru 560034",
      direction: "pickup",
      slotStart: at(0, 10),
      slotEnd: at(0, 12),
      serviceTypes: ["Washing", "Steam Ironing"],
      qty: 5,
      priority: "Standard",
      rider: "John Doe",
      riderTracking: "en_route",
      pickupStatus: "en_route",
      deliveryDue: at(2, 18),
      note: "Coffee stain on front of the white shirt. Please pre-treat before washing and avoid bleach.",
      orderItems: [
        { name: "White Shirt", quantity: 2 },
        { name: "Black Trousers", quantity: 3 },
      ],
    },
    {
      id: "PU-002",
      orderId: "CL-0002",
      customer: "Michael Chen",
      phone: "+91 98450 12345",
      address: "789 Oak Street, Suite 12",
      city: "Bengaluru 560038",
      direction: "pickup",
      slotStart: at(0, 8),
      slotEnd: at(0, 10),
      serviceTypes: ["Drycleaning"],
      qty: 3,
      priority: "Express 24H",
      rider: "Mike Smith",
      riderTracking: "arrived",
      pickupStatus: "picked_up",
      deliveryDue: at(1, 10),
      note: "Oil stain on white shirt collar.",
      orderItems: [{ name: "White Shirt", quantity: 3 }],
    },
    {
      id: "PU-003",
      orderId: "CL-0003",
      customer: "James Wilson",
      phone: "+91 99000 45678",
      address: "321 Cedar Lane, Unit 5",
      city: "Bengaluru 560008",
      direction: "pickup",
      slotStart: at(0, 14),
      slotEnd: at(0, 16),
      serviceTypes: ["Drycleaning"],
      qty: 4,
      priority: "Express 48H",
      rider: "Sarah Wilson",
      riderTracking: "assigned",
      pickupStatus: "rider_assigned",
      deliveryDue: at(2, 14),
      note: "Delicate silk items – hand finish only, no steam press on the scarves.",
      orderItems: [
        { name: "Silk Blouse", quantity: 2 },
        { name: "Silk Scarf", quantity: 2 },
      ],
    },
    {
      id: "PU-004",
      orderId: "CL-0004",
      customer: "Ananya Rao",
      phone: "+91 97400 22110",
      address: "18 Lake View Road",
      city: "Bengaluru 560076",
      direction: "pickup",
      slotStart: at(0, 9),
      slotEnd: at(0, 11),
      serviceTypes: ["Washing"],
      qty: 6,
      priority: "Standard",
      rider: "Ravi Kumar",
      riderTracking: "arrived",
      pickupStatus: "received_at_outlet",
      deliveryDue: at(3, 18),
      orderItems: [
        { name: "Bedsheet", quantity: 2 },
        { name: "Pillow Cover", quantity: 4 },
      ],
      completedAt: at(0, 10, 40),
      handover: {
        confirmedAt: at(0, 10, 40),
        received: [
          { name: "Bedsheet", expected: 2, received: 2 },
          { name: "Pillow Cover", expected: 4, received: 3 },
        ],
        discrepancyNote: "One pillow cover missing from the bag; rider informed.",
        hasDiscrepancy: true,
      },
    },
    {
      id: "PU-005",
      orderId: "CL-0005",
      customer: "Michael Brown",
      phone: "+91 98861 33445",
      address: "220 Elm St, Apt 5C",
      city: "Bengaluru 560001",
      direction: "pickup",
      slotStart: at(0, 16),
      slotEnd: at(0, 18),
      serviceTypes: ["Drycleaning"],
      qty: 2,
      priority: "Standard",
      rider: null,
      riderTracking: null,
      pickupStatus: "not_scheduled",
      deliveryDue: at(3, 12),
      note: "Color bleed risk on red dress – wash separately.",
      orderItems: [
        { name: "Red Dress", quantity: 1 },
        { name: "Cotton T-Shirt", quantity: 1 },
      ],
    },
    {
      id: "PU-006",
      orderId: "CL-0006",
      customer: "David Lee",
      phone: "+91 99860 78901",
      address: "789 Pine St",
      city: "Bengaluru 560025",
      direction: "pickup",
      slotStart: at(0, 12),
      slotEnd: at(0, 14),
      serviceTypes: ["Washing", "Steam Ironing"],
      qty: 7,
      priority: "Express 24H",
      rider: null,
      riderTracking: null,
      pickupStatus: "scheduled",
      deliveryDue: at(1, 14),
      note: "Grass stains on knees of the jeans.",
      orderItems: [
        { name: "Blue Jeans", quantity: 4 },
        { name: "Kids T-Shirt", quantity: 3 },
      ],
    },
    {
      id: "PU-007",
      orderId: "CL-0007",
      customer: "Priya Sharma",
      phone: "+91 90080 55667",
      address: "5 MG Road, Flat 302",
      city: "Bengaluru 560001",
      direction: "pickup",
      slotStart: at(0, 11),
      slotEnd: at(0, 13),
      serviceTypes: ["Drycleaning", "Steam Ironing"],
      qty: 3,
      priority: "Standard",
      rider: "Arjun Mehta",
      riderTracking: "en_route",
      pickupStatus: "delayed",
      deliveryDue: at(2, 18),
      orderItems: [
        { name: "Saree", quantity: 2 },
        { name: "Blazer", quantity: 1 },
      ],
    },
    {
      id: "PU-008",
      orderId: "CL-0008",
      customer: "Karan Patel",
      phone: "+91 98440 11223",
      address: "77 Residency Road",
      city: "Bengaluru 560025",
      direction: "pickup",
      slotStart: at(-1, 15),
      slotEnd: at(-1, 17),
      serviceTypes: ["Washing"],
      qty: 4,
      priority: "Standard",
      rider: null,
      riderTracking: null,
      pickupStatus: "cancelled",
      deliveryDue: at(2, 12),
      note: "Customer cancelled – travelling.",
      orderItems: [{ name: "Cotton Shirt", quantity: 4 }],
    },
    {
      id: "PU-009",
      orderId: "CL-0009",
      customer: "Neha Iyer",
      phone: "+91 97311 66778",
      address: "41 Indiranagar 2nd Stage",
      city: "Bengaluru 560038",
      direction: "pickup",
      slotStart: at(1, 10),
      slotEnd: at(1, 12),
      serviceTypes: ["Drycleaning"],
      qty: 2,
      priority: "Express 48H",
      rider: null,
      riderTracking: null,
      pickupStatus: "scheduled",
      deliveryDue: at(3, 10),
      orderItems: [{ name: "Wool Coat", quantity: 2 }],
    },
    {
      id: "DL-001",
      orderId: "CL-0010",
      customer: "Emily Davis",
      phone: "+91 98450 34567",
      address: "156 Pine Road",
      city: "Bengaluru 560008",
      direction: "delivery",
      slotStart: at(0, 17),
      slotEnd: at(0, 19),
      serviceTypes: ["Washing"],
      qty: 8,
      priority: "Standard",
      rider: null,
      riderTracking: null,
      pickupStatus: "scheduled",
      deliveryDue: at(0, 19),
      orderItems: [
        { name: "Towel", quantity: 4 },
        { name: "Cotton Shirt", quantity: 4 },
      ],
    },
    {
      id: "DL-002",
      orderId: "CL-0011",
      customer: "Lisa Anderson",
      phone: "+91 99001 56789",
      address: "888 Birch Boulevard",
      city: "Bengaluru 560017",
      direction: "delivery",
      slotStart: at(0, 13),
      slotEnd: at(0, 15),
      serviceTypes: ["Drycleaning"],
      qty: 6,
      priority: "Express 24H",
      rider: "Mike Smith",
      riderTracking: "assigned",
      pickupStatus: "rider_assigned",
      deliveryDue: at(0, 15),
      note: "Deliver to the security desk if the customer is unavailable.",
      orderItems: [{ name: "Suit (2-piece)", quantity: 3 }, { name: "Tie", quantity: 3 }],
    },
    {
      id: "DL-003",
      orderId: "CL-0012",
      customer: "Robert Taylor",
      phone: "+91 98860 67890",
      address: "456 Pine St",
      city: "Bengaluru 560034",
      direction: "delivery",
      slotStart: at(0, 9),
      slotEnd: at(0, 11),
      serviceTypes: ["Steam Ironing"],
      qty: 3,
      priority: "Express 48H",
      rider: "John Doe",
      riderTracking: "arrived",
      pickupStatus: "picked_up",
      deliveryDue: at(0, 11),
      orderItems: [{ name: "Formal Shirt", quantity: 3 }],
      completedAt: at(0, 10, 15),
    },
    {
      id: "DL-004",
      orderId: "CL-0013",
      customer: "Vikram Nair",
      phone: "+91 90350 44556",
      address: "12 Koramangala 5th Block",
      city: "Bengaluru 560095",
      direction: "delivery",
      slotStart: at(1, 10),
      slotEnd: at(1, 12),
      serviceTypes: ["Washing", "Steam Ironing"],
      qty: 5,
      priority: "Standard",
      rider: null,
      riderTracking: null,
      pickupStatus: "not_scheduled",
      deliveryDue: at(1, 12),
      orderItems: [{ name: "Kurta", quantity: 5 }],
    },
  ];
}
