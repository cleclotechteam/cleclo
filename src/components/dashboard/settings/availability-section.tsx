"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DayAvailability } from "@/lib/vendor-data";
import { SaveFooter, SectionCard } from "./shared";

/** Half-hourly slots from 12:00 AM to 11:30 PM; value "HH:mm", label "9:00 AM". */
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return {
    value: `${String(h).padStart(2, "0")}:${m}`,
    label: `${hour12}:${m} ${h < 12 ? "AM" : "PM"}`,
  };
});

function TimeSelect({
  value,
  onChange,
  disabled,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        aria-label={label}
        className="h-9 w-32 bg-white px-2.5 text-xs sm:text-sm font-medium"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-64">
        {TIME_SLOTS.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function AvailabilitySection({
  saved,
  onSave,
}: {
  saved: DayAvailability[];
  onSave: (next: DayAvailability[]) => void;
}) {
  const [days, setDays] = useState(saved);

  const dirty = days.some(
    (d, i) => d.open !== saved[i]?.open || d.from !== saved[i]?.from || d.to !== saved[i]?.to,
  );
  const invalidDays = days.filter((d) => d.open && d.to <= d.from).map((d) => d.day);

  const update = (day: string, patch: Partial<DayAvailability>) =>
    setDays((ds) => ds.map((d) => (d.day === day ? { ...d, ...patch } : d)));

  return (
    <SectionCard
      title="Availability"
      description="Manage outlet operating hours and service availability."
    >
      <div className="divide-y divide-slate-100">
        {days.map((d) => {
          const invalid = invalidDays.includes(d.day);
          return (
            <div key={d.day} className="p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-4 min-w-[130px]">
                  <Switch
                    checked={d.open}
                    aria-label={`${d.day} open`}
                    onCheckedChange={(open) => update(d.day, { open })}
                  />
                  <span className="font-medium text-slate-900 w-24">{d.day}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <TimeSelect
                    label={`${d.day} opening time`}
                    value={d.from}
                    disabled={!d.open}
                    onChange={(from) => update(d.day, { from })}
                  />
                  <span className="text-slate-400 text-xs sm:text-sm">to</span>
                  <TimeSelect
                    label={`${d.day} closing time`}
                    value={d.to}
                    disabled={!d.open}
                    onChange={(to) => update(d.day, { to })}
                  />
                </div>
              </div>
              {invalid && (
                <p className="mt-2 text-xs text-red-500 sm:text-right">
                  Closing time must be after opening time.
                </p>
              )}
            </div>
          );
        })}
      </div>
      <SaveFooter
        className="p-4"
        dirty={dirty}
        disabled={invalidDays.length > 0}
        label="Save Availability"
        icon={<Save className="h-4 w-4" />}
        onSave={() => {
          onSave(days);
          toast.success("Availability updated");
        }}
      />
    </SectionCard>
  );
}
