CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO profiles (id, name) VALUES ('local', 'Local learner');

CREATE TABLE fields (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT 'green',
  sort_order INTEGER NOT NULL DEFAULT 0,
  archived_at TIMESTAMPTZ
);

CREATE TABLE concepts (
  id TEXT PRIMARY KEY,
  field_id TEXT NOT NULL REFERENCES fields(id),
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  explanation JSONB NOT NULL CHECK (jsonb_typeof(explanation) = 'array'),
  example TEXT NOT NULL DEFAULT '',
  takeaway TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived_at TIMESTAMPTZ
);
CREATE INDEX concepts_field_order ON concepts(field_id, sort_order);

CREATE TABLE sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE
);
CREATE TABLE concept_sources (
  concept_id TEXT NOT NULL REFERENCES concepts(id),
  source_id TEXT NOT NULL REFERENCES sources(id),
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (concept_id, source_id)
);

CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  concept_id TEXT NOT NULL REFERENCES concepts(id),
  current_revision_id UUID,
  sort_order INTEGER NOT NULL DEFAULT 0,
  archived_at TIMESTAMPTZ
);
CREATE INDEX cards_concept_order ON cards(concept_id, sort_order);

CREATE TABLE card_revisions (
  id UUID PRIMARY KEY,
  card_id TEXT NOT NULL REFERENCES cards(id),
  revision INTEGER NOT NULL CHECK (revision > 0),
  kind TEXT NOT NULL CHECK (kind IN ('recall', 'single_choice', 'multiple_choice')),
  question TEXT NOT NULL CHECK (length(trim(question)) > 0),
  answers JSONB NOT NULL CHECK (jsonb_typeof(answers) = 'array' AND jsonb_array_length(answers) > 0),
  choices JSONB NOT NULL DEFAULT '[]' CHECK (jsonb_typeof(choices) = 'array'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (card_id, revision),
  UNIQUE (card_id, id)
);
ALTER TABLE cards ADD CONSTRAINT cards_current_revision
  FOREIGN KEY (id, current_revision_id) REFERENCES card_revisions(card_id, id)
  DEFERRABLE INITIALLY DEFERRED;

CREATE FUNCTION preserve_card_revision() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Card revisions are immutable; create a new revision instead';
END;
$$;
CREATE TRIGGER immutable_card_revisions BEFORE UPDATE OR DELETE ON card_revisions
  FOR EACH ROW EXECUTE FUNCTION preserve_card_revision();

CREATE TABLE read_progress (
  profile_id TEXT NOT NULL REFERENCES profiles(id),
  concept_id TEXT NOT NULL REFERENCES concepts(id),
  read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, concept_id)
);
CREATE TABLE card_progress (
  profile_id TEXT NOT NULL REFERENCES profiles(id),
  card_id TEXT NOT NULL REFERENCES cards(id),
  rating TEXT NOT NULL CHECK (rating IN ('practice', 'partial', 'confident')),
  reviewed_at TIMESTAMPTZ NOT NULL,
  reviews INTEGER NOT NULL CHECK (reviews > 0),
  PRIMARY KEY (profile_id, card_id)
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
  mode TEXT NOT NULL CHECK (mode IN ('single', 'multiple', 'random')),
  requested_fields JSONB NOT NULL CHECK (jsonb_typeof(requested_fields) = 'array'),
  selected_fields JSONB NOT NULL CHECK (jsonb_typeof(selected_fields) = 'array'),
  requested_count INTEGER NOT NULL CHECK (requested_count > 0),
  weak_only BOOLEAN NOT NULL DEFAULT false,
  version INTEGER NOT NULL DEFAULT 0 CHECK (version >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  CHECK ((status IN ('completed', 'abandoned')) = (finished_at IS NOT NULL))
);
CREATE INDEX sessions_profile_updated ON sessions(profile_id, updated_at DESC);
CREATE UNIQUE INDEX one_active_session_per_profile ON sessions(profile_id) WHERE status = 'active';

CREATE TABLE session_items (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES sessions(id),
  position INTEGER NOT NULL CHECK (position >= 0),
  card_id TEXT NOT NULL,
  revision_id UUID NOT NULL,
  snapshot JSONB NOT NULL CHECK (jsonb_typeof(snapshot) = 'object'),
  answer_text TEXT NOT NULL DEFAULT '',
  selected_choice_ids JSONB NOT NULL DEFAULT '[]' CHECK (jsonb_typeof(selected_choice_ids) = 'array'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'revealed', 'reviewed')),
  rating TEXT CHECK (rating IN ('practice', 'partial', 'confident')),
  correct BOOLEAN,
  revealed_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (card_id, revision_id) REFERENCES card_revisions(card_id, id),
  UNIQUE (session_id, position),
  UNIQUE (session_id, card_id),
  CHECK ((status = 'pending') = (revealed_at IS NULL)),
  CHECK ((status = 'reviewed') = (rating IS NOT NULL AND reviewed_at IS NOT NULL))
);
CREATE INDEX session_items_order ON session_items(session_id, position);

CREATE TABLE legacy_imports (
  profile_id TEXT NOT NULL REFERENCES profiles(id),
  content_hash TEXT NOT NULL,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, content_hash)
);

CREATE TABLE seed_runs (
  id TEXT PRIMARY KEY,
  imported_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
