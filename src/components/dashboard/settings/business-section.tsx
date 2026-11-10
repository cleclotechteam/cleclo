"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  BusinessLegalInfo,
  BusinessSettings,
  ReverificationRequest,
} from "@/lib/vendor-data";
import {
  PendingBadge,
  PendingReverificationBanner,
  ReverificationDialog,
  SaveFooter,
  SectionCard,
  changedKeys,
  diffRows,
  nowStamp,
} from "./shared";

const LEGAL_KEYS: (keyof BusinessLegalInfo)[] = [
  "businessName",
  "businessAddress",
  "gstNumber",
  "panNumber",
];
const INSTANT_KEYS: (keyof BusinessSettings)[] = [
  "businessEmail",
  "businessContact",
  "serviceRadius",
  "dailyCapacity",
];
const LABELS: Record<keyof BusinessLegalInfo, string> = {
  businessName: "Business Name",
  businessAddress: "Business Address",
  gstNumber: "GST Number",
  panNumber: "PAN Number",
};

const GST_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export function BusinessSection({
  saved,
  pending,
  onSave,
}: {
  saved: BusinessSettings;
  pending: ReverificationRequest<BusinessLegalInfo> | null;
  onSave: (
    next: BusinessSettings,
    pending: ReverificationRequest<BusinessLegalInfo> | null,
  ) => void;
}) {
  const [form, setForm] = useState(saved);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const set = (key: keyof BusinessSettings, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const legalChanges = changedKeys<BusinessLegalInfo>(saved, form, LEGAL_KEYS);
  const instantChanges = changedKeys<BusinessSettings>(saved, form, INSTANT_KEYS);
  const hasLegal = Object.keys(legalChanges).length > 0;
  const dirty = hasLegal || Object.keys(instantChanges).length > 0;

  const gstValid = form.gstNumber === "" || GST_RE.test(form.gstNumber);
  const panValid = PAN_RE.test(form.panNumber);
  const contactValid = /^\d{10}$/.test(form.businessContact);
  const valid =
    form.businessName.trim() !== "" &&
    form.businessAddress.trim() !== "" &&
    gstValid &&
    panValid &&
    contactValid;

  const legalLocked = pending !== null;

  const submit = () => {
    const next: BusinessSettings = { ...saved, ...instantChanges };
    const request = hasLegal ? { submittedAt: nowStamp(), changes: legalChanges } : pending;
    onSave(next, request);
    setForm(next);
    setConfirmOpen(false);
    toast.success(
      hasLegal ? "Changes submitted for re-verification" : "Business details updated",
    );
  };

  const field = (
    key: keyof BusinessSettings,
    label: string,
    placeholder: string,
    opts: { legal?: boolean; span?: boolean; error?: string | false; upper?: boolean; digits?: number } = {},
  ) => (
    <div className={opts.span ? "space-y-2 md:col-span-2" : "space-y-2"}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={key}>{label}</Label>
        {opts.legal && legalLocked && key in (pending?.changes ?? {}) && <PendingBadge />}
      </div>
      <Input
        id={key}
        value={form[key]}
        disabled={opts.legal && legalLocked}
        inputMode={opts.digits ? "numeric" : undefined}
        onChange={(e) => {
          let v = e.target.value;
          if (opts.upper) v = v.toUpperCase().replace(/\s/g, "");
          if (opts.digits) v = v.replace(/\D/g, "").slice(0, opts.digits);
          set(key, v);
        }}
        placeholder={placeholder}
        className="h-11"
      />
      {opts.error && <p className="text-xs text-red-500">{opts.error}</p>}
    </div>
  );

  const rows = diffRows<BusinessLegalInfo>(saved, legalChanges, LABELS);

  return (
    <SectionCard
      title="Business Details"
      description="View and manage your registered business and outlet information."
    >
      <div className="p-6 space-y-6">
        {pending && (
          <PendingReverificationBanner
            submittedAt={pending.submittedAt}
            rows={diffRows<BusinessLegalInfo>(saved, pending.changes, LABELS)}
            onWithdraw={() => {
              onSave(saved, null);
              toast("Re-verification request withdrawn");
            }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field("businessName", "Business Name", "Enter your registered business name", {
            legal: true,
            span: true,
          })}
          {field("businessEmail", "Business Email", "Enter your business email address")}
          {field("businessContact", "Business Contact", "Enter your business contact number", {
            digits: 10,
            error: !contactValid && form.businessContact !== "" && "Contact number must be 10 digits.",
          })}
          {field("businessAddress", "Business Address", "Enter your registered business address", {
            legal: true,
            span: true,
          })}
          {field("gstNumber", "GST Number", "Enter your 15-digit GSTIN (if applicable)", {
            legal: true,
            upper: true,
            error: !gstValid && "Enter a valid 15-digit GSTIN.",
          })}
          {field("panNumber", "PAN Number", "Enter your PAN number", {
            legal: true,
            upper: true,
            error: !panValid && form.panNumber !== "" && "Enter a valid 10-character PAN.",
          })}
          <div className="space-y-2">
            <Label htmlFor="serviceRadius">Service Radius (KM)</Label>
            <Select value={form.serviceRadius} onValueChange={(v) => set("serviceRadius", v)}>
              <SelectTrigger id="serviceRadius" className="h-11 w-full bg-white">
                <SelectValue placeholder="Select radius" />
              </SelectTrigger>
              <SelectContent>
                {["3", "5", "8", "10", "15", "20", "25", "30", "50"].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v} KM
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Daily Capacity (Units)</Label>
            <Select value={form.dailyCapacity} onValueChange={(v) => set("dailyCapacity", v)}>
              <SelectTrigger id="capacity" className="h-11 w-full bg-white">
                <SelectValue placeholder="Select capacity" />
              </SelectTrigger>
              <SelectContent>
                {["10", "20", "30", "50", "75", "100", "150", "200"].map((v) => (
                  <SelectItem key={v} value={v}>
                    {v === "200" ? "200+" : v} Units
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <SaveFooter
          dirty={dirty}
          disabled={!valid}
          onSave={() => (hasLegal ? setConfirmOpen(true) : submit())}
          hint={
            legalLocked
              ? "Legal business details are locked while a re-verification request is pending."
              : hasLegal &&
                "Changes to legal business information will be sent for re-verification."
          }
        />
      </div>

      <ReverificationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Submit business details for re-verification?"
        rows={rows}
        onConfirm={submit}
      />
    </SectionCard>
  );
}
