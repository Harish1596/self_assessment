import { useEffect, useRef } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  Database,
  Layers,
  Monitor,
  Network,
  Binary,
  Cpu,
  Sigma,
  Braces,
  Wrench,
  ShieldCheck,
  X,
  ExternalLink,
} from 'lucide-react';
import { cards, fieldById } from './data';
import type { Concept, FieldId, Progress } from './types';

const icons = {
  computing: Cpu,
  logic: Sigma,
  programming: Braces,
  engineering: Wrench,
  security: ShieldCheck,
  representation: Binary,
  structures: Layers,
  algorithms: Code2,
  systems: Monitor,
  networking: Network,
  databases: Database,
};
export function FieldIcon({ field, size = 20 }: { field: FieldId; size?: number }) {
  const Icon = icons[field as keyof typeof icons] ?? BookOpen;
  return <Icon size={size} strokeWidth={1.7} aria-hidden="true" />;
}

export function Reader({
  concept,
  progress,
  onRead,
  onClose,
  onPractice,
}: {
  concept: Concept;
  progress: Progress;
  onRead: (id: string) => void;
  onClose: () => void;
  onPractice?: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const field = fieldById[concept.field];
  const isRead = progress.read.includes(concept.id);
  useEffect(() => {
    const node = dialog.current!;
    node.showModal();
    return () => {
      node.close();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="reader-dialog"
      onCancel={onClose}
      aria-labelledby="reader-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="reader-top">
        <span className={`field-label ${field.color}`}>
          <FieldIcon field={concept.field} size={15} />
          {field.name}
        </span>
        <button className="icon-button" aria-label="Close explanation" onClick={onClose} autoFocus>
          <X size={20} />
        </button>
      </div>
      <article className="article">
        <h1 id="reader-title">{concept.title}</h1>
        <p className="article-intro">{concept.summary}</p>
        <h2>The concept</h2>
        {concept.explanation.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <h2>A concrete example</h2>
        <pre>{concept.example}</pre>
        <div className="takeaway">
          <BookOpen size={20} />
          <div>
            <strong>Keep this in mind</strong>
            <p>{concept.takeaway}</p>
          </div>
        </div>
        <h2>Sources & further reading</h2>
        <p className="muted small">
          These notes are written in our own words using the references below. Sources checked 7
          November 2026.
        </p>
        <ul className="sources">
          {concept.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title}
                <ExternalLink size={15} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
        <h2>Test your understanding</h2>
        <div className="related-questions">
          {cards
            .filter((c) => c.conceptId === concept.id)
            .map((c) => (
              <details key={c.id}>
                <summary>
                  {c.question}
                  <ChevronRight size={17} />
                </summary>
                <p>{c.answer}</p>
              </details>
            ))}
        </div>
      </article>
      <div className="reader-footer">
        <button
          className={isRead ? 'button read-button' : 'button secondary'}
          onClick={() => onRead(concept.id)}
        >
          {isRead ? <Check size={17} /> : <BookOpen size={17} />}
          {isRead ? 'Read · mark unread' : 'Mark as read'}
        </button>
        {onPractice && (
          <button className="button primary" onClick={onPractice}>
            Practise this field
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </dialog>
  );
}
