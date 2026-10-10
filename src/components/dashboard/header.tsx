"use client";

import { useState } from "react";
import {
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Package,
  Clock,
  X,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/dashboard/sidebar-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Static notification data
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

export function DashboardHeader() {
  const { isCollapsed, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header className="flex h-16 w-full justify-between items-center border-b border-[var(--kraft-line)] bg-white/70 backdrop-blur-md px-4 md:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile: hamburger to open mobile drawer */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop: collapse/expand toggle (unchanged) */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex items-center gap-3 md:gap-4 ml-auto">
        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-black font-bold hover:text-black hover:bg-[#3E8940]/10"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />

              {/* Dropdown Panel — responsive width */}
              <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-[380px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Notifications List */}
                <div className="max-h-[400px] overflow-y-auto">
                  {NOTIFICATIONS.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer",
                        notif.unread && "bg-[#3E8940]/5"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                            notif.type === "new_order" &&
                            "bg-orange-100 text-orange-600",
                            notif.type === "processing" &&
                            "bg-blue-100 text-blue-600",
                            notif.type === "completed" &&
                            "bg-green-100 text-green-600"
                          )}
                        >
                          {notif.type === "new_order" && (
                            <Bell className="h-5 w-5" />
                          )}
                          {notif.type === "processing" && (
                            <Clock className="h-5 w-5" />
                          )}
                          {notif.type === "completed" && (
                            <Package className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-slate-900 text-sm truncate">
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {notif.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {notif.id} • {notif.customer}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-slate-600">
                              {notif.items}
                            </span>
                            <span className="text-sm font-bold text-[#3E8940]">
                              {notif.earning}
                            </span>
                          </div>
                        </div>
                        {notif.unread && (
                          <div className="h-2 w-2 rounded-full bg-[#3E8940] shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-slate-100 bg-slate-50">
                  <Link
                    href="/dashboard/orders"
                    className="flex items-center justify-center gap-1 text-sm font-semibold text-[#3E8940] hover:text-[#3E8940]/80"
                    onClick={() => setShowNotifications(false)}
                  >
                    View All Orders
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 border-l pl-3 md:pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-black font-bold leading-none">
              Clean Press Laundry
            </p>
            <p className="text-xs text-primary font-semibold mt-1">
              Vendor ID: #8291
            </p>
          </div>
          <Avatar>
            <AvatarImage src="/avatars/01.png" alt="@cleanpress" />
            <AvatarFallback>CP</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
