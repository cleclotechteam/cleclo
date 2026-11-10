"use client";

import { useState, type ReactNode } from "react";
import { BadgeCheck, Clock3, Loader2, Save, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h2 className="font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

/** Footer with a save button that is only enabled when the form has been modified. */
export function SaveFooter({
  dirty,
  disabled,
  onSave,
  label = "Save Changes",
  icon,
  hint,
  className,
}: {
  dirty: boolean;
  disabled?: boolean;
  onSave: () => void;
  label?: string;
  icon?: ReactNode;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100",
        className,
      )}
    >
      <div className="text-xs text-slate-500">{hint}</div>
      <Button
        className="bg-[#00B074] hover:bg-[#00B074]/90 gap-2 ml-auto"
        disabled={!dirty || disabled}
        onClick={onSave}
      >
        {icon ?? <Save className="h-4 w-4" />}
        {label}
      </Button>
    </div>
  );
}

export function VerifiedBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#00B074]/10 px-2 py-0.5 text-[11px] font-semibold text-[#00B074]">
      <BadgeCheck className="h-3.5 w-3.5" />
      Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
      <ShieldAlert className="h-3.5 w-3.5" />
      OTP verification required
    </span>
  );
}

export function PendingBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
      <Clock3 className="h-3.5 w-3.5" />
      Pending re-verification
    </span>
  );
}

/** Banner listing changes submitted for re-verification (verified values stay live meanwhile). */
export function PendingReverificationBanner({
  submittedAt,
  rows,
  onWithdraw,
}: {
  submittedAt: string;
  rows: { label: string; from: string; to: string }[];
  onWithdraw: () => void;
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <PendingBadge />
            <span className="text-xs text-slate-500">Submitted {submittedAt}</span>
          </div>
          <p className="mt-1.5 text-sm text-slate-600">
            Your current verified details remain active until the Cleclo team approves these
            changes.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onWithdraw}>
          Withdraw request
        </Button>
      </div>
      <div className="divide-y divide-amber-100 rounded-lg bg-white/80 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-1 sm:grid-cols-3 gap-1 px-3 py-2">
            <span className="font-medium text-slate-700">{r.label}</span>
            <span className="text-slate-400 line-through break-all">{r.from || "—"}</span>
            <span className="text-slate-900 break-all">{r.to || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Confirmation dialog shown before submitting verified details for re-verification. */
export function ReverificationDialog({
  open,
  onOpenChange,
  title,
  rows,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  rows: { label: string; from: string; to: string }[];
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            These details were verified during onboarding. Changes will be sent for
            re-verification and will not update instantly.
          </DialogDescription>
        </DialogHeader>
        <div className="divide-y divide-slate-100 rounded-lg border border-slate-100 text-sm">
          {rows.map((r) => (
            <div key={r.label} className="px-3 py-2">
              <p className="font-medium text-slate-700">{r.label}</p>
              <p className="text-slate-400 line-through break-all">{r.from || "—"}</p>
              <p className="text-slate-900 break-all">{r.to || "—"}</p>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-[#00B074] hover:bg-[#00B074]/90" onClick={onConfirm}>
            Submit for Re-verification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export interface OtpTarget {
  kind: "email" | "phone";
  value: string;
}

/**
 * OTP verification for changed email / mobile number. Verifies each target in turn and
 * calls onVerified once all have been confirmed. Demo: any 6-digit code is accepted.
 */
export function OtpDialog({
  targets,
  onCancel,
  onVerified,
}: {
  targets: OtpTarget[];
  onCancel: () => void;
  onVerified: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resent, setResent] = useState(false);
  const target = targets[index];
  const open = targets.length > 0;

  const reset = () => {
    setIndex(0);
    setCode("");
    setResent(false);
    setVerifying(false);
  };

  const verify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setCode("");
      setResent(false);
      if (index + 1 < targets.length) {
        setIndex(index + 1);
      } else {
        reset();
        onVerified();
      }
    }, 600);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset();
          onCancel();
        }
      }}
    >
      <DialogContent>
        {target && (
          <>
            <DialogHeader>
              <DialogTitle>
                {target.kind === "email" ? "Verify your email address" : "Verify your mobile number"}
              </DialogTitle>
              <DialogDescription>
                Enter the 6-digit OTP sent to{" "}
                <span className="font-semibold text-slate-900">
                  {target.kind === "phone" ? `+91 ${target.value}` : target.value}
                </span>
                {targets.length > 1 && ` (${index + 1} of ${targets.length})`}.
              </DialogDescription>
            </DialogHeader>
            <Input
              inputMode="numeric"
              autoFocus
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="h-12 text-center text-lg tracking-[0.5em] font-semibold"
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{resent ? "A new OTP has been sent." : "Didn't receive the code?"}</span>
              <button
                type="button"
                className="font-semibold text-[#00B074] hover:underline"
                onClick={() => setResent(true)}
              >
                Resend OTP
              </button>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  reset();
                  onCancel();
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#00B074] hover:bg-[#00B074]/90 gap-2"
                disabled={code.length !== 6 || verifying}
                onClick={verify}
              >
                {verifying && <Loader2 className="h-4 w-4 animate-spin" />}
                Verify OTP
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export const nowStamp = () =>
  new Date().toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).replace(/\b(am|pm)\b/, (m) => m.toUpperCase());

export function diffRows<T extends object>(
  from: T,
  to: Partial<T>,
  labels: Partial<Record<keyof T, string>>,
  mask?: (key: keyof T, value: string) => string,
) {
  return (Object.keys(to) as (keyof T)[]).map((key) => {
    const show = (v: unknown) => (mask ? mask(key, String(v ?? "")) : String(v ?? ""));
    return { label: labels[key] ?? String(key), from: show(from[key]), to: show(to[key]) };
  });
}

export function changedKeys<T extends object>(a: T, b: T, keys: (keyof T)[]) {
  const out: Partial<T> = {};
  for (const k of keys) if (a[k] !== b[k]) out[k] = b[k];
  return out;
}
