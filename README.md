# Recall

A personal computer science knowledge library with source references and self-assessed flashcards. Built with React, TypeScript, Vite, a local Node.js API and PostgreSQL. No account or API key required.

## Run locally

Use Node.js 22.19+ and Docker Desktop. Start Docker before the database commands.

```sh
npm ci
cp .env.example .env
npm run db:start
npm run db:seed
npm run dev:api
```

In a second terminal:

```sh
npm run dev
```

Open http://127.0.0.1:5173. Keep both terminals running. Vite proxies `/api` to
`127.0.0.1:3001`; PostgreSQL listens on `127.0.0.1:54329`. Server-only credentials
are in `.env`, which Git ignores. If you change the database port or password,
update `DATABASE_URL` to match. For an API port change, set `RECALL_API_TARGET`
when running Vite (for example `http://127.0.0.1:3005`).

`db:seed` applies versioned migrations and imports the bundled foundation content
once. Repeating it does not reset progress or overwrite existing seeded content.
The API also applies pending migrations at startup. Docker stores data in the
`recall_recall_postgres` named volume. `docker compose stop db` preserves it.
Deleting that volume removes the database.

```sh
npm test          # Domain, content, validation, PostgreSQL repositories and HTTP
npm run build    # TypeScript checking and production browser bundle
npm run preview  # Preview bundle; keep the API running
npm run test:e2e # Starts isolated API/Vite servers; PostgreSQL must be running
```

Browser tests use installed Google Chrome (`channel: 'chrome'` in
`playwright.config.ts`). Alternatively, remove that setting and install Playwright
Chromium with `npx playwright install chromium`. Tests use ports 5174/3002 and a
separate disposable `recall_e2e` database on the configured PostgreSQL server;
they reset only that database's assessment progress. The configured PostgreSQL
user must be able to create this test database. Unit/repository tests use embedded
PostgreSQL (PGlite), and HTTP tests need permission to bind a loopback port.

The API and database bind to loopback for personal use. Public hosting, accounts
and cross-device sync are outside the current scope. A database failure produces
an error; there is no silent fallback to temporary browser-only saves.

## Included

- 87 introductory concepts and 438 questions across 11 fields, starting with what a computer does and how programs work.
- A searchable library with field and read/unread filters, worked examples, important caveats, source links and related questions.
- Single-field, multiple-field and randomly selected-field assessments. Questions are shuffled without repetition; short pools use only the available questions. Mixed sessions include one question per selected field when the session length and available pool permit.
- Answer reveal, saved written responses, three self-assessment ratings, session results and retrying questions that need revision.
- Written recall with one or several accepted answers, single-choice and multiple-correct-choice cards. Choice grading uses the exact correct set; written answers remain self-assessed. The existing foundation bank contains written-recall cards.
- Database-backed read progress, latest ratings and complete session records: card order/revisions, written answers, selected choices, reveal state, timestamps and active/paused/completed/abandoned status.
- Session history with resume after reload, pause/resume and review of previous answers. Opening an explanation or the library preserves practice state.
- JSON export/import of latest progress, with validation and confirmation before replacement. Historical sessions remain intact. Existing browser progress migrates automatically without deleting its original copy.

## Your data

The local PostgreSQL database is the source of truth for library content, sources,
read progress, ratings and session history. Browser storage is used only to read
legacy progress for migration. Migration merges once per backup content hash;
failed migration preserves the original browser data and shows an error.

Ratings save immediately. Written drafts save after a short pause in typing;
reveal also saves the current response before displaying the answer. Wait for
“Session saved” before closing the browser. Unsaved drafts trigger the browser's
leave warning where supported. On a save failure, the typed response remains
available with a retry action. Exact retries after a lost save acknowledgement
are safe; conflicting edits from another tab require reloading saved state. Navigating to the library preserves the draft.
Answers lock after reveal. Completed and ended sessions stay in history, with
snapshots of their original cards even if the library changes later.

The sidebar Export/Import buttons handle version-1 **progress only** (read state
and latest ratings), retaining compatibility with older backups. They do not
back up content or session answers. Import confirms replacement of latest
progress, validates before writing, and retains all historical sessions.

For a **full backup**, including content and session answers, use PostgreSQL's
standard tools. With the supplied local Compose configuration:

```sh
docker compose exec -T db pg_dump -U recall -d recall -Fc > recall-full.dump
```

Keep the dump outside the repository. To inspect its table of contents without
restoring or changing data:

```sh
docker compose exec -T db pg_restore -l < recall-full.dump
```

Restoring a database is a separate operation: target a new database first and
verify it before replacing existing data. No automatic restore or sync is included.

Text and fonts are bundled locally, and normal use does not call external AI or
content services. Source links open external websites. Keep the local web server,
API and database running to use Recall; this is not an installable offline PWA.

## Content

`src/seed-data.ts` assembles the initial catalogue from `src/content/` for explicit database seeding and integrity tests. The browser loads its catalogue from the API via `src/data.ts`. Field metadata lives in `fields.ts`; `initial.ts` retains the original entries; the computer, programming and core foundations modules hold the expansion. Each entry includes a stable ID, field, title, summary, explanation, example, takeaway, sources and a variable number of focused question/answer pairs. Initial cards are derived from the entries so they stay linked to their explanations. New structured catalogues can be merged through `POST /api/catalogue`; see [database architecture](docs/database-architecture.md). Fields are database records, so adding a field requires no TypeScript enum change. A future Markdown processor can target this import contract. Content imports are currently available through the API, without a dedicated editor UI.

Keep IDs stable to preserve saved history. Question IDs depend on their position within an entry: append questions rather than reordering or repurposing existing ones. The original 48 questions retain their IDs and meanings; earlier progress backups remain compatible. Tests check integrity across every entry, coverage of the foundation fields, data-driven counts and a snapshot of the original questions. Update documented inventory totals when expanding content; the current totals are not limits.

The bank is intended for engineering foundations regardless of experience level. It includes definitions, distinctions, small examples and common misconceptions. Difficulty tiers remain deferred.

| Field                | Concepts | Questions |
| -------------------- | -------: | --------: |
| Computer basics      |        8 |        50 |
| Data representation  |        7 |        37 |
| Logic & mathematics  |        7 |        35 |
| Programming basics   |       12 |        60 |
| Data structures      |        7 |        33 |
| Algorithms           |        8 |        38 |
| Operating systems    |        9 |        41 |
| Networking           |        8 |        38 |
| Databases            |        9 |        44 |
| Software engineering |        6 |        32 |
| Security basics      |        6 |        30 |

The notes are original introductory summaries, not verbatim reproductions or a live scraping feed. Source links were checked on 7 November 2026. Ratings are self-assessments, not automated grading or proof of mastery. Difficulty levels and language/framework-specific collections are intentionally deferred.

## Structure

`src/content/` and `src/seed-data.ts` own the initial teaching notes and question
bank. `src/data.ts` holds the API catalogue installed before the app mounts.
`App.tsx` coordinates navigation, acknowledged saves and draft persistence;
`Library.tsx` handles discovery; `components.tsx` provides the reader;
`Flashcards.tsx` provides setup, practice, history and results. `domain.ts` owns
selection and progress validation; `shared/` defines persistence contracts and
answer validation. `server/` owns HTTP handlers, transactional repositories,
seeding and SQL migrations. See [database architecture](docs/database-architecture.md)
for API and storage boundaries.

The implementation scope is recorded in `docs/design.md` and `docs/plan.md`. The generated visual reference is in `docs/reference/recall-concept.png`.

The clarified absolute-basics scope and expansion approach are recorded in `docs/foundations-expansion.md`.
