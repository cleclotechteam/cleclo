// Demo data for the vendor dashboard, used until the backend API exists.
// Every date is generated relative to "now" so the default date filters always have rows to show.
// The shapes here are the contract the API responses are expected to follow.
import { addHours, differenceInCalendarDays, addDays, format, subDays, subHours } from "date-fns";

const ISO_LOCAL = "yyyy-MM-dd'T'HH:mm:ss";

// Date-only strings parse as UTC; pin them to midday so they stay on the same local day.
const parseIso = (iso: string) => new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);

/** Shifts every `isoDate` by whole days so the newest item lands on today (and refreshes `date` labels). */
function rebaseToToday<T extends { isoDate?: string; date?: string }>(items: T[]): T[] {
  const dates = items.filter((i) => i.isoDate).map((i) => parseIso(i.isoDate!));
  if (dates.length === 0) return items;
  const newest = new Date(Math.max(...dates.map((d) => d.getTime())));
  const shift = differenceInCalendarDays(new Date(), newest);
  return items.map((item) => {
    if (!item.isoDate) return item;
    const shifted = addDays(parseIso(item.isoDate), shift);
    return {
      ...item,
      isoDate: format(shifted, ISO_LOCAL),
      ...(item.date ? { date: format(shifted, "MMM dd, yyyy") } : {}),
    };
  });
}

/* ------------------------------ Dashboard overview ------------------------------ */

export function demoDashboardOrders() {
  const now = new Date();
  const orders = [
    {
      id: "#ORD-8291",
      customer: "Alice Freeman",
      type: "Regular",
      serviceType: "Standard",
      avatar: "/avatars/alice.png",
      items: "5kg Wash & Fold",
      status: "Under Processing",
      pickupDate: subHours(now, 70), // Standard (72h), picked up 70h ago. Due in 2h. T-2 is NOW. (Borderline)
      dueDate: format(addHours(subHours(now, 70), 72), "MMM dd, h:mm a"),
      isoDate: addHours(subHours(now, 70), 72).toISOString(),
    },
    {
      id: "#ORD-8292",
      customer: "Mark Wilson",
      type: "New Customer",
      serviceType: "Express 24h",
      avatar: "/avatars/mark.png",
      items: "2 Suits Dry Clean",
      status: "Assigned",
      pickupDate: subHours(now, 2), // Picked up 2h ago. Due in 22h.
      dueDate: format(addHours(subHours(now, 2), 24), "MMM dd, h:mm a"),
      isoDate: addHours(subHours(now, 2), 24).toISOString(),
    },
    {
      id: "#ORD-8288",
      customer: "Sarah Jenkins",
      type: "VIP",
      serviceType: "Standard",
      avatar: "/avatars/sarah.png",
      items: "10kg Mixed Load",
      status: "Ready",
      pickupDate: subDays(now, 4),
      dueDate: format(addHours(subDays(now, 4), 72), "MMM dd, h:mm a"),
      isoDate: addHours(subDays(now, 4), 72).toISOString(),
    },
    {
      id: "#ORD-8293",
      customer: "James Doe",
      type: "Regular",
      serviceType: "Express 48h",
      avatar: "/avatars/james.png",
      items: "Wedding Dress Clean",
      status: "Pending Pickup",
      pickupDate: addHours(now, 2), // Future pickup
      dueDate: format(addHours(addHours(now, 2), 48), "MMM dd, h:mm a"),
      isoDate: addHours(addHours(now, 2), 48).toISOString(),
    },
    {
      id: "#ORD-8294",
      customer: "Emily Chen",
      type: "Regular",
      serviceType: "Standard",
      avatar: "/avatars/emily.png",
      items: "3 Curtains",
      status: "Assigned",
      pickupDate: subHours(now, 5),
      dueDate: format(addHours(subHours(now, 5), 72), "MMM dd, h:mm a"),
      isoDate: addHours(subHours(now, 5), 72).toISOString(),
    },
    {
      id: "#ORD-8295",
      customer: "Michael Brown",
      type: "VIP",
      serviceType: "Express 24h",
      avatar: "/avatars/michael.png",
      items: "Premium Suit Clean",
      status: "Assigned",
      pickupDate: subHours(now, 1),
      dueDate: format(addHours(subHours(now, 1), 24), "MMM dd, h:mm a"),
      isoDate: addHours(subHours(now, 1), 24).toISOString(),
  
    },
    {
      id: "#ORD-8296",
      customer: "Lisa Wang",
      type: "New Customer",
      serviceType: "Standard",
      avatar: "/avatars/lisa.png",
      items: "10kg Wash & Fold",
      status: "Under Processing",
      pickupDate: subHours(now, 71), // Standard (72h), picked up 71h ago. Due in 1h. Overdue (Now > Due-2h).
      dueDate: format(addHours(subHours(now, 71), 72), "MMM dd, h:mm a"),
      isoDate: addHours(subHours(now, 71), 72).toISOString(),
    },
    {
      id: "#ORD-8297",
      customer: "David Miller",
      type: "Regular",
      serviceType: "Standard",
      avatar: "/avatars/david.png",
      items: "2 Winter Coats",
      status: "Under Processing",
      pickupDate: subHours(now, 20),
      dueDate: format(addHours(subHours(now, 20), 72), "MMM dd, h:mm a"),
      isoDate: addHours(subHours(now, 20), 72).toISOString(),
    },
    {
      id: "#ORD-8298",
      customer: "Sophie Turner",
      type: "VIP",
      serviceType: "Express 48h",
      avatar: "/avatars/sophie.png",
      items: "Wedding Saree",
      status: "Ready",
      pickupDate: subHours(now, 50),
      dueDate: format(addHours(subHours(now, 50), 48), "MMM dd, h:mm a"),
      isoDate: addHours(subHours(now, 50), 48).toISOString(),
    },
  ];
  return orders;
}

