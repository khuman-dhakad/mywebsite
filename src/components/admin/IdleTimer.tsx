"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const WARNING_BEFORE_MS = 60 * 1000; // 1 minute warning before logout

export function IdleTimer() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(60);

  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    const logoutUser = async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/admin/login?reason=idle_timeout");
    };

    const resetTimers = () => {
      setShowWarning(false);
      clearTimeout(idleTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);

      warningTimer = setTimeout(() => {
        setShowWarning(true);
        setSecondsRemaining(60);
        countdownInterval = setInterval(() => {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, IDLE_TIMEOUT_MS - WARNING_BEFORE_MS);

      idleTimer = setTimeout(() => {
        logoutUser();
      }, IDLE_TIMEOUT_MS);
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, resetTimers, { passive: true });
    });

    resetTimers();

    return () => {
      clearTimeout(idleTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimers);
      });
    };
  }, [router]);

  const handleStayLoggedIn = () => {
    window.dispatchEvent(new Event("mousedown"));
  };

  if (!showWarning) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-amber-500 text-stone-950 shadow-2xl flex items-center gap-3 border-2 border-stone-900 max-w-sm"
    >
      <AlertTriangle className="w-6 h-6 shrink-0" />
      <div className="flex-1">
        <p className="font-bold text-sm">Session Expiring Soon</p>
        <p className="text-xs">
          Logging out in {secondsRemaining}s due to inactivity.
        </p>
      </div>
      <button
        type="button"
        onClick={handleStayLoggedIn}
        className="px-3 py-1.5 rounded-lg bg-stone-950 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shrink-0 min-h-[36px]"
      >
        Stay Signed In
      </button>
    </div>
  );
}
