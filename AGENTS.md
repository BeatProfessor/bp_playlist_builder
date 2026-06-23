# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

BP Playlist Builder — a Spotify playlist generator for DJs. Two modes: manual filters (genre, year, BPM) and natural-language prompts (powered by Claude API). Stack: vanilla HTML/CSS/JS frontend, Vercel serverless functions backend, Spotify Web API + GetSongBPM API for music data.

See `docs/module-0-decisions.md` for full design decisions.

### Development commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (runs on port 3000) |
| Lint | `npm run lint` |
| Lint fix | `npm run lint:fix` |
| Tests | `npm test` |

### Key notes

- `npm run dev` uses a lightweight local Node.js server (`dev-server.js`) that serves `public/` for static files and dynamically loads `api/*.js` handlers. This works without Vercel authentication.
- `npm run dev:vercel` uses the Vercel CLI for local dev (requires `vercel login` first — not available in cloud agent VMs).
- API routes live in `api/` and export a default `handler(req, res)` function matching Vercel's serverless convention.
- Frontend files live in `public/`. Browser globals (`document`, `window`, etc.) are configured in `eslint.config.js` for the `public/` directory.
- Environment variables for external APIs are documented in `.env.example`. The app will run without them (health check works), but Spotify/GetSongBPM/Claude integration requires real keys.
