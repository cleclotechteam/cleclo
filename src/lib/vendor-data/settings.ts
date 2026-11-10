// Demo data + types for the Settings screen (/dashboard/settings).

export interface ProfileSettings {
  firstName: string;
  lastName: string;
  /** Registered email. Any change must be confirmed with an OTP before it is saved. */
  email: string;
  /** Registered 10-digit mobile number (without +91). Any change requires OTP verification. */
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  /** Data URL / CDN URL of the profile photo (JPG or PNG, max 2 MB). */
  photoUrl: string | null;
}

/**
 * Legal business information. Vendor registration details are verified during onboarding,
 * so changes to these fields must NOT update instantly — the backend stores them as a
 * pending re-verification request and keeps serving the verified values until approved.
 */
export interface BusinessLegalInfo {
  businessName: string;
  businessAddress: string;
  gstNumber: string;
  panNumber: string;
}

export interface BusinessSettings extends BusinessLegalInfo {
  /** Contact details and operational preferences update instantly. */
  businessEmail: string;
  businessContact: string;
  serviceRadius: string;
  dailyCapacity: string;
}

/**
 * Payout bank details are verified during onboarding. Changes trigger re-verification
 * (e.g. penny-drop + document check) instead of updating instantly; payouts continue to
 * the verified account until the new one is approved.
 */
export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export interface PaymentSettings extends BankDetails {
  bankName: string;
  payoutSchedule: "weekly" | "biweekly" | "monthly";
  minimumPayout: string;
}

/** A change request waiting for Cleclo's verification team. */
export interface ReverificationRequest<T> {
  submittedAt: string;
  changes: Partial<T>;
}

export type NotificationCategoryId =
  | "newOrderAssignments"
  | "orderStatusUpdates"
  | "pickupDelivery"
  | "prioritySla"
  | "paymentPayout"
  | "discrepancyIssue"
  | "platformAnnouncements";

/**
 * Notification trigger logic (backend):
 * - New Order Assignment: immediately when an order is assigned.
 * - Acceptance Reminder: before the order acceptance window expires.
 * - Pickup & Delivery: when logistics status changes.
 * - Processing Deadline: when an order approaches its committed deadline.
 * - Discrepancy Alert: when an issue is reported or its resolution changes.
 * - Payout Notification: when a settlement is initiated, completed or fails.
 * Critical alerts are mandatory (`mandatory: true`) — vendors cannot disable new assignments,
 * acceptance deadlines, major SLA risks or unresolved discrepancies.
 * De-duplication: each event (e.g. a single order-status change) must generate exactly ONE
 * notification per enabled channel — never repeated alerts for the same event.
 */
export interface NotificationCategory {
  id: NotificationCategoryId;
  heading: string;
  description: string;
  /** Events that fire this category, shown to the vendor for transparency. */
  triggers: { notification: string; trigger: string }[];
  /** Critical alert — always on, toggle is locked. */
  mandatory: boolean;
  enabled: boolean;
}

export interface NotificationChannels {
  push: boolean;
  sms: boolean;
  email: boolean;
}

export interface DayAvailability {
  day: string;
  open: boolean;
  /** 24-hour "HH:mm"; displayed as "9:00 AM". */
  from: string;
  to: string;
}

export interface VendorSettings {
  profile: ProfileSettings;
  business: BusinessSettings;
  businessPending: ReverificationRequest<BusinessLegalInfo> | null;
  payment: PaymentSettings;
  bankPending: ReverificationRequest<BankDetails> | null;
  notifications: NotificationCategory[];
  channels: NotificationChannels;
  availability: DayAvailability[];
}

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const demoSettings = (): VendorSettings => ({
  profile: {
    firstName: "Rohit",
    lastName: "Sharma",
    email: "vendor@cleclo.com",
    phone: "9876543210",
    emailVerified: true,
    phoneVerified: true,
    photoUrl: null,
  },
  business: {
    businessName: "Clean Press Laundry",
    businessEmail: "accounts@cleanpress.in",
    businessContact: "9123456780",
    businessAddress: "Shop 12, Sector 18 Market, Noida, Uttar Pradesh 201301",
    gstNumber: "09ABCDE1234F1Z5",
    panNumber: "ABCDE1234F",
    serviceRadius: "5",
    dailyCapacity: "50",
  },
  businessPending: null,
  payment: {
    bankName: "HDFC Bank",
    accountNumber: "50100234564567",
    ifscCode: "HDFC0001234",
    accountHolderName: "Clean Press Laundry",
    payoutSchedule: "weekly",
    minimumPayout: "500",
  },
  bankPending: null,
  notifications: [
    {
      id: "newOrderAssignments",
      heading: "New Order Assignments",
      description: "Get notified when a new order is assigned for acceptance.",
      triggers: [
        { notification: "New Order Assignment", trigger: "Immediately when an order is assigned" },
        { notification: "Acceptance Reminder", trigger: "Before the order acceptance window expires" },
      ],
      mandatory: true,
      enabled: true,
    },
    {
      id: "orderStatusUpdates",
      heading: "Order Status Updates",
      description: "Receive updates on order progress, processing and completion.",
      triggers: [],
      mandatory: false,
      enabled: true,
    },
    {
      id: "pickupDelivery",
      heading: "Pickup & Delivery Alerts",
      description: "Stay informed about logistics assignments, pickups and deliveries.",
      triggers: [{ notification: "Pickup & Delivery", trigger: "When logistics status changes" }],
      mandatory: false,
      enabled: true,
    },
    {
      id: "prioritySla",
      heading: "Priority & SLA Alerts",
      description: "Receive reminders for express orders, approaching deadlines and delays.",
      triggers: [
        { notification: "Processing Deadline", trigger: "When an order approaches its committed deadline" },
      ],
      mandatory: true,
      enabled: true,
    },
    {
      id: "paymentPayout",
      heading: "Payment & Payout Alerts",
      description: "Get notified about earnings, settlements and successful payouts.",
      triggers: [
        { notification: "Payout Notification", trigger: "When a settlement is initiated, completed or fails" },
      ],
      mandatory: false,
      enabled: true,
    },
    {
      id: "discrepancyIssue",
      heading: "Discrepancy & Issue Alerts",
      description: "Receive updates on reported discrepancies and issue resolutions.",
      triggers: [
        { notification: "Discrepancy Alert", trigger: "When an issue is reported or its resolution changes" },
      ],
      mandatory: true,
      enabled: true,
    },
    {
      id: "platformAnnouncements",
      heading: "Platform Announcements",
      description: "Stay updated on important Cleclo announcements and service changes.",
      triggers: [],
      mandatory: false,
      enabled: false,
    },
  ],
  channels: { push: true, sms: true, email: true },
  availability: WEEKDAYS.map((day) => ({
    day,
    open: day !== "Sunday",
    from: "09:00",
    to: "18:00",
  })),
});
