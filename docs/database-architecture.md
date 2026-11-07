# Database-backed Recall

## Scope and decisions

The user requested durable storage for an expanding library and all flashcard
session answers/status. PostgreSQL is the database. Multiple acceptable
written answers and single-/multiple-correct selectable choices are independent
of database choice; the model supports both. Existing content and card IDs must
remain stable. This remains a personal, local application without public hosting
or accounts. The API binds to loopback; deploying it publicly requires identity
and access control first.

## Boundaries

- React renders a catalogue fetched from an HTTP API, not bundled seed data.
- Shared contracts define fields, concepts, cards, session state and responses.
- API handlers validate requests and call a service/repository layer.
- PostgreSQL migrations own schema changes; explicit idempotent seeding imports
  the current catalogue and does not overwrite content on every server restart.
- A catalogue import endpoint accepts structured content with stable IDs, allowing
  Markdown processing to be added independently later. This task does not invent
  the final Markdown parser or generate more learning material.

## Persistent records

Fields contain knowledge entries; entries retain explanations, examples,
takeaways and sources. Flashcards have stable IDs and immutable revisions.
Each revision defines its prompt, accepted answer bodies and optional choices
with stable choice IDs and correctness. Content updates create revisions; they
do not rewrite previous session items. Fields are data, not a TypeScript enum.

Sessions retain selection mode, requested/chosen fields, ordered cards, creation
and update times, progress and lifecycle status. Each item snapshots the card's
revision, question, answer alternatives and choices. Responses retain written
text, selected choices, reveal state, self-rating and timestamps. Active sessions
can resume after a browser reload. Finished or abandoned sessions remain in
history. Draft writes and ratings must be acknowledged before reporting saved.

Read progress and latest ratings remain available for existing library filters
and weak-question practice, backed by persistent session history. Importing old
browser backups preserves available information without inventing missing typed
answers or past sessions. Browser data is not deleted on a failed migration.

## Validation and concurrency

Use parameterised SQL, foreign keys, uniqueness and state constraints. Session
mutations use transactions, optimistic versions and idempotent review operations.
Reject unknown/out-of-session choice IDs, invalid ratings, rating-before-reveal,
stale writes and modifications to finished sessions. Never claim an answer is
saved after a failed request. Correct selectable answers use exact set equality;
written recall remains explicitly self-assessed.

## Delivery subsections

1. Commit schema, shared contracts and repository/migration foundations after
   appropriate validation.
2. Commit tested catalogue, progress and session APIs plus local run tooling.
3. Commit the client integration, resumable session/history UI and legacy migration.
4. Verify full-stack persistence, answer alternatives/choices, restart/resume,
   invalid requests and old progress compatibility; update docs and commit fixes.

## Backend tooling

Run `npm run db:start`, then `npm run db:seed` to migrate and explicitly import
87 concepts and 438 existing cards. Seeding is idempotent and does not reset
progress. `npm run dev:api` runs the API on `127.0.0.1:3001`. Optional `.env`
settings are documented in `.env.example`; database credentials are server-only.

The API provides `GET /api/bootstrap`, `GET /api/sessions/:id`,
`POST /api/sessions`, `PATCH /api/sessions/:id`, `PUT /api/read/:id`,
`POST /api/progress/import` and `POST /api/catalogue`. Catalogue imports merge
stable IDs and append changed card revisions; omitted records remain available.
Request validation happens before content writes; imports and session changes
run in database transactions. Progress imports replace latest read/rating state
without deleting historical sessions. Legacy imports merge once per content hash.

`npm test` exercises the migration and repositories against embedded PostgreSQL
(PGlite), including revision immutability, draft persistence, exact-set choice
grading, optimistic concurrency, idempotent ratings, lifecycle transitions and
legacy imports. HTTP tests bind a temporary loopback port. PostgreSQL 17 Docker
migration and repeat seeding were also exercised successfully.

## Client integration and recovery

The browser installs its catalogue before mounting the app; `src/seed-data.ts`
is absent from the production browser bundle. Local legacy progress is imported
idempotently without deleting the original data. Typed drafts stay in application
state while browsing the library, save after 500 ms, and are included in reveal
requests. Save acknowledgements control the visible saved status. Responses lock
after reveal; ratings commit before advancing to the next item. API requests have
a 15-second timeout. Exact draft/reveal/rating retries do not duplicate saves after
a lost acknowledgement. A reload action recovers from conflicting tab versions,
with confirmation before discarding a local unsaved draft.

History retains all session summaries and prioritises an active session. The
personal database is separate from the browser-test database. Desktop/mobile
browser tests exercise accepted-answer alternatives, multiple-correct selections,
read progress, reload/resume, pause/resume, historical answers, legacy migration,
progress backup round-trips and failed-save recovery. Card content is versioned;
this initial implementation does not version entire explanatory articles.

## Verification completed

- 25 domain, content, answer-validation, repository and HTTP tests pass.
- Five desktop/mobile browser flows pass against PostgreSQL 17 in the isolated
  `recall_e2e` database; production TypeScript checking and Vite build pass.
- Repeat seeding preserves the original 87 concepts / 438 cards.
- A paused test session and written response survive a real PostgreSQL restart
  with identical order, status, revision snapshots and timestamps.
- The documented `pg_dump` command produced a custom-format archive whose table
  of contents was readable with `pg_restore -l`; a full restore was not exercised.
- The personal app proxy returns 11 fields, 87 concepts and 438 cards, while the
  browser fixtures and restart probe remain isolated from personal progress.
- The earlier layout-transition finding is already resolved: progress indicators
  animate `transform` rather than width. No design suppressions were added.
