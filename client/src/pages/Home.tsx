/*
 * VITL — Home (App Shell)
 * Design: Cyberpunk Terminal Fitness
 * Manages screen state and renders the mobile app shell with bottom nav
 */
import { useState, useEffect } from "react";
import { toast } from "sonner";
import OnboardingScreen from "@/components/screens/OnboardingScreen";
import DashboardScreen from "@/components/screens/DashboardScreen";
import ChatScreen from "@/components/screens/ChatScreen";
import WearableScreen from "@/components/screens/WearableScreen";
import NotificationsScreen from "@/components/screens/NotificationsScreen";
import ProgressScreen from "@/components/screens/ProgressScreen";
import PricingScreen from "@/components/screens/PricingScreen";
import BottomNav from "@/components/BottomNav";

export type Screen = "onboarding" | "dashboard" | "chat" | "wearable" | "notifications" | "progress" | "pricing";

export interface UserProfile {
  name: string;
  goal: number | null;
  activity: number | null;
  weight: number;
  avatar: string;
  streakCount: number;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const [showNav, setShowNav] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex",
    goal: null,
    activity: null,
    weight: 76,
    avatar: "💪",
    streakCount: 14,
  });

  // Handle Stripe Checkout return URL params: ?subscription=success|canceled&plan=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sub = params.get("subscription");
    const plan = params.get("plan");

    if (sub === "success") {
      // Show success banner and navigate to pricing to show active plan
      toast.success(
        plan
          ? `🎉 Welcome to VITL ${plan.charAt(0).toUpperCase() + plan.slice(1)}! Your subscription is now active.`
          : "🎉 Subscription activated! Welcome to VITL.",
        { duration: 6000 }
      );
      // Clean the URL without reload
      window.history.replaceState({}, "", window.location.pathname);
      // Navigate to pricing screen to show the active plan badge
      setScreen("pricing");
      setShowNav(true);
    } else if (sub === "canceled") {
      toast.info("Checkout was canceled. You can subscribe anytime from the Plans screen.", { duration: 5000 });
      window.history.replaceState({}, "", window.location.pathname);
      setScreen("pricing");
      setShowNav(true);
    }
  }, []);

  function handleOnboardingComplete(data: Partial<UserProfile>) {
    setProfile(prev => ({ ...prev, ...data, streakCount: 1 }));
    setScreen("dashboard");
    setShowNav(true);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        maxWidth: 430,
        margin: "0 auto",
        background: "var(--vitl-bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Screens */}
      {screen === "onboarding" && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
      {screen === "dashboard" && (
        <DashboardScreen profile={profile} onNavigate={setScreen} />
      )}
      {screen === "chat" && (
        <ChatScreen profile={profile} onNavigate={setScreen} />
      )}
      {screen === "wearable" && (
        <WearableScreen />
      )}
      {screen === "notifications" && (
        <NotificationsScreen onNavigate={setScreen} />
      )}
      {screen === "progress" && (
        <ProgressScreen />
      )}
      {screen === "pricing" && (
        <PricingScreen onNavigate={setScreen} />
      )}

      {/* Bottom Nav */}
      {showNav && (
        <BottomNav current={screen} onNavigate={setScreen} />
      )}
    </div>
  );
}
