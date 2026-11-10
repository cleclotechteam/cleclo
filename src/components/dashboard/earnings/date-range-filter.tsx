"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { endOfDay, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { RANGE_PRESETS, presetRange, rangeLabel, type DateRangeValue } from "./earnings-utils";

interface DateRangeFilterProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  className?: string;
}

/** Today / Last 7 Days / Last 30 Days / Custom Range. */
export function DateRangeFilter({ value, onChange, className }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>({ from: value.from, to: value.to });

  const applyCustom = () => {
    if (!draft?.from) return;
    onChange({
      preset: "custom",
      from: startOfDay(draft.from),
      to: endOfDay(draft.to ?? draft.from),
    });
    setOpen(false);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="flex flex-wrap rounded-lg bg-slate-100 p-1">
        {RANGE_PRESETS.map((p) =>
          p.value === "custom" ? (
            <Popover
              key={p.value}
              open={open}
              onOpenChange={(o) => {
                setOpen(o);
                if (o) setDraft({ from: value.from, to: value.to });
              }}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                    value.preset === "custom"
                      ? "bg-[#00B074] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-200",
                  )}
                >
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {p.label}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  defaultMonth={draft?.from}
                  selected={draft}
                  onSelect={setDraft}
                  numberOfMonths={2}
                  disabled={{ after: new Date() }}
                />
                <div className="flex justify-end gap-2 border-t p-3">
                  <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#00B074] hover:bg-[#00B074]/90"
                    disabled={!draft?.from}
                    onClick={applyCustom}
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange(presetRange(p.value as Exclude<typeof p.value, "custom">))}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                value.preset === p.value
                  ? "bg-[#00B074] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-200",
              )}
            >
              {p.label}
            </button>
          ),
        )}
      </div>
      {value.preset === "custom" && (
        <span className="text-xs font-medium text-slate-500">{rangeLabel(value)}</span>
      )}
    </div>
  );
}
