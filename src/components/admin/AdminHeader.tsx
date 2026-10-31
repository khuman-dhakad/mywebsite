"use client";

import Link from "next/link";
import { ExternalLink, LogOut, ShieldCheck, Building } from "lucide-react";
import { logoutAdminAction } from "@/app/admin/actions";
import { siteConfig } from "@/config/site.config";

interface AdminHeaderProps {
  hotelName: string;
}

export function AdminHeader({ hotelName }: AdminHeaderProps) {
  return (
    <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-heritage-700 text-white flex items-center justify-center font-serif font-bold text-lg">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-base sm:text-lg text-slate-900 dark:text-stone-100 flex items-center gap-2">
              <span>{hotelName}</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Admin
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-stone-400">
              Control Panel &bull; Site ID: <code className="font-mono text-[11px]">{siteConfig.siteId}</code>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-slate-700 dark:text-stone-200 text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-heritage-600 min-h-[40px]"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-4 h-4" />
          </Link>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-700 dark:text-red-400 text-xs sm:text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[40px]"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
