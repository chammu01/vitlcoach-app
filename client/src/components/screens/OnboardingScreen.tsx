/*
 * VITL — OnboardingScreen
 * Design: Cyberpunk Terminal Fitness
 * 4-step onboarding: goal, activity level, target weight, profile
 */
import { useState } from "react";
import { UserProfile } from "@/pages/Home";

interface Props {
  onComplete: (data: Partial<UserProfile>) => void;
}

const STEPS = [
  {
    label: "Step 1 of 4",
    title: "What's your primary <accent>goal?</accent>",
    sub: "Your AI coach will build every plan around this.",
    type: "options" as const,
    options: [
      { icon: "⚡", title: "Lose Body Fat", sub: "Reduce % while preserving muscle" },
      { icon: "💪", title: "Build Muscle", sub: "Hypertrophy-focused programming" },
      { icon: "🏃", title: "Improve Endurance", sub: "Cardio & VO2 max development" },
      { icon: "🧘", title: "General Wellness", sub: "Balance across all health pillars" },
    ],
  },
  {
    label: "Step 2 of 4",
    title: "How <accent>active</accent> are you?",
    sub: "This calibrates your baseline calorie needs and training intensity.",
    type: "options" as const,
    options: [
      { icon: "🪑", title: "Sedentary", sub: "Desk job, minimal movement" },
      { icon: "🚶", title: "Lightly Active", sub: "Light exercise 1–3 days/week" },
      { icon: "🏋️", title: "Moderately Active", sub: "Exercise 3–5 days/week" },
      { icon: "🔥", title: "Very Active", sub: "Intense training 6+ days/week" },
    ],
  },
  {
    label: "Step 3 of 4",
    title: "Set your <accent>target weight</accent>",
    sub: "We'll use this to pace your progress and adjust macros over time.",
    type: "slider" as const,
    min: 45, max: 120, val: 76, unit: "kg",
  },
  {
    label: "Step 4 of 4",
    title: "Who are <accent>you?</accent>",
    sub: "Personalise your VITL experience.",
    type: "name" as const,
  },
];

const AVATARS = [
  { emoji: "💪", label: "Athlete" },
  { emoji: "🧘", label: "Zen" },
  { emoji: "🏃", label: "Runner" },
  { emoji: "🌱", label: "Beginner" },
];

function renderTitle(raw: string) {
  const parts = raw.split(/<accent>|<\/accent>/);
  return (
    <span>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} style={{ color: "var(--vitl-accent)" }}>{p}</span>
        ) : (
          p
        )
      )}
    </span>
  );
}

