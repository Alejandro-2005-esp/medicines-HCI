"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Heart } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export function HeroSection({ onGetStarted, onLogin }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-4 py-4 md:px-8 flex items-center justify-between bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold text-foreground">MediRecuerda</span>
        </div>
        <nav className="flex items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={onLogin}
            className="text-base font-medium"
          >
            Iniciar Sesión
          </Button>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="text-base font-medium hidden md:flex"
          >
            Registrarse
          </Button>
        </nav>
      </header>

      {/* Hero Content */}
      <div className="flex-1 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center px-4 md:px-8 lg:px-16 pt-24 pb-12">
        {/* Text Content */}
        <div className="flex flex-col gap-6 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full w-fit">
            <Heart className="w-4 h-4 text-accent" aria-hidden="true" />
            <span className="text-sm font-medium text-secondary-foreground">
              Cuida tu salud cada día
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
            Nunca olvides tomar tus medicamentos
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            MediRecuerda te ayuda a mantener tu rutina de medicamentos con recordatorios 
            inteligentes, alertas de voz y una interfaz diseñada para toda la familia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="text-lg px-8 py-6 font-semibold"
            >
              Comenzar Gratis
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={onLogin}
              className="text-lg px-8 py-6 font-semibold"
            >
              Ya tengo cuenta
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Alertas de Voz</p>
                <p className="text-sm text-muted-foreground">Recordatorios audibles</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-accent" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Horarios Flexibles</p>
                <p className="text-sm text-muted-foreground">Configura tus horas</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-success" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Fácil de Usar</p>
                <p className="text-sm text-muted-foreground">Diseño accesible</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/images/hero-medication.jpg"
            alt="Persona organizando sus medicamentos en un pastillero semanal"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}
