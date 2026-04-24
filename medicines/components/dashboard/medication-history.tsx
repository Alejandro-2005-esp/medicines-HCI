"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Check, Clock, AlertCircle } from "lucide-react";
import { useApp, MedicationHistoryEntry } from "@/lib/app-context";

const STATUS_CONFIG = {
  taken: {
    label: "Tomado",
    icon: Check,
    bgClass: "bg-success/10",
    textClass: "text-success",
    borderClass: "border-success/30",
  },
  snoozed: {
    label: "Pospuesto",
    icon: Clock,
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-600",
    borderClass: "border-amber-500/30",
  },
  missed: {
    label: "No tomado",
    icon: AlertCircle,
    bgClass: "bg-destructive/10",
    textClass: "text-destructive",
    borderClass: "border-destructive/30",
  },
};

function HistoryEntry({ entry }: { entry: MedicationHistoryEntry }) {
  const config = STATUS_CONFIG[entry.status];
  const Icon = config.icon;

  const formattedDate = new Date(entry.actionTime).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const formattedTime = new Date(entry.actionTime).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const medicationText =
    entry.medicationNames.length === 1
      ? entry.medicationNames[0]
      : entry.medicationNames.length === 2
        ? `${entry.medicationNames[0]} y ${entry.medicationNames[1]}`
        : `${entry.medicationNames.slice(0, -1).join(", ")} y ${entry.medicationNames[entry.medicationNames.length - 1]}`;

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border ${config.borderClass} ${config.bgClass}`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bgClass}`}
      >
        <Icon className={`w-5 h-5 ${config.textClass}`} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate">{medicationText}</p>
        <p className="text-sm text-muted-foreground">
          {formattedDate} a las {formattedTime}
        </p>
      </div>
      <div
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgClass} ${config.textClass}`}
      >
        {config.label}
      </div>
    </div>
  );
}

export function MedicationHistory() {
  const { history } = useApp();

  const takenCount = history.filter((h) => h.status === "taken").length;
  const snoozedCount = history.filter((h) => h.status === "snoozed").length;

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <History className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          Historial de Medicamentos
        </CardTitle>
        {history.length > 0 && (
          <div className="flex gap-4 mt-2">
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-success">{takenCount}</span> tomados
            </span>
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-amber-600">{snoozedCount}</span> pospuestos
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <History className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Sin historial</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">
              Cuando confirmes o pospongas un recordatorio, aparecera aqui.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
            {history.map((entry) => (
              <HistoryEntry key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
