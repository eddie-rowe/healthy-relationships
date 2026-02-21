# Healthy Relationships

**Evidence-based conflict resolution — no accounts needed.**

A real-time, Jackbox-style PWA for two people on their phones. One person creates a room and shares the code; the other joins. No sign-up, no install, no friction.

## What it is

Five guided conversation modes, grounded in Gottman Method, Nonviolent Communication (NVC), and Imago Relationship Therapy:

| Mode | Purpose |
|---|---|
| **Check In** | Share how you're feeling and feel heard |
| **Appreciate** | Express genuine appreciation and receive it |
| **Raise a Concern** | Share something bothering you with structure and care |
| **Work Through It** | Deep listening — each person speaks and is mirrored |
| **Repair** | After a conflict — process feelings, share realities, take responsibility |

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Real-time**: [PartyKit](https://partykit.io) (WebSocket server, edge-deployed)
- **Animations**: Framer Motion
- **Hosting**: Vercel (frontend) + PartyKit Cloud (real-time server)

## Getting Started

```bash
# 1. Clone and install
git clone https://github.com/your-username/healthy-relationships.git
cd healthy-relationships
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local if needed (defaults work for local dev)

# 3. Start both servers
npm run dev:all
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Dev | Prod |
|---|---|---|
| `NEXT_PUBLIC_PARTYKIT_HOST` | `localhost:1999` | `healthy-relationships.<user>.partykit.dev` |

## Project Structure

```
healthy-relationships/
├── app/
│   ├── page.tsx              # Landing page
│   ├── join/[code]/          # Join shortcut → /room/[code]?role=listener
│   └── room/[code]/          # Main room UI (screen router)
├── components/
│   ├── screens/              # One component per conversation step
│   └── ui/                   # Reusable primitives (Button, TextArea, etc.)
├── lib/
│   ├── types.ts              # RoomState, ClientMessage, ServerMessage
│   └── constants.ts          # MODE_CONFIG, EMOTIONS, explainers
├── party/
│   └── index.ts              # PartyKit WebSocket server (all room logic)
└── .github/workflows/        # CI/CD
```

## Deployment

### PartyKit (real-time server)

```bash
# Authenticate once
npx partykit login

# Deploy
npm run party:deploy
```

This deploys to `healthy-relationships.<your-username>.partykit.dev`. A GitHub Actions workflow (`.github/workflows/deploy-partykit.yml`) auto-deploys on every push to `main` — add a `PARTYKIT_TOKEN` secret to your GitHub repo to enable it.

### Next.js (frontend)

Deploy to [Vercel](https://vercel.com) — connect your GitHub repo and it deploys automatically. Set the `NEXT_PUBLIC_PARTYKIT_HOST` environment variable to your PartyKit URL.

## Contributing

This project uses AI-assisted development. See [`CLAUDE.md`](./CLAUDE.md) for architecture notes, coding conventions, and restrictions relevant to working with Claude or other AI tools.
