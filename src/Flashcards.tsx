import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Layers,
  Play,
  RotateCcw,
  Shuffle,
} from 'lucide-react';
import { cards, concepts, fields, fieldById, fieldCounts } from './data';
import { buildSession } from './domain';
import { FieldIcon } from './components';
import type { Card, Concept, Progress, Rating, SessionConfig } from './types';

export type ActiveSession = {
  cards: Card[];
  index: number;
  revealed: boolean;
  results: { card: Card; rating: Rating }[];
};
const ratingLabels: Record<Rating, string> = {
  practice: 'Needs practice',
  partial: 'Partly understood',
  confident: 'Confident',
};

export default function Flashcards({
  progress,
  initialField,
  session,
  setSession,
  onRate,
  onOpen,
  onLibrary,
}: {
  progress: Progress;
  initialField: string;
  session: ActiveSession | null;
  setSession: (s: ActiveSession | null) => void;
  onRate: (id: string, rating: Rating) => void;
  onOpen: (c: Concept) => void;
  onLibrary: () => void;
}) {
  const [config, setConfig] = useState<SessionConfig>(() => ({
    mode: initialField === 'all' ? 'multiple' : 'single',
    fields: initialField === 'all' ? fields.map((f) => f.id) : [initialField],
    count: 10,
    weakOnly: false,
  }));
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  useEffect(() => {
    if (!session) return;
    const target =
      session.index >= session.cards.length
        ? 'results-title'
        : session.revealed
          ? 'expected-answer'
          : 'question-title';
    document.getElementById(target)?.focus({ preventScroll: true });
  }, [session?.index, session?.cards, session?.revealed]);
  function start() {
    try {
      const selected = buildSession(config, progress);
      setError('');
      setNotes('');
      setSession({ cards: selected.cards, index: 0, revealed: false, results: [] });
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function changeMode(mode: SessionConfig['mode']) {
    setError('');
    setConfig((c) => ({
      ...c,
      mode,
      fields:
        mode === 'single'
          ? [c.fields[0] || fields[0].id]
          : mode === 'multiple' && c.fields.length < 2
            ? fields.map((f) => f.id)
            : c.fields,
    }));
  }
  function toggleField(id: string) {
    setError('');
    setConfig((c) => ({
      ...c,
      fields:
        c.mode === 'single'
          ? [id]
          : c.fields.includes(id)
            ? c.fields.filter((f) => f !== id)
            : [...c.fields, id],
    }));
  }
  const reviewed = Object.values(progress.ratings);
  const weak = reviewed.filter((r) => r.rating !== 'confident').length;

  if (!session)
    return (
      <div className="practice-page">
        <div className="page-heading">
          <h1>A little recall. A lot of clarity.</h1>
          <p>Choose your fields, then explain each answer in your own words.</p>
        </div>
        <div className="setup-layout">
          <section className="setup-panel">
            <div className="section-top">
              <h2>Build your session</h2>
              <span className="subtle-label">Basic concepts</span>
            </div>
            <fieldset className="mode-fieldset">
              <legend>Choose your field selection</legend>
              <div className="mode-grid">
                {[
                  {
                    id: 'single',
                    Icon: BookOpen,
                    title: 'Single field',
                    text: 'Focus on one area',
                  },
                  {
                    id: 'multiple',
                    Icon: Layers,
                    title: 'Multiple fields',
                    text: 'Pick your own mix',
                  },
                  {
                    id: 'random',
                    Icon: Shuffle,
                    title: 'Random fields',
                    text: 'Let Recall choose',
                  },
                ].map(({ id, Icon, title, text }) => (
                  <label className={`mode-option ${config.mode === id ? 'selected' : ''}`} key={id}>
                    <input
                      type="radio"
                      name="mode"
                      value={id}
                      checked={config.mode === id}
                      onChange={() => changeMode(id as SessionConfig['mode'])}
                    />
                    <Icon size={21} />
                    <strong>{title}</strong>
                    <span>{text}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {config.mode !== 'random' ? (
              <fieldset className="field-picker">
                <legend>
                  {config.mode === 'single' ? 'Select one field' : 'Select at least two fields'}
                </legend>
                {fields.map((f) => (
                  <label
                    key={f.id}
                    className={`field-choice ${config.fields.includes(f.id) ? 'selected' : ''}`}
                  >
                    <input
                      type={config.mode === 'single' ? 'radio' : 'checkbox'}
                      name="fields"
                      checked={config.fields.includes(f.id)}
                      onChange={() => toggleField(f.id)}
                    />
                    <span className={`field-icon ${f.color}`}>
                      <FieldIcon field={f.id} size={19} />
                    </span>
                    <span>
                      <strong>{f.name}</strong>
                      <small>{fieldCounts[f.id].cards} questions</small>
                    </span>
                    <span className="selection-indicator">
                      {config.fields.includes(f.id) && <Check size={14} />}
                    </span>
                  </label>
                ))}
              </fieldset>
            ) : (
              <div className="random-explainer">
                <Shuffle size={24} />
                <div>
                  <strong>A fresh mix every time</strong>
                  <p>
                    We’ll randomly choose two or more available fields and mix their questions.
                    You’ll see the selected fields when your session starts.
                  </p>
                </div>
              </div>
            )}
            <div className="session-options">
              <label>
                Session length
                <select
                  aria-label="Session length"
                  value={config.count}
                  onChange={(e) => setConfig((c) => ({ ...c, count: Number(e.target.value) }))}
                >
                  <option value={5}>5 questions</option>
                  <option value={10}>10 questions</option>
                  <option value={20}>20 questions</option>
                  <option value={cards.length}>All available questions</option>
                </select>
              </label>
              <label className="weak-option">
                <input
                  type="checkbox"
                  checked={config.weakOnly}
                  onChange={(e) => {
                    setError('');
                    setConfig((c) => ({ ...c, weakOnly: e.target.checked }));
                  }}
                />
                <span>
                  Only questions to revisit<small>Needs practice or partly understood</small>
                </span>
              </label>
            </div>
            {error && (
              <p role="alert" className="inline-error">
                {error}
              </p>
            )}
            <div className="setup-footer">
              <p>
                Questions are shuffled with no repeats.
                <br />
                Shorter pools use all available questions.
              </p>
              <button className="button primary" onClick={start}>
                <Play size={16} />
                Start session
              </button>
            </div>
          </section>
          <aside className="session-sidebar">
            <h3>Your practice so far</h3>
            <div className="progress-number">
              {reviewed.length}
              <span> / {cards.length}</span>
            </div>
            <p>questions assessed</p>
            <div className="thin-progress">
              <span style={{ transform: `scaleX(${reviewed.length / cards.length})` }} />
            </div>
            <div className="progress-detail">
              <span>
                <i className="dot confident" />
                Confident
              </span>
              <strong>{reviewed.length - weak}</strong>
            </div>
            <div className="progress-detail">
              <span>
                <i className="dot practice" />
                To revisit
              </span>
              <strong>{weak}</strong>
            </div>
            <div className="tip">
              <CircleHelp size={20} />
              <p>
                Try answering before you reveal. Being honest about uncertainty makes your next
                session more useful.
              </p>
            </div>
            <button className="text-button" onClick={onLibrary}>
              Explore the library
              <ChevronRight size={16} />
            </button>
          </aside>
        </div>
      </div>
    );

  if (session.index >= session.cards.length) {
    const counts = { practice: 0, partial: 0, confident: 0 };
    session.results.forEach((r) => counts[r.rating]++);
    const retry = session.results.filter((r) => r.rating !== 'confident').map((r) => r.card);
    return (
      <div className="results-page">
        <CheckCircle2 size={40} className="result-icon" />
        <h1 id="results-title" tabIndex={-1}>
          One session stronger.
        </h1>
        <p>You assessed {session.results.length} questions. Here’s where you stand.</p>
        <div className="result-counts">
          {(['practice', 'partial', 'confident'] as Rating[]).map((r) => (
            <div className={r} key={r}>
              <strong>{counts[r]}</strong>
              <span>{ratingLabels[r]}</span>
            </div>
          ))}
        </div>
        <div className="result-actions">
          {retry.length > 0 && (
            <button
              className="button primary"
              onClick={() => {
                setNotes('');
                setSession({ cards: retry, index: 0, revealed: false, results: [] });
              }}
            >
              <RotateCcw size={17} />
              Practise {retry.length} to revisit
            </button>
          )}
          <button className="button secondary" onClick={() => setSession(null)}>
            Build another session
          </button>
        </div>
        <section className="results-review">
          <h2>Your session review</h2>
          {session.results.map(({ card, rating }) => (
            <button
              key={card.id}
              onClick={() => onOpen(concepts.find((c) => c.id === card.conceptId)!)}
            >
              <span>{card.question}</span>
              <span className={`rating-label ${rating}`}>{ratingLabels[rating]}</span>
              <ChevronRight size={16} />
            </button>
          ))}
        </section>
      </div>
    );
  }
  const current = session.cards[session.index];
  const activeFields = [...new Set(session.cards.map((c) => c.field))];
  function rate(rating: Rating) {
    onRate(current.id, rating);
    setNotes('');
    setSession({
      ...session!,
      index: session!.index + 1,
      revealed: false,
      results: [...session!.results, { card: current, rating }],
    });
  }
  return (
    <div className="active-practice">
      <div className="session-top">
        <button
          className="text-button"
          onClick={() => {
            if (window.confirm('End this session? Your completed assessments are already saved.'))
              setSession(null);
          }}
        >
          <ArrowLeft size={16} />
          End session
        </button>
        <span>
          Question {session.index + 1} of {session.cards.length}
        </span>
      </div>
      <div
        className="session-progress"
        aria-label={`Session ${session.index} of ${session.cards.length} completed`}
      >
        <span style={{ transform: `scaleX(${session.index / session.cards.length})` }} />
      </div>
      <div className="session-field-summary">
        Your fields: {activeFields.map((f) => fieldById[f].name).join(' · ')}
      </div>
      <section className="flashcard" aria-labelledby="question-title">
        <span className={`field-label ${fieldById[current.field].color}`}>
          <FieldIcon field={current.field} size={16} />
          {fieldById[current.field].name}
        </span>
        <h1 id="question-title" tabIndex={-1}>
          {current.question}
        </h1>
        <p className="recall-prompt">Pause. Think it through. Explain it in your own words.</p>
        <label className="notes-label" htmlFor="answer-notes">
          Your answer <span>(optional · cleared after each card)</span>
        </label>
        <textarea
          id="answer-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Jot down your thinking…"
          rows={3}
        />
        {!session.revealed ? (
          <button
            className="button primary reveal-button"
            onClick={() => setSession({ ...session, revealed: true })}
          >
            Reveal answer
            <ArrowRight size={17} />
          </button>
        ) : (
          <div className="answer-area" aria-live="polite">
            <h2 id="expected-answer" tabIndex={-1}>
              Expected answer
            </h2>
            <p>{current.answer}</p>
            <button
              className="text-button"
              onClick={() => onOpen(concepts.find((c) => c.id === current.conceptId)!)}
            >
              <BookOpen size={16} />
              Read the explanation
              <ChevronRight size={16} />
            </button>
            <div className="rating-area">
              <h3>How well did you know it?</h3>
              <div className="rating-buttons">
                {(['practice', 'partial', 'confident'] as Rating[]).map((r) => (
                  <button className={`rating-button ${r}`} key={r} onClick={() => rate(r)}>
                    {ratingLabels[r]}
                    <ArrowRight size={15} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
      <p className="session-footnote">
        Your assessments save after each card. Ratings reflect your own understanding.
      </p>
    </div>
  );
}