export default function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<number | null>(null);
  const [activity, setActivity] = useState<number | null>(null);
  const [weight, setWeight] = useState(76);
  const [name, setName] = useState("Alex");
  const [avatar, setAvatar] = useState("💪");

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function handleNext() {
    if (isLast) {
      onComplete({ name, goal, activity, weight, avatar });
    } else {
      setStep(step + 1);
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  const pct = ((step) / STEPS.length) * 100;

  return (
    <div
      className="animate-fade-in-up"
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        background: "var(--vitl-bg)",
        overflow: "hidden",
      }}
    >
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, padding: "16px 24px 0" }}>
        {STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 10,
              background:
                i < step
                  ? "var(--vitl-accent)"
                  : i === step
                  ? "rgba(200,255,87,0.4)"
                  : "var(--vitl-surface3)",
              transition: "background 0.4s",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        className="scrollable"
        style={{ padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}
      >
        <div
          key={step}
          className="animate-fade-in-up"
          style={{ display: "flex", flexDirection: "column", flex: 1 }}
        >
          <div
            style={{
              fontSize: 10,
              color: "var(--vitl-muted)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            {s.label}
          </div>
          <div
            style={{
              fontFamily: "'Unbounded', sans-serif",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              marginBottom: 8,
            }}
          >
            {renderTitle(s.title)}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--vitl-muted)",
              lineHeight: 1.7,
              marginBottom: 32,
            }}
          >
            {s.sub}
          </div>

          {/* Options */}
          {s.type === "options" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {s.options!.map((opt, i) => {
                const selected = step === 0 ? goal === i : activity === i;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (step === 0) setGoal(i);
                      else setActivity(i);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "14px 18px",
                      background: selected ? "rgba(200,255,87,0.05)" : "var(--vitl-surface)",
                      border: `1px solid ${selected ? "rgba(200,255,87,0.4)" : "var(--vitl-border)"}`,
                      borderRadius: 14,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: 22, width: 36, textAlign: "center" }}>{opt.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13 }}>{opt.title}</div>
                      <div style={{ fontSize: 11, color: "var(--vitl-muted)", marginTop: 2 }}>{opt.sub}</div>
                    </div>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: selected ? "none" : "2px solid var(--vitl-border2)",
                        background: selected ? "var(--vitl-accent)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        color: "#000",
                        flexShrink: 0,
                        transition: "all 0.2s",
                      }}
                    >
                      {selected ? "✓" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Slider */}
          {s.type === "slider" && (
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontFamily: "'Unbounded', sans-serif",
                  fontSize: 38,
                  fontWeight: 700,
                  color: "var(--vitl-accent)",
                  letterSpacing: "-0.04em",
                  textAlign: "center",
                  marginBottom: 4,
                }}
              >
                {weight}
              </div>
              <div style={{ fontSize: 12, color: "var(--vitl-muted)", textAlign: "center", marginBottom: 16 }}>
                kg
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--vitl-muted)", marginBottom: 8 }}>
                <span>45kg</span>
                <span>120kg</span>
              </div>
              <input
                type="range"
                min={45}
                max={120}
                value={weight}
                onChange={e => setWeight(Number(e.target.value))}
                style={{
                  width: "100%",
                  background: `linear-gradient(to right, var(--vitl-accent) 0%, var(--vitl-accent) ${((weight - 45) / 75) * 100}%, rgba(255,255,255,0.08) ${((weight - 45) / 75) * 100}%)`,
                }}
              />
            </div>
          )}

          {/* Name + Avatar */}
          {s.type === "name" && (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                {AVATARS.map(a => (
                  <div
                    key={a.emoji}
                    onClick={() => setAvatar(a.emoji)}
                    style={{
                      flex: 1,
                      padding: "14px 10px",
                      borderRadius: 14,
                      background: avatar === a.emoji ? "rgba(200,255,87,0.05)" : "var(--vitl-surface)",
                      border: `1px solid ${avatar === a.emoji ? "rgba(200,255,87,0.4)" : "var(--vitl-border)"}`,
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 32, display: "block", marginBottom: 6 }}>{a.emoji}</span>
                    <span style={{ fontSize: 11, color: "var(--vitl-muted)" }}>{a.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, color: "var(--vitl-muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Your Name
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name..."
                  style={{
                    width: "100%",
                    background: "var(--vitl-surface2)",
                    border: "1px solid var(--vitl-border)",
                    borderRadius: 12,
                    padding: "12px 16px",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 13,
                    color: "var(--vitl-text)",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "rgba(200,255,87,0.3)")}
                  onBlur={e => (e.target.style.borderColor = "var(--vitl-border)")}
                />
              </div>
            </>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            {step > 0 && (
              <button
                onClick={handleBack}
                style={{
                  flex: 1,
                  padding: "12px 24px",
                  borderRadius: 12,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  cursor: "pointer",
                  border: "1px solid var(--vitl-border)",
                  background: "var(--vitl-surface2)",
                  color: "var(--vitl-text)",
                  transition: "all 0.2s",
                }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleNext}
              style={{
                flex: 2,
                padding: "12px 24px",
                borderRadius: 12,
                fontFamily: "'DM Mono', monospace",
                fontSize: 13,
                cursor: "pointer",
                border: "none",
                background: "var(--vitl-accent)",
                color: "#000",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.background = "#d4ff70";
                (e.target as HTMLButtonElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.background = "var(--vitl-accent)";
                (e.target as HTMLButtonElement).style.transform = "none";
              }}
            >
              {isLast ? "🚀 Start Your Journey →" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
