"use client";

import { useState } from "react";
import { EarningsStats } from "./earnings-stats";
import { EarningsChart } from "./earnings-chart";
import { EarningsTrendChart } from "./earnings-trend-chart";
import { RecentTransactions } from "./recent-transactions";
import { ChevronDown, Calendar as CalendarIcon, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { VendorDataGate } from "@/components/dashboard/vendor-data-gate";
import type { Transaction } from "@/lib/vendor-data";

import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
  isWithinInterval,
  startOfDay,
  endOfDay,
  parseISO,
  format,
  subDays,
  differenceInDays,
  isSameDay,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function EarningsOverview() {
  return (
    <VendorDataGate resource="transactions">
      {(transactions) => <EarningsOverviewView transactions={transactions} />}
    </VendorDataGate>
  );
}

function EarningsOverviewView({ transactions: TRANSACTIONS_DATA }: { transactions: Transaction[] }) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isExporting, setIsExporting] = useState(false);

  const filteredTransactions = date?.from
    ? TRANSACTIONS_DATA.filter((t) => {
        // For demonstration purposes, since the mock data is old (2024),
        // we might want to bypass filtering if "all time" isn't selected,
        // OR we just let it filter correctly (which means it will show nothing for default "last 7 days").
        // To be helpful, I'll bypass filtering if the date range includes "today" and the data is very old,
        // BUT strictly speaking, I should filter.
        // Let's implement strict filtering. The user can select a custom range to see old data.
        if (!t.isoDate) return false;
        const transactionDate = new Date(t.isoDate);
        return isWithinInterval(transactionDate, {
          start: startOfDay(date.from!),
          end: endOfDay(date.to || date.from!),
        });
      })
    : TRANSACTIONS_DATA;

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export delay
    setTimeout(() => {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Transaction ID,Customer/Type,Service,Date,Status,Amount\n" +
        filteredTransactions
          .map(
            (t) =>
              `${t.id},"${t.customer} - ${t.type}",${t.service},${t.date},${t.status},"${t.amount}"`,
          )
          .join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      const rangeStr = date?.from
        ? `${format(date.from, "yyyy-MM-dd")}_to_${date.to ? format(date.to, "yyyy-MM-dd") : format(date.from, "yyyy-MM-dd")}`
        : "all_time";
      link.setAttribute("download", `earnings_report_${rangeStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Overview
        </h1>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 min-w-[240px] justify-start text-left font-normal"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="font-medium">Export Earnings Data</span>
                {date?.from && (
                  <>
                    <span className="mx-2 h-4 w-px bg-slate-300" />
                    <span className="text-slate-600 font-normal">
                      {date.to &&
                      differenceInDays(date.to, date.from) === 7 &&
                      isSameDay(date.to, new Date()) ? (
                        "Last 7 Days"
                      ) : date.to ? (
                        <>
                          {format(date.from, "LLL dd")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )}
                    </span>
                  </>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="flex gap-2 p-3 border-b border-slate-100">
                <div className="flex-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    From
                  </span>
                  <div className="text-xs font-semibold text-slate-800 border border-slate-200 rounded-md px-2 py-1.5 mt-1 bg-slate-50">
                    {date?.from
                      ? format(date.from, "MMM dd, yyyy")
                      : "Select date"}
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    To
                  </span>
                  <div className="text-xs font-semibold text-slate-800 border border-slate-200 rounded-md px-2 py-1.5 mt-1 bg-slate-50">
                    {date?.to ? format(date.to, "MMM dd, yyyy") : "-"}
                  </div>
                </div>
              </div>
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate as any}
                numberOfMonths={2}
              />
              <div className="p-3 border-t">
                <Button
                  className="w-full bg-[#00B074] hover:bg-[#00B074]/90"
                  onClick={handleExport}
                  disabled={!date?.from || isExporting}
                >
                  {isExporting ? "Exporting..." : "Export Data"}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <EarningsStats />

      <div className="grid gap-6 lg:grid-cols-2">
        <EarningsChart />
        <EarningsTrendChart />
      </div>

      <RecentTransactions
        transactions={filteredTransactions}
        dateRange={
          date?.from
            ? `${format(date.from, "MMM dd")} - ${date.to ? format(date.to, "MMM dd") : format(date.from, "MMM dd")}`
            : "All Time"
        }
      />
    </div>
  );
}
