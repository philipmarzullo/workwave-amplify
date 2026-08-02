# WorkWave Amplify — Pre-Conference Experience App

## What This Is

A pre-conference experience app for WorkWave Amplify (Jan 31 - Feb 3, 2027, New Orleans). Built to drive excitement and registration among customers before the event. Features an AI chat agent, persona-based session matching quiz, session browser, and easter egg game.

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS 3 |
| Backend | Node.js/Express (Claude API proxy + rate limiting) |
| AI | Claude Haiku 4.5 via `/api/chat` |
| Data | Static TypeScript seed data (no DB) |

## Project Structure

```
workwave-amplify/
├── render.yaml           # Render deployment config
├── frontend/             # React + Vite + Tailwind
│   └── src/
│       ├── data/         # Static seed data (sessions, tracks, personas)
│       ├── components/   # Reusable components
│       └── pages/        # Route pages (Home, Sessions, MyAgenda, FAQ, Partners, Travel)
└── backend/              # Express API proxy
    └── src/
        ├── server.js     # Express setup
        └── routes/
            └── chat.js   # Rate-limited Claude proxy
```

## Key Commands

- Frontend dev: `cd frontend && npm run dev`
- Backend dev: `cd backend && npm run dev`
- Build frontend: `cd frontend && npm run build`

## Branding

- Navy: `#0A1128`
- Purple (primary accent): `#8B3DFF`
- Blue: `#264BEE`
- Magenta (CTA/highlight): `#E8005E`
- White: `#FFFFFF`
- Headline font: Termina Bold (font-display)
- Body font: Inter Regular (font-sans)
- Track colors: Purple `#8B3DFF` (Joint), Magenta `#E8005E` (PestPac), Green `#22c55e` (RealGreen), Blue `#264BEE` (WinTeam)

## Backend

- Port: 10000 (Render default)
- `GET /health` — Health check
- `POST /api/chat` — Claude proxy with rate limiting (5/min, 50/day per IP, 500/day global)
- ANTHROPIC_API_KEY env var required

## Chat Agent

- 60-word hard limit per response
- `[REGISTER_NOW]` tag renders as CTA button
- Coy about the easter egg
- Knows all conference sessions and tracks

## Easter Egg

- "AMPLIFY Arcade" with an endless runner game: Service Dash
- Triggered from footer "Need a break?" link
- Service Dash: dodge industry hazards (pests 🪲, overgrowth 🌿, flashlights 🔦, toilets 🚽) while collecting ⭐. Arrow keys or tap to switch lanes, speed ramps up
- Tiers: Fleet Commander (2000+), Route Pro (1000+), Dispatcher (500+), Trainee (0+)
