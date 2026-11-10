import { Badge } from "@/components/ui/badge";

const STYLES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200",
  Processing: "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200",
  Cleared: "bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-200",
  Paid: "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
  Scheduled: "bg-green-50 text-green-700 hover:bg-green-100 border-green-200",
  Failed: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="secondary" className={STYLES[status] ?? STYLES.Pending}>
      {status}
    </Badge>
  );
}
