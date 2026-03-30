/*
 * VITL — NotificationsScreen
 * Design: Cyberpunk Terminal Fitness
 * Weekly summary, smart alerts, reminder settings
 */
import { useState } from "react";
import { Screen } from "@/pages/Home";

interface Props {
  onNavigate: (s: Screen) => void;
}

const REMINDERS = [
  { icon: "💪", name: "Workout Reminder", time: "3:00 PM daily", on: true },
  { icon: "🥗", name: "Meal Logging", time: "After each meal", on: true },
  { icon: "💧", name: "Hydration Alerts", time: "Every 2 hours", on: true },
  { icon: "😴", name: "Sleep Wind-down", time: "9:30 PM", on: true },
  { icon: "📊", name: "Weekly Summary", time: "Sunday morning", on: false },
];

export default function NotificationsScreen({ onNavigate }: Props) {
  const [reminders, setReminders] = useState(REMINDERS);

  function toggleReminder(i: number) {
    setReminders(prev => prev.map((r, idx) => idx === i ? { ...r, on: !r.on } : r));
  }

  return (
    <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 4 }}>Smart Reminders</div>
        <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em" }}>Notifications</div>
      </div>

      <div className="scrollable" style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Weekly Summary */}
        <div style={{
          background: "linear-gradient(135deg, rgba(200,255,87,0.06), rgba(87,255,204,0.04))",
          border: "1px solid rgba(200,255,87,0.15)", borderRadius: 16, padding: 20,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 100, fontSize: 11, marginBottom: 10,
            background: "rgba(200,255,87,0.08)", border: "1px solid rgba(200,255,87,0.2)", color: "var(--vitl-accent)",
          }}>
            📅 Weekly Summary
          </div>
          <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 16, fontWeight: 700 }}>You're ahead of pace 🏆</div>
          <div style={{ fontSize: 11, color: "var(--vitl-muted)", marginTop: 4 }}>Week 14 · Best week this month</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 }}>
            {[
              { val: "5", label: "Workouts" },
              { val: "↓1.4kg", label: "Weight" },
              { val: "92%", label: "Nutrition" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--vitl-accent)" }}>{s.val}</div>
                <div style={{ fontSize: 10, color: "var(--vitl-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 12 }}>Today's Alerts</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Workout alert */}
            <div style={{
              background: "var(--vitl-surface)", border: "1px solid rgba(200,255,87,0.2)",
              borderRadius: 14, padding: 16, display: "flex", gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: "rgba(200,255,87,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>💪</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Workout starts in 45 min</div>
                <div style={{ fontSize: 11, color: "var(--vitl-muted)", lineHeight: 1.6, marginBottom: 10 }}>
                  Upper Body Strength · 4 exercises · ~45 min. Your energy level is optimal right now.
                </div>
                <div style={{ fontSize: 10, color: "var(--vitl-muted)", marginBottom: 10 }}>2:15 PM</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => onNavigate("dashboard")}
                    style={{
                      padding: "7px 16px", borderRadius: 8, fontSize: 11, cursor: "pointer",
                      background: "var(--vitl-accent)", border: "none", color: "#000",
                      fontFamily: "'DM Mono', monospace", fontWeight: 500,
                    }}
                  >Start Workout</button>
                  <button style={{
                    padding: "7px 16px", borderRadius: 8, fontSize: 11, cursor: "pointer",
                    background: "var(--vitl-surface2)", border: "1px solid var(--vitl-border)",
                    color: "var(--vitl-text)", fontFamily: "'DM Mono', monospace",
                  }}>Reschedule</button>
                </div>
              </div>
            </div>

            {/* Nutrition alert */}
            <div style={{
              background: "var(--vitl-surface)", border: "1px solid rgba(87,255,204,0.2)",
              borderRadius: 14, padding: 16, display: "flex", gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: "rgba(87,255,204,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>🥗</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Log your lunch</div>
                <div style={{ fontSize: 11, color: "var(--vitl-muted)", lineHeight: 1.6, marginBottom: 10 }}>
                  You're 38g short on protein for today. I've prepared a quick meal suggestion based on your last log.
                </div>
                <div style={{ fontSize: 10, color: "var(--vitl-muted)", marginBottom: 10 }}>1:30 PM</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{
                    padding: "7px 16px", borderRadius: 8, fontSize: 11, cursor: "pointer",
                    background: "var(--vitl-accent2)", border: "none", color: "#000",
                    fontFamily: "'DM Mono', monospace", fontWeight: 500,
                  }}>Log Meal</button>
                  <button style={{
                    padding: "7px 16px", borderRadius: 8, fontSize: 11, cursor: "pointer",
                    background: "var(--vitl-surface2)", border: "1px solid var(--vitl-border)",
                    color: "var(--vitl-text)", fontFamily: "'DM Mono', monospace",
                  }}>See Suggestion</button>
                </div>
              </div>
            </div>

            {/* Sleep alert */}
            <div style={{
              background: "var(--vitl-surface)", border: "1px solid rgba(255,87,135,0.2)",
              borderRadius: 14, padding: 16, display: "flex", gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: "rgba(255,87,135,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>😴</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Wind-down reminder</div>
                <div style={{ fontSize: 11, color: "var(--vitl-muted)", lineHeight: 1.6 }}>
                  Sleep debt detected. Based on last 3 nights, aim for 8h tonight. Wind down by 10 PM.
                </div>
              </div>
            </div>

            {/* Hydration */}
            <div style={{
              background: "var(--vitl-surface)", border: "1px solid var(--vitl-border)",
              borderRadius: 14, padding: 16, display: "flex", gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: "rgba(255,159,87,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>💧</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Hydration check</div>
                <div style={{ fontSize: 11, color: "var(--vitl-muted)", lineHeight: 1.6, marginBottom: 6 }}>
                  You've had 1.8L today. 700ml left to hit your goal. Especially important on training days.
                </div>
                <div style={{ fontSize: 10, color: "var(--vitl-muted)" }}>12:00 PM</div>
              </div>
            </div>

          </div>
        </div>

        {/* Reminder Settings */}
        <div>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--vitl-muted)", marginBottom: 12 }}>Reminder Schedule</div>
          <div style={{
            background: "var(--vitl-surface)", border: "1px solid var(--vitl-border)",
            borderRadius: 16, overflow: "hidden",
          }}>
            {reminders.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 16px",
                  borderBottom: i < reminders.length - 1 ? "1px solid var(--vitl-border)" : "none",
                }}
              >
                <div style={{ fontSize: 20 }}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12 }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: "var(--vitl-muted)", marginTop: 2 }}>{r.time}</div>
                </div>
                <div
                  onClick={() => toggleReminder(i)}
                  style={{
                    width: 44, height: 24, borderRadius: 100, cursor: "pointer",
                    background: r.on ? "var(--vitl-accent)" : "var(--vitl-surface3)",
                    border: `1px solid ${r.on ? "var(--vitl-accent)" : "var(--vitl-border2)"}`,
                    position: "relative", transition: "all 0.2s",
                  }}
                >
                  <div style={{
                    position: "absolute", top: 2,
                    left: r.on ? "calc(100% - 22px)" : 2,
                    width: 18, height: 18, borderRadius: "50%",
                    background: r.on ? "#000" : "var(--vitl-muted)",
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
