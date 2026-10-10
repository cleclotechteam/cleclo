import type { ReactNode } from "react";

/**
 * Wraps marketing-site chrome (VendorHeader / VendorFooter) so the vendor
 * app's global styles don't restyle it. See `.site-chrome` in globals.css.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return <div className="site-chrome">{children}</div>;
}
