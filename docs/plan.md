# Recall Implementation Plan

Goal: deliver the two agreed app surfaces with CS fundamentals and persistent assessment progress.
Architecture: static React/Vite app, structured content, pure session and backup utilities, browser-local state.
Spec: docs/design.md

## Constraints and review focus

- No accounts, AI calls, difficulty levels or unrelated curriculum.
- Prevent duplicate cards, out-of-field questions and empty sessions.
- Reject corrupt/foreign backups without overwriting progress.
- Surface unavailable browser storage and preserve active sessions when reading.
- Verify keyboard access, mobile layout and answer-before-rating behaviour.

## Tasks

- [x] Write and run failing domain tests for field modes, randomisation, weak-card filtering, backup validation and source integrity.
- [x] Implement typed content in src/data.ts and pure selection/storage helpers in src/domain.ts. Run domain tests.
- [x] Build library, article reader, flashcard setup/session/results, local persistence and export/import.
- [x] Run typecheck, production build and browser flows at desktop/mobile widths. Fix observed failures, review final source and document launch instructions.

## Execution notes

- Eight domain tests and four browser flows cover the key requirements.
- Independent source review identified focus management and unfinished-session exit warnings; both were fixed and regression checked in Chrome.
- Browser plugin unavailable; Playwright used installed Chrome at 1487 × 1058 and 390 × 844.
- The generated visual reference is retained under docs/reference. Content ordering groups entries by field; reading status, assessment configuration and backup feedback extend the original library reference.
- Fonts are bundled locally. No account, runtime AI call, scraping service or remote database was introduced.

Execution: inline in this empty workspace, following the user's instruction to build. No existing repository or branch is present. Content references are verified before inclusion.
