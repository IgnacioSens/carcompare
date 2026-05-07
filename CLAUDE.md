# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CarCompare is a Portuguese-language web platform for searching, filtering, and comparing cars side-by-side. All UI text, comments, and variable names are in Portuguese.

## Commands

### Running with Docker (full stack)
```bash
# From project root — requires .env file copied from .env.example
docker compose up --build
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001/api/health
```

### Running without Docker (recommended when using Supabase)
```bash
# Backend
cd backend && npm run dev       # nodemon, port 3001

# Frontend
cd frontend && npm run dev      # Vite, port 5173

# Frontend build
cd frontend && npm run build
```

There are no test scripts configured in either package.json.

## Architecture

### Monorepo structure
Two independent Node projects (`backend/`, `frontend/`) plus a `docker-compose.yml` at root. Each has its own `package.json` and `Dockerfile`.

### Backend (`backend/`)
- **ES Modules** (`"type": "module"`) — use `import/export`, not `require`.
- Entry point: `src/server.js` — loads `dotenv/config` on line 1, then sets up Express with CORS and JSON.
- Database: `src/config/database.js` — `pg.Pool` reading `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` from env. **No SSL configured** — connecting to Supabase requires adding `ssl: { rejectUnauthorized: false }` to the Pool options.
- Only one endpoint exists: `GET /api/health`. The `routes/`, `controllers/`, `models/`, `middlewares/` directories are planned but not yet created.
- Installed but not yet wired up: JWT auth (`jsonwebtoken`, `bcryptjs`), email (`nodemailer`), external HTTP (`axios` for FIPE API).

### Frontend (`frontend/`)
- React 18 + Vite + React Router v6 + Tailwind CSS.
- Routes defined in `src/App.jsx`: `/` (Home), `/catalogo` (Catalog), `/carros/:id` (Detail), `/comparar` (Compare), `/design-system`.
- **All pages currently use hardcoded mock data** — no real API calls have been implemented yet.
- Vite dev proxy (`vite.config.js`): `/api/*` → `http://backend:3001`. This hostname (`backend`) only resolves inside Docker. For local dev without Docker, the proxy target must be changed to `http://localhost:3001`.
- Reusable UI components in `src/components/ui/` (Button, Badge, SpecCard, CarCard, Input, Select) and `src/components/layout/` (Layout, Navbar), each folder exported via `index.js`.

### Environment variables
- Template: `.env.example` at project root.
- For direct dev (no Docker): create `backend/.env`. For Docker: create `.env` at project root.
- `docker-compose.yml` hardcodes `DB_HOST: db` in the backend service block — this overrides any `.env` value, so Docker always points to the local PostgreSQL container regardless of what is in `.env`.

### Database
- PostgreSQL via `pg` library.
- Docker Compose spins up a `postgres:16-alpine` container named `carcompare_db`.
- To use Supabase instead: run the backend directly (not via Docker), set Supabase connection details in `backend/.env`, and add SSL to the Pool config in `src/config/database.js`.
- No schema migrations or seed files exist yet.

## Planned features (dependencies installed, not yet implemented)
- JWT authentication and bcrypt password hashing
- Nodemailer contact email
- Saved favorites
- FIPE API integration for vehicle data