export type DashboardOrder = ReturnType<typeof demoDashboardOrders>[number];

export const demoNewOrderAlert = () => ({
  id: "ORD-8292",
  customer: "Mark Wilson",
  items: "2 Suits Dry Clean",
  earning: "₹280",
  time: "Just now",
});

/* ----------------------------------- Orders ----------------------------------- */

export type OrderStatus =
  | "New Orders"
  | "Accepted Orders"
  | "Under Processing"
  | "Ready for Dispatch"
  | "Completed Orders";
export type ServiceSpeed = "economy" | "fast" | "express";

export interface Order {
  id: string;
  status: OrderStatus;
  serviceSpeed: ServiceSpeed;
  items: string;
  service: string;
  detergent: string;
  pickupTime: string;
  deliveryTime: string;
  address: string;
  locality: string;
  distance: string;
  earning: string;
  customerName: string;
  isoDate: string;
}

const ORDERS: Order[] = [
  // New Orders
  {
    id: "ORD-4920",
    status: "New Orders",
    serviceSpeed: "economy",
    items: "3 Shirts • 2 Jeans • 1 Silk Scarf",
    service: "Dry Cleaning",
    detergent: "Standard detergent",
    pickupTime: "Today at 2:00 PM",
    deliveryTime: "Tomorrow at 10:00 AM",
    address: "123 Maple St, Downtown",
    locality: "Punjabi Bagh",
    distance: "1.2 km",
    earning: "₹140",
    customerName: "John Smith",
    isoDate: "2026-02-07T14:00:00",
  },
  {
    id: "ORD-4921",
    status: "New Orders",
    serviceSpeed: "fast",
    items: "1 Bedsheet • 4 Pillow Cases",
    service: "Dry Cleaning",
    detergent: "Delicate items",
    pickupTime: "Today at 4:30 PM",
    deliveryTime: "Tomorrow at 12:00 PM",
    address: "456 Oak Ave, Uptown",
    locality: "Uptown",
    distance: "3.5 km",
    earning: "₹220",
    customerName: "Sarah Johnson",
    isoDate: "2026-02-07T16:30:00",
  },
  {
    id: "ORD-4925",
    status: "New Orders",
    serviceSpeed: "express",
    items: "4 Curtains • 2 Sofa Covers",
    service: "Wash & Fold",
    detergent: "Heavy duty",
    pickupTime: "Today at 5:00 PM",
    deliveryTime: "Today at 9:00 PM",
    address: "789 Pine Ln, Suburbs",
    locality: "South Delhi",
    distance: "5.0 km",
    earning: "₹500",
    customerName: "Mike Chen",
    isoDate: "2026-02-07T17:00:00",
  },
  // Accepted Orders
  {
    id: "ORD-4918",
    status: "Accepted Orders",
    serviceSpeed: "economy",
    items: "1 Suit • 2 Ties",
    service: "Dry Clean",
    detergent: "Premium care",
    pickupTime: "Today at 11:00 AM",
    deliveryTime: "Wed at 2:00 PM",
    address: "321 Cedar Rd",
    locality: "Janakpuri",
    distance: "2.1 km",
    earning: "₹350",
    customerName: "David Wilson",
    isoDate: "2026-02-07T11:00:00",
  },
  {
    id: "ORD-4916",
    status: "Accepted Orders",
    serviceSpeed: "fast",
    items: "2 Dresses • 3 Blouses",
    service: "Wash & Iron",
    detergent: "Gentle care",
    pickupTime: "Today at 1:00 PM",
    deliveryTime: "Tomorrow at 3:00 PM",
    address: "555 Elm Street",
    locality: "Rajouri Garden",
    distance: "1.8 km",
    earning: "₹280",
    customerName: "Emily Brown",
    isoDate: "2026-02-07T13:00:00",
  },
  // Processing Orders
  {
    id: "ORD-4912",
    status: "Under Processing",
    serviceSpeed: "economy",
    items: "5 Jeans • 8 T-Shirts",
    service: "Wash & Fold",
    detergent: "Standard",
    pickupTime: "Yesterday at 3:00 PM",
    deliveryTime: "Tomorrow at 11:00 AM",
    address: "888 Birch Ave",
    locality: "Pitampura",
    distance: "4.2 km",
    earning: "₹420",
    customerName: "Alex Turner",
    isoDate: "2026-02-06T15:00:00",
  },
  {
    id: "ORD-4910",
    status: "Under Processing",
    serviceSpeed: "express",
    items: "1 Wedding Dress",
    service: "Premium Dry Clean",
    detergent: "Delicate fabrics",
    pickupTime: "Today at 9:00 AM",
    deliveryTime: "Today at 6:00 PM",
    address: "999 Willow Lane",
    locality: "Gurgaon",
    distance: "2.5 km",
    earning: "₹800",
    customerName: "Lisa Anderson",
    isoDate: "2026-02-07T09:00:00",
  },
  {
    id: "ORD-4908",
    status: "Under Processing",
    serviceSpeed: "fast",
    items: "10 Uniforms",
    service: "Wash & Iron",
    detergent: "Commercial grade",
    pickupTime: "Yesterday at 5:00 PM",
    deliveryTime: "Tomorrow at 9:00 AM",
    address: "444 Oak Street",
    locality: "Dwarka",
    distance: "3.0 km",
    earning: "₹600",
    customerName: "Corporate Client",
    isoDate: "2026-02-06T17:00:00",
  },
  {
    id: "ORD-4905",
    status: "Under Processing",
    serviceSpeed: "economy",
    items: "2 Blankets • 1 Comforter",
    service: "Heavy Wash",
    detergent: "Deep clean",
    pickupTime: "2 days ago",
    deliveryTime: "Tomorrow at 4:00 PM",
    address: "222 Pine Road",
    locality: "Rohini",
    distance: "5.5 km",
    earning: "₹380",
    customerName: "Robert Kim",
    isoDate: "2026-02-05T14:00:00", // approx 2 PM
  },
  {
    id: "ORD-4902",
    status: "Under Processing",
    serviceSpeed: "economy",
    items: "6 Shirts • 4 Pants",
    service: "Wash & Iron",
    detergent: "Standard",
    pickupTime: "Yesterday at 2:00 PM",
    deliveryTime: "Tomorrow at 2:00 PM",
    address: "111 Maple Drive",
    locality: "Paschim Vihar",
    distance: "1.9 km",
    earning: "₹320",
    customerName: "James Lee",
    isoDate: "2026-02-06T14:00:00",
  },
  // Ready Orders
  {
    id: "ORD-4900",
    status: "Ready for Dispatch",
    serviceSpeed: "fast",
    items: "2 Jackets • 2 Pants",
    service: "Dry Clean",
    detergent: "Premium",
    pickupTime: "2 days ago",
    deliveryTime: "Today at 12:00 PM",
    address: "777 Cherry St",
    locality: "Vikaspuri",
    distance: "2.8 km",
    earning: "₹450",
    customerName: "Tom Harris",
    isoDate: "2026-02-05T10:00:00",
  },
  {
    id: "ORD-4898",
    status: "Ready for Dispatch",
    serviceSpeed: "economy",
    items: "6 Curtains",
    service: "Steam Clean",
    detergent: "Fabric refresh",
    pickupTime: "3 days ago",
    deliveryTime: "Today at 3:00 PM",
    address: "333 Walnut Ave",
    locality: "Moti Nagar",
    distance: "4.0 km",
    earning: "₹520",
    customerName: "Nancy White",
    isoDate: "2026-02-04T10:00:00",
  },
  // Completed Orders
  {
    id: "ORD-4895",
    status: "Completed Orders",
    serviceSpeed: "express",
    items: "1 Party Dress • Accessories",
    service: "Express Clean",
    detergent: "Delicate",
    pickupTime: "Yesterday",
    deliveryTime: "Yesterday at 8:00 PM",
    address: "666 Spruce Lane",
    locality: "Kirti Nagar",
    distance: "3.2 km",
    earning: "₹650",
    customerName: "Jennifer Davis",
    isoDate: "2026-02-06T10:00:00",
  },
  {
    id: "ORD-4890",
    status: "Completed Orders",
    serviceSpeed: "economy",
    items: "4 Bedsheets • 8 Towels",
    service: "Wash & Fold",
    detergent: "Fresh scent",
    pickupTime: "2 days ago",
    deliveryTime: "Yesterday at 10:00 AM",
    address: "123 Ash Road",
    locality: "Tilak Nagar",
    distance: "2.0 km",
    earning: "₹300",
    customerName: "Chris Martin",
    isoDate: "2026-02-05T09:00:00",
  },
];

