"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

import { useState } from "react";
import { format } from "date-fns";
import type { Transaction } from "@/lib/vendor-data";

interface RecentTransactionsProps {
  transactions?: Transaction[];
  dateRange?: string;
}

export function RecentTransactions({
  transactions = [],
  dateRange = "All Time",
}: RecentTransactionsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export delay
    setTimeout(() => {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Transaction ID,Customer/Type,Service,Date,Status,Amount\n" +
        transactions
          .map(
            (t) =>
              `${t.id},"${t.customer} - ${t.type}",${t.service},${t.date},${t.status},"${t.amount}"`,
          )
          .join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `earnings_statement_${dateRange.replace(/\s+/g, "_").toLowerCase()}_${format(new Date(), "yyyy-MM-dd")}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Recent Transactions
          </h2>
          <p className="text-sm text-slate-500">
            Real-time update of your earnings and payouts
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 text-slate-600"
          onClick={handleExport}
          disabled={transactions.length === 0 || isExporting}
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Downloading..." : "Download Statement"}
        </Button>
      </div>

      <div className="overflow-x-auto sm:overflow-visible rounded-lg border sm:border-0 border-slate-100 p-0 sm:p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="font-semibold text-slate-600">
                Transaction ID
              </TableHead>
              <TableHead className="font-semibold text-slate-600">
                Customer / Type
              </TableHead>
              <TableHead className="font-semibold text-slate-600">
                Service
              </TableHead>
              <TableHead className="font-semibold text-slate-600">Date</TableHead>
              <TableHead className="font-semibold text-slate-600">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold text-slate-600">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500">
                  No transactions in this period.
                </TableCell>
              </TableRow>
            )}
            {transactions.map((txn) => (
              <TableRow key={txn.id} className="hover:bg-slate-50">
                <TableCell className="font-medium text-slate-900">
                  {txn.id}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col whitespace-nowrap">
                    <span className="font-medium text-slate-900">
                      {txn.customer}
                    </span>
                    <span className="text-xs text-slate-500">{txn.type}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 whitespace-nowrap">{txn.service}</TableCell>
                <TableCell className="text-slate-600 whitespace-nowrap">{txn.date}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      txn.status === "Completed" || txn.status === "Processed"
                        ? "bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                        : "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200"
                    }
                  >
                    {txn.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold text-slate-900">
                  {txn.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
