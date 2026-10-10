"use client";

import { useCallback, useEffect, useState } from "react";
import { loadVendorData, type VendorData, type VendorResource } from "./index";

type State<T> =
  | { status: "loading"; data: undefined; error: undefined }
  | { status: "ready"; data: T; error: undefined }
  | { status: "error"; data: undefined; error: string };

const LOADING = { status: "loading", data: undefined, error: undefined } as const;

/** Loads one dashboard resource (demo data or API) and tracks loading / error state. */
export function useVendorData<K extends VendorResource>(resource: K) {
  const [state, setState] = useState<State<VendorData<K>>>(LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadVendorData(resource)
      .then((data) => {
        if (!cancelled) setState({ status: "ready", data, error: undefined });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const error = err instanceof Error ? err.message : "Something went wrong";
        setState({ status: "error", data: undefined, error });
      });
    return () => {
      cancelled = true;
    };
  }, [resource, attempt]);

  const reload = useCallback(() => {
    setState(LOADING);
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, reload };
}
