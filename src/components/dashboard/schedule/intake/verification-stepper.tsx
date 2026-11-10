import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { VERIFICATION_WORKFLOW_STEPS } from "@/lib/vendor-data";

/** Recommended Final Workflow, 5 steps. `done[i]` marks step i+1 complete. */
export function VerificationStepper({ done }: { done: boolean[] }) {
  const current = done.findIndex((d) => !d);

  return (
    <ol className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:grid-cols-5 md:gap-2">
      {VERIFICATION_WORKFLOW_STEPS.map((step, i) => {
        const isDone = done[i];
        const isCurrent = i === current;
        return (
          <li key={step.title} className="relative flex gap-3 md:flex-col md:gap-2">
            {i < VERIFICATION_WORKFLOW_STEPS.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute hidden md:block md:left-9 md:-right-2 md:top-3.5 md:h-0.5",
                  isDone ? "bg-[#00B074]" : "bg-slate-200",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                isDone
                  ? "bg-[#00B074] text-white"
                  : isCurrent
                    ? "border-2 border-[#00B074] bg-white text-[#00B074]"
                    : "border-2 border-slate-200 bg-white text-slate-400",
              )}
            >
              {isDone ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <div className="md:pr-2">
              <p
                className={cn(
                  "text-sm font-semibold leading-tight",
                  isDone || isCurrent ? "text-slate-900" : "text-slate-400",
                )}
              >
                {i + 1}. {step.title}
              </p>
              <p className={cn("mt-0.5 text-xs leading-snug", isDone || isCurrent ? "text-slate-500" : "text-slate-400")}>
                {step.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
