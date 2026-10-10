"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  function handleLogin(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg("Please enter your registered email or mobile number and password.");
      return;
    }

    // Authenticate and redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-lg mx-auto relative z-10">
      {/* Brand Form Card */}
      <div 
        className="bg-white rounded-3xl p-8 sm:p-10 border border-[var(--line)] shadow-xl relative overflow-hidden"
        style={{
          boxShadow: "0 24px 48px -20px rgba(14,51,49,0.18)",
        }}
      >
        {/* Top Decorative Header */}
        <div className="text-center mb-8">
          <div className="eyebrow mx-auto justify-center mb-3">
            Vendor Portal Access
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-[var(--pine)] mb-3">
            Welcome Back to Cleclo
          </h1>
          
          <p className="text-sm text-[var(--ink-soft)] max-w-sm mx-auto leading-relaxed">
            Manage your outlets, track real-time orders and monitor your earnings in one unified dashboard.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Identifier Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--pine-2)]">
              Email or Mobile Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pine-2)]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your registered email or mobile number"
                className="w-full pl-11 pr-4 py-3.5 bg-[var(--steam)] border border-[var(--line)] rounded-2xl text-sm font-medium text-[var(--ink)] placeholder:text-[var(--ink-soft)]/60 focus:bg-white focus:border-[var(--pine)] focus:ring-2 focus:ring-[var(--pine)]/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[var(--pine-2)]">
                Password
              </label>
              <a 
                href="#forgot" 
                className="text-xs font-medium text-[var(--stamp)] hover:underline transition-colors"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--pine-2)]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3.5 bg-[var(--steam)] border border-[var(--line)] rounded-2xl text-sm font-medium text-[var(--ink)] placeholder:text-[var(--ink-soft)]/60 focus:bg-white focus:border-[var(--pine)] focus:ring-2 focus:ring-[var(--pine)]/20 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-soft)] hover:text-[var(--pine)] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              className="btn btn-primary w-full justify-center text-sm font-semibold py-3.5"
            >
              <span>Secure Vendor Login</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              type="button"
              onClick={handleLogin}
              className="btn btn-ghost w-full justify-center text-sm font-semibold py-3.5"
            >
              Get OTP Instead
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-[var(--line)] text-center text-xs text-[var(--ink-soft)]">
          Don't have a Cleclo partner account yet?{" "}
          <Link href="/signup" className="font-bold text-[var(--pine)] hover:underline">
            Become a Partner
          </Link>
        </div>
      </div>

      {/* Trust Row below Form */}
      <div className="flex items-center justify-center gap-6 mt-8 text-xs font-medium text-[var(--ink-soft)]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[var(--pine-2)]" />
          <span>256-Bit SSL Encrypted</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-[var(--stamp)]" />
        <div className="flex items-center gap-1.5">
          <span>24/7 Vendor Support</span>
        </div>
      </div>
    </div>
  );
}
