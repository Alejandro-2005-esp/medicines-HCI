"use client";

import { useState } from "react";
import { AppProvider, useApp } from "@/lib/app-context";
import { HeroSection } from "@/components/landing/hero.section";
import { AuthForm } from "@/components/auth/auth-forms";
import { Dashboard } from "@/components/dashboard/dashboard";
import { ReminderModal } from "@/components/notifications/reminder-modal";
import { SuccessToast } from "@/components/notifications/success-toast";

type Screen = "landing" | "login" | "register" | "dashboard";

function AppContent() {
  const { user } = useApp();
  const [currentScreen, setCurrentScreen] = useState<Screen>(user ? "dashboard" : "landing");

  // If user is logged in but not on dashboard, redirect
  if (user && currentScreen !== "dashboard") {
    setCurrentScreen("dashboard");
  }

  const handleGetStarted = () => setCurrentScreen("register");
  const handleLogin = () => setCurrentScreen("login");
  const handleBack = () => setCurrentScreen("landing");
  const handleAuthSuccess = () => setCurrentScreen("dashboard");
  const handleLogout = () => setCurrentScreen("landing");
  const handleSwitchToLogin = () => setCurrentScreen("login");
  const handleSwitchToRegister = () => setCurrentScreen("register");

  return (
    <>
      {currentScreen === "landing" && (
        <HeroSection onGetStarted={handleGetStarted} onLogin={handleLogin} />
      )}

      {currentScreen === "login" && (
        <AuthForm
          mode="login"
          onBack={handleBack}
          onSuccess={handleAuthSuccess}
          onSwitchMode={handleSwitchToRegister}
        />
      )}

      {currentScreen === "register" && (
        <AuthForm
          mode="register"
          onBack={handleBack}
          onSuccess={handleAuthSuccess}
          onSwitchMode={handleSwitchToLogin}
        />
      )}

      {currentScreen === "dashboard" && <Dashboard onLogout={handleLogout} />}

      {/* Global Reminder Modal */}
      <ReminderModal />
      <SuccessToast />
    </>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
