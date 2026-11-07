import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Layers,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import { cards, concepts, fields, fieldById } from './data';
import { FieldIcon } from './components';
import type { Concept, Progress } from './types';

export default function Library({
  field,
  onField,
  progress,
  onOpen,
  onPractice,
}: {
  field: string;
  onField: (field: string) => void;
  progress: Progress;
  onOpen: (concept: Concept) => void;
  onPractice: () => void;
}) {
  const [query, setQuery] = useState('');
  const [readFilter, setReadFilter] = useState('all');
  const needle = query.trim().toLowerCase();
  const filtered = concepts.filter(
    (c) =>
      (field === 'all' || c.field === field) &&
      (readFilter === 'all' || progress.read.includes(c.id) === (readFilter === 'read')) &&
      (!needle ||
        [
          c.title,
          c.summary,
          ...c.explanation,
          c.example,
          fieldById[c.field].name,
          ...c.questions.flat(),
        ]
          .join(' ')
          .toLowerCase()
          .includes(needle)),
  );
  const reviewed = Object.keys(progress.ratings).length;
  const fieldCount = new Set(filtered.map((concept) => concept.field)).size;
  return (
    <>
      <div className="page-heading">
        <h1>A stronger foundation.</h1>
        <p>Understand the essentials. Put your knowledge to the test.</p>
      </div>
      <div className="search-toolbar">
        <div className="search-box">
          <Search size={19} />
          <input
            aria-label="Search knowledge library"
            placeholder="Search concepts, questions, and explanations"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="icon-button" onClick={() => setQuery('')} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>
        <select
          aria-label="Filter library by field"
          value={field}
          onChange={(e) => onField(e.target.value)}
        >
          <option value="all">All fields</option>
          {fields.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>
      <div className="library-meta">
        <span>
          <strong>{filtered.length}</strong> concepts
        </span>
        <span>
          {filtered.reduce((sum, concept) => sum + concept.questions.length, 0)} flashcards
        </span>
        <span>
          {fieldCount} {fieldCount === 1 ? 'field' : 'fields'}
        </span>
        <span className="read-count">
          {progress.read.length} of {concepts.length} read
        </span>
      </div>
      <div className="library-layout">
        <section className="concept-list" aria-label="Knowledge library">
          <div className="section-top">
            <h2>Your knowledge library</h2>
            <select
              aria-label="Filter by reading status"
              className="compact-select"
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
            >
              <option value="all">All concepts</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>
          <div aria-live="polite" className="sr-only">
            {filtered.length} concepts found
          </div>
          {filtered.map((c) => (
            <button className="concept-row" key={c.id} onClick={() => onOpen(c)}>
              <span className={`field-icon ${fieldById[c.field].color}`}>
                <FieldIcon field={c.field} size={24} />
              </span>
              <span className="concept-copy">
                <span className="concept-title">
                  {c.title}
                  {progress.read.includes(c.id) && (
                    <Check size={15} className="read-check" aria-label="Read" />
                  )}
                </span>
                <span className="concept-summary">{c.summary}</span>
                <span className="concept-field">{fieldById[c.field].name}</span>
              </span>
              <ChevronRight className="row-arrow" size={19} />
            </button>
          ))}
          {!filtered.length && (
            <div className="empty-state">
              <Search size={30} />
              <h3>No matching concepts</h3>
              <p>Try a different search, field, or reading filter.</p>
              <button
                className="button secondary"
                onClick={() => {
                  setQuery('');
                  setReadFilter('all');
                  onField('all');
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
        <aside className="practice-aside">
          <div className="practice-pitch">
            <h2>Make it stick.</h2>
            <div className="card-illustration" aria-hidden="true">
              <div />
              <div />
              <div>
                <span />
                <span />
                <span />
              </div>
            </div>
            <p>Turn what you read into what you remember.</p>
            <button className="button primary" onClick={onPractice}>
              Build a practice session
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="how-it-works">
            <h3>How it works</h3>
            {[
              {
                Icon: BookOpen,
                title: 'Read a concept',
                text: 'Build understanding with clear, focused explanations.',
              },
              {
                Icon: CircleHelp,
                title: 'Recall the answer',
                text: 'Test your knowledge with flashcards.',
              },
              {
                Icon: RefreshCw,
                title: 'Reflect and revisit',
                text: 'Keep practising what feels uncertain.',
              },
            ].map(({ Icon, title, text }) => (
              <div className="how-step" key={title}>
                <span>
                  <Icon size={21} strokeWidth={1.6} />
                </span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
      {reviewed > 0 && (
        <div className="library-bottom">
          <Layers size={17} />
          <span>
            You’ve assessed {reviewed} of {cards.length} flashcards. Your next session can focus on
            what needs practice.
          </span>
          <button onClick={onPractice}>
            Keep practising
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </>
  );
}
