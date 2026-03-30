/*
 * VITL — WearableScreen
 * Design: Cyberpunk Terminal Fitness
 * Device sync, live data feed, data permissions
 */
import { useState } from "react";

interface Device {
  logo: string;
  name: string;
  sub: string;
  connected: boolean;
}

const INITIAL_DEVICES: Device[] = [
  { logo: "⌚", name: "Apple Watch Series 9", sub: "HR · HRV · Sleep · Activity · ECG", connected: true },
  { logo: "🛏️", name: "Oura Ring Gen 3", sub: "Sleep stages · Readiness · HRV", connected: true },
  { logo: "💚", name: "Whoop 4.0", sub: "Strain · Recovery · Sleep coach", connected: false },
  { logo: "🏃", name: "Garmin Forerunner 965", sub: "GPS · VO2 Max · Training Load", connected: false },
];

const FEED = [
  { dot: "live", label: "Heart Rate", val: "72 bpm", time: "live" },
  { dot: "synced", label: "HRV (last night)", val: "54 ms", time: "6h ago" },
  { dot: "synced", label: "Sleep Score", val: "74 / 100", time: "6h ago" },
  { dot: "synced", label: "Readiness Score", val: "82 / 100", time: "6h ago" },
  { dot: "live", label: "Active Calories", val: "640 kcal", time: "live" },
  { dot: "pending", label: "Blood Oxygen", val: "98%", time: "12 min ago" },
];

const DOT_COLORS: Record<string, string> = {
  live: "var(--vitl-accent)",
  synced: "var(--vitl-accent2)",
  pending: "var(--vitl-muted)",
};

const PERMS = [
  { icon: "❤️", label: "Heart Rate & HRV", on: true },
  { icon: "😴", label: "Sleep Data", on: true },
  { icon: "👟", label: "Activity & Steps", on: true },
  { icon: "🌡️", label: "Body Temperature", on: true },
  { icon: "🩸", label: "Blood Oxygen", on: false },
];

export default function WearableScreen() {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [perms, setPerms] = useState(PERMS);

  function toggleDevice(i: number) {
    setDevices(prev => prev.map((d, idx) => idx === i ? { ...d, connected: !d.connected } : d));
  }

  function togglePerm(i: number) {
    setPerms(prev => prev.map((p, idx) => idx === i ? { ...p, on: !p.on } : p));
  }

  return (
    <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 4 }}>Health Data</div>
        <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em" }}>Device Sync</div>
      </div>

      <div className="scrollable" style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, rgba(200,255,87,0.06), rgba(87,255,204,0.04))",
          border: "1px solid rgba(200,255,87,0.12)", borderRadius: 16, padding: 24, textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⌚</div>
          <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Live Health Sync</div>
          <div style={{ fontSize: 12, color: "var(--vitl-muted)", lineHeight: 1.7 }}>
            Your AI coach reads real-time data from your wearables to personalize every workout, meal plan, and recovery recommendation.
          </div>
        </div>

        {/* Devices */}
        <div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 12 }}>Connected Devices</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {devices.map((d, i) => (
              <div
                key={i}
                onClick={() => toggleDevice(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 16px",
                  background: d.connected ? "rgba(87,255,204,0.04)" : "var(--vitl-surface)",
                  border: `1px solid ${d.connected ? "rgba(87,255,204,0.2)" : "var(--vitl-border)"}`,
                  borderRadius: 14, cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: 28, width: 44, textAlign: "center" }}>{d.logo}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: "var(--vitl-muted)", marginTop: 2 }}>{d.sub}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <div style={{
                    fontSize: 11, padding: "3px 10px", borderRadius: 100,
                    background: d.connected ? "rgba(87,255,204,0.1)" : "rgba(255,255,255,0.05)",
                    color: d.connected ? "var(--vitl-accent2)" : "var(--vitl-muted)",
                    border: `1px solid ${d.connected ? "rgba(87,255,204,0.2)" : "var(--vitl-border)"}`,
                  }}>
                    {d.connected ? "● Connected" : "Connect"}
                  </div>
                  {d.connected && (
                    <div style={{ fontSize: 10, color: "var(--vitl-accent)", cursor: "pointer" }}>Sync now</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Feed */}
        <div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 12 }}>Live Data Feed</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FEED.map((f, i) => (
              <div
                key={i}
                className="animate-feed-in"
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px",
                  background: "var(--vitl-surface2)", border: "1px solid var(--vitl-border)",
                  borderRadius: 12, animationDelay: `${i * 0.08}s`,
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: DOT_COLORS[f.dot],
                  animation: f.dot === "live" ? "pulse 2s infinite" : "none",
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, fontSize: 12 }}>{f.label}</div>
                <div style={{ fontSize: 12, fontFamily: "'Unbounded', sans-serif", fontWeight: 600 }}>{f.val}</div>
                <div style={{ fontSize: 10, color: "var(--vitl-muted)", minWidth: 50, textAlign: "right" }}>{f.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions */}
        <div style={{ background: "var(--vitl-surface)", border: "1px solid var(--vitl-border)", borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 16 }}>Data Permissions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {perms.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 0",
                  borderBottom: i < perms.length - 1 ? "1px solid var(--vitl-border)" : "none",
                }}
              >
                <div style={{ fontSize: 18 }}>{p.icon}</div>
                <div style={{ flex: 1, fontSize: 12 }}>{p.label}</div>
                {/* Toggle */}
                <div
                  onClick={() => togglePerm(i)}
                  style={{
                    width: 44, height: 24, borderRadius: 100, cursor: "pointer",
                    background: p.on ? "var(--vitl-accent)" : "var(--vitl-surface3)",
                    border: `1px solid ${p.on ? "var(--vitl-accent)" : "var(--vitl-border2)"}`,
                    position: "relative", transition: "all 0.2s",
                  }}
                >
                  <div style={{
                    position: "absolute", top: 2,
                    left: p.on ? "calc(100% - 22px)" : 2,
                    width: 18, height: 18, borderRadius: "50%",
                    background: p.on ? "#000" : "var(--vitl-muted)",
                    transition: "left 0.2s",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
