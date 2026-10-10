import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Truck, Settings2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "Newly Assigned Orders",
    status: "Assigned",
    description: "+4 since yesterday",
    icon: ClipboardList,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    trend: "up",
  },
  {
    title: "Pending Pickups",
    status: "Pending Pickup",
    description: "Next pickup at 2:00 PM",
    icon: Truck,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    trend: "neutral",
  },
  {
    title: "Under Processing",
    status: "Under Processing",
    description: "15 washers active",
    icon: Settings2,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    trend: "neutral",
  },
  {
    title: "Ready for Delivery",
    status: "Ready",
    description: "3 drivers notified",
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    trend: "up",
  },
];

interface StatsCardsProps {
  orders: any[];
  selectedFilter: string | null;
  onFilterChange: (status: string | null) => void;
}

export function StatsCards({
  orders,
  selectedFilter,
  onFilterChange,
}: StatsCardsProps) {
  const getCount = (status: string) =>
    orders.filter((o) => o.status === status).length;

  const cardData = stats.map((stat) => ({
    ...stat,
    value: getCount(stat.status).toString(),
  }));

  return (
    <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
      {cardData.map((stat) => (
        <Card
          key={stat.title}
          className={cn(
            "cursor-pointer transition-all duration-300 hover:shadow-lg rounded-2xl border bg-white/80 backdrop-blur-sm p-1",
            selectedFilter === stat.status
              ? "border-[var(--pine)] bg-[var(--pine)]/5 shadow-md ring-2 ring-[var(--pine)]/20"
              : "border-[var(--kraft-line)] hover:border-[var(--stamp)]/30",
          )}
          onClick={() =>
            onFilterChange(selectedFilter === stat.status ? null : stat.status)
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between space-y-0 mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--pine)]">{stat.title}</h3>
              <div className={`p-2 rounded-xl ${stat.iconBg}`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[var(--pine)]">{stat.value}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
