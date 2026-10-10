// Single entry point for all vendor dashboard data.
//
// There is no backend yet, so every resource is served from the demo data in ./demo.
// When the API is ready, set NEXT_PUBLIC_VENDOR_API_URL (e.g. in .env.local) and each
// resource is fetched from `${NEXT_PUBLIC_VENDOR_API_URL}${path}` instead. No screen
// needs to change, as long as the responses follow the shapes in ./demo.
import {
  demoDashboardOrders,
  demoNewOrderAlert,
  demoNotifications,
  demoOrders,
  demoSchedule,
  demoScheduleDetails,
  demoServices,
  demoTransactions,
  demoWeeklyEarnings,
  type DashboardOrder,
} from "./demo";

export * from "./demo";

const API_URL = process.env.NEXT_PUBLIC_VENDOR_API_URL?.replace(/\/+$/, "") ?? "";

/** True while the dashboard is running on demo data (no API configured). */
export const isDemoMode = API_URL === "";

interface ResourceDef<T> {
  /** Endpoint path, appended to NEXT_PUBLIC_VENDOR_API_URL. */
  path: string;
  demo: () => T;
  /** Converts the raw JSON response into the shape the screens use. */
  parse?: (raw: unknown) => T;
}

const define = <T,>(def: ResourceDef<T>) => def;

const resources = {
  dashboardOrders: define({
    path: "/dashboard/orders",
    demo: demoDashboardOrders,
    // JSON has no Date type; the overview screen does date maths on pickupDate.
    parse: (raw) =>
      (raw as DashboardOrder[]).map((o) => ({ ...o, pickupDate: new Date(o.pickupDate) })),
  }),
  newOrderAlert: define({
    path: "/dashboard/new-order-alert",
    demo: (): ReturnType<typeof demoNewOrderAlert> | null => demoNewOrderAlert(),
  }),
  orders: define({ path: "/orders", demo: demoOrders }),
  schedule: define({ path: "/schedule", demo: demoSchedule }),
  scheduleDetails: define({ path: "/schedule/details", demo: demoScheduleDetails }),
  services: define({ path: "/services", demo: demoServices }),
  transactions: define({ path: "/earnings/transactions", demo: demoTransactions }),
  weeklyEarnings: define({ path: "/earnings/weekly", demo: demoWeeklyEarnings }),
  notifications: define({ path: "/notifications", demo: demoNotifications }),
};

export type VendorResource = keyof typeof resources;
export type VendorData<K extends VendorResource> = ReturnType<(typeof resources)[K]["demo"]>;

export async function loadVendorData<K extends VendorResource>(resource: K): Promise<VendorData<K>> {
  const def = resources[resource] as ResourceDef<VendorData<K>>;
  if (isDemoMode) return def.demo();

  const res = await fetch(`${API_URL}${def.path}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status} ${res.statusText})`);
  }
  const raw: unknown = await res.json();
  return def.parse ? def.parse(raw) : (raw as VendorData<K>);
}
