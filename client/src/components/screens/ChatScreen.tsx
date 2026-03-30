/*
 * VITL — ChatScreen
 * Design: Cyberpunk Terminal Fitness
 * AI coach chat with typing indicator and quick replies
 */
import { useState, useRef, useEffect } from "react";
import { UserProfile, Screen } from "@/pages/Home";

interface Props {
  profile: UserProfile;
  onNavigate: (s: Screen) => void;
}

interface Message {
  role: "ai" | "user";
  text: string;
  time: string;
  insight?: { title: string; rows: { key: string; val: string }[] };
}

const AI_RESPONSES = [
  "Great question! Your HRV is trending at 54ms — above your baseline. That means you have recovery capacity for a solid training session today. I'd push the shoulder press to 42.5kg.",
  "Based on your sleep data (7.4h, 74/100 quality score), I'd recommend a high-protein pre-workout meal — around 40g protein, 60g carbs. Something like chicken rice with a protein shake.",
  "Your weekly training load is sitting at 78% — ideal zone. You're building fitness without accumulating too much fatigue. Keep this pace through Sunday.",
  "I've noticed your bench press has improved 8% over 4 weeks. You're on track to hit a 75kg PR by end of Month 2. Want me to build a specific peaking protocol?",
  "Sleep debt detected across 3 nights. I'm recommending a 10% intensity reduction tomorrow and prioritising a 9:30 PM wind-down tonight. Magnesium glycinate before bed can help.",
];

const INITIAL_MESSAGES: Message[] = [
  {
    role: "ai",
    text: "Hey! Your resting HR dropped to 62 bpm this week — that's a 3-point improvement 📉 Keep it up. You're crushing the consistency game.",
    time: "Today · 8:42 AM",
    insight: {
      title: "📊 Today's Snapshot",
      rows: [
        { key: "Resting HR", val: "62 bpm ↓3" },
        { key: "Calories Burned", val: "1,840 kcal" },
        { key: "Workout Completion", val: "50% (2/4)" },
        { key: "Sleep Quality", val: "74 / 100" },
      ],
    },
  },
  {
    role: "user",
    text: "I slept less last night. Should I skip the workout?",
    time: "9:10 AM",
  },
  {
    role: "ai",
    text: "Don't skip entirely — but I've adjusted your plan. I swapped the heavy shoulder press for a lighter accessory superset and cut total volume by 20%. You'll still make progress without digging into your recovery deficit.",
    time: "9:10 AM",
  },
];

const QUICK_REPLIES = [
  "Pre-workout meal?",
  "Optimize sleep",
  "Weekly trend",
  "Increase bench",
];

const QUICK_REPLY_TEXTS: Record<string, string> = {
  "Pre-workout meal?": "What should I eat before my workout?",
  "Optimize sleep": "Adjust tonight's plan for better sleep",
  "Weekly trend": "How am I trending this week?",
  "Increase bench": "Add 5kg to my bench press target",
};

