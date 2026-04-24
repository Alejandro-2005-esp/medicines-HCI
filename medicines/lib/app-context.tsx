"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

export interface Medication {
  id: string;
  name: string;
  time: string;
  days: string[];
  createdAt: Date;
}

export interface MedicationHistoryEntry {
  id: string;
  medicationNames: string[];
  scheduledTime: string;
  actionTime: Date;
  status: "taken" | "snoozed" | "missed";
}

export interface User {
  name: string;
  email: string;
}

interface PendingReminder {
  medications: Medication[];
  triggeredAt: Date;
  snoozeCount: number;
}

interface AppContextType {
  user: User | null;
  medications: Medication[];
  pendingReminder: PendingReminder | null;
  history: MedicationHistoryEntry[];
  login: (user: User) => void;
  logout: () => void;
  addMedication: (medication: Omit<Medication, "id" | "createdAt">) => void;
  updateMedication: (id: string, data: Omit<Medication, "id" | "createdAt">) => void;
  removeMedication: (id: string) => void;
  triggerReminder: (medications: Medication[]) => void;
  confirmMedication: () => void;
  snoozeReminder: () => void;
  dismissReminder: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [pendingReminder, setPendingReminder] = useState<PendingReminder | null>(null);
  const [history, setHistory] = useState<MedicationHistoryEntry[]>([]);
  const [snoozedReminders, setSnoozedReminders] = useState<{ medications: Medication[]; snoozeTime: Date }[]>([]);

  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setMedications([]);
    setPendingReminder(null);
    setHistory([]);
  }, []);

  const addMedication = useCallback((medicationData: Omit<Medication, "id" | "createdAt">) => {
    const newMedication: Medication = {
      ...medicationData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setMedications((prev) => [...prev, newMedication]);
  }, []);

  const updateMedication = useCallback((id: string, data: Omit<Medication, "id" | "createdAt">) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, ...data } : med
      )
    );
  }, []);

  const removeMedication = useCallback((id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
  }, []);

  const triggerReminder = useCallback((meds: Medication[]) => {
    setPendingReminder({
      medications: meds,
      triggeredAt: new Date(),
      snoozeCount: 0,
    });
  }, []);

  const confirmMedication = useCallback(() => {
    if (pendingReminder) {
      const entry: MedicationHistoryEntry = {
        id: crypto.randomUUID(),
        medicationNames: pendingReminder.medications.map((m) => m.name),
        scheduledTime: pendingReminder.medications[0]?.time || "",
        actionTime: new Date(),
        status: "taken",
      };
      setHistory((prev) => [entry, ...prev]);
    }
    setPendingReminder(null);
  }, [pendingReminder]);

  const snoozeReminder = useCallback(() => {
    if (pendingReminder) {
      const entry: MedicationHistoryEntry = {
        id: crypto.randomUUID(),
        medicationNames: pendingReminder.medications.map((m) => m.name),
        scheduledTime: pendingReminder.medications[0]?.time || "",
        actionTime: new Date(),
        status: "snoozed",
      };
      setHistory((prev) => [entry, ...prev]);
      // Add to snoozed queue to re-trigger in 5 minutes
      setSnoozedReminders((prev) => [
        ...prev,
        { medications: pendingReminder.medications, snoozeTime: new Date() },
      ]);
      setPendingReminder(null); // Close the modal immediately
    }
  }, [pendingReminder]);

  const dismissReminder = useCallback(() => {
    setPendingReminder(null);
  }, []);

  // Check for medication reminders every minute
  useEffect(() => {
    if (!user || medications.length === 0) return;

    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const currentDay = now.toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();

      // Collect ALL medications that match the current time and day
      const matchingMedications = medications.filter(
        (medication) =>
          medication.time === currentTime &&
          medication.days.some((day) => day.toLowerCase() === currentDay)
      );

      if (matchingMedications.length > 0) {
        // Check if we already have a pending reminder for these same medications
        const pendingIds = pendingReminder?.medications.map((m) => m.id) || [];
        const newIds = matchingMedications.map((m) => m.id);
        const isSameSet =
          pendingIds.length === newIds.length &&
          pendingIds.every((id) => newIds.includes(id));

        if (!pendingReminder || !isSameSet) {
          triggerReminder(matchingMedications);
        }
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000);

    return () => clearInterval(interval);
  }, [user, medications, pendingReminder, triggerReminder]);

  // Handle snooze timer (5 minutes)
  useEffect(() => {
    if (snoozedReminders.length === 0) return;

    const timers = snoozedReminders.map((snoozed, index) => {
      const elapsed = Date.now() - snoozed.snoozeTime.getTime();
      const remaining = Math.max(0, 5 * 60 * 1000 - elapsed);

      return setTimeout(() => {
        // Re-trigger the reminder after 5 minutes
        if (!pendingReminder) {
          triggerReminder(snoozed.medications);
        }
        // Remove from snoozed queue
        setSnoozedReminders((prev) => prev.filter((_, i) => i !== index));
      }, remaining);
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [snoozedReminders, pendingReminder, triggerReminder]);

  return (
    <AppContext.Provider
      value={{
        user,
        medications,
        pendingReminder,
        history,
        login,
        logout,
        addMedication,
        updateMedication,
        removeMedication,
        triggerReminder,
        confirmMedication,
        snoozeReminder,
        dismissReminder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
