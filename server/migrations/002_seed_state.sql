-- Track the currently applied bundle, including returning to an earlier version.
CREATE TABLE seed_state (
  id TEXT PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
