# 🏋️ Workout Log

A full-stack workout tracker with an AI coach. Log your workouts, and they're
saved to a real database so they survive refreshes and restarts. An AI coach —
powered by Claude — reads your actual training history and answers questions
like _"what muscle group have I been skipping?"_ or _"suggest a workout for today."_

Built for Internship Assignment 2.

**Live site:** _(add your Vercel URL here after deploying)_

---

## What it is

- **Log workouts** — exercise, muscle group, sets, reps, weight, notes.
- **Full CRUD** — create, view the list, view one, edit, and delete workouts.
- **AI Coach** — a chat that **streams** its answers, **remembers** the
  conversation, and **knows your data** (it's given your real workouts).
- **Dark athletic UI** with faint background art (my own anime drawings).

## Tech stack

| Tool | Role |
|---|---|
| **Next.js (App Router) + React + TypeScript** | The web framework and UI |
| **Tailwind CSS** | Styling |
| **PostgreSQL (Neon)** | The database where workouts are stored |
| **Prisma 7** | Talks to the database with type-safe code (+ the `pg` driver adapter) |
| **Claude API (`@anthropic-ai/sdk`)** | The AI coach (streaming, model: `claude-haiku-4-5`) |
| **Vercel** | Hosting |

## Pages

- `/` — list of all workouts (Read)
- `/new` — form to add a workout (Create)
- `/workout/[id]` — one workout's detail, with Edit and Delete (Read one / Update / Delete). Dynamic route; shows a 404 page if the id doesn't exist.
- `/coach` — the AI coach chat

---

## Running it locally

**Prerequisites:** Node.js 20+ and a free [Neon](https://neon.tech) Postgres database.

1. **Clone and install**
   ```bash
   git clone https://github.com/Zman95/workout-log.git
   cd workout-log
   npm install
   ```

2. **Set environment variables.** Create a file named `.env` in the project root:
   ```bash
   DATABASE_URL="your-neon-postgres-connection-string"
   ANTHROPIC_API_KEY="your-claude-api-key"
   ```
   `.env` is git-ignored — it is never committed.

3. **Set up the database** (creates the `Workout` table):
   ```bash
   npx prisma migrate dev
   ```

4. **Run it**
   ```bash
   npm run dev
   ```
   Open <http://localhost:3000>.

Handy: `npx prisma studio` opens a visual browser of the database.

## Environment variables

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Postgres connection string from Neon. A secret — it's a password to all the data. |
| `ANTHROPIC_API_KEY` | Claude API key for the AI coach. |

Both live in `.env` locally and in **Vercel's environment settings** in
production. Neither is ever sent to the browser — the AI and database are only
ever touched by server code.

---

## What I'd add with more time

- **Auth** so each user has their own private workouts (e.g. Clerk).
- **Search/filter** on the list (by exercise or muscle group).
- **Charts** — volume per muscle group over time.
- **Tool use** — let the coach log a workout for me, not just talk about it.

## What broke and how I fixed it

**Prisma 7 wouldn't connect to the database at runtime.** My first version just
did `new PrismaClient()` like older tutorials show, and every database call
failed. Prisma 7 changed how connections work: for SQL databases you now have to
pass a **driver adapter**. I installed `@prisma/adapter-pg` and `pg`, then
created the client with
`new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })`.
After that the connection worked. I found this by reading the actual error and
the Prisma 7 upgrade notes instead of guessing.

A smaller one: after adding my API key to `.env`, the AI still failed — because
the dev server only reads `.env` at startup. Restarting it fixed it.
