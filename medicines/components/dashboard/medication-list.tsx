"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, Trash2, Pill, Pencil } from "lucide-react";
import { useApp, Medication } from "@/lib/app-context";

const DAY_LABELS: Record<string, string> = {
  lunes: "Lun",
  martes: "Mar",
  miércoles: "Mié",
  jueves: "Jue",
  viernes: "Vie",
  sábado: "Sáb",
  domingo: "Dom",
};

interface MedicationCardProps {
  medication: Medication;
  onEdit: (medication: Medication) => void;
}

function MedicationCard({ medication, onEdit }: MedicationCardProps) {
  const { removeMedication } = useApp();

  const formattedTime = new Date(`2000-01-01T${medication.time}`).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Pill className="w-6 h-6 text-primary" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground truncate">{medication.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm">{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm">
                {medication.days.map((d) => DAY_LABELS[d] || d).join(", ")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(medication)}
            aria-label={`Editar ${medication.name}`}
            className="h-10 w-10"
          >
            <Pencil className="w-4 h-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => removeMedication(medication.id)}
            aria-label={`Eliminar ${medication.name}`}
            className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MedicationListProps {
  onEditMedication: (medication: Medication) => void;
}

export function MedicationList({ onEditMedication }: MedicationListProps) {
  const { medications } = useApp();

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent" aria-hidden="true" />
          </div>
          Mis Recordatorios
          {medications.length > 0 && (
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {medications.length} {medications.length === 1 ? "medicamento" : "medicamentos"}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {medications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Pill className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Sin medicamentos</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">
              Agrega tu primer medicamento usando el formulario de arriba para comenzar a recibir
              recordatorios.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {medications.map((medication) => (
              <MedicationCard key={medication.id} medication={medication} onEdit={onEditMedication} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
