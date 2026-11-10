"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronRight,
  Clock,
  CreditCard,
  LogOut,
  Shield,
  Store,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VendorSettings } from "@/lib/vendor-data";
import { ProfileSection } from "./profile-section";
import { BusinessSection } from "./business-section";
import { NotificationsSection } from "./notifications-section";
import { SecuritySection } from "./security-section";
import { PaymentSection } from "./payment-section";
import { AvailabilitySection } from "./availability-section";

const SETTINGS_SECTIONS = [
  {
    id: "profile",
    icon: User,
    title: "Profile Information",
    description: "Manage your personal details and registered contact information.",
  },
  {
    id: "business",
    icon: Store,
    title: "Business Details",
    description: "View and manage your registered business and outlet information.",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Customise alerts for orders, logistics updates and payouts.",
  },
  {
    id: "security",
    icon: Shield,
    title: "Security",
    description: "Manage your password, account access and security preferences.",
  },
  {
    id: "payments",
    icon: CreditCard,
    title: "Payment Settings",
    description: "View your registered bank details and payout preferences.",
  },
  {
    id: "availability",
    icon: Clock,
    title: "Availability",
    description: "Manage outlet operating hours and service availability.",
  },
] as const;

type SectionId = (typeof SETTINGS_SECTIONS)[number]["id"];

export function SettingsPage({ initial }: { initial: VendorSettings }) {
  const [activeSection, setActiveSection] = useState<SectionId>("profile");
  const [settings, setSettings] = useState(initial);
  const patch = (p: Partial<VendorSettings>) => setSettings((s) => ({ ...s, ...p }));

  const { profile, business } = settings;
  const initials =
    business.businessName
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w.charAt(0))
      .join("")
      .toUpperCase() || "VL";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-black font-bold tracking-tight">
          Account &amp; Business Settings
        </h1>
        <p className="text-primary mt-1">
          Manage your profile, business information, operational preferences and account
          security in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {profile.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.photoUrl}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 shrink-0 rounded-full bg-[#00B074]/10 flex items-center justify-center text-[#00B074] font-bold text-lg">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{business.businessName}</p>
                  <p className="text-xs text-slate-500 truncate">{profile.email}</p>
                </div>
              </div>
            </div>
            <div className="p-2">
              {SETTINGS_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                    activeSection === section.id
                      ? "bg-[#00B074]/10 text-[#00B074]"
                      : "hover:bg-slate-50 text-slate-600",
                  )}
                >
                  <section.icon className="h-5 w-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{section.title}</p>
                    <p className="text-xs text-slate-500 leading-snug mt-0.5">
                      {section.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-slate-100">
              <Link
                href="/"
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium text-sm">Log Out</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeSection === "profile" && (
            <ProfileSection saved={profile} onSave={(next) => patch({ profile: next })} />
          )}

          {activeSection === "business" && (
            <BusinessSection
              saved={business}
              pending={settings.businessPending}
              onSave={(next, pending) => patch({ business: next, businessPending: pending })}
            />
          )}

          {activeSection === "notifications" && (
            <NotificationsSection
              saved={settings.notifications}
              savedChannels={settings.channels}
              onSave={(notifications, channels) => patch({ notifications, channels })}
            />
          )}

          {activeSection === "security" && <SecuritySection />}

          {activeSection === "payments" && (
            <PaymentSection
              saved={settings.payment}
              pending={settings.bankPending}
              onSave={(payment, bankPending) => patch({ payment, bankPending })}
            />
          )}

          {activeSection === "availability" && (
            <AvailabilitySection
              saved={settings.availability}
              onSave={(availability) => patch({ availability })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
