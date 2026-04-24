"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pill, Save, X } from "lucide-react";
import { useApp, Medication } from "@/lib/app-context";
import { useEffect } from "react";

const DAYS_OF_WEEK = [
  { id: "lunes", label: "Lun" },
  { id: "martes", label: "Mar" },
  { id: "miércoles", label: "Mié" },
  { id: "jueves", label: "Jue" },
  { id: "viernes", label: "Vie" },
  { id: "sábado", label: "Sáb" },
  { id: "domingo", label: "Dom" },
];

interface MedicationFormProps {
  onSuccess?: () => void;
  editingMedication?: Medication | null;
  onCancelEdit?: () => void;
}

export function MedicationForm({ onSuccess, editingMedication, onCancelEdit }: MedicationFormProps) {
  const { addMedication, updateMedication } = useApp();
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name?: string; time?: string; days?: string }>({});

  const isEditing = !!editingMedication;

  // Populate form when editing
  useEffect(() => {
    if (editingMedication) {
      setName(editingMedication.name);
      setTime(editingMedication.time);
      setSelectedDays(editingMedication.days);
      setErrors({});
    }
  }, [editingMedication]);

  const resetForm = () => {
    setName("");
    setTime("");
    setSelectedDays([]);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { name?: string; time?: string; days?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Ingresa el nombre del medicamento";
    }

    if (!time) {
      newErrors.time = "Selecciona la hora del recordatorio";
    }

    if (selectedDays.length === 0) {
      newErrors.days = "Selecciona al menos un día";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
    if (errors.days) setErrors((prev) => ({ ...prev, days: undefined }));
  };

  const handleSelectAllDays = () => {
    if (selectedDays.length === DAYS_OF_WEEK.length) {
      setSelectedDays([]);
    } else {
      setSelectedDays(DAYS_OF_WEEK.map((d) => d.id));
    }
    if (errors.days) setErrors((prev) => ({ ...prev, days: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isEditing && editingMedication) {
      updateMedication(editingMedication.id, {
        name: name.trim(),
        time,
        days: selectedDays,
      });
    } else {
      addMedication({
        name: name.trim(),
        time,
        days: selectedDays,
      });
    }

    resetForm();
    onCancelEdit?.();
    onSuccess?.();
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit?.();
  };

  return (
    <Card className={`shadow-lg ${isEditing ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {isEditing ? (
              <Save className="w-5 h-5 text-primary" aria-hidden="true" />
            ) : (
              <Plus className="w-5 h-5 text-primary" aria-hidden="true" />
            )}
          </div>
          {isEditing ? "Editar Medicamento" : "Agregar Medicamento"}
          {isEditing && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={handleCancel}
              aria-label="Cancelar edicion"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Medication Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="medication-name" className="text-base font-medium">
              Nombre del medicamento
            </Label>
            <div className="relative">
              <Pill
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="medication-name"
                type="text"
                placeholder="Ej: Aspirina, Omeprazol..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={`pl-10 h-14 text-lg ${errors.name ? "border-destructive" : ""}`}
                aria-describedby={errors.name ? "name-error" : undefined}
                aria-invalid={!!errors.name}
              />
            </div>
            {errors.name && (
              <p id="name-error" className="text-destructive text-sm" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Time */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="medication-time" className="text-base font-medium">
              Hora del recordatorio
            </Label>
            <Input
              id="medication-time"
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                if (errors.time) setErrors((prev) => ({ ...prev, time: undefined }));
              }}
              className={`h-14 text-lg ${errors.time ? "border-destructive" : ""}`}
              aria-describedby={errors.time ? "time-error" : undefined}
              aria-invalid={!!errors.time}
            />
            {errors.time && (
              <p id="time-error" className="text-destructive text-sm" role="alert">
                {errors.time}
              </p>
            )}
          </div>

          {/* Days of Week */}
          <fieldset className="flex flex-col gap-3">
            <legend className="text-base font-medium text-foreground mb-1">
              Días de repetición
            </legend>
            <div className="flex items-center gap-2 mb-2">
              <Checkbox
                id="select-all"
                checked={selectedDays.length === DAYS_OF_WEEK.length}
                onCheckedChange={handleSelectAllDays}
              />
              <Label htmlFor="select-all" className="text-sm cursor-pointer">
                Todos los días
              </Label>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => handleDayToggle(day.id)}
                  className={`
                    h-12 rounded-lg font-medium text-sm transition-all
                    focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                    ${
                      selectedDays.includes(day.id)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }
                  `}
                  aria-pressed={selectedDays.includes(day.id)}
                >
                  {day.label}
                </button>
              ))}
            </div>
            {errors.days && (
              <p className="text-destructive text-sm" role="alert">
                {errors.days}
              </p>
            )}
          </fieldset>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button type="submit" size="lg" className="h-14 text-lg font-semibold flex-1">
              {isEditing ? (
                <>
                  <Save className="w-5 h-5 mr-2" aria-hidden="true" />
                  Guardar Cambios
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" aria-hidden="true" />
                  Agregar Recordatorio
                </>
              )}
            </Button>
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-14 text-lg font-semibold"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
