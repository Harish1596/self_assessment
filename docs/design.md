# Recall: computer science foundations

The agreed product has two parts: a browsable knowledge library with source links, and self-assessed flashcards with single-field, multiple-field and random-field sessions. Begin with basic computer science; defer difficulty levels and additional subject areas.

Implementation decision: local-first React + TypeScript + Vite app. Browser storage retains read concepts and per-question assessments. JSON export/import backs up progress; no accounts or backend. Original educational summaries cite publicly accessible primary references; no live scraping or runtime AI dependencies.

Seed 24 concepts and 48 questions across data representation, data structures, algorithms, operating systems, networking and databases. Each concept contains a summary, explanation, example, misconception and titled sources. Library searches title, field, explanation and questions, filters fields, and opens an accessible reading dialog. Read state is explicitly user controlled.

Flashcards configure field mode, fields, number of questions and optional needs-practice filtering. Single mode requires exactly one field; multiple mode requires at least two; random mode randomly selects fields on every start and displays the chosen fields. Shuffle without duplicates, reveal answer before rating, and save each rating immediately. A result summary supports retrying weak questions or starting again. Opening a library explanation preserves an active assessment. Confirm before abandoning an unfinished session.

Visual direction: white reading canvas, pale-gray navigation, forest-green actions, serif display heading and sans-serif controls, list-based library and compact practice panel. Responsive navigation, labelled controls, visible focus and reduced-motion support.

Storage failures must be visible; malformed imports must leave current progress untouched. Only known content IDs and valid rating values are imported. Imported progress replaces current progress after explicit confirmation. Export uses a versioned JSON schema.

Approaches considered: browser storage (chosen for a small personal first version); hosted database (deferred because cross-device sync is not requested). All content ships with the app and is usable without external source sites once loaded. Source links require a network connection.
