"use client";

import { SettingsPage } from "@/components/dashboard/settings/settings-page";
import { VendorDataGate } from "@/components/dashboard/vendor-data-gate";

export default function Settings() {
  return (
    <VendorDataGate resource="settings">
      {(settings) => <SettingsPage initial={settings} />}
    </VendorDataGate>
  );
}
