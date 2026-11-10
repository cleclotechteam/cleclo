"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileSettings } from "@/lib/vendor-data";
import { OtpDialog, SaveFooter, SectionCard, VerifiedBadge, type OtpTarget } from "./shared";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProfileSection({
  saved,
  onSave,
}: {
  saved: ProfileSettings;
  onSave: (next: ProfileSettings) => void;
}) {
  const [form, setForm] = useState(saved);
  const [otpTargets, setOtpTargets] = useState<OtpTarget[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const emailChanged = form.email.trim() !== saved.email;
  const phoneChanged = form.phone !== saved.phone;
  const dirty =
    form.firstName !== saved.firstName ||
    form.lastName !== saved.lastName ||
    emailChanged ||
    phoneChanged ||
    form.photoUrl !== saved.photoUrl;

  const emailValid = EMAIL_RE.test(form.email.trim());
  const phoneValid = /^\d{10}$/.test(form.phone);
  const valid = form.firstName.trim() !== "" && emailValid && phoneValid;

  const set = <K extends keyof ProfileSettings>(key: K, value: ProfileSettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const commit = () => {
    const next: ProfileSettings = {
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      emailVerified: true,
      phoneVerified: true,
    };
    onSave(next);
    setForm(next);
    toast.success("Profile updated");
  };

  const handleSave = () => {
    const targets: OtpTarget[] = [];
    if (emailChanged) targets.push({ kind: "email", value: form.email.trim() });
    if (phoneChanged) targets.push({ kind: "phone", value: form.phone });
    if (targets.length) setOtpTargets(targets);
    else commit();
  };

  const handlePhoto = (file: File | undefined) => {
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setPhotoError("Only JPG or PNG images are supported.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Image exceeds the 2 MB limit.");
      return;
    }
    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = () => set("photoUrl", String(reader.result));
    reader.readAsDataURL(file);
  };

  const initials =
    `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase() || "VL";

  return (
    <SectionCard
      title="Personal Information"
      description="Manage your contact details and personal information associated with your vendor account."
    >
      <div className="p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {form.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.photoUrl}
                alt="Profile photo"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-[#00B074]/10 flex items-center justify-center text-[#00B074] font-bold text-2xl">
                {initials}
              </div>
            )}
            <button
              type="button"
              aria-label="Upload profile photo"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:bg-slate-50"
            >
              <Camera className="h-4 w-4 text-slate-600" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => {
                handlePhoto(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </div>
          <div>
            <p className="font-medium text-slate-900">Profile Photo</p>
            <p className="text-sm text-slate-500">Upload a JPG or PNG image (Maximum 2 MB).</p>
            {photoError && <p className="text-xs text-red-500 mt-1">{photoError}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              placeholder="Enter your first name"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              placeholder="Enter your last name"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="email">Email</Label>
              <VerifiedBadge verified={!emailChanged && saved.emailVerified} />
            </div>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="Enter your registered email address"
              className="h-11"
            />
            {emailChanged && !emailValid && form.email !== "" && (
              <p className="text-xs text-red-500">Enter a valid email address.</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="phone">Phone</Label>
              <VerifiedBadge verified={!phoneChanged && saved.phoneVerified} />
            </div>
            <div className="flex">
              <span className="inline-flex h-11 items-center rounded-l-md border border-r-0 border-input bg-slate-50 px-3 text-sm text-slate-500">
                +91
              </span>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="Enter your 10-digit mobile number"
                className="h-11 rounded-l-none"
              />
            </div>
            {phoneChanged && !phoneValid && form.phone !== "" && (
              <p className="text-xs text-red-500">Mobile number must be 10 digits.</p>
            )}
          </div>
        </div>

        <SaveFooter
          dirty={dirty}
          disabled={!valid}
          onSave={handleSave}
          hint={
            (emailChanged || phoneChanged) &&
            "Changes to your email or mobile number require OTP verification."
          }
        />
      </div>

      <OtpDialog targets={otpTargets} onCancel={() => setOtpTargets([])} onVerified={() => {
        setOtpTargets([]);
        commit();
      }} />
    </SectionCard>
  );
}
