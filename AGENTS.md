# Project instructions

Recall is a local-first knowledge library and self-assessment flashcard app.
Current scope: basic computer science; difficulty levels and other collections
are deferred until requested. Discuss accounts, backends, runtime AI or sync
before changing the architecture.

## Read as needed

- Setup, commands and browser-test prerequisites: [README](README.md#run-locally).
- Content structure and expansion: [Content](README.md#content).
- File responsibilities: [Structure](README.md#structure).
- Persistence and temporary state: [Your data](README.md#your-data).
- Assessment behaviour: [Included](README.md#included).
- Backend contracts, migrations and session storage: [Database](docs/database-architecture.md).
- Initial design and visual direction: [Design](docs/design.md).

Read the relevant sections before changing that area; do not load every linked
file for unrelated tasks. Keep detailed guidance in those documents, not here.

## Project rules

- Write original explanations with verified, supporting source links.
- Preserve concept/question IDs and saved-progress compatibility. Question IDs
  depend on position: reordering or replacing questions needs a compatibility
  strategy, as do changes to storage keys or backup schemas.
- Preserve field-selection modes, non-repeating sessions, reveal-before-rating
  and active assessment state when opening explanations.
- Save ratings immediately. Validate imports before use, confirm replacement,
  preserve existing data on invalid imports and surface storage failures.
- Keep selection/progress validation in `src/domain.ts` and answer validation in
  `shared/validation.ts`; edit sources, not `dist/`.
- Preserve the existing visual system, responsive layouts, keyboard/focus access
  and reduced-motion support. Bundle reading assets locally.
- When expanding content, update inventory assertions and documented counts;
  retain meaningful integrity checks.

## Delivery

Run relevant domain tests and the production build for code changes; exercise
browser flows for affected interactions and layouts. For documentation-only
changes, check formatting, diffs and links. Update the README when documented
behaviour changes and report verification limits.

Commit each completed subsection of a large task before starting the next.
Commit task changes before reporting completion. General Git safety, atomicity
and message formatting come from the global `git-management` skill.
