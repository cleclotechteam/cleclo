import VendorHeader from "@/components/vendor/VendorHeader";
import VendorFooter from "@/components/vendor/VendorFooter";
import { SiteChrome } from "@/components/auth/site-chrome";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="auth-page flex flex-col min-h-screen bg-[var(--steam)] font-sans antialiased text-[var(--ink)]">
      <SiteChrome>
        <VendorHeader />
      </SiteChrome>
      <main className="flex-1 flex flex-col items-center justify-center py-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle decorative background blur circles matching Cleclo landing pages */}
        <div 
          className="absolute top-1/4 -left-20 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl" 
          style={{ background: "var(--brand-light)" }} 
        />
        <div 
          className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full pointer-events-none opacity-15 blur-3xl" 
          style={{ background: "var(--brass)" }} 
        />
        
        <LoginForm />
      </main>
      <SiteChrome>
        <VendorFooter />
      </SiteChrome>
    </div>
  );
}

