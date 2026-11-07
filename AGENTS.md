# Agent instructions

## Project purpose and scope

Recall is a personal learning app with two connected parts: a knowledge library
with source references and flashcards for self-assessment. The current scope is
basic computer science fundamentals. Difficulty levels and language/framework
collections are deferred until requested.

Keep normal reading and practice independent of external services. Discuss adding
accounts, a backend, runtime AI, or cross-device synchronisation before changing
the architecture. See [README.md](README.md) for setup and current behaviour and
[docs/design.md](docs/design.md) for the initial design decisions.

## Architecture and ownership

The app uses React, TypeScript and Vite, with browser-local progress storage.

- `src/data.ts`: fields, knowledge entries, sources and derived flashcards.
- `src/types.ts`: shared content, session and progress types.
- `src/domain.ts`: session selection, backup validation and progress loading.
- `src/App.tsx`: navigation, progress updates and backup import/export.
- `src/Library.tsx`: searching and filtering the library.
- `src/components.tsx`: article reader and shared field icons.
- `src/Flashcards.tsx`: assessment setup, active sessions and results.
- `src/styles.css`: shared visual system and responsive layouts.

Keep selection and validation logic in the domain layer rather than duplicating
it in UI components. Treat `dist/` as generated output; edit source files instead.

## Knowledge content

Each entry must include a field, stable ID, title, summary, explanation, concrete
example, takeaway, source links and related question/answer pairs. Write original,
accurate summaries and verify that the linked sources support the explanation.
Prefer primary documentation and educational references. Do not fabricate sources
or claim a source was checked without actually checking it.

Preserve concept and question IDs because saved progress refers to them. Question
IDs currently depend on the concept ID and question position: reordering or
repurposing questions can attach old assessments to different content. Handle
these changes explicitly, including compatibility or migration where needed.

When adding content, update inventory assertions in `src/domain.test.ts` and any
documented counts. Do not treat the initial inventory size as a permanent limit
or remove integrity checks merely to make an expansion pass.

## Assessment behaviour

Preserve single-field, multiple-field and random-field sessions. Single-field
sessions stay within one chosen field; multiple-field sessions stay within the
selected fields; random-field sessions choose fields as well as shuffle questions.
Include each selected field when the session length and eligible pool permit.

Do not repeat questions within a session. Short pools use the available questions
without padding with duplicates. Reveal the expected answer before allowing a
rating. Ratings are self-assessments, not automated grading or proof of mastery.
Opening a library explanation must preserve the active assessment.

## Progress and backups

Save completed ratings immediately and preserve existing progress when an import
is invalid. Validate backup structure, version, IDs and rating values before use;
confirm before replacing progress. Surface storage failures to the user.

Treat storage keys and backup schemas as compatibility contracts. Provide an
explicit migration or compatibility strategy when changing them. Do not silently
discard existing progress. Active session position and scratch notes are currently
temporary; keep that limitation clear and preserve unfinished-session warnings.

## UI conventions

Preserve the existing white reading canvas, pale navigation, green actions, serif
display headings, sans-serif controls and list-based library unless a redesign is
requested. Maintain responsive layouts, labelled controls, visible keyboard focus,
dialog focus handling and focus movement between flashcard states.

Respect reduced-motion preferences. Use transform-based progress animations rather
than animating layout properties. Bundle fonts and other reading assets locally.

## Verification and documentation

- Use npm and the tracked lockfile; `npm ci` installs dependencies.
- `npm test` checks session selection, backup validation and content integrity.
- `npm run build` performs TypeScript checking and creates the production bundle.
- For changes to assessment behaviour, persistence or UI interactions, run the
  relevant `npm run test:e2e` flows. Start `npm run dev -- --port 5173` first;
  Playwright expects `http://127.0.0.1:5173` and currently uses installed Google
  Chrome. Check desktop/mobile layouts and keyboard behaviour when affected.
- For documentation-only changes, check the diff, formatting and referenced paths;
  application tests are unnecessary unless behaviour or configuration also changes.
- Update the README when commands, storage behaviour or content-authoring
  instructions change. Link to detailed documentation instead of duplicating it
  here. Report verification limits accurately.

## Commit timing

If a task is large, divide it into sub-sections and commit each completed
sub-section before moving to the next. Commit task-related changes before reporting
the task complete. General Git safety, atomicity and commit-message rules belong
to the global `git-management` skill.
