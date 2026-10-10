"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Bell,
  Zap,
  Shirt,
  Clock,
  Calendar,
  MapPin,
  Banknote,
  ArrowRight,
  Check,
  AlertTriangle,
} from "lucide-react";
import { ReportProblemModal } from "@/components/dashboard/report-problem-modal";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

interface NewOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SAMPLE_ITEMS = [
  {
    id: 1,
    name: "Men's Cotton Shirt",
    service: "Wash & Iron",
    type: "Wash",
    count: 3,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=150&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15cc3ef1887?w=150&q=80",
    ],
  },
  {
    id: 2,
    name: "Pyjama",
    service: "Wash & Fold",
    type: "Wash",
    count: 2,
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=150&q=80",
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=150&q=80",
    ],
  },
  {
    id: 3,
    name: "Shorts",
    service: "Wash & Fold",
    type: "Wash",
    count: 2,
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=150&q=80",
      "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=150&q=80",
    ],
  },
  {
    id: 4,
    name: "T-Shirt",
    service: "Wash & Iron",
    type: "Wash",
    count: 4,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=150&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=150&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=150&q=80",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=150&q=80",
    ],
  },
  {
    id: 5,
    name: "Denim Jeans",
    service: "Dry Clean",
    type: "Dry Clean",
    count: 2,
    images: [
      "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=150&q=80",
      "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=150&q=80",
    ],
  },
];

