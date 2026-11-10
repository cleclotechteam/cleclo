import type { CSSProperties } from "react";
import { ClipboardList, Truck, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardOrder, SlaAlert, DashboardStatus } from "@/lib/vendor-data";

/**
 * One colour per operational status. The KPI icon, KPI card accent and the matching
 * status chip in Recent Orders all read from here so they always stay in sync.
 */
export const STATUS_COLORS: Record<DashboardStatus, { fg: string; bg: string }> = {
  Assigned: { fg: "#2F6FE4", bg: "#E8F0FE" },
  "Pending Pickup": { fg: "#B7861F", bg: "#FDF3DC" },
  "Picked Up": { fg: "#7C5CD6", bg: "#F0EBFC" },
  "Under Processing": { fg: "#E07A1F", bg: "#FDEEDF" },
  "Ready for Delivery": { fg: "#00B074", bg: "#E3F6EE" },
  Completed: { fg: "#475569", bg: "#EEF2F6" },
  Cancelled: { fg: "#DC2626", bg: "#FDECEC" },
};

export const ALERT_COLORS: Record<SlaAlert, { fg: string; bg: string }> = {
  "On Time": { fg: "#00B074", bg: "#E3F6EE" },
  "Due Soon": { fg: "#B7861F", bg: "#FDF3DC" },
  Overdue: { fg: "#DC2626", bg: "#FDECEC" },
};

export function StatusChip({ status, className }: { status: DashboardStatus; className?: string }) {
  const c = STATUS_COLORS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
        className,
      )}
      style={{ color: c.fg, backgroundColor: c.bg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.fg }} />
      {status}
    </span>
  );
}

export function AlertChip({ alert }: { alert: SlaAlert | null }) {
  if (!alert) return <span className="text-xs text-slate-400">—</span>;
  const c = ALERT_COLORS[alert];
  return (
    <span
      className="inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-bold"
      style={{ color: c.fg, backgroundColor: c.bg }}
    >
      {alert}
    </span>
  );
}

const KPIS: {
  title: string;
  sublabel: string;
  status: DashboardStatus;
  icon: typeof ClipboardList;
}[] = [
  { title: "NEWLY ASSIGNED", sublabel: "Assigned", status: "Assigned", icon: ClipboardList },
  { title: "PENDING PICKUP", sublabel: "Pending Pickup", status: "Pending Pickup", icon: Truck },
  { title: "UNDER PROCESSING", sublabel: "Processing", status: "Under Processing", icon: SlidersHorizontal },
  { title: "READY FOR DELIVERY", sublabel: "Ready", status: "Ready for Delivery", icon: CheckCircle2 },
];

interface StatsCardsProps {
  orders: DashboardOrder[];
  selectedFilter: DashboardStatus | null;
  onFilterChange: (status: DashboardStatus | null) => void;
}

export function StatsCards({ orders, selectedFilter, onFilterChange }: StatsCardsProps) {
  return (
    <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
      {KPIS.map((kpi) => {
        const c = STATUS_COLORS[kpi.status];
        const count = orders.filter((o) => o.status === kpi.status).length;
        const selected = selectedFilter === kpi.status;
        return (
          <Card
            key={kpi.status}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            className={cn(
              "cursor-pointer rounded-2xl border-[1.5px] bg-white/80 p-1 backdrop-blur-sm transition-all duration-300 hover:shadow-lg",
              selected && "shadow-md ring-4",
            )}
            style={
              {
                borderColor: c.fg,
                backgroundColor: selected ? c.bg : undefined,
                "--tw-ring-color": `${c.fg}26`,
              } as CSSProperties
            }
            onClick={() => onFilterChange(selected ? null : kpi.status)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onFilterChange(selected ? null : kpi.status);
              }
            }}
          >
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold tracking-wider text-[var(--pine)]">{kpi.title}</h3>
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: c.bg }}
                >
                  <kpi.icon className="h-4 w-4" style={{ color: c.fg }} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-[var(--pine)]">{count}</div>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.fg }} />
                {kpi.sublabel}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
