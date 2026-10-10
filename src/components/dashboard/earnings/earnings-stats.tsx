"use client"

import { Wallet, TrendingUp, Hourglass, Calendar } from "lucide-react"

export function EarningsStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Available Balance Card */}
      <div className="relative overflow-hidden rounded-xl bg-[#3E8940] p-6 text-white shadow-lg shadow-emerald-900/10 transition-all hover:shadow-xl hover:shadow-emerald-900/20">
        <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
          <div className="flex items-center gap-2 text-emerald-100 mb-1">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium uppercase tracking-wide">Available Balance</span>
          </div>
          <div>
            <div className="text-4xl font-bold tracking-tight mb-2">₹1,240.50</div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
              <Calendar className="h-3 w-3" />
              <span>Next payout: Oct 24</span>
            </div>
          </div>
        </div>
      </div>

      {/* This Week Earnings Card */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold uppercase text-slate-500 tracking-wide">This Week Earnings</span>
          <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            <span>+15%</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-slate-900">₹450.00</div>
          <div className="text-sm text-slate-500 font-medium">
            Compared to last week <span className="text-slate-400">(₹390.00)</span>
          </div>
        </div>
      </div>

      {/* Pending Clearance Card */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold uppercase text-slate-500 tracking-wide">Pending Clearance</span>
          <Hourglass className="h-4 w-4 text-orange-400" />
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-slate-900">₹120.00</div>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            <span>3 orders pending delivery</span>
          </div>
        </div>
      </div>
    </div>
  )
}
