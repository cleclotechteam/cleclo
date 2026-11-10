"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaveFooter, SectionCard } from "./shared";

export function SecuritySection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const dirty = current !== "" || next !== "" || confirm !== "";
  const tooShort = next !== "" && next.length < 8;
  const mismatch = confirm !== "" && next !== confirm;
  const valid = current !== "" && next.length >= 8 && next === confirm;

  return (
    <SectionCard
      title="Security"
      description="Manage your password, account access and security preferences."
    >
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="h-11"
            />
            {tooShort && (
              <p className="text-xs text-red-500">Password must be at least 8 characters.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-11"
            />
            {mismatch && <p className="text-xs text-red-500">Passwords do not match.</p>}
          </div>
        </div>

        <SaveFooter
          dirty={dirty}
          disabled={!valid}
          label="Update Password"
          icon={<Shield className="h-4 w-4" />}
          onSave={() => {
            setCurrent("");
            setNext("");
            setConfirm("");
            toast.success("Password updated");
          }}
        />
      </div>
    </SectionCard>
  );
}
