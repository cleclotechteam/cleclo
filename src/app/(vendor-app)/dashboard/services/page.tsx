"use client";

import { useState } from "react";
import { Package, AlertCircle, CheckCircle, Clock, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Services assigned by admin - vendors can ONLY toggle availability
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

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Wash":
      return "bg-blue-100 text-blue-700";
    case "Dry Clean":
      return "bg-purple-100 text-purple-700";
    case "Iron":
      return "bg-amber-100 text-amber-700";
    case "Repair":
      return "bg-orange-100 text-orange-700";
    case "Special":
      return "bg-pink-100 text-pink-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function ServicesPage() {
  const [services, setServices] = useState(assignedServices);
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [serviceToDisable, setServiceToDisable] = useState<number | null>(null);
  const [disableReason, setDisableReason] = useState("");

  const toggleAvailability = (id: number) => {
    const service = services.find((s) => s.id === id);
    if (!service) return;

    if (service.available) {
      // If currently Available, user is trying to Disable -> Open Modal
      setServiceToDisable(id);
      setDisableDialogOpen(true);
    } else {
      // If currently Unavailable, user is trying to Enable -> Do instantly
      setServices((prev) =>
        prev.map((s) => (s.id === id ? { ...s, available: true } : s)),
      );
    }
  };

  const handleConfirmDisable = () => {
    if (serviceToDisable !== null) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceToDisable ? { ...s, available: false } : s,
        ),
      );
    }
    setDisableDialogOpen(false);
    setServiceToDisable(null);
    setDisableReason("");
  };

  const availableCount = services.filter((s) => s.available).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Disable Reason Dialog */}
      <Dialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-slate-900 border-none shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Disable Service?
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Please provide a reason why this service is temporarily
              unavailable.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="reason" className="font-semibold text-slate-700">
                Reason
              </Label>
              <Textarea
                id="reason"
                placeholder="e.g. Machine breakdown, Out of supplies..."
                className="bg-white border-slate-200 focus:border-primary/50 text-slate-900 min-h-[100px]"
                value={disableReason}
                onChange={(e) => setDisableReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDisableDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDisable}
              disabled={!disableReason.trim()}
              className="bg-red-500 hover:bg-red-600 text-white font-bold"
            >
              Disable Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl text-black font-bold tracking-tight">
            Service Catalog
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            Service pricing is managed by Admin. You may toggle availability
            based on operational capacity. Contact Admin for additions or
            pricing updates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-700 border-none px-3 py-1">
            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
            {availableCount} Available
          </Badge>
          <Badge className="bg-slate-100 text-slate-600 border-none px-3 py-1">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            {services.length - availableCount} Unavailable
          </Badge>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-blue-800">Read-Only Service Catalog</p>
          <p className="text-sm text-blue-700 mt-1">
            This is a read-only service catalogue. Pricing and service structure
            are managed centrally. You may update availability based on
            operational constraints.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className={`bg-white rounded-xl shadow-sm border p-5 transition-all ${!service.available ? "opacity-60" : ""
              }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-lg ${service.available ? "bg-primary/10" : "bg-slate-100"
                    }`}
                >
                  <Package
                    className={`h-5 w-5 ${service.available ? "text-primary" : "text-slate-400"
                      }`}
                  />
                </div>
                <Badge
                  className={`${getCategoryColor(
                    service.category,
                  )} border-none text-xs`}
                >
                  {service.category}
                </Badge>
              </div>
              <Switch
                checked={service.available}
                onCheckedChange={() => toggleAvailability(service.id)}
              />
            </div>

            <h3 className="font-bold text-black text-lg mb-1">
              {service.name}
            </h3>
            <p className="text-sm text-slate-500 mb-3">{service.description}</p>

            <div className="flex items-center justify-end pt-3 border-t">
              <Badge
                className={`${service.available
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  } border-none`}
              >
                {service.available ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Available
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Unavailable
                  </>
                )}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Admin */}
      <div className="bg-slate-50 rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-medium text-black">
            Need to add or modify services?
          </p>
          <p className="text-sm text-slate-500">
            Contact Admin to request changes to your service catalog
          </p>
        </div>
        <Button
          variant="outline"
          className="text-primary border-primary hover:bg-primary/10"
        >
          Contact Admin
        </Button>
      </div>
    </div>
  );
}
