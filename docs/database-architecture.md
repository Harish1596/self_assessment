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

Current environment: PostgreSQL is not listening locally and Docker's daemon is
not running. Dependency downloads and escalated actions are presently blocked by
an invalidated approval-service sign-in token. Continue preparing and checking
local changes; do not bypass that approval failure or claim database integration
was exercised without a running database.
