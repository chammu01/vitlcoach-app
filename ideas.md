# VITL — Design Brainstorm

## Overview
VITL is a mobile-style AI fitness & health coaching app. The original HTML uses a dark theme with lime-green (#c8ff57) accent, DM Mono + Unbounded fonts, and a bottom navigation pattern. The React rebuild should faithfully reproduce this aesthetic while elevating the polish.

---

<response>
<text>
## Idea A — Cyberpunk Terminal Fitness

**Design Movement:** Cyberpunk / Brutalist Terminal

**Core Principles:**
1. Monospace-first typography — everything feels like a readout from a performance computer
2. Neon-on-void contrast — lime green and teal on near-black backgrounds
3. Data-density — pack meaningful metrics tightly, no decorative whitespace
4. Glitch micro-interactions — subtle scanline overlays and flicker effects

**Color Philosophy:**
- Background: #090910 (near-void black with a faint blue cast)
- Accent: #c8ff57 (electric lime — energy, performance, progress)
- Accent2: #57ffcc (teal — recovery, AI, calm data)
- Accent3: #ff5787 (hot pink — alerts, warnings, intensity)
- Accent4: #ff9f57 (amber — nutrition, warmth)
- Text: #eeeef5, Muted: #64647a

**Layout Paradigm:**
- Full-height mobile shell (390px max-width centered on desktop)
- Fixed bottom navigation with 5 tabs
- Screen-switching (no routing) — single page, multiple "screens"
- Cards with subtle glow borders

**Signature Elements:**
1. Noise texture overlay (SVG fractalNoise) on the entire app
2. Spark bar mini-charts in vital cards
3. Pulsing AI dot indicator

**Interaction Philosophy:**
- Instant screen transitions with fadeIn + translateY
- Toggle interactions on workout items and device cards
- Typing indicator for AI chat responses

**Animation:**
- fadeIn: opacity 0→1, translateY 6px→0, 0.3s ease
- pulse: scale + opacity for AI dot, 2s infinite
- Progress bar fills animate on mount (width transition 0.6s ease)

**Typography System:**
- Display: Unbounded (700/900) — section titles, big numbers
- Body/UI: DM Mono (300/400/500) — all labels, inputs, meta text
- Hierarchy: 26px onboarding titles → 22px vital values → 16px section titles → 12px body → 10px labels
</text>
<probability>0.09</probability>
</response>

<response>
<text>
## Idea B — Biometric Dashboard Dark

**Design Movement:** Premium Health Tech / Apple Health meets Whoop

**Core Principles:**
1. Breathing room — generous padding, cards float in space
2. Gradient depth — subtle radial gradients behind metric cards
3. Rounded softness — 20-24px border radius throughout
4. Color-coded data streams — each metric has its own accent color

**Color Philosophy:**
- Background: #0a0a12 deep navy-black
- Primary accent: #b8ff3c yellow-green
- Secondary: #3cffd4 cyan-mint
- Danger: #ff3c6e coral-red
- Warm: #ffb03c amber
- Surfaces: layered from #111120 → #1a1a28 → #222232

**Layout Paradigm:**
- Floating card grid with asymmetric column spans
- Sticky header with user avatar and streak
- Horizontal scroll for chip filters

**Signature Elements:**
1. Radial glow halos behind metric cards
2. Smooth SVG line charts with gradient fills
3. Pill badges with color-matched borders

**Interaction Philosophy:**
- Spring-based hover lifts on cards
- Smooth scroll within each screen section
- Animated progress bars on mount

**Animation:**
- Card hover: translateY(-3px) + box-shadow expansion
- Number counters animate up on screen enter
- Chat messages slide in from bottom

**Typography System:**
- Display: Unbounded Bold — hero numbers and titles
- Body: DM Mono — all supporting text
- Accent labels: 9-10px uppercase letter-spaced
</text>
<probability>0.08</probability>
</response>

<response>
<text>
## Idea C — Kinetic Sport HUD

**Design Movement:** Sports HUD / Military Tactical Display

**Core Principles:**
1. Information hierarchy through brightness — most important = brightest
2. Edge-to-edge layouts — bleed content to screen edges
3. Angular accents — clipped corners and diagonal dividers
4. Live data feel — blinking indicators, live badges

**Color Philosophy:**
- Background: #07070f ultra-dark
- Accent: #d4ff4d high-vis yellow-green
- Teal: #4dffcc signal teal
- Alert: #ff4d7a signal red
- Surfaces: #0f0f1a, #161622, #1d1d2a

**Layout Paradigm:**
- Full-bleed hero stats at top of dashboard
- Asymmetric two-column vitals grid
- Horizontal swipe-style navigation chips

**Signature Elements:**
1. Corner-clipped card borders (clip-path polygon)
2. Blinking "LIVE" dot on real-time data
3. Horizontal rule dividers with accent color

**Interaction Philosophy:**
- Tap feedback with brief scale pulse
- Swipe-like screen transitions
- Quick-reply chips animate in staggered

**Animation:**
- Staggered feed item entrance (animation-delay per item)
- Live dot: blink 1s infinite
- Screen transition: slide-left 0.25s ease

**Typography System:**
- Display: Unbounded ExtraBold — all metric values
- Mono: DM Mono — all UI chrome and labels
- Uppercase labels: 9px, 0.15em letter-spacing
</text>
<probability>0.07</probability>
</response>

---

## Selected Approach: **Idea A — Cyberpunk Terminal Fitness**

This most faithfully extends the original HTML's aesthetic while adding React-powered polish. The Unbounded + DM Mono pairing, lime-green-on-void palette, noise texture, and data-dense card layout are all preserved and elevated.
