/*
 * VITL — ProgressScreen
 * Design: Cyberpunk Terminal Fitness
 * Weight chart, body composition, muscle map, achievements
 */
import { useState } from "react";

const TABS = ["1W", "1M", "3M"];

const CHART_PATHS: Record<string, { line: string; area: string }> = {
  "1W": {
    line: "M0,100 C30,96 60,88 90,92 S150,80 180,75 S240,68 300,62 S330,58 360,54",
    area: "M0,100 C30,96 60,88 90,92 S150,80 180,75 S240,68 300,62 S330,58 360,54 L360,140 L0,140Z",
  },
  "1M": {
    line: "M0,110 C40,105 80,98 120,95 S180,85 220,78 S280,65 320,58 S345,52 360,48",
    area: "M0,110 C40,105 80,98 120,95 S180,85 220,78 S280,65 320,58 S345,52 360,48 L360,140 L0,140Z",
  },
  "3M": {
    line: "M0,120 C50,115 100,108 150,100 S220,88 270,75 S320,60 360,45",
    area: "M0,120 C50,115 100,108 150,100 S220,88 270,75 S320,60 360,45 L360,140 L0,140Z",
  },
};

const BODY_STATS = [
  { icon: "⚡", val: "18.4", unit: "%", label: "Body Fat", change: "↓ 1.2% this month", pos: false },
  { icon: "💪", val: "62.3", unit: "kg", label: "Lean Mass", change: "↑ 0.8 kg", pos: true },
  { icon: "🔋", val: "2,840", unit: "", label: "TDEE / day", change: "Recalibrated", pos: true },
  { icon: "❤️‍🔥", val: "54", unit: "ms", label: "Avg HRV", change: "↑ 6ms this week", pos: true },
];

const BADGES = [
  { icon: "🔥", name: "14-Day Streak", earned: true },
  { icon: "💪", name: "PR Bench", earned: true },
  { icon: "🥗", name: "Macro Master", earned: true },
  { icon: "😴", name: "Sleep King", earned: true },
  { icon: "🏆", name: "30-Day Goal", earned: false },
  { icon: "⚡", name: "Sub-15% Fat", earned: false },
];

const MUSCLE_LEGEND = [
  { color: "var(--vitl-accent)", label: "Chest/Back", pct: 82 },
  { color: "var(--vitl-accent2)", label: "Arms", pct: 65 },
  { color: "var(--vitl-accent3)", label: "Legs", pct: 48 },
  { color: "var(--vitl-accent4)", label: "Shoulders", pct: 71 },
  { color: "var(--vitl-muted)", label: "Core", pct: 55 },
];

export default function ProgressScreen() {
  const [tab, setTab] = useState("1W");

  return (
    <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 4 }}>Analytics</div>
        <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em" }}>Your Progress</div>
      </div>

      <div className="scrollable" style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Weight Chart */}
        <div style={{ background: "var(--vitl-surface)", border: "1px solid var(--vitl-border)", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 4 }}>Body Weight</div>
              <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 22, fontWeight: 700 }}>
                76.4 <span style={{ fontSize: 13, fontWeight: 300, color: "var(--vitl-muted)" }}>kg</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--vitl-accent)", marginTop: 2 }}>↓ 1.4 kg from start</div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: "5px 14px", borderRadius: 8, fontSize: 11, cursor: "pointer",
                    transition: "all 0.2s", fontFamily: "'DM Mono', monospace",
                    background: tab === t ? "rgba(200,255,87,0.08)" : "transparent",
                    border: `1px solid ${tab === t ? "rgba(200,255,87,0.2)" : "transparent"}`,
                    color: tab === t ? "var(--vitl-accent)" : "var(--vitl-muted)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: 140, marginTop: 16, position: "relative" }}>
            <svg width="100%" height="100%" viewBox="0 0 360 140" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c8ff57" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#c8ff57" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="35" x2="360" y2="35" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <line x1="0" y1="70" x2="360" y2="70" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <line x1="0" y1="105" x2="360" y2="105" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <path
                d={CHART_PATHS[tab].line}
                fill="none" stroke="var(--vitl-accent)" strokeWidth="2.5" strokeLinecap="round"
                style={{ transition: "d 0.5s ease" }}
              />
              <path d={CHART_PATHS[tab].area} fill="url(#chartGrad)" />
              <circle cx="360" cy={tab === "1W" ? 54 : tab === "1M" ? 48 : 45} r="4" fill="var(--vitl-accent)" />
              <circle cx="360" cy={tab === "1W" ? 54 : tab === "1M" ? 48 : 45} r="8" fill="var(--vitl-accent)" opacity="0.2" />
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <text key={d} x={i * 52} y="130" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="DM Mono">{d}</text>
              ))}
            </svg>
          </div>
        </div>

        {/* Body Composition */}
        <div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 12 }}>Body Composition</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {BODY_STATS.map(s => (
              <div key={s.label} style={{
                background: "var(--vitl-surface2)", borderRadius: 14, padding: 16,
                border: "1px solid var(--vitl-border)",
              }}>
                <div style={{ fontSize: 20, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em" }}>
                  {s.val}
                  {s.unit && <span style={{ fontSize: 12, color: "var(--vitl-muted)" }}>{s.unit}</span>}
                </div>
                <div style={{ fontSize: 10, color: "var(--vitl-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, marginTop: 6, color: s.pos ? "var(--vitl-accent)" : "var(--vitl-accent3)" }}>{s.change}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Muscle Map */}
        <div style={{ background: "var(--vitl-surface)", border: "1px solid var(--vitl-border)", borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 16 }}>Muscle Volume — Last 30 Days</div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {/* Body SVG */}
            <div style={{ flexShrink: 0 }}>
              <svg width="80" height="140" viewBox="0 0 80 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="40" cy="18" rx="14" ry="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <rect x="22" y="34" width="36" height="44" rx="8" fill="rgba(200,255,87,0.15)" stroke="rgba(200,255,87,0.3)" strokeWidth="1" />
                <rect x="8" y="36" width="14" height="36" rx="7" fill="rgba(87,255,204,0.12)" stroke="rgba(87,255,204,0.25)" strokeWidth="1" />
                <rect x="58" y="36" width="14" height="36" rx="7" fill="rgba(87,255,204,0.12)" stroke="rgba(87,255,204,0.25)" strokeWidth="1" />
                <rect x="24" y="80" width="14" height="50" rx="7" fill="rgba(255,87,135,0.1)" stroke="rgba(255,87,135,0.2)" strokeWidth="1" />
                <rect x="42" y="80" width="14" height="50" rx="7" fill="rgba(255,87,135,0.1)" stroke="rgba(255,87,135,0.2)" strokeWidth="1" />
              </svg>
            </div>
            {/* Legend */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {MUSCLE_LEGEND.map(m => (
                <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                  <div style={{ color: "var(--vitl-muted)", width: 80 }}>{m.label}</div>
                  <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 10 }}>
                    <div style={{ height: "100%", width: `${m.pct}%`, background: m.color, borderRadius: 10 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 12 }}>Achievements</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {BADGES.map(b => (
              <div
                key={b.name}
                style={{
                  background: b.earned ? "rgba(200,255,87,0.04)" : "var(--vitl-surface2)",
                  borderRadius: 14, padding: "14px 10px",
                  textAlign: "center",
                  border: `1px solid ${b.earned ? "rgba(200,255,87,0.2)" : "var(--vitl-border)"}`,
                  opacity: b.earned ? 1 : 0.4,
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icon}</div>
                <div style={{ fontSize: 10, color: "var(--vitl-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{b.name}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
