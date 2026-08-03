# WorkWave Amplify — Pre-Conference Experience App

## What This Is

A pre-conference experience app for WorkWave Amplify (Jan 31 - Feb 3, 2027, New Orleans). Built to drive excitement and registration among customers before the event. Features an AI chat agent, persona-based session matching quiz, session browser, and easter egg game.

## Architecture

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS 3 |
| Backend | Node.js/Express (Claude API proxy + rate limiting) |
| AI | Claude Haiku 4.5 via `/api/chat` |
| Data | Static TypeScript seed data + JSON file persistence for poll/logs |

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
- `POST /api/chat` — Claude proxy with rate limiting (5/min, 50/day per IP, 500/day global), logs interactions to `backend/data/chat-logs.jsonl`
- `GET /api/poll` / `POST /api/poll` — Live poll with persistent JSON storage in `backend/data/poll.json`
- ANTHROPIC_API_KEY env var required

## Chat Agent (Ask WAIve)

- Branded as "Ask WAIve" — WorkWave's AI assistant
- WAIve mark icon (sparkle) used across chat FAB, header, welcome, FAQ, and home CTA
- 60-word hard limit per response
- `[REGISTER_NOW]` tag renders as CTA button
- Coy about the easter egg
- Knows all conference sessions and tracks
- Idle nudge popup after 25s on site (once per session) to drive engagement
- All interactions logged to `backend/data/chat-logs.jsonl` for marketing insights (IP hashed)

## Agenda Results

- AI-style summary above session list: describes what was matched, highlights track/interest breakdown
- "Don't miss these extras" section suggests bootcamps, Meet the Experts, Wavelytics, and AI sessions the user didn't select
- Top 10 scored sessions grouped by day with export options (ICS, PDF, email, Google Cal)

## Easter Egg

- "AMPLIFY Arcade" with an endless runner game: Service Dash
- Triggered from footer "Need a break?" link
- Service Dash: 3-lane endless runner, dodge industry hazards, collect power-ups
- 20 obstacle types unlocked progressively by score (pest, lawn, security, janitorial)
- Power-ups: ⭐ points, 💵 2x multiplier, 🧤 shield, 🏆 big points, ☕ invulnerability
- Special mechanics: 🦨 fog overlay, 😴 sluggish controls, 🦝 dodgy lane-switching
- Fast movers: 🐀, 🪳, 🕷️, 🦟 — move faster than normal obstacles
- Arrow keys or tap to switch lanes, speed ramps up, 3 lives
- Tiers: Fleet Commander (2000+), Route Pro (1000+), Dispatcher (500+), Trainee (0+)
