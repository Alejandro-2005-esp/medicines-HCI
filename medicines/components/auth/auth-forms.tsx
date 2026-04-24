"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, ArrowLeft, User, Mail } from "lucide-react";
import { useApp } from "@/lib/app-context";

interface AuthFormProps {
  mode: "login" | "register";
  onBack: () => void;
  onSuccess: () => void;
  onSwitchMode: () => void;
}

export function AuthForm({ mode, onBack, onSuccess, onSwitchMode }: AuthFormProps) {
  const { login } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Por favor, ingresa tu nombre";
    } else if (name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!email.trim()) {
      newErrors.email = "Por favor, ingresa tu correo electrónico";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Por favor, ingresa un correo válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate a brief loading state
    await new Promise((resolve) => setTimeout(resolve, 500));

    login({ name: name.trim(), email: email.trim() });
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full px-4 py-4 md:px-8 flex items-center gap-4 border-b border-border">
        <Button
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="gap-2"
          aria-label="Volver a la página principal"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          <span className="hidden sm:inline">Volver</span>
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold text-foreground">MediRecuerda</span>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl md:text-3xl font-bold">
              {mode === "login" ? "Bienvenido de vuelta" : "Crear cuenta"}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {mode === "login"
                ? "Ingresa tus datos para continuar"
                : "Regístrate para comenzar a usar MediRecuerda"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-base font-medium">
                  Nombre completo
                </Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ej: María García"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    className={`pl-10 h-14 text-lg ${errors.name ? "border-destructive" : ""}`}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    aria-invalid={!!errors.name}
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="text-destructive text-sm" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-base font-medium">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ej: maria@ejemplo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={`pl-10 h-14 text-lg ${errors.email ? "border-destructive" : ""}`}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    aria-invalid={!!errors.email}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-destructive text-sm" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="h-14 text-lg font-semibold mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Procesando..."
                  : mode === "login"
                  ? "Iniciar Sesión"
                  : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                <button
                  onClick={onSwitchMode}
                  className="text-primary font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                >
                  {mode === "login" ? "Regístrate" : "Inicia sesión"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
