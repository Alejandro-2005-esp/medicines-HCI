"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Clock, Pill, Volume2, VolumeX } from "lucide-react";
import { useApp } from "@/lib/app-context";

export function ReminderModal() {
  const { pendingReminder, confirmMedication, snoozeReminder } = useApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const hasPlayedRef = useRef(false);

  // Build the list of medication names for voice
  const getMedicationNamesText = useCallback(() => {
    if (!pendingReminder?.medications.length) return "";
    const names = pendingReminder.medications.map((m) => m.name);
    if (names.length === 1) {
      return names[0];
    } else if (names.length === 2) {
      return `${names[0]} y ${names[1]}`;
    } else {
      const lastItem = names.pop();
      return `${names.join(", ")} y ${lastItem}`;
    }
  }, [pendingReminder?.medications]);

  const playVoiceReminder = useCallback(() => {
    if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const medicationNames = getMedicationNamesText();
    const message =
      pendingReminder?.medications.length === 1
        ? `Es hora de tomar tu medicamento: ${medicationNames}`
        : `Es hora de tomar tus medicamentos: ${medicationNames}`;

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isMuted, getMedicationNamesText, pendingReminder?.medications.length]);

  // Play voice reminder when modal opens
  useEffect(() => {
    if (pendingReminder && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      // Small delay to ensure modal is visible first
      const timer = setTimeout(() => {
        playVoiceReminder();
      }, 500);
      return () => clearTimeout(timer);
    }

    if (!pendingReminder) {
      hasPlayedRef.current = false;
    }
  }, [pendingReminder, playVoiceReminder]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleConfirm = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    confirmMedication();
  };

  const handleSnooze = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    snoozeReminder();
  };

  const toggleMute = () => {
    if (!isMuted && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsMuted(!isMuted);
  };

  const replayVoice = () => {
    playVoiceReminder();
  };

  if (!pendingReminder) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="reminder-title"
      aria-describedby="reminder-description"
    >
      <Card className="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
        <CardContent className="flex flex-col items-center py-8 px-6">
          {/* Animated Bell */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Bell className="w-12 h-12 text-primary animate-bounce" aria-hidden="true" />
            </div>
            {/* Sound indicator */}
            {isPlaying && (
              <div className="absolute -right-2 -top-2">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-accent-foreground" aria-hidden="true" />
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <h2 id="reminder-title" className="text-2xl md:text-3xl font-bold text-foreground text-center">
            {pendingReminder.medications.length === 1
              ? "Es hora de tu medicamento"
              : "Es hora de tus medicamentos"}
          </h2>

          {/* Medication Names */}
          <div className="flex flex-col gap-2 mt-4 w-full">
            {pendingReminder.medications.map((medication) => (
              <div
                key={medication.id}
                className="flex items-center gap-3 px-6 py-4 bg-secondary rounded-xl"
              >
                <Pill className="w-8 h-8 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="text-xl font-semibold text-foreground">
                  {medication.name}
                </span>
              </div>
            ))}
          </div>

          {/* Description */}
          <p id="reminder-description" className="text-muted-foreground mt-4 text-center">
            {pendingReminder.medications.length === 1
              ? "Recuerda tomar tu medicamento según las indicaciones de tu médico."
              : "Recuerda tomar tus medicamentos según las indicaciones de tu médico."}
          </p>

          {/* Snooze count indicator */}
          {pendingReminder.snoozeCount > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Recordatorio #{pendingReminder.snoozeCount + 1}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col w-full gap-3 mt-8">
            <Button
              size="lg"
              onClick={handleConfirm}
              className="h-16 text-xl font-semibold gap-3"
            >
              <Check className="w-6 h-6" aria-hidden="true" />
              Tomado
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleSnooze}
              className="h-16 text-xl font-semibold gap-3"
            >
              <Clock className="w-6 h-6" aria-hidden="true" />
              Recordar en 5 minutos
            </Button>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center gap-4 mt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="gap-2"
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Volume2 className="w-5 h-5" aria-hidden="true" />
              )}
              {isMuted ? "Activar sonido" : "Silenciar"}
            </Button>
            {!isMuted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={replayVoice}
                className="gap-2"
                aria-label="Repetir mensaje de voz"
              >
                <Bell className="w-5 h-5" aria-hidden="true" />
                Repetir
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
