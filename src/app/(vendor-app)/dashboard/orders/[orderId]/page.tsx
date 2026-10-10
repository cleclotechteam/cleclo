"use client"

import { use } from "react"

import { 
  ArrowLeft, 
  AlertTriangle, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Navigation, 
  Package, 
  Truck, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Droplets
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"

export default function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params)
  // Mock data - in real app fetch based on params.orderId
  const orderId = resolvedParams.orderId || "ORD-7829"

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200 bg-white" asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-5 w-5 text-slate-700" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Order {orderId}</h1>
            <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 border px-3 py-1 text-xs font-bold uppercase">
              New Assigned
            </Badge>
          </div>
        </div>
        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4" />
          Report Issue
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer Details Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#3E8940]  text-white rounded-full">
                    <User className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Customer Details</h2>
             </div>

             <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                            <AvatarImage src="/avatars/alex.png" />
                            <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-lg">AM</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Alex M.</h3>
                            <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                                <span>★ 4.9</span>
                                <span className="text-slate-400">(12 orders)</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
                        <div>
                            <p className="font-bold text-slate-900">123 Maple Avenue, Apt 4B</p>
                            <p className="text-sm text-slate-500">Brooklyn, NY 11201</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                        <div className="bg-slate-50 p-3 rounded-xl">
                            <div className="flex items-center gap-2 text-[#3E8940] mb-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Pickup</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">Today, 2pm</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl">
                            <div className="flex items-center gap-2 text-[#3E8940] mb-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Deadline</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">Tomorrow, 10am</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl">
                            <div className="flex items-center gap-2 text-[#3E8940] mb-1">
                                <Navigation className="h-3.5 w-3.5" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Distance</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">2.4 miles</p>
                        </div>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="w-full md:w-[240px] h-[200px] bg-[#9FCFA8] rounded-3xl relative overflow-hidden flex items-center justify-center">
                   <div className="relative z-10 translate-y-[-24px] flex items-center justify-center">
                       <MapPin className="h-32 w-32 text-[#1a1f1c]" strokeWidth={1.5} />
                   </div>
                   <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
                       <Button size="sm" className="bg-white hover:bg-white/90 text-[#3E8940] text-xs font-bold shadow-sm h-8 mt-2 px-6 rounded-full">
                           Open in Maps
                       </Button>
                   </div>
                </div>
             </div>
          </div>

          {/* Order Items Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3E8940]/10 text-[#3E8940] rounded-lg">
                    <Package className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Order Items</h2>
             </div>

             <div className="border rounded-xl overflow-hidden">
                 <div className="bg-slate-50 px-6 py-3 flex justify-between items-center border-b">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Type</span>
                     <span className="font-bold text-slate-900">Wash & Iron</span>
                 </div>
                 <div className="divide-y">
                     {[
                         { name: "Men's Jeans", category: "Jeans", count: 1, img: "/placeholder-jeans.png" }, // Mock images or colors
                         { name: "Men's Denim", category: "Denim", count: 4, img: "/placeholder-denim.png" },
                         { name: "Men's T-Shirt", category: "T-Shirt", count: 3, img: "/placeholder-tshirt.png" }
                     ].map((item, i) => (
                         <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                             <div className="flex items-center gap-4">
                                 <div className="h-12 w-12 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                                     {/* Placeholder for item image */}
                                     {/* <Image ... /> if available, else icon */}
                                     <div className="h-full w-full bg-[#5d4037]" /> {/* Mock brown fabric color from image */}
                                 </div>
                                 <div>
                                     <p className="font-bold text-slate-900">{item.name}</p>
                                     <p className="text-sm text-slate-500">{item.category}</p>
                                 </div>
                             </div>
                             <div className="text-right">
                                 <p className="text-xs text-slate-400 font-bold uppercase mb-0.5">Item</p>
                                 <p className="font-bold text-slate-900 text-lg">{item.count}</p>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
          </div>

        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
            
            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#3E8940]/10 text-[#3E8940] rounded-lg">
                        <Info className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Order Date</span>
                        <span className="font-bold text-slate-900">Oct 24, 2023 - 09:30 AM</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Delivery Priority</span>
                        <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 text-[10px] font-bold uppercase">Express</Badge>
                    </div>
                    <div className="pt-4 border-t flex justify-between items-center">
                        <span className="text-slate-500 font-bold">Vendor Earnings</span>
                        <span className="text-2xl font-bold text-[#3E8940]">₹40.50</span>
                    </div>
                    <p className="text-right text-xs text-slate-400 font-medium">Estimated Payout: Oct 25</p>
                </div>
            </div>

            {/* Update Status */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-8">
                 <h2 className="text-lg font-bold text-slate-900">Update Order Status</h2>

                 {/* Stepper */}
                 <div className="relative flex justify-between items-center px-2">
                     {/* Line */}
                     <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10" />
                     <div className="absolute top-1/2 left-0 right-[25%] h-0.5 bg-[#3E8940] -z-10" /> {/* Progress bar mockup */}

                     {/* Steps */}
                     {[
                         { label: "Assigned", active: true, done: true },
                         { label: "Picked Up", active: true, done: true },
                         { label: "Washing", active: false, done: false }, // Current Target? 
                         { label: "Ready", active: false, done: false }
                     ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 bg-white px-1"> 
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                                step.done ? "bg-[#3E8940] border-[#3E8940] text-white" : 
                                step.active ? "bg-white border-[#3E8940] text-[#3E8940]" :
                                "bg-white border-slate-200 text-slate-300"
                            }`}>
                                {step.done ? <CheckCircle2 className="h-4 w-4" /> : 
                                 i === 2 ? <Droplets className="h-4 w-4" /> : // Washing icon
                                 <div className="h-2 w-2 rounded-full bg-current" />}
                            </div>
                            <span className={`text-[10px] uppercase font-bold tracking-wider ${step.done || step.active ? "text-[#3E8940]" : "text-slate-300"}`}>
                                {step.label}
                            </span>
                        </div>
                     ))}
                 </div>

                 <Button className="w-full bg-[#3E8940] hover:bg-[#3E8940]/90 text-white font-bold h-12 text-base shadow-md shadow-emerald-900/10">
                    <Droplets className="mr-2 h-5 w-5" />
                    Mark as Washing
                 </Button>

                 <div className="bg-slate-50 rounded-xl p-4 flex gap-3">
                     <Info className="h-5 w-5 text-slate-400 shrink-0" />
                     <p className="text-sm text-slate-500 leading-relaxed">
                        <span className="font-bold text-slate-700">Pro Tip:</span> Scanning the QR code on the laundry bag will automatically update the status to "Washing".
                     </p>
                 </div>
            </div>

        </div>
      </div>
    </div>
  )
}
