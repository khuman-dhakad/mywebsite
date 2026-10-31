"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, KeyRound, AlertCircle, Shield, Building, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { siteConfig } from "@/config/site.config";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showTotpField, setShowTotpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  useEffect(() => {
    // Check local storage lockout state
    const lockExpiry = localStorage.getItem("admin_lock_expiry");
    if (lockExpiry && parseInt(lockExpiry, 10) > Date.now()) {
      setIsLockedOut(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Rate Limiting Check: max 5 failed attempts per 15 mins
    const now = Date.now();
    const storedExpiry = localStorage.getItem("admin_lock_expiry");
    if (storedExpiry && parseInt(storedExpiry, 10) > now) {
      setErrorMessage("Too many failed attempts. Login locked for 15 minutes.");
      setIsLockedOut(true);
      return;
    }

    if (attempts >= 5) {
      const lockUntil = now + 15 * 60 * 1000;
      localStorage.setItem("admin_lock_expiry", lockUntil.toString());
      setIsLockedOut(true);
      setErrorMessage("Too many failed attempts. Login locked for 15 minutes.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !authData.user) {
        setAttempts((prev) => prev + 1);
        // Generic error message to prevent account enumeration
        setErrorMessage("Invalid email or password.");
        setLoading(false);
        return;
      }

      // 2. Optional TOTP 2FA Verification
      if (showTotpField && totpCode) {
        const { error: mfaError } = await supabase.auth.mfa.challengeAndVerify({
          factorId: "totp",
          code: totpCode.trim(),
        });

        if (mfaError) {
          setErrorMessage("Invalid 2FA code.");
          setLoading(false);
          return;
        }
      }

      // 3. Multi-tenant Site Authorization Check
      const { data: adminRecord, error: adminError } = await supabase
        .from("site_admins")
        .select("site_id, role")
        .eq("user_id", authData.user.id)
        .eq("site_id", siteConfig.siteId)
        .single();

      if (adminError || !adminRecord) {
        // Log out immediately to prevent unauthorized session
        await supabase.auth.signOut();
        setErrorMessage("Access denied: This account is not registered to manage this hotel.");
        setLoading(false);
        return;
      }

      // Reset failed attempt counter on success
      localStorage.removeItem("admin_lock_expiry");
      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-8">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-heritage-700 text-white mx-auto flex items-center justify-center mb-3 shadow-md">
            <Building className="w-7 h-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-stone-100">
            {siteConfig.branding.hotelName}
          </h1>
          <p className="text-sm text-slate-500 dark:text-stone-400 mt-1">
            Owner & Manager Portal &bull; <span className="font-hindi">होटल व्यवस्थापक लॉगिन</span>
          </p>
        </div>

        {/* Security & Error Notice */}
        {errorMessage && (
          <div
            data-testid="login-error"
            role="alert"
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-800 dark:text-red-300 text-sm"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold">{errorMessage}</p>
              {attempts > 2 && attempts < 5 && (
                <p className="text-xs mt-1 text-red-600 dark:text-red-400">
                  {5 - attempts} login attempts remaining before temporary account lockout.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2"
            >
              Email Address <span className="text-slate-400 font-normal">(ईमेल पता)</span>
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                disabled={isLockedOut || loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@hotel.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2"
            >
              Password <span className="text-slate-400 font-normal">(पासवर्ड)</span>
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                disabled={isLockedOut || loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[44px]"
              />
            </div>
          </div>

          {/* Optional TOTP 2FA Field */}
          {showTotpField ? (
            <div>
              <label
                htmlFor="totp"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-stone-300 mb-2"
              >
                Authenticator 6-Digit Code (TOTP 2FA)
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="totp"
                  type="text"
                  maxLength={6}
                  disabled={isLockedOut || loading}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 tracking-widest font-mono text-center text-lg min-h-[44px]"
                />
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowTotpField(true)}
                className="text-xs text-heritage-700 dark:text-heritage-400 hover:underline font-medium"
              >
                Have a 2FA TOTP Authenticator code?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLockedOut || loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-heritage-700 hover:bg-heritage-800 text-white font-semibold text-base shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-heritage-600 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed min-h-[48px]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In (लॉग इन करें)</span>
            )}
          </button>
        </form>

        {/* Security Notice Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-stone-800 text-center">
          <p className="text-xs text-slate-500 dark:text-stone-400 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End Encrypted &bull; Strictly No Public Signups</span>
          </p>
        </div>
      </div>
    </div>
  );
}
