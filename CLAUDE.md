# CLAUDE.md — Healthy Relationships

AI-assisted development guide for this project.

## Project Overview

**Healthy Relationships** is a real-time, Jackbox-style conflict resolution PWA for two people on their phones. No accounts — just 6-character room codes. Built with Next.js 16 (App Router, TypeScript), PartyKit (WebSocket real-time server), and Tailwind CSS v4.

Five evidence-based modes: Check In, Appreciate, Raise a Concern, Work Through It, Repair.

## Dev Setup

```bash
npm install

# Copy env (then edit if needed)
cp .env.local.example .env.local

# Run both servers together
npm run dev:all

# Or separately
npm run party:dev   # PartyKit WebSocket server on :1999
npm run dev         # Next.js on :3000
```

## Environment Variables

| Variable | Dev value | Prod value |
|---|---|---|
| `NEXT_PUBLIC_PARTYKIT_HOST` | `localhost:1999` | `healthy-relationships.<user>.partykit.dev` |

## Key Architecture

This app has **two servers**:

1. **Next.js frontend** (`app/`) — renders the UI, handles routing
2. **PartyKit server** (`party/index.ts`) — manages all room state via WebSockets

The frontend connects to the PartyKit server using `usePartySocket` (via `components/RoomProvider.tsx`). The PartyKit server is the source of truth for all room state. It broadcasts full `RoomState` to all connections on every state change.

### Room flow

1. Person A creates a room → gets a code (e.g. `BEAR42`)
2. Person B joins at `/join/BEAR42` → routed to `/room/BEAR42?role=listener`
3. Person A selects a mode; explainer screen shows for both
4. Person A starts session; step-by-step flow begins
5. Results shown at the end; can reset and try another mode

## Important Paths

| Path | Purpose |
|---|---|
| `party/index.ts` | PartyKit WebSocket server — all room logic lives here |
| `lib/types.ts` | All TypeScript types: `RoomState`, `ClientMessage`, `ServerMessage` |
| `lib/constants.ts` | `MODE_CONFIG`, `EMOTIONS`, `MODE_EXPLAINERS`, `getNextModeSuggestion` |
| `app/room/[code]/page.tsx` | Main room UI — screen router (mode + step + role → component) |
| `app/join/[code]/page.tsx` | Join shortcut — redirects to `/room/[code]?role=listener` |
| `components/RoomProvider.tsx` | `usePartySocket` context + message handling |
| `components/screens/` | One component per screen/step |
| `components/ui/` | Reusable UI primitives (Button, TextArea, ProgressDots, etc.) |
| `app/globals.css` | Tailwind v4 CSS-first config + theme tokens |

## Coding Conventions

### Message types

All client → server messages are typed in `lib/types.ts` as `ClientMessage`. All server → client messages are typed as `ServerMessage`. Keep these exhaustive and discriminated.

### Adding a new mode

1. Add mode steps to `MODE_STEPS` in `party/index.ts`
2. Add mode config (label, description, steps list) to `MODE_CONFIG` in `lib/constants.ts`
3. Add mode explainer to `MODE_EXPLAINERS` in `lib/constants.ts`
4. Add step handling in `party/index.ts` (`onMessage` switch)
5. Add screen components in `components/screens/`
6. Add cases to the screen router in `app/room/[code]/page.tsx`

### Styling

- Tailwind v4 (CSS-first config) — no `tailwind.config.js`
- Theme tokens are CSS custom properties in `app/globals.css`
- Dark mode is supported via `dark:` variants
- Use existing primitives (`Button`, `TextArea`, `ProgressDots`, `ScreenTransition`) before creating new ones

### State machine

The PartyKit server (`party/index.ts`) is a simple state machine. `RoomState.step` drives which screen is shown. `MODE_STEPS[mode]` defines the ordered step array for each mode. The server advances the step on `submit-step` messages.

## Restrictions

- **Do NOT auto-commit or push** without explicit user instruction
- **Do NOT modify `.partykit/state/` files** — these are local dev state snapshots
- **Do NOT change the `name` field in `partykit.json`** — it is the deploy identifier for PartyKit Cloud
- **Do NOT add accounts, auth, or persistent storage** — the app is intentionally ephemeral

## Deployment

```bash
# Deploy PartyKit server (requires PARTYKIT_TOKEN env var or partykit login)
npm run party:deploy

# Next.js deploys automatically via Vercel GitHub integration
# Set NEXT_PUBLIC_PARTYKIT_HOST in Vercel environment variables
```

A GitHub Actions workflow (`.github/workflows/deploy-partykit.yml`) auto-deploys the PartyKit server on every push to `main`. It requires a `PARTYKIT_TOKEN` secret in the GitHub repo settings.
