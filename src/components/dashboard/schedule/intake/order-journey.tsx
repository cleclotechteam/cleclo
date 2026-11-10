import { CheckCircle2, Route } from "lucide-react";
import { cn } from "@/lib/utils";
import { ORDER_JOURNEY_STAGES } from "@/lib/vendor-data";

interface OrderJourneyProps {
  /** Number of stages completed (0–16). The next stage is shown as current. */
  completedThrough: number;
  /** Optional timestamp per completed stage number. */
  timestamps: Partial<Record<number, string>>;
  /** Optional extra line under a stage (e.g. discrepancies flagged). */
  notes?: Partial<Record<number, string>>;
}

/** Cleclo Order Journey – 16 stages. */
export function OrderJourney({ completedThrough, timestamps, notes = {} }: OrderJourneyProps) {
  const total = ORDER_JOURNEY_STAGES.length;
  const currentStage = Math.min(completedThrough + 1, total);
  const current = ORDER_JOURNEY_STAGES[currentStage - 1];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <Route className="h-5 w-5 text-[#00B074]" />
          Cleclo Order Journey
        </h2>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {completedThrough >= total
            ? `${ORDER_JOURNEY_STAGES[total - 1].heading}`
            : `Stage ${currentStage} of ${total} · ${current.heading}`}
        </span>
      </div>

      <ol className="relative p-5">
        {ORDER_JOURNEY_STAGES.map((s, i) => {
          const done = s.stage <= completedThrough;
          const isCurrent = !done && s.stage === currentStage;
          const last = i === total - 1;
          return (
            <li key={s.stage} className="relative flex gap-4 pb-5 last:pb-0">
              {!last && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-[15px] top-8 bottom-0 w-0.5",
                    done ? "bg-[#00B074]" : "bg-slate-200",
                  )}
                />
              )}
              <span
                className={cn(
                  "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  done
                    ? "bg-[#00B074] text-white shadow-md shadow-emerald-200/50"
                    : isCurrent
                      ? "animate-pulse bg-amber-500 text-white shadow-md shadow-amber-200/50"
                      : "bg-slate-100 text-slate-400",
                )}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : s.stage}
              </span>
              <div className="flex-1 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4
                    className={cn(
                      "font-semibold",
                      done ? "text-slate-900" : isCurrent ? "text-amber-700" : "text-slate-400",
                    )}
                  >
                    {s.heading}
                  </h4>
                  {done && timestamps[s.stage] ? (
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
                      {timestamps[s.stage]}
                    </span>
                  ) : isCurrent ? (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                      In Progress
                    </span>
                  ) : null}
                </div>
                <p className={cn("mt-0.5 text-sm", done || isCurrent ? "text-slate-500" : "text-slate-400")}>
                  {s.description}
                </p>
                {notes[s.stage] && (
                  <p className="mt-1 text-xs font-medium text-amber-700">{notes[s.stage]}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
