"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useApp } from "@/lib/app-context";

export function SuccessToast() {
  const { history } = useApp();
  const [showToast, setShowToast] = useState(false);
  const [lastHistoryLength, setLastHistoryLength] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if a new "taken" entry was added
    if (history.length > lastHistoryLength) {
      const latestEntry = history[0];
      if (latestEntry && latestEntry.status === "taken") {
        const medNames = latestEntry.medicationNames;
        const medText =
          medNames.length === 1
            ? medNames[0]
            : medNames.length === 2
              ? `${medNames[0]} y ${medNames[1]}`
              : `${medNames.slice(0, -1).join(", ")} y ${medNames[medNames.length - 1]}`;

        setMessage(`Has tomado ${medText}`);
        setShowToast(true);

        const timer = setTimeout(() => {
          setShowToast(false);
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
    setLastHistoryLength(history.length);
  }, [history, lastHistoryLength]);

  if (!showToast) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 px-6 py-4 bg-success text-success-foreground rounded-xl shadow-lg">
        <div className="w-8 h-8 rounded-full bg-success-foreground/20 flex items-center justify-center">
          <Check className="w-5 h-5" aria-hidden="true" />
        </div>
        <span className="font-medium text-lg">{message}</span>
      </div>
    </div>
  );
}