function now() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function ChatScreen({ profile }: Props) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [aiIdx, setAiIdx] = useState(0);
  const [activeChip, setActiveChip] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const aiMsg: Message = {
        role: "ai",
        text: AI_RESPONSES[aiIdx % AI_RESPONSES.length],
        time: now(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setAiIdx(i => i + 1);
    }, 1600);
  }

  return (
    <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        background: "var(--vitl-surface)",
        borderBottom: "1px solid var(--vitl-border)",
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "rgba(87,255,204,0.1)", border: "1px solid rgba(87,255,204,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>
          🤖
        </div>
        <div>
          <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 13, fontWeight: 600 }}>VITL Coach</div>
          <div style={{ fontSize: 11, color: "var(--vitl-muted)", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--vitl-accent2)", display: "inline-block", animation: "pulse 2s infinite" }} />
            Online · Analyzing your data
          </div>
        </div>
      </div>

      {/* Context chips */}
      <div style={{
        display: "flex", gap: 8, padding: "10px 16px", overflowX: "auto",
        borderBottom: "1px solid var(--vitl-border)", flexShrink: 0,
      }}>
        {["📊 Today's Stats", "💪 Workout", "🥗 Nutrition", "😴 Sleep", "📈 Goals"].map((chip, i) => (
          <div
            key={i}
            onClick={() => setActiveChip(i)}
            style={{
              padding: "6px 14px", borderRadius: 100, fontSize: 11, cursor: "pointer",
              whiteSpace: "nowrap", transition: "all 0.2s",
              background: activeChip === i ? "rgba(200,255,87,0.08)" : "transparent",
              border: `1px solid ${activeChip === i ? "rgba(200,255,87,0.2)" : "transparent"}`,
              color: activeChip === i ? "var(--vitl-accent)" : "var(--vitl-muted)",
            }}
          >
            {chip}
          </div>
        ))}
      </div>

      {/* Messages */}
      <div className="scrollable" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className="animate-fade-in-up"
            style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              gap: 10, alignItems: "flex-start",
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              background: msg.role === "ai" ? "rgba(87,255,204,0.1)" : "rgba(200,255,87,0.1)",
              border: `1px solid ${msg.role === "ai" ? "rgba(87,255,204,0.2)" : "rgba(200,255,87,0.2)"}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>
              {msg.role === "ai" ? "🤖" : "👤"}
            </div>
            <div style={{ maxWidth: "75%", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{
                padding: "12px 14px",
                background: msg.role === "ai" ? "var(--vitl-surface2)" : "rgba(200,255,87,0.08)",
                border: `1px solid ${msg.role === "ai" ? "var(--vitl-border)" : "rgba(200,255,87,0.15)"}`,
                borderRadius: msg.role === "ai" ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
                fontSize: 12, lineHeight: 1.7, color: "var(--vitl-text)",
              }}>
                {msg.text}
              </div>
              {msg.insight && (
                <div style={{
                  background: "var(--vitl-surface3)", border: "1px solid var(--vitl-border)",
                  borderRadius: 12, padding: "12px 14px",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 8 }}>{msg.insight.title}</div>
                  {msg.insight.rows.map(r => (
                    <div key={r.key} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                      <span style={{ color: "var(--vitl-muted)" }}>{r.key}</span>
                      <span style={{ color: "var(--vitl-accent2)" }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ fontSize: 10, color: "var(--vitl-muted)", paddingLeft: msg.role === "user" ? 0 : 4, textAlign: msg.role === "user" ? "right" : "left" }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(87,255,204,0.1)", border: "1px solid rgba(87,255,204,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>🤖</div>
            <div style={{
              padding: "14px 18px",
              background: "var(--vitl-surface2)", border: "1px solid var(--vitl-border)",
              borderRadius: "4px 14px 14px 14px",
              display: "flex", gap: 4, alignItems: "center",
            }}>
              {[0, 1, 2].map(d => (
                <div key={d} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "var(--vitl-muted)",
                  animation: `typingBounce 1.2s ease infinite`,
                  animationDelay: `${d * 0.2}s`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{
        padding: "12px 16px", background: "var(--vitl-surface)",
        borderTop: "1px solid var(--vitl-border)", flexShrink: 0,
      }}>
        {/* Quick replies */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 10, paddingBottom: 2 }}>
          {QUICK_REPLIES.map(qr => (
            <button
              key={qr}
              onClick={() => sendMessage(QUICK_REPLY_TEXTS[qr])}
              style={{
                padding: "6px 14px", borderRadius: 100, fontSize: 11,
                whiteSpace: "nowrap", cursor: "pointer",
                background: "var(--vitl-surface2)", border: "1px solid var(--vitl-border)",
                color: "var(--vitl-text)", fontFamily: "'DM Mono', monospace",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--vitl-border2)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--vitl-border)")}
            >
              {qr}
            </button>
          ))}
        </div>
        {/* Input row */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask your AI coach..."
            style={{
              flex: 1, background: "var(--vitl-surface2)", border: "1px solid var(--vitl-border)",
              borderRadius: 12, padding: "12px 16px", fontFamily: "'DM Mono', monospace",
              fontSize: 13, color: "var(--vitl-text)", outline: "none",
            }}
            onFocus={e => (e.target.style.borderColor = "rgba(200,255,87,0.3)")}
            onBlur={e => (e.target.style.borderColor = "var(--vitl-border)")}
          />
          <button
            onClick={() => sendMessage(input)}
            style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "var(--vitl-accent)", border: "none",
              color: "#000", fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#d4ff70")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--vitl-accent)")}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
