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
import { FieldIcon } from './components';
import type { Concept, Progress, Rating, SessionConfig } from './types';
import type { SessionSummary, StoredSession } from '../shared/contracts';
import type { Draft } from './App';
const ratingLabels: Record<Rating, string> = {
  practice: 'Needs practice',
  partial: 'Partly understood',
  confident: 'Confident',
};
export default function Flashcards({
  progress,
  initialField,
  session,
  history,
  busy,
  draft,
  pending,
  draftError,
  onDraft,
  onRetrySave,
  onStart,
  onAction,
  onSession,
  onCloseSession,
  onOpen,
  onLibrary,
}: {
  progress: Progress;
  initialField: string;
  session: StoredSession | null;
  history: SessionSummary[];
  busy: boolean;
  draft: Draft | null;
  pending: boolean;
  draftError: string;
  onDraft: (draft: Draft) => void;
  onRetrySave: () => void;
  onStart: (config: SessionConfig, ids?: string[]) => void;
  onAction: (action: string, itemId?: string, rating?: string) => void;
  onSession: (id: string) => void;
  onCloseSession: () => void;
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
  const index = session?.items.findIndex((i) => i.status !== 'reviewed') ?? -1;
  const current = session?.items[index];
  useEffect(() => {
    if (!session) return;
    const target = !current
      ? 'results-title'
      : current.status === 'revealed'
        ? 'expected-answer'
        : 'question-title';
    document.getElementById(target)?.focus({ preventScroll: true });
  }, [session?.id, index, current?.status]);
  function start() {
    setError('');
    onStart(config);
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
  const reviewed = Object.values(progress.ratings),
    weak = reviewed.filter((r) => r.rating !== 'confident').length;
  if (!session)
    return (
      <div className="practice-page">
        <div className="page-heading">
          <h1>A little recall. A lot of clarity.</h1>
          <p>Choose your fields, then explain each answer in your own words.</p>
        </div>
        {history.length > 0 && (
          <section className="session-history" aria-label="Session history">
            <h2>Session history</h2>
            <p>Resume saved practice or review previous answers.</p>
            <div className="history-list">
              {history.map((s) => (
                <button disabled={busy} key={s.id} onClick={() => onSession(s.id)}>
                  <span>
                    <strong>{s.status.charAt(0).toUpperCase() + s.status.slice(1)} session</strong>
                    <small>
                      {new Date(s.updatedAt).toLocaleString()} ·{' '}
                      {s.selectedFields.map((f) => fieldById[f]?.name ?? f).join(' · ')}
                    </small>
                  </span>
                  <span>
                    {s.reviewed} / {s.total} assessed
                  </span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </section>
        )}
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
              <button
                className="button primary"
                disabled={busy || history.some((s) => s.status === 'active')}
                onClick={start}
              >
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

  const results = session.items.filter((i) => i.status === 'reviewed');
  const terminal = session.status === 'completed' || session.status === 'abandoned';
  if (!current || terminal) {
    const counts = { practice: 0, partial: 0, confident: 0 };
    results.forEach((i) => {
      if (i.rating) counts[i.rating]++;
    });
    const retry = results.filter((i) => i.rating !== 'confident').map((i) => i.card.id);
    return (
      <div className="results-page">
        <CheckCircle2 size={40} className="result-icon" />
        <h1 id="results-title" tabIndex={-1}>
          {session.status === 'completed' ? 'One session stronger.' : 'Session ended.'}
        </h1>
        <p>
          You assessed {results.length} of {session.items.length} questions. Your answers are saved.
        </p>
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
              disabled={busy}
              className="button primary"
              onClick={() => onStart({ ...session.config, weakOnly: false }, retry)}
            >
              <RotateCcw size={17} />
              Practise {retry.length} to revisit
            </button>
          )}
          <button disabled={busy} className="button secondary" onClick={onCloseSession}>
            Build another session
          </button>
        </div>
        <section className="results-review">
          <h2>Your session review</h2>
          {session.items.map((item) => (
            <details key={item.id} className="history-answer">
              <summary>
                {item.card.question}{' '}
                <span className={`rating-label ${item.rating ?? ''}`}>
                  {item.rating ? ratingLabels[item.rating] : 'Not assessed'}
                </span>
              </summary>
              <p>
                <strong>Your answer:</strong> {item.answerText || 'No written answer'}
              </p>
              {item.card.choices.length > 0 && (
                <p>
                  <strong>Your selections:</strong>{' '}
                  {item.card.choices
                    .filter((c) => item.selectedChoiceIds.includes(c.id))
                    .map((c) => c.label)
                    .join(' · ') || 'None'}
                </p>
              )}
              {item.correct !== null && (
                <p>
                  {item.correct
                    ? 'Correct selection'
                    : 'Selection did not match all correct options'}
                </p>
              )}
              <p>
                <strong>Accepted answers:</strong>
              </p>
              {item.card.answers.map((a, i) => (
                <p key={i}>{a}</p>
              ))}
              {concepts.some((c) => c.id === item.card.conceptId) && (
                <button onClick={() => onOpen(concepts.find((c) => c.id === item.card.conceptId)!)}>
                  Read the explanation
                  <ChevronRight size={16} />
                </button>
              )}
            </details>
          ))}
        </section>
      </div>
    );
  }
  const response =
    draft?.itemId === current.id
      ? draft
      : {
          itemId: current.id,
          answerText: current.answerText,
          selectedChoiceIds: current.selectedChoiceIds,
        };
  const revealed = current.status === 'revealed',
    paused = session.status === 'paused';
  const activeField = fieldById[current.card.field] ?? { name: current.card.field, color: 'green' };
  return (
    <div className="active-practice">
      <div className="session-top">
        <button
          disabled={busy}
          className="text-button"
          onClick={() => {
            if (
              window.confirm(
                'End this session? Your answers and assessments will remain in history.',
              )
            )
              onAction('abandon');
          }}
        >
          <ArrowLeft size={16} />
          End session
        </button>
        <span>
          Question {index + 1} of {session.items.length}
        </span>
      </div>
      <div
        className="session-progress"
        aria-label={`Session ${results.length} of ${session.items.length} completed`}
      >
        <span style={{ transform: `scaleX(${results.length / session.items.length})` }} />
      </div>
      <div className="session-field-summary">
        Your fields: {session.selectedFields.map((f) => fieldById[f]?.name ?? f).join(' · ')}
      </div>
      <div className="session-controls">
        <span role="status">
          {draftError
            ? 'Answer could not be saved'
            : busy || pending
              ? 'Saving answer…'
              : paused
                ? 'Session paused'
                : 'Session saved'}
        </span>
        {draftError && (
          <button disabled={busy} className="text-button" onClick={onRetrySave}>
            Retry save
          </button>
        )}
        <button
          disabled={busy}
          className="text-button"
          onClick={() => onAction(paused ? 'resume' : 'pause')}
        >
          {paused ? 'Resume session' : 'Pause session'}
        </button>
        <button disabled={busy || pending} className="text-button" onClick={onCloseSession}>
          Session history
        </button>
      </div>
      <section className="flashcard" aria-labelledby="question-title">
        <span className={`field-label ${activeField.color}`}>
          <FieldIcon field={current.card.field} size={16} />
          {activeField.name}
        </span>
        <h1 id="question-title" tabIndex={-1}>
          {current.card.question}
        </h1>
        <p className="recall-prompt">
          {current.card.kind === 'multiple_choice'
            ? 'Select all correct options.'
            : current.card.kind === 'single_choice'
              ? 'Select one option.'
              : 'Pause. Think it through. Explain it in your own words.'}
        </p>
        {current.card.choices.length > 0 && (
          <fieldset className="answer-choices" disabled={revealed || paused}>
            <legend>Your selection</legend>
            {current.card.choices.map((choice) => (
              <label key={choice.id}>
                <input
                  type={current.card.kind === 'single_choice' ? 'radio' : 'checkbox'}
                  name="answer-choice"
                  checked={response.selectedChoiceIds.includes(choice.id)}
                  onChange={() =>
                    onDraft({
                      ...response,
                      selectedChoiceIds:
                        current.card.kind === 'single_choice'
                          ? [choice.id]
                          : response.selectedChoiceIds.includes(choice.id)
                            ? response.selectedChoiceIds.filter((id) => id !== choice.id)
                            : [...response.selectedChoiceIds, choice.id],
                    })
                  }
                />
                {choice.label}
                {revealed && choice.correct && <span> · Correct</span>}
              </label>
            ))}
          </fieldset>
        )}
        <label className="notes-label" htmlFor="answer-notes">
          Your answer <span>(optional · saved with this session)</span>
        </label>
        <textarea
          id="answer-notes"
          value={response.answerText}
          disabled={revealed || paused}
          onChange={(e) => onDraft({ ...response, answerText: e.target.value })}
          placeholder="Jot down your thinking…"
          rows={3}
        />
        {!revealed ? (
          <button
            disabled={busy || paused}
            className="button primary reveal-button"
            onClick={() => onAction('reveal', current.id)}
          >
            Reveal answer
            <ArrowRight size={17} />
          </button>
        ) : (
          <div className="answer-area" aria-live="polite">
            <h2 id="expected-answer" tabIndex={-1}>
              {current.card.answers.length > 1 ? 'Accepted answers' : 'Expected answer'}
            </h2>
            {current.card.answers.map((answer, i) => (
              <p key={i}>{answer}</p>
            ))}
            {current.correct !== null && (
              <p>
                {current.correct
                  ? 'Your selection is correct.'
                  : 'Your selection does not match all correct options.'}
              </p>
            )}
            {concepts.some((c) => c.id === current.card.conceptId) && (
              <button
                className="text-button"
                onClick={() => onOpen(concepts.find((c) => c.id === current.card.conceptId)!)}
              >
                <BookOpen size={16} />
                Read the explanation
                <ChevronRight size={16} />
              </button>
            )}
            <div className="rating-area">
              <h3>How well did you know it?</h3>
              <div className="rating-buttons">
                {(['practice', 'partial', 'confident'] as Rating[]).map((r) => (
                  <button
                    disabled={busy || paused}
                    className={`rating-button ${r}`}
                    key={r}
                    onClick={() => onAction('rate', current.id, r)}
                  >
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
        Answers and assessments save to your local database. Written answers are self-assessed.
      </p>
    </div>
  );
}
