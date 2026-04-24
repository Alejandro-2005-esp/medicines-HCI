"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User } from "lucide-react";
import { useApp, Medication } from "@/lib/app-context";
import { MedicationForm } from "./medication-form";
import { MedicationList } from "./medication-list";
import { MedicationHistory } from "./medication-history";

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const { user, logout } = useApp();
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full px-4 py-4 md:px-8 flex items-center justify-between border-b border-border bg-card sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold text-foreground hidden sm:block">MediRecuerda</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" aria-hidden="true" />
            </div>
            <span className="font-medium text-foreground hidden sm:block">{user.name}</span>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={handleLogout}
            className="gap-2"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Hola, {user.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra tus recordatorios de medicamentos
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <MedicationForm
            editingMedication={editingMedication}
            onCancelEdit={() => setEditingMedication(null)}
          />
          <MedicationList onEditMedication={setEditingMedication} />
          <MedicationHistory />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 py-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          MediRecuerda - Cuidando tu salud cada día
        </p>
      </footer>
    </div>
  );
}
