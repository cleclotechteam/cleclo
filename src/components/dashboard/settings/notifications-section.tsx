"use client";

import { useState } from "react";
import { Lock, Zap } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import type { NotificationCategory, NotificationChannels } from "@/lib/vendor-data";
import { SaveFooter, SectionCard } from "./shared";

const CHANNELS: { key: keyof NotificationChannels; label: string }[] = [
  { key: "push", label: "In-app / Push" },
  { key: "sms", label: "SMS" },
  { key: "email", label: "Email" },
];

export function NotificationsSection({
  saved,
  savedChannels,
  onSave,
}: {
  saved: NotificationCategory[];
  savedChannels: NotificationChannels;
  onSave: (next: NotificationCategory[], channels: NotificationChannels) => void;
}) {
  const [categories, setCategories] = useState(saved);
  const [channels, setChannels] = useState(savedChannels);

  const dirty =
    categories.some((c, i) => c.enabled !== saved[i]?.enabled) ||
    CHANNELS.some(({ key }) => channels[key] !== savedChannels[key]);
  const anyChannel = CHANNELS.some(({ key }) => channels[key]);

  const toggle = (id: NotificationCategory["id"], enabled: boolean) =>
    setCategories((cs) =>
      // Critical alerts stay on regardless of what the UI sends.
      cs.map((c) => (c.id === id && !c.mandatory ? { ...c, enabled } : c)),
    );

  return (
    <SectionCard
      title="Notifications"
      description="Customise alerts for orders, logistics updates and payouts."
    >
      <div className="divide-y divide-slate-100">
        {categories.map((c) => (
          <div key={c.id} className="p-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{c.heading}</p>
                {c.mandatory && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    <Lock className="h-3 w-3" />
                    Mandatory
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500">{c.description}</p>
              {c.triggers.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {c.triggers.map((t) => (
                    <li
                      key={t.notification}
                      className="flex items-start gap-1.5 text-xs text-slate-500"
                    >
                      <Zap className="h-3.5 w-3.5 mt-px shrink-0 text-[#00B074]" />
                      <span>
                        <span className="font-medium text-slate-700">{t.notification}:</span>{" "}
                        {t.trigger}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Switch
              checked={c.mandatory || c.enabled}
              disabled={c.mandatory}
              aria-label={c.heading}
              title={c.mandatory ? "Critical alerts cannot be turned off" : undefined}
              onCheckedChange={(checked) => toggle(c.id, checked)}
            />
          </div>
        ))}
        <div className="p-4 bg-slate-50/50">
          <p className="font-medium text-slate-900 mb-1">Notification Channels</p>
          <p className="text-xs text-slate-500 mb-3">
            Each event sends one notification per enabled channel.
          </p>
          <div className="flex flex-wrap gap-4">
            {CHANNELS.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2">
                <Switch
                  checked={channels[key]}
                  onCheckedChange={(checked) => setChannels((ch) => ({ ...ch, [key]: checked }))}
                />
                <span className="text-sm text-slate-600">{label}</span>
              </label>
            ))}
          </div>
          {!anyChannel && (
            <p className="mt-2 text-xs text-red-500">
              Keep at least one channel enabled so you receive critical alerts.
            </p>
          )}
        </div>
        <SaveFooter
          className="p-4"
          dirty={dirty}
          disabled={!anyChannel}
          onSave={() => {
            onSave(categories, channels);
            toast.success("Notification preferences updated");
          }}
        />
      </div>
    </SectionCard>
  );
}
