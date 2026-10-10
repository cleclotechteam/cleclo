"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Store,
  Bell,
  Shield,
  CreditCard,
  Clock,
  MapPin,
  ChevronRight,
  Camera,
  Save,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SETTINGS_SECTIONS = [
  {
    id: "profile",
    icon: User,
    title: "Profile Information",
    description: "Update your personal details",
  },
  {
    id: "business",
    icon: Store,
    title: "Business Details",
    description: "Manage your laundry business info",
  },
  {
    id: "notifications",
    icon: Bell,
    title: "Notifications",
    description: "Configure alerts and notifications",
  },
  {
    id: "security",
    icon: Shield,
    title: "Security",
    description: "Password and authentication",
  },
  {
    id: "payments",
    icon: CreditCard,
    title: "Payment Settings",
    description: "Bank account and payout preferences",
  },
  {
    id: "availability",
    icon: Clock,
    title: "Availability",
    description: "Set your working hours",
  },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderUpdates: true,
    payments: true,
    marketing: false,
    sms: true,
    email: true,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-black font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-primary mt-1">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[#3E8940]/10 flex items-center justify-center text-[#3E8940] font-bold text-lg">
                  VL
                </div>
                <div>
                  <p className="font-bold text-slate-900">Vendor Laundry</p>
                  <p className="text-xs text-slate-500">vendor@cleclo.com</p>
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
                      ? "bg-[#3E8940]/10 text-[#3E8940]"
                      : "hover:bg-slate-50 text-slate-600"
                  )}
                >
                  <section.icon className="h-5 w-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{section.title}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-slate-100">
              <Link href="/" className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all">
                <LogOut className="h-5 w-5" />
                <span className="font-medium text-sm">Log Out</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeSection === "profile" && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">
                  Profile Information
                </h2>
                <p className="text-sm text-slate-500">
                  Update your personal details and photo
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-[#3E8940]/10 flex items-center justify-center text-[#3E8940] font-bold text-2xl">
                      VL
                    </div>
                    <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50">
                      <Camera className="h-4 w-4 text-slate-600" />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Profile Photo</p>
                    <p className="text-sm text-slate-500">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      defaultValue="John"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="vendor@cleclo.com"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button className="bg-[#3E8940] hover:bg-[#3E8940]/90 gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "business" && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">Business Details</h2>
                <p className="text-sm text-slate-500">
                  Manage your laundry business information
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      defaultValue="Sparkle Clean Laundry"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      defaultValue="123 Main Street, San Francisco, CA 94110"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceRadius">
                      Service Radius (KM)
                    </Label>
                    <Select defaultValue="5">
                      <SelectTrigger id="serviceRadius" className="h-11 w-full bg-white">
                        <SelectValue placeholder="Select radius" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 KM</SelectItem>
                        <SelectItem value="5">5 KM</SelectItem>
                        <SelectItem value="8">8 KM</SelectItem>
                        <SelectItem value="10">10 KM</SelectItem>
                        <SelectItem value="15">15 KM</SelectItem>
                        <SelectItem value="20">20 KM</SelectItem>
                        <SelectItem value="25">25 KM</SelectItem>
                        <SelectItem value="30">30 KM</SelectItem>
                        <SelectItem value="50">50 KM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Daily Capacity (Units)</Label>
                    <Select defaultValue="20">
                      <SelectTrigger id="capacity" className="h-11 w-full bg-white">
                        <SelectValue placeholder="Select capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 Units</SelectItem>
                        <SelectItem value="20">20 Units</SelectItem>
                        <SelectItem value="30">30 Units</SelectItem>
                        <SelectItem value="50">50 Units</SelectItem>
                        <SelectItem value="75">75 Units</SelectItem>
                        <SelectItem value="100">100 Units</SelectItem>
                        <SelectItem value="150">150 Units</SelectItem>
                        <SelectItem value="200">200+ Units</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button className="bg-[#3E8940] hover:bg-[#3E8940]/90 gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">Notifications</h2>
                <p className="text-sm text-slate-500">
                  Choose what notifications you receive
                </p>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">New Orders</p>
                    <p className="text-sm text-slate-500">
                      Get notified when a new order is assigned
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newOrders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newOrders: checked })
                    }
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Order Updates</p>
                    <p className="text-sm text-slate-500">
                      Status changes and customer messages
                    </p>
                  </div>
                  <Switch
                    checked={notifications.orderUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        orderUpdates: checked,
                      })
                    }
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Payment Alerts</p>
                    <p className="text-sm text-slate-500">
                      Earnings and payout notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.payments}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, payments: checked })
                    }
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Marketing</p>
                    <p className="text-sm text-slate-500">
                      Tips, promotions, and updates
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketing}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, marketing: checked })
                    }
                  />
                </div>
                <div className="p-4 bg-slate-50/50">
                  <p className="font-medium text-slate-900 mb-3">
                    Notification Channels
                  </p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, sms: checked })
                        }
                      />
                      <span className="text-sm text-slate-600">SMS</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, email: checked })
                        }
                      />
                      <span className="text-sm text-slate-600">Email</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">Security</h2>
                <p className="text-sm text-slate-500">
                  Manage your password and security settings
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button className="bg-[#3E8940] hover:bg-[#3E8940]/90 gap-2">
                    <Shield className="h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "payments" && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">Payment Settings</h2>
                <p className="text-sm text-slate-500">
                  Manage your bank account and payout preferences
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div className="p-4 bg-[#3E8940]/5 rounded-xl border border-[#3E8940]/10">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="h-5 w-5 text-[#3E8940]" />
                    <span className="font-semibold text-slate-900">
                      Bank Account Connected
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">Chase Bank •••• 4567</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Payout Schedule</Label>
                    <select className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm">
                      <option value="weekly">Weekly (Every Friday)</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Payout Amount</Label>
                    <Input type="number" defaultValue="50" className="h-11" />
                    <p className="text-xs text-slate-500">
                      We'll hold payments until this threshold is met
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button className="bg-[#3E8940] hover:bg-[#3E8940]/90 gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "availability" && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">Availability</h2>
                <p className="text-sm text-slate-500">
                  Set your working hours for pickups
                </p>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <div
                    key={day}
                    className="p-4 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap"
                  >
                    <div className="flex items-center gap-4 min-w-[130px]">
                      <Switch defaultChecked={day !== "Sunday"} />
                      <span className="font-medium text-slate-900 w-24">
                        {day}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <Input
                        type="time"
                        defaultValue="09:00"
                        className="h-9 w-36 px-2.5 text-xs sm:text-sm font-medium"
                        disabled={day === "Sunday"}
                      />
                      <span className="text-slate-400 text-xs sm:text-sm">to</span>
                      <Input
                        type="time"
                        defaultValue="18:00"
                        className="h-9 w-36 px-2.5 text-xs sm:text-sm font-medium"
                        disabled={day === "Sunday"}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-end">
                <Button className="bg-[#3E8940] hover:bg-[#3E8940]/90 gap-2">
                  <Save className="h-4 w-4" />
                  Save Availability
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
