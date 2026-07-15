# Handoff: FitPlan — Strength & Endurance PWA

**For:** Claude Code
**From:** Claude.ai prototype session
**Artifact:** `training-plan.html` (v1 prototype, single self-contained file — ships alongside this doc)

---

## Kickoff prompt (paste this into Claude Code)

> Read `CLAUDE_CODE_HANDOFF.md` and `training-plan.html` in this directory. The HTML file is a working v1 prototype of a mobile fitness tracker (5-day strength/endurance plan + diet). Set up the project per the handoff doc, then implement Phase 1 (persistence + PWA). Keep it a zero-build, framework-free single-page app unless a phase explicitly says otherwise. Preserve the existing design tokens and UX exactly — this is an enhancement pass, not a redesign.

---

## Overview

A mobile-first workout + diet tracker for a beginner on a 3-lift / 5-active-day weekly program. Primary use context: **one-handed, mid-workout, in a gym, on an iPhone** — every interaction must survive sweaty thumbs and 30-second attention windows. Opened via Safari "Add to Home Screen."

The v1 prototype is complete and functional. The job now is hardening it into a real installable PWA with persistence and history.

## Current state (v1 — what already works)

- **Train tab:** Mon–Sun week strip (auto-selects today), per-exercise tappable set pills, rest-day checklists, per-day reset, contextual coaching notes.
- **Rest timer:** sticky bar above bottom nav; 1:30 / 2:00 / 3:00 presets; shows "GO!" at zero.
- **Diet tab:** expandable meal accordion with training-day/rest-day toggle (carb portions differ), 10-rules habit checklist.
- **Targets tab:** body-weight → kcal/protein/fat/carb calculator (maintenance ≈ bw×32 − 400 deficit; protein 1.8 g/kg; fat 0.9 g/kg; carbs remainder).
- **Storage:** a `save()/load()` adapter exists but only targets `window.storage` (a Claude-artifacts-only API). **In standalone Safari nothing persists** — this is the #1 gap.

## Design tokens (preserve exactly)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0F1420` | page background |
| `--surface` | `#1A2130` | cards |
| `--surface2` | `#212A3D` | inputs, pills, nested surfaces |
| `--line` | `#2A3346` | borders, dividers |
| `--text` | `#EAEEF6` | primary text |
| `--muted` | `#8B95A9` | secondary text |
| `--accent` | `#FFB224` | active day, badges, timer, calculated values |
| `--done` | `#3DDC84` | completed sets/checks, running timer |
| `--radius` | `14px` | card corner radius |

Type: **Oswald 500–700** (display/headings/nav, uppercase, `.02em` tracking) over the system stack for body. Touch targets ≥ 44px. Safe-area insets already handled (`env(safe-area-inset-*)`).

## Data model (current, in-memory `state` object)

```js
{
  sets:   { "mon-0-1": true, ... },   // "<dayId>-<exerciseIdx>-<setIdx>"
  checks: { "tue-c0": true, ... },    // rest-day / recovery checklist items
  rules:  { "r3": true, ... },        // diet habit rules
  bw:     "80",                       // calculator input
  diet:   "train" | "rest"            // meal template mode
}
```

Static content lives in `DAYS`, `MEALS`, `RULES` constants — keep content as data, never hardcode into markup.

---

## Roadmap

### Phase 1 — Persistence + installable PWA (do first)

1. **Storage adapter:** extend `save()/load()` to a three-tier fallback: `window.storage` (artifact) → `localStorage` (standalone Safari) → in-memory. Wrap everything in try/catch; Safari private mode throws on `localStorage.setItem`.
2. **Weekly auto-reset:** stamp state with an ISO week number; when the week rolls over, archive the old week's completion snapshot to a `history` array and clear `sets`/`checks` (keep `rules`, `bw`, `diet`).
3. **PWA:** add `manifest.json` (name, `#0F1420` theme/background, standalone display, icons — generate a simple barbell/plate icon as SVG→PNG 180/192/512), a service worker with cache-first for the app shell, and self-host or inline the Oswald font so it works fully offline. Keep single-file spirit: at most `index.html`, `sw.js`, `manifest.json`, icons.
4. **iOS meta:** `apple-touch-icon`, verify `black-translucent` status bar doesn't overlap the header on notched devices.

### Phase 2 — Logging that compounds

5. **Weight-per-set logging:** long-press (or a small "kg" affordance) on a set pill opens a minimal numeric input; store `{key, kg, reps, ts}`. Progression rule from the plan: top of rep range on all sets → suggest +2.5 kg upper / +5 kg lower next session — surface this as an inline hint on the exercise.
6. **Body metrics:** weekly body-weight and waist entries on the Targets tab; sparkline of the 7-day rolling average (waist is the belly-fat proxy per the plan).
7. **History view:** past weeks' completion % and lift progression, rendered with inline SVG — no chart library.

### Phase 3 — Polish

8. Timer improvements: `Notification`/`vibrate` where supported (no-op on iOS Safari, degrade silently), keep-awake via a muted looping video or Screen Wake Lock API where available.
9. Accessibility pass: convert div-based checklists to `role="checkbox"` + `aria-checked`, focus-visible styles, `prefers-reduced-motion` guard on transitions.
10. Optional: export/import state as JSON (share sheet) for device migration.

## Constraints & guardrails

- **No frameworks, no build step.** Vanilla JS, one HTML entry point. This must stay AirDrop-able.
- **Never lose user data:** any schema change needs a migration path from the existing state shape.
- **Offline-first:** after first load, zero network required.
- **Do not alter the program content** (exercises, sets/reps, meals, macro formulas) without being asked — it's a designed training plan, not placeholder copy.

## Edge cases to handle

- Private-mode Safari (storage throws) → fall back to memory, show a one-line notice.
- Timezone/DST week-rollover correctness for the weekly reset.
- Calculator: reject bw outside 30–300 kg (already done) — keep that validation on any new numeric inputs.
- Long exercise names on 320px-wide screens (SE) — pills must wrap, not overflow.