export const demoOrders = () => rebaseToToday(ORDERS);

/* ---------------------------------- Schedule ---------------------------------- */

const SCHEDULE_DATA = [
  {
    id: "PU-001",
    orderId: "#284-9321",
    customer: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    address: "452 Maple Ave, Apt 4B",
    city: "San Francisco, CA 94110",
    date: "Feb 07, 2026",
    isoDate: "2026-02-07T10:00:00",
    items: 5,
    status: "pickup_scheduled",
    type: "pickup",
    rating: 4.8,
    note: "Coffee stain on front",
    deliveryType: "Standard",
    driver: "John Doe",
    orderItems: [
      {
        name: "White Shirt",
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=800&auto=format&fit=crop&q=60",
      },
      {
        name: "Black Trousers",
        quantity: 3,
        image:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "PU-002",
    orderId: "#284-9318",
    customer: "Michael Chen",
    phone: "+1 (555) 234-5678",
    address: "789 Oak Street, Suite 12",
    city: "San Francisco, CA 94102",
    date: "Feb 07, 2026",
    isoDate: "2026-02-07T14:30:00",
    items: 3,
    status: "in_workshop",
    type: "pickup",
    rating: 4.9,
    note: "Oil stain on white shirt collar",
    deliveryType: "Express 24h",
    driver: "Mike Smith",
    orderItems: [
      {
        name: "White Shirt",
        quantity: 3,
        image:
          "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=800&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "DL-001",
    orderId: "#284-9310",
    customer: "Emily Davis",
    phone: "+1 (555) 345-6789",
    address: "156 Pine Road",
    city: "San Francisco, CA 94108",
    date: "Feb 06, 2026",
    isoDate: "2026-02-06T09:00:00",
    items: 8,
    status: "ready_for_delivery",
    type: "delivery",
    rating: 4.7,
    deliveryType: "Standard",
  },
  {
    id: "PU-003",
    orderId: "#284-9325",
    customer: "James Wilson",
    phone: "+1 (555) 456-7890",
    address: "321 Cedar Lane, Unit 5",
    city: "San Francisco, CA 94114",
    date: "Feb 08, 2026",
    isoDate: "2026-02-08T11:00:00",
    items: 4,
    status: "picked_up",
    type: "pickup",
    rating: 5.0,
    note: "Delicate silk items",
    deliveryType: "Express 48h",
    driver: "Sarah Wilson",
    orderItems: [
      {
        name: "Silk Blouse",
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=60",
      },
      {
        name: "Silk Scarf",
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?w=800&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "DL-002",
    orderId: "#284-9305",
    customer: "Lisa Anderson",
    phone: "+1 (555) 567-8901",
    address: "888 Birch Boulevard",
    city: "San Francisco, CA 94117",
    date: "Feb 07, 2026",
    isoDate: "2026-02-07T16:00:00",
    items: 6,
    status: "ready_for_delivery",
    type: "delivery",
    rating: 4.6,
    deliveryType: "Express 24h",
  },
  {
    id: "DL-003",
    orderId: "#284-9308",
    customer: "Robert Taylor",
    phone: "+1 (555) 678-9012",
    address: "456 Pine St",
    city: "San Francisco, CA 94109",
    date: "Feb 06, 2026",
    isoDate: "2026-02-06T15:00:00",
    items: 3,
    status: "completed",
    type: "delivery",
    rating: 4.8,
    deliveryType: "Express 48h",
  },
  {
    id: "PU-005",
    orderId: "#284-9330",
    customer: "Michael Brown",
    rating: 4.7,
    phone: "+1 (555) 456-7890",
    address: "220 Elm St, Apt 5C",
    city: "San Francisco, CA 94103",
    date: "Feb 07, 2026",
    isoDate: "2026-02-07T09:30:00",
    items: 2,
    status: "not_scheduled",
    type: "pickup",
    note: "Color bleed risk on red dress",
    deliveryType: "Standard",
    orderItems: [
      {
        name: "Red Dress",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=60",
      },
      {
        name: "Cotton T-Shirt",
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60",
      },
    ],
  },
  {
    id: "PU-006",
    orderId: "#284-9335",
    customer: "David Lee",
    rating: 4.5,
    phone: "+1 (555) 987-6543",
    address: "789 Pine St",
    city: "San Francisco, CA 94108",
    date: "Feb 08, 2026",
    isoDate: "2026-02-08T13:00:00",
    items: 7,
    status: "not_scheduled",
    type: "pickup",
    note: "Grass stains on knees",
    deliveryType: "Express 24h",
    orderItems: [
      {
        name: "Blue Jeans",
        quantity: 4,
        image:
          "https://images.unsplash.com/photo-1604176354204-9268737828fa?w=800&auto=format&fit=crop&q=60",
      },
      {
        name: "Kids T-Shirt",
        quantity: 3,
        image:
          "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=800&auto=format&fit=crop&q=60",
      },
    ],
  },
];

export const demoSchedule = () => rebaseToToday(SCHEDULE_DATA);

export type ScheduleEntry = ReturnType<typeof demoSchedule>[number];

const SCHEDULE_DETAILS = [
  {
    id: "PU-001",
    orderId: "#284-9321",
    customer: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    address: "452 Maple Ave, Apt 4B",
    city: "San Francisco, CA 94110",
    date: "Jan 21, 2026",
    items: 5,
    status: "scheduled",
    type: "pickup",
    rating: 4.8,
    note: "Coffee stain on front",
    deliveryType: "Standard",
    driver: "John Doe",
    orderItems: [
      {
        name: "White Shirt",
        quantity: 2,
        image: "https://picsum.photos/seed/shirt1/200/200",
      },
      {
        name: "Black Trousers",
        quantity: 3,
        image: "https://picsum.photos/seed/trouser1/200/200",
      },
    ],
  },
  {
    id: "PU-002",
    orderId: "#284-9318",
    customer: "Michael Chen",
    phone: "+1 (555) 234-5678",
    address: "789 Oak Street, Suite 12",
    city: "San Francisco, CA 94102",
    date: "Jan 21, 2026",
    items: 3,
    status: "in_progress",
    type: "pickup",
    rating: 4.9,
    note: "Oil stain on white shirt collar",
    deliveryType: "Express 24h",
    driver: "Mike Smith",
    orderItems: [
      {
        name: "White Shirt",
        quantity: 3,
        image: "https://picsum.photos/seed/shirt2/200/200",
      },
    ],
  },
  {
    id: "PU-003",
    orderId: "#284-9325",
    customer: "James Wilson",
    phone: "+1 (555) 456-7890",
    address: "321 Cedar Lane, Unit 5",
    city: "San Francisco, CA 94114",
    date: "Jan 21, 2026",
    items: 4,
    status: "scheduled",
    type: "pickup",
    rating: 5.0,
    note: "Delicate silk items",
    deliveryType: "Express 48h",
    driver: "Sarah Wilson",
    orderItems: [
      {
        name: "Silk Blouse",
        quantity: 2,
        image: "https://picsum.photos/seed/blouse1/200/200",
      },
      {
        name: "Silk Scarf",
        quantity: 2,
        image: "https://picsum.photos/seed/scarf1/200/200",
      },
    ],
  },
  {
    id: "PU-005",
    orderId: "#284-9330",
    customer: "Michael Brown",
    rating: 4.7,
    phone: "+1 (555) 456-7890",
    address: "220 Elm St, Apt 5C",
    city: "San Francisco, CA 94103",
    date: "Jan 21, 2026",
    items: 2,
    status: "not_scheduled",
    type: "pickup",
    note: "Color bleed risk on red dress",
    deliveryType: "Standard",
    orderItems: [
      {
        name: "Red Dress",
        quantity: 1,
        image: "https://picsum.photos/seed/dress1/200/200",
      },
      {
        name: "Cotton T-Shirt",
        quantity: 1,
        image: "https://picsum.photos/seed/tshirt1/200/200",
      },
    ],
  },
  {
    id: "PU-006",
    orderId: "#284-9335",
    customer: "David Lee",
    rating: 4.5,
    phone: "+1 (555) 987-6543",
    address: "789 Pine St",
    city: "San Francisco, CA 94108",
    date: "Jan 21, 2026",
    items: 7,
    status: "not_scheduled",
    type: "pickup",
    note: "Grass stains on knees",
    deliveryType: "Express 24h",
    orderItems: [
      {
        name: "Blue Jeans",
        quantity: 4,
        image: "https://picsum.photos/seed/jeans1/200/200",
      },
      {
        name: "Kids T-Shirt",
        quantity: 3,
        image: "https://picsum.photos/seed/kidstshirt1/200/200",
      },
    ],
  },
];

export const demoScheduleDetails = () =>
  SCHEDULE_DETAILS.map((s) => ({ ...s, date: format(new Date(), "MMM dd, yyyy") }));

export type ScheduleDetail = ReturnType<typeof demoScheduleDetails>[number];

/* ---------------------------------- Services ---------------------------------- */

const assignedServices = [
  {
    id: 1,
    name: "Dry Cleaning",
    description:
      "Professional solvent-based care for delicate and structured garments.",
    basePrice: "₹150/piece",
    category: "Dry Clean",
    available: true,
  },
  {
    id: 2,
    name: "Washing",
    description:
      "Professional machine washing with fabric-appropriate detergents and controlled drying for everyday garments.",
    basePrice: "₹80/kg",
    category: "Wash",
    available: true,
  },
  {
    id: 3,
    name: "Steam Iron",
    description:
      "Precision steam finishing for wrinkle-free, crisp presentation of garments.",
    basePrice: "₹20/piece",
    category: "Iron",
    available: true,
  },
  {
    id: 4,
    name: "Repair & Alterations",
    description:
      "Skilled repair, stitching and fabric restoration for damaged or worn garments.",
    basePrice: "₹100/item",
    category: "Repair",
    available: true,
  },
];

export const demoServices = () => assignedServices;

export type AssignedService = (typeof assignedServices)[number];

/* ---------------------------------- Earnings ---------------------------------- */

export interface Transaction {
  id: string;
  customer: string;
  service: string;
  date: string;
  isoDate?: string;
  amount: string;
  status: string;
  type: string;
}

const TRANSACTIONS_DATA: Transaction[] = [
  {
    id: "ORD-8291",
    customer: "Alice Freeman",
    service: "Wash & Fold",
    date: "Oct 24, 2024",
    isoDate: "2024-10-24",
    amount: "₹1,240.50",
    status: "Completed",
    type: "Order Payment",
  },
  {
    id: "PAY-8831",
    customer: "Platform Payout",
    service: "Weekly Settlement",
    date: "Oct 23, 2024",
    isoDate: "2024-10-23",
    amount: "₹2,450.00",
    status: "Processed",
    type: "Payout",
  },
  {
    id: "ORD-8290",
    customer: "Mark Wilson",
    service: "Dry Clean",
    date: "Oct 22, 2024",
    isoDate: "2024-10-22",
    amount: "₹890.00",
    status: "Completed",
    type: "Order Payment",
  },
  {
    id: "ORD-8288",
    customer: "Sarah Jenkins",
    service: "Ironing",
    date: "Oct 21, 2024",
    isoDate: "2024-10-21",
    amount: "₹450.00",
    status: "Completed",
    type: "Order Payment",
  },
  {
    id: "ORD-8285",
    customer: "James Doe",
    service: "Premium Wash",
    date: "Oct 20, 2024",
    isoDate: "2024-10-20",
    amount: "₹1,100.00",
    status: "Pending",
    type: "Order Payment",
  },
];

export const demoTransactions = () => rebaseToToday(TRANSACTIONS_DATA);

export interface DailyEarning {
  day: string;
  amount: number;
  trend: number;
  active?: boolean;
}

export const demoWeeklyEarnings = (): DailyEarning[] => [
  { day: "Mon", amount: 3800, trend: 3600 },
  { day: "Tue", amount: 5200, trend: 4800 },
  { day: "Wed", amount: 2900, trend: 3200 },
  { day: "Thu", amount: 5800, trend: 5400 },
  { day: "Fri", amount: 7400, trend: 6900 },
  { day: "Sat", amount: 4600, active: true, trend: 4900 },
  { day: "Sun", amount: 1800, trend: 2100 },
];

/* -------------------------------- Notifications -------------------------------- */

const NOTIFICATIONS = [
  {
    id: "ORD-8292",
    type: "new_order",
    title: "New Order Assigned",
    customer: "Mark Wilson",
    items: "2 Suits Dry Clean",
    earning: "₹280",
    time: "Just now",
    unread: true,
  },
  {
    id: "ORD-8291",
    type: "processing",
    title: "Order Ready for Pickup",
    customer: "Alice Freeman",
    items: "5kg Wash & Fold",
    earning: "₹140",
    time: "5 min ago",
    unread: true,
  },
  {
    id: "ORD-8288",
    type: "completed",
    title: "Order Completed",
    customer: "Sarah Jenkins",
    items: "10kg Mixed Load",
    earning: "₹350",
    time: "1 hour ago",
    unread: false,
  },
];

export const demoNotifications = () => NOTIFICATIONS;

export type VendorNotification = (typeof NOTIFICATIONS)[number];
