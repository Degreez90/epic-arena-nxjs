# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server on port 3001
npm run build            # Production build
npm run lint             # ESLint (next/core-web-vitals only)
npm run prisma:push      # Push schema to DB (no migrations)
npm run prisma:generate  # Regenerate Prisma client
npm run prisma:studio    # Open Prisma Studio GUI
npm run db:update        # prisma:push + prisma:generate

# Seed/clean dummy data (uses tsx, needs DATABASE_URL in .env)
npx tsx scripts/seed-all-dummy-data.ts    # 30 users, 4 games, 8 tournaments
npx tsx scripts/clean-all-dummy-data.ts   # Remove all dummy data
npx tsx scripts/reset.tsx                 # Interactive table reset
```

> **Note:** `npm install` auto-runs `prisma generate` via the `postinstall` hook. There are no tests, no CI pipeline, and no Prettier config.

## Architecture

**Epic Arena** — a Next.js 15 (App Router) tournament bracket management app for esports/gaming. Stack: TypeScript strict mode, PostgreSQL (Neon) via Prisma 5, NextAuth v5 beta (JWT), shadcn/ui + Tailwind CSS, Zustand for client state.

### Route Groups

| Group | Pages | Layout |
|---|---|---|
| `(auth)` | `/login`, `/register`, `/new-verification` | Centered gradient card |
| `(protected)` | `/additionalinfo`, `/settings` | Centered gradient card |
| `(root)` | `/` (home) | Inherits root layout |

Top-level pages outside groups: `/dashboard`, `/tournaments`, `/tournaments/new`, `/tournaments/[id]`.

### Auth (NextAuth v5 beta)

- **`auth.ts`** — combines `auth.config.ts` (Google OAuth + Credentials provider) with PrismaAdapter, signIn callback (email verification + 2FA enforcement), and JWT callback (attaches user fields to token).
- **`routes.ts`** — route classification constants (`authRoutes`, `privateRoutes`, `DEFAULT_LOGIN_REDIRECT`, etc.).
- **`middleware.ts`** — **currently a no-op pass-through.** All auth-guarding logic is commented out. Auth is enforced at the page/server-action level instead.
- Registration flow: `actions/auth/register.ts` → Zod validation → bcrypt hash → Prisma create → Mailgun verification email.
- Use `auth()` from `auth.ts` for server-side session access; `useCurrentUser()` hook for client-side.

### Bracket System (`brackets-manager`)

The tournament bracket engine is the `brackets-manager` library. Its storage is handled by **`lib/MyDB.ts`** — a custom `CrudInterface` implementation that stores bracket data (stage, group, round, match, match_game, participant) as **JSON arrays in the `Tournament` Prisma model**. This avoids a separate relational table-per-entity design; every CRUD operation on bracket entities reads/writes the entire JSON blob.

Key files:
- **`lib/MyDB.ts`** — Custom storage adapter. `MyDB.build(tournamentId)` loads tournament JSON into memory; all mutations call `saveTournament()` which does a `prisma.tournament.update`.
- **`data/Tournaments/tournaments.ts`** — Data layer: CRUD for tournaments, plus bracket-manager wrappers (`getTournamentManager`, `getTournamentParticipants`, `getTournamentMatches`, `updateTournamentMatch`, `getStageBracket`, etc.).
- **`lib/bracketHelpers.ts`** — ~660 lines of bracket utilities: structure building, standings, BYE resolution, best-of series scoring.
- **`data/Tournaments/dataProcessors.ts`** — Transforms raw bracket-manager data into organized UI models (nesting matches→rounds→groups→stages, adding participant names).

### Data Flow

```
Client Component → Server Action (actions/) → data/ functions → Prisma
                  → API Route (app/api/)    → data/ functions → Prisma
                                              → MyDB (for bracket ops)
```

- **`actions/`** — Server actions for mutations (auth, tournament CRUD, score reporting, game management). Auth checks happen here.
- **`data/`** — Prisma queries. Functions in `data/Tournaments/tournaments.ts` are the single source for tournament DB access.
- **`schemas/`** — Zod validation schemas for forms and API inputs (`CreateTournamentSchema`, `reportScoreSchema`, `RegisterSchema`, etc.).
- **`store/useTournamentStore.ts`** — Zustand store for tournament UI state (loading, error, match score dialog).

## Key Patterns & Gotchas

- **Mongoose → Prisma migration in progress.** The project has both Mongoose models (`models/`) and Prisma models. `lib/token.ts` still uses Mongoose for token operations (verification, password reset, 2FA). New code should use Prisma exclusively.
- **Redux is declared but unused.** `store.ts` has an empty reducer. The actual client state manager is **Zustand** (`store/useTournamentStore.ts`).
- **Middleware is disabled.** No route protection at the middleware level. Protect routes via auth checks in server actions and page-level `auth()` calls.
- **Two database URLs required.** Neon serverless requires both `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) for Prisma migrations.
- **Dockerfile CMD is broken.** Uses `node run dev` — should be `npm run dev`. Also, `docker-compose.yaml` references a nonexistent `Dockerfile.dev`.
- **Dashboard uses hardcoded mock data** (stats are not fetched from the API).
- **Path alias `@/*`** maps to the project root (e.g., `@/lib/prisma`, `@/components/ui/button`).