const getBadgeColor = (type: string) => {
  switch (type) {
    case "Wash":
      return "bg-[#A8E6A1] text-[#2d5c2a]";
    case "Dry Clean":
      return "bg-[#F6A6A6] text-[#6b3434]";
    case "Both":
      return "bg-[#FFD580] text-[#7c5e10]";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export function NewOrderModal({ open, onOpenChange }: NewOrderModalProps) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showReportProblem, setShowReportProblem] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes for Express allocation
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!open) {
      setTimeLeft(180);
      setIsExpired(false);
      setIsDeclined(false);
      setIsAccepted(false);
      return;
    }

    if (isAccepted || isDeclined || isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, isAccepted, isDeclined, isExpired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleImageSelection = (img: string) => {
    if (selectedImages.includes(img)) {
      setSelectedImages(selectedImages.filter((i) => i !== img));
    } else {
      setSelectedImages([...selectedImages, img]);
    }
  };

  const handleAcceptOrder = () => {
    setIsAccepted(true);
    setTimeout(() => {
      onOpenChange(false);
      router.push("/dashboard/schedule");
      setTimeout(() => setIsAccepted(false), 300);
    }, 2500);
  };

  const handleDeclineOrder = () => {
    setIsDeclined(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md p-0 overflow-hidden bg-slate-50 border-0"
        showCloseButton={false}
      >
        {isAccepted ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4 bg-white h-full min-h-[400px]">
            <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300">
              <Check className="h-10 w-10 text-emerald-600" strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 animate-in slide-in-from-bottom-2 duration-300 delay-100">
              Order Accepted!
            </h3>
            <p className="text-slate-500 font-medium max-w-[250px] animate-in slide-in-from-bottom-2 duration-300 delay-200 text-sm">
              Pickup scheduled for today, 2-4 PM. Order moved to processing queue.
            </p>
          </div>
        ) : isExpired ? (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center space-y-4 bg-white h-full min-h-[400px]">
            <div className="h-20 w-20 bg-amber-100 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300">
              <Clock className="h-10 w-10 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Order Auto-Reallocated
            </h3>
            <p className="text-slate-500 font-medium text-sm max-w-[300px]">
              The 3-minute acceptance window for this Express order has expired. It has been automatically reallocated to another partner to maintain customer SLA.
            </p>
            <Button
              className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-6 h-11"
              onClick={() => onOpenChange(false)}
            >
              Back to Dashboard
            </Button>
          </div>
        ) : isDeclined ? (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center space-y-4 bg-white h-full min-h-[400px]">
            <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Order Declined
            </h3>
            <p className="text-slate-500 font-medium text-sm max-w-[300px]">
              You have declined this order. It has been immediately returned to the allocation engine for partner reassignment.
            </p>
            <Button
              className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-6 h-11"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-5 pb-0 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Bell className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-black text-slate-900 leading-tight">
                      New Order Assigned
                    </DialogTitle>
                    <p className="text-slate-500 font-medium text-sm">
                      Order #284-9321
                    </p>
                  </div>
                </div>
                {/* Close Button replacement or just standard X provided by DialogPrimitive? 
                    ShadCN Dialog usually has a Close button. We can leave it or hide it. 
                    Assuming DialogContent has a close button by default if we strictly follow standard shadcn. 
                    However, custom header here. 
                */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 -mr-2 -mt-2"
                  onClick={() => onOpenChange(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-orange-50 text-orange-600 border-orange-100 font-bold px-2 py-0.5 rounded-md flex items-center gap-1.5"
                >
                  <Zap className="h-3 w-3 fill-orange-600" />
                  EXPRESS
                </Badge>
              </div>

              {/* Express Countdown Banner */}
              <div className="flex items-center justify-between gap-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 mt-3">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-amber-950">
                      Express Acceptance Window
                    </span>
                    <span className="text-[11px] text-amber-700/90 font-medium">
                      Auto-reallocates if not accepted in time
                    </span>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm shadow-xs shrink-0 border ${
                    timeLeft < 60
                      ? "bg-red-50 text-red-700 border-red-200 animate-pulse"
                      : "bg-white text-amber-900 border-amber-300/80"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-5">
              {/* Items Summary */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    ITEMS SUMMARY (
                    {SAMPLE_ITEMS.reduce((acc, item) => acc + item.count, 0)})
                  </h4>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-all"
                  >
                    View details
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <img
                          src={SAMPLE_ITEMS[0].images[0]}
                          alt={SAMPLE_ITEMS[0].name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-slate-900 text-white text-[10px] border-2 border-white cursor-default">
                        x{SAMPLE_ITEMS[0].count}
                      </Badge>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">
                        {SAMPLE_ITEMS[0].name}
                      </h5>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "mt-1 text-[10px] px-1.5 py-0 font-bold h-5",
                          getBadgeColor(SAMPLE_ITEMS[0].type),
                        )}
                      >
                        {SAMPLE_ITEMS[0].service}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <img
                          src={SAMPLE_ITEMS[1].images[0]}
                          alt={SAMPLE_ITEMS[1].name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-slate-900 text-white text-[10px] border-2 border-white cursor-default">
                        x{SAMPLE_ITEMS[1].count}
                      </Badge>
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">
                        {SAMPLE_ITEMS[1].name}
                      </h5>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "mt-1 text-[10px] px-1.5 py-0 font-bold h-5",
                          getBadgeColor(SAMPLE_ITEMS[1].type),
                        )}
                      >
                        {SAMPLE_ITEMS[1].service}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detail Dialog */}
              <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden bg-white">
                  <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-20 flex items-center justify-between">
                    <DialogTitle className="text-xl font-bold text-slate-900">
                      Order Details (
                      {SAMPLE_ITEMS.reduce((acc, item) => acc + item.count, 0)})
                    </DialogTitle>
                  </div>
                  <div className="p-6 max-h-[70vh] overflow-y-auto bg-slate-50/30 scrollbar-primary">
                    <div className="space-y-6 pb-4">
                      {Object.entries(
                        SAMPLE_ITEMS.reduce(
                          (acc, item) => {
                            if (!acc[item.type]) acc[item.type] = [];
                            acc[item.type].push(item);
                            return acc;
                          },
                          {} as Record<string, typeof SAMPLE_ITEMS>,
                        ),
                      ).map(([type, items]) => (
                        <div key={type} className="space-y-3">
                          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-1">
                            {type}
                          </h4>
                          <div className="space-y-3">
                            {items.map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col gap-4 p-5 bg-white hover:bg-slate-50/50 rounded-2xl transition-all border border-slate-100 shadow-sm"
                              >
                                {/* Header: Title/Service & Badge */}
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h5 className="text-base font-bold text-slate-900 leading-tight">
                                      {item.name}
                                    </h5>
                                    <p className="text-sm text-slate-500 font-medium mt-1">
                                      {item.service}
                                    </p>
                                  </div>
                                  <Badge
                                    className={cn(
                                      "border-0 px-3 py-1 text-[11px] uppercase font-bold tracking-wider rounded-full",
                                      getBadgeColor(item.type),
                                    )}
                                  >
                                    {item.type.toUpperCase()}
                                  </Badge>
                                </div>

                                {/* Images Grid */}
                                <div className="flex flex-wrap gap-3">
                                  {item.images.map((img, idx) => {
                                    const isSelected =
                                      selectedImages.includes(img);
                                    return (
                                      <div
                                        key={idx}
                                        onClick={() =>
                                          toggleImageSelection(img)
                                        }
                                        className={cn(
                                          "group relative h-16 w-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm cursor-pointer transition-all",
                                          isSelected &&
                                            "ring-2 ring-[#3E8940] ring-offset-2",
                                        )}
                                      >
                                        <img
                                          src={img}
                                          alt={`${item.name} ${idx + 1}`}
                                          className="h-full w-full object-cover"
                                        />
                                        {/* Selection indicator overlay */}
                                        <div
                                          className={cn(
                                            "absolute inset-0 transition-colors flex items-center justify-center",
                                            isSelected
                                              ? "bg-black/20"
                                              : "bg-black/0 group-hover:bg-black/5",
                                          )}
                                        >
                                          {isSelected && (
                                            <div className="bg-[#3E8940] rounded-full p-1 shadow-sm">
                                              <Check
                                                className="h-4 w-4 text-white"
                                                strokeWidth={3}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0 z-20">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-200 text-slate-700 font-bold h-12 rounded-xl text-base hover:bg-slate-50 hover:text-slate-900"
                        onClick={() => setShowDetails(false)}
                      >
                        Close
                      </Button>
                      <Button
                        className="flex-1 bg-[#3E8940] text-white font-bold h-12 rounded-xl text-base hover:bg-[#3E8940]/90 shadow-lg shadow-emerald-500/20"
                        onClick={() => {
                          setShowDetails(false);
                          onOpenChange(false);
                          router.push("/dashboard/schedule");
                        }}
                      >
                        Confirm
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Grid Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <Shirt className="h-3.5 w-3.5" /> SERVICE
                  </div>
                  <p className="font-bold text-slate-900 text-sm">
                    Wash & Fold
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col gap-1.5 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <Clock className="h-3.5 w-3.5" /> PICKUP
                  </div>
                  <p className="font-bold text-slate-900 text-sm">
                    Today, 2pm - 4pm
                  </p>
                </div>
              </div>

              {/* Earning */}
              <div className="bg-[#3E8940]/5 rounded-xl border border-[#3E8940]/10 p-3 flex items-center justify-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#3E8940]/10 flex items-center justify-center text-[#3E8940]">
                  <Banknote className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Your Earning
                  </span>
                  <span className="text-xl font-black text-[#3E8940] tracking-tight">
                    ₹245.00
                  </span>
                </div>
              </div>
            </div>

            {/* Report Problem Modal */}
            <ReportProblemModal
              open={showReportProblem}
              onOpenChange={setShowReportProblem}
              orderId="284-9321"
            />

            {/* Footer Actions */}
            <div className="bg-white p-5 pt-2 pb-5 border-t border-slate-50 flex flex-col gap-4">
              <p className="text-center text-[12px] text-slate-400 font-medium leading-tight px-4">
                By accepting, you agree to fulfil this order within the
                specified time window.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-12 border-slate-200 text-slate-700 font-bold text-base hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl transition-all"
                  onClick={handleDeclineOrder}
                >
                  Decline Order
                </Button>
                <Button
                  className="h-12 bg-[#3E8940] hover:bg-[#3E8940]/90 text-white font-bold text-base shadow-lg shadow-emerald-500/20 rounded-xl"
                  onClick={handleAcceptOrder}
                >
                  Accept Order <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <button
                onClick={() => setShowReportProblem(true)}
                className="flex items-center justify-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
                Report Problem
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
