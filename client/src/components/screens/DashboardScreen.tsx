/*
 * VITL — DashboardScreen
 * Design: Cyberpunk Terminal Fitness
 * Live vitals, today's workout, nutrition, AI insight
 */
import { useState } from "react";
import { UserProfile, Screen } from "@/pages/Home";

interface Props {
  profile: UserProfile;
  onNavigate: (s: Screen) => void;
}

function AiDot() {
  return (
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "var(--vitl-accent2)",
        display: "inline-block",
        animation: "pulse 2s infinite",
      }}
    />
  );
}

function SparkBar({ heights, color }: { heights: number[]; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 24, marginTop: 8 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${h}%`,
            background: i === heights.length - 1 ? color : "rgba(255,255,255,0.07)",
            opacity: i === heights.length - 1 ? 0.5 : 1,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}

const VITALS = [
  {
    icon: "❤️",
    val: "62",
    sup: "bpm",
    label: "Resting HR",
    delta: "↓ 3",
    deltaType: "up",
    sparks: [60, 40, 70, 50, 62],
    color: "var(--vitl-accent)",
  },
  {
    icon: "🔥",
    val: "1,840",
    sup: "cal",
    label: "Burned",
    delta: "↑ 12%",
    deltaType: "up",
    sparks: [45, 55, 80, 60, 85],
    color: "var(--vitl-accent2)",
  },
  {
    icon: "👟",
    val: "8,241",
    sup: "",
    label: "Steps",
    delta: "82%",
    deltaType: "up",
    sparks: [70, 50, 90, 65, 82],
    color: "var(--vitl-accent3)",
  },
  {
    icon: "💤",
    val: "7.4",
    sup: "hr",
    label: "Sleep",
    delta: "↓ 0.6",
    deltaType: "down",
    sparks: [80, 90, 75, 85, 74],
    color: "var(--vitl-accent4)",
  },
];

const GLOWS = [
  "var(--vitl-accent)",
  "var(--vitl-accent2)",
  "var(--vitl-accent3)",
  "var(--vitl-accent4)",
];

const INITIAL_WORKOUT = [
  { name: "Bench Press", meta: "4×10 · 65kg", done: true },
  { name: "Incline DB Press", meta: "3×12 · 22kg", done: true },
  { name: "Cable Flyes", meta: "3×15", done: false },
  { name: "Shoulder Press", meta: "4×8 · 40kg", done: false },
];

export default function DashboardScreen({ profile, onNavigate }: Props) {
  const [workout, setWorkout] = useState(INITIAL_WORKOUT);

  const doneCount = workout.filter(w => w.done).length;
  const pct = Math.round((doneCount / workout.length) * 100);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  function toggleItem(i: number) {
    setWorkout(prev => prev.map((w, idx) => idx === i ? { ...w, done: !w.done } : w));
  }

  return (
    <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Hey, <span style={{ color: "var(--vitl-accent)" }}>{profile.name}</span> 👋
          </div>
          <div style={{ fontSize: 10, color: "var(--vitl-muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>
            {today}
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(200,255,87,0.06)", border: "1px solid rgba(200,255,87,0.18)",
          borderRadius: 100, padding: "6px 14px", fontSize: 11, color: "var(--vitl-accent)",
        }}>
          🔥 <span>{profile.streakCount}</span>-day streak
        </div>
      </div>

      {/* Scrollable content */}
      <div className="scrollable" style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Vitals */}
        <div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 12 }}>
            Live Vitals
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {VITALS.map((v, i) => (
              <div
                key={i}
                style={{
                  background: "var(--vitl-surface)",
                  border: "1px solid var(--vitl-border)",
                  borderRadius: 14,
                  padding: 16,
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "none")}
              >
                {/* Glow */}
                <div style={{
                  position: "absolute", top: -20, right: -20,
                  width: 60, height: 60, borderRadius: "50%",
                  filter: "blur(20px)", opacity: 0.2,
                  background: GLOWS[i],
                }} />
                <div style={{ fontSize: 18, marginBottom: 10 }}>{v.icon}</div>
                <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {v.val}
                  {v.sup && <sup style={{ fontSize: 10, fontWeight: 300, opacity: 0.6 }}>{v.sup}</sup>}
                </div>
                <div style={{ fontSize: 10, color: "var(--vitl-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {v.label}
                </div>
                <div style={{
                  position: "absolute", bottom: 12, right: 12, fontSize: 10,
                  padding: "2px 8px", borderRadius: 100,
                  background: v.deltaType === "up" ? "rgba(200,255,87,0.1)" : "rgba(255,87,135,0.1)",
                  color: v.deltaType === "up" ? "var(--vitl-accent)" : "var(--vitl-accent3)",
                }}>
                  {v.delta}
                </div>
                <SparkBar heights={v.sparks} color={v.color} />
              </div>
            ))}
          </div>
        </div>

        {/* Today's Workout */}
        <div style={{ background: "var(--vitl-surface)", border: "1px solid var(--vitl-border)", borderRadius: 16, padding: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 4 }}>Today's Workout</div>
              <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: "-0.02em" }}>Upper Body Strength</div>
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 12px", borderRadius: 100, fontSize: 11,
              background: "rgba(87,255,204,0.08)", border: "1px solid rgba(87,255,204,0.2)", color: "var(--vitl-accent2)",
            }}>
              <AiDot /> AI-tailored
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {workout.map((w, i) => (
              <div
                key={i}
                onClick={() => toggleItem(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px",
                  background: "var(--vitl-surface2)",
                  borderRadius: 12,
                  border: "1px solid transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  opacity: w.done ? 0.45 : 1,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--vitl-border)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "transparent")}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  border: w.done ? "none" : "2px solid var(--vitl-border2)",
                  background: w.done ? "var(--vitl-accent)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: "#000", flexShrink: 0, transition: "all 0.2s",
                }}>
                  {w.done ? "✓" : ""}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12 }}>{w.name}</div>
                  <div style={{ fontSize: 10, color: "var(--vitl-muted)", marginTop: 2 }}>{w.meta}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ background: "var(--vitl-surface2)", borderRadius: 8, overflow: "hidden", height: 4 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "var(--vitl-accent)", borderRadius: 8, transition: "width 0.6s ease" }} />
            </div>
            <div style={{ fontSize: 10, color: "var(--vitl-muted)", marginTop: 6 }}>
              {doneCount} of {workout.length} complete · {(workout.length - doneCount) * 11} min left
            </div>
          </div>
        </div>

        {/* Nutrition */}
        <div style={{ background: "var(--vitl-surface)", border: "1px solid var(--vitl-border)", borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 12 }}>
            Today's Nutrition
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 22, fontWeight: 700, color: "var(--vitl-accent)" }}>
              1,640<span style={{ fontSize: 12, color: "var(--vitl-muted)", fontWeight: 300 }}> kcal left</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--vitl-muted)" }}>Goal: 2,400</div>
          </div>
          {[
            { label: "Protein", val: "142 / 180g", pct: 79, color: "var(--vitl-accent)" },
            { label: "Carbs", val: "210 / 280g", pct: 75, color: "var(--vitl-accent2)" },
            { label: "Fats", val: "48 / 70g", pct: 69, color: "var(--vitl-accent3)" },
          ].map(m => (
            <div key={m.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
                <span style={{ color: "var(--vitl-muted)" }}>{m.label}</span>
                <span>{m.val}</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${m.pct}%`, background: m.color, borderRadius: 10, transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
        </div>

        {/* AI Insight */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(87,255,204,0.06), rgba(200,255,87,0.04))",
            border: "1px solid rgba(87,255,204,0.15)",
            borderRadius: 16, padding: 20,
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ fontSize: 22 }}>🧠</div>
            <div>
              <div style={{ fontSize: 11, color: "var(--vitl-accent2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                AI Coach Insight
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.7, color: "var(--vitl-text)" }}>
                Your HRV is trending up — great sign of recovery. Based on last night's sleep data, I've reduced tonight's recommended workout intensity by 10%.
              </div>
              <div
                style={{ marginTop: 10, cursor: "pointer" }}
                onClick={() => onNavigate("chat")}
              >
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 12px", borderRadius: 100, fontSize: 11,
                  background: "rgba(87,255,204,0.08)", border: "1px solid rgba(87,255,204,0.2)", color: "var(--vitl-accent2)",
                  cursor: "pointer",
                }}>
                  Ask Coach →
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
