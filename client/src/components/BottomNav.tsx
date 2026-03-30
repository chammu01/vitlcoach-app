/*
 * VITL — BottomNav
 * Design: Cyberpunk Terminal Fitness — fixed bottom navigation bar
 */
import { Screen } from "@/pages/Home";

const NAV_ITEMS: { screen: Screen; icon: string; label: string }[] = [
  { screen: "dashboard", icon: "🏠", label: "Home" },
  { screen: "chat", icon: "🤖", label: "Coach" },
  { screen: "wearable", icon: "⌚", label: "Sync" },
  { screen: "notifications", icon: "🔔", label: "Alerts" },
  { screen: "progress", icon: "📈", label: "Progress" },
];

interface Props {
  current: Screen;
  onNavigate: (s: Screen) => void;
}

export default function BottomNav({ current, onNavigate }: Props) {
  return (
    <nav
      style={{
        height: 64,
        flexShrink: 0,
        background: "var(--vitl-surface)",
        borderTop: "1px solid var(--vitl-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 8px",
        position: "relative",
        zIndex: 100,
      }}
    >
      {NAV_ITEMS.map(({ screen, icon, label }) => {
        const active = current === screen;
        return (
          <button
            key={screen}
            onClick={() => onNavigate(screen)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "8px 16px",
              borderRadius: 12,
              cursor: "pointer",
              border: "none",
              background: "transparent",
              fontFamily: "'DM Mono', monospace",
              color: active ? "var(--vitl-accent)" : "var(--vitl-muted)",
              transition: "color 0.2s",
            }}
          >
            <span
              style={{
                fontSize: 20,
                transition: "transform 0.2s",
                transform: active ? "scale(1.15)" : "scale(1)",
                display: "block",
              }}
            >
              {icon}
            </span>
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
