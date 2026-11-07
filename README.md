# Recall

A personal computer science knowledge library with source references and self-assessed flashcards. Built with React, TypeScript and Vite; no account, backend or API key required.

## Run locally

Use Node.js 22.19+ (the version verified for this project).

```sh
npm ci
npm run dev
```

Open the localhost URL printed by Vite, normally http://127.0.0.1:5173.

```sh
npm test          # Session selection, backup validation, content integrity
npm run build    # TypeScript checking and production bundle
npm run preview  # Serve the production build
npm run test:e2e # Browser flows; start the dev server first
```

Browser tests use installed Google Chrome (`channel: 'chrome'` in `playwright.config.ts`). Alternatively, remove that setting and install Playwright Chromium with `npx playwright install chromium`.

## Included

- 87 introductory concepts and 438 questions across 11 fields, starting with what a computer does and how programs work.
- A searchable library with field and read/unread filters, worked examples, important caveats, source links and related questions.
- Single-field, multiple-field and randomly selected-field assessments. Questions are shuffled without repetition; short pools use only the available questions. Mixed sessions include one question per selected field when the session length and available pool permit.
- Answer reveal, optional scratch notes, three self-assessment ratings, session results and retrying questions that need revision.
- Read state and each question’s latest rating, review timestamp and review count saved in browser local storage.
- JSON export/import of progress, with validation and confirmation before replacing existing data.

## Your data

Progress stays in the current browser profile and origin. Clearing site data removes it; switching browsers, ports or domains does not carry it across. Export a backup before clearing data or moving to another device. No cross-device synchronisation is included.

Ratings save immediately. The active session position and optional scratch notes are temporary. Navigating away from an unfinished session prompts for confirmation where the browser supports it. Importing a backup replaces current progress and ends the active session. Export includes progress, not scratch notes or content.

Text and fonts ship with the app; normal reading and assessments do not fetch external services. Source links open external websites. This version is not an installable offline PWA: keep the local server running to load or reload it.

## Content

`src/data.ts` assembles the catalogue from `src/content/`. Field metadata lives in `fields.ts`; `initial.ts` retains the original entries; the computer, programming and core foundations modules hold the expansion. Each entry includes a stable ID, field, title, summary, explanation, example, takeaway, sources and a variable number of focused question/answer pairs. Cards are derived from the entries so they stay linked to their explanations.

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

`src/content/` owns teaching notes and question banks; `src/data.ts` derives the searchable catalogue and counts. `App.tsx` manages navigation and persistence; `Library.tsx` handles discovery; `components.tsx` provides the article reader; `Flashcards.tsx` provides setup, practice and results; `domain.ts` owns question selection and backup validation.

The implementation scope is recorded in `docs/design.md` and `docs/plan.md`. The generated visual reference is in `docs/reference/recall-concept.png`.

The clarified absolute-basics scope and expansion approach are recorded in `docs/foundations-expansion.md`.
