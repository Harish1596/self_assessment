# Database-backed Recall

## Scope and decisions

The user requested durable storage for an expanding library and all flashcard
session answers/status. PostgreSQL is the proposed database. Multiple acceptable
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
