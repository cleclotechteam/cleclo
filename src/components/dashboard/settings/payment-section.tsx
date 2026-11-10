"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
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
import type { BankDetails, PaymentSettings, ReverificationRequest } from "@/lib/vendor-data";
import {
  PendingBadge,
  PendingReverificationBanner,
  ReverificationDialog,
  SaveFooter,
  SectionCard,
  VerifiedBadge,
  changedKeys,
  diffRows,
  nowStamp,
} from "./shared";

const BANK_KEYS: (keyof BankDetails)[] = ["accountNumber", "ifscCode", "accountHolderName"];
const PREF_KEYS: (keyof PaymentSettings)[] = ["payoutSchedule", "minimumPayout"];
const LABELS: Record<keyof BankDetails, string> = {
  accountNumber: "Bank Account Number",
  ifscCode: "IFSC Code",
  accountHolderName: "Account Holder Name",
};
const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const maskAccount = (n: string) => (n.length > 4 ? `•••• ${n.slice(-4)}` : n);
const maskRow = (key: keyof BankDetails, v: string) =>
  key === "accountNumber" ? maskAccount(v) : v;

export function PaymentSection({
  saved,
  pending,
  onSave,
}: {
  saved: PaymentSettings;
  pending: ReverificationRequest<BankDetails> | null;
  onSave: (next: PaymentSettings, pending: ReverificationRequest<BankDetails> | null) => void;
}) {
  const [form, setForm] = useState(saved);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const set = <K extends keyof PaymentSettings>(key: K, value: PaymentSettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const bankChanges = changedKeys<BankDetails>(saved, form, BANK_KEYS);
  const prefChanges = changedKeys<PaymentSettings>(saved, form, PREF_KEYS);
  const hasBank = Object.keys(bankChanges).length > 0;
  const dirty = hasBank || Object.keys(prefChanges).length > 0;
  const locked = pending !== null;

  const accountValid = /^\d{9,18}$/.test(form.accountNumber);
  const ifscValid = IFSC_RE.test(form.ifscCode);
  const valid =
    accountValid && ifscValid && form.accountHolderName.trim() !== "" && Number(form.minimumPayout) >= 0;

  const submit = () => {
    const next: PaymentSettings = { ...saved, ...prefChanges };
    onSave(next, hasBank ? { submittedAt: nowStamp(), changes: bankChanges } : pending);
    setForm(next);
    setConfirmOpen(false);
    toast.success(hasBank ? "Bank details submitted for re-verification" : "Payout preferences updated");
  };

  return (
    <SectionCard
      title="Payment Settings"
      description="View your registered bank details and payout preferences."
    >
      <div className="p-6 space-y-6">
        <div className="p-4 bg-[#00B074]/5 rounded-xl border border-[#00B074]/10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <CreditCard className="h-5 w-5 text-[#00B074]" />
            <span className="font-semibold text-slate-900">Bank Account Connected</span>
            <VerifiedBadge verified />
          </div>
          <p className="text-sm text-slate-600">
            {saved.bankName} {maskAccount(saved.accountNumber)} · {saved.ifscCode}
          </p>
        </div>

        {pending && (
          <PendingReverificationBanner
            submittedAt={pending.submittedAt}
            rows={diffRows<BankDetails>(saved, pending.changes, LABELS, maskRow)}
            onWithdraw={() => {
              onSave(saved, null);
              toast("Re-verification request withdrawn");
            }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="accountNumber">Bank Account Number</Label>
              {locked && "accountNumber" in pending.changes && <PendingBadge />}
            </div>
            <Input
              id="accountNumber"
              inputMode="numeric"
              disabled={locked}
              value={form.accountNumber}
              onChange={(e) => set("accountNumber", e.target.value.replace(/\D/g, "").slice(0, 18))}
              placeholder="Enter your bank account number"
              className="h-11"
            />
            {!accountValid && form.accountNumber !== "" && (
              <p className="text-xs text-red-500">Account number must be 9–18 digits.</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              {locked && "ifscCode" in pending.changes && <PendingBadge />}
            </div>
            <Input
              id="ifscCode"
              disabled={locked}
              value={form.ifscCode}
              onChange={(e) => set("ifscCode", e.target.value.toUpperCase().replace(/\s/g, "").slice(0, 11))}
              placeholder="Enter your bank's IFSC code"
              className="h-11"
            />
            {!ifscValid && form.ifscCode !== "" && (
              <p className="text-xs text-red-500">Enter a valid 11-character IFSC code.</p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="accountHolderName">Account Holder Name</Label>
              {locked && "accountHolderName" in pending.changes && <PendingBadge />}
            </div>
            <Input
              id="accountHolderName"
              disabled={locked}
              value={form.accountHolderName}
              onChange={(e) => set("accountHolderName", e.target.value)}
              placeholder="Enter the name as per bank records"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payoutSchedule">Payout Schedule</Label>
            <Select
              value={form.payoutSchedule}
              onValueChange={(v) => set("payoutSchedule", v as PaymentSettings["payoutSchedule"])}
            >
              <SelectTrigger id="payoutSchedule" className="h-11 w-full bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly (Every Friday)</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumPayout">Minimum Payout Amount (₹)</Label>
            <Input
              id="minimumPayout"
              type="number"
              min={0}
              value={form.minimumPayout}
              onChange={(e) => set("minimumPayout", e.target.value)}
              className="h-11"
            />
            <p className="text-xs text-slate-500">
              We&apos;ll hold payments until this threshold is met
            </p>
          </div>
        </div>

        <SaveFooter
          dirty={dirty}
          disabled={!valid}
          onSave={() => (hasBank ? setConfirmOpen(true) : submit())}
          hint={
            locked
              ? "Bank details are locked while a re-verification request is pending."
              : hasBank && "Changes to bank details will be sent for re-verification."
          }
        />
      </div>

      <ReverificationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Submit bank details for re-verification?"
        rows={diffRows<BankDetails>(saved, bankChanges, LABELS, maskRow)}
        onConfirm={submit}
      />
    </SectionCard>
  );
}
