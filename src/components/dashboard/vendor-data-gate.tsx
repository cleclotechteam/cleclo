"use client";

import type { ReactNode } from "react";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VendorData, VendorResource } from "@/lib/vendor-data";
import { useVendorData } from "@/lib/vendor-data/use-vendor-data";

interface VendorDataGateProps<K extends VendorResource> {
  resource: K;
  children: (data: VendorData<K>) => ReactNode;
}

/**
 * Loads a dashboard resource and renders `children` once it is available.
 * Shows a loading state while fetching and a retry card if the request fails.
 */
export function VendorDataGate<K extends VendorResource>({
  resource,
  children,
}: VendorDataGateProps<K>) {
  const { status, data, error, reload } = useVendorData(resource);

  if (status === "loading") {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-3xl border border-[var(--kraft-line)] bg-white/80 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--stamp)]" />
        <p className="text-sm font-medium">Loading…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-3xl border border-red-100 bg-white px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">We couldn&apos;t load this data</h2>
        <p className="max-w-sm text-sm text-slate-500">
          The server didn&apos;t respond as expected. Check your connection and try again.
        </p>
        <p className="text-xs text-slate-400">{error}</p>
        <Button onClick={reload} className="mt-1 gap-2 rounded-xl">
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  return <>{children(data)}</>;
}
