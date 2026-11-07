import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Layers,
  LayoutGrid,
  Download,
  Upload,
  HardDrive,
  ArrowRight,
  ChevronRight,
  Home,
  Play,
  X,
} from 'lucide-react';
import { concepts, fields } from './data';
import { loadProgress, parseProgress, STORAGE_KEY } from './domain';
import { FieldIcon, Reader } from './components';
import Library from './Library';
import Flashcards, { type ActiveSession } from './Flashcards';
import type { Concept, Progress, Rating } from './types';

export default function App() {
  const [initial] = useState(loadProgress);
  const [progress, setProgress] = useState(initial.progress);
  const [storageError, setStorageError] = useState(initial.error);
  const [notice, setNotice] = useState('');
  const [view, setView] = useState<'library' | 'flashcards'>('library');
  const [field, setField] = useState('all');
  const [practiceField, setPracticeField] = useState('all');
  const [article, setArticle] = useState<Concept | null>(null);
  const [session, setSession] = useState<ActiveSession | null>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const main = useRef<HTMLElement>(null);
  const unfinished = Boolean(session && session.index < session.cards.length);
  useEffect(() => {
    if (!unfinished) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [unfinished]);

  function navigate(next: 'library' | 'flashcards', nextField?: string) {
    if (view === next && nextField === undefined) return;
    if (
      unfinished &&
      !window.confirm('Leave this session? Your completed assessments are already saved.')
    )
      return;
    setSession(null);
    setArticle(null);
    setView(next);
    if (nextField !== undefined) setField(nextField);
    if (next === 'flashcards') setPracticeField(nextField ?? field);
    main.current?.scrollTo(0, 0);
  }
  function save(next: Progress) {
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageError('');
    } catch {
      setStorageError(
        'Browser storage is unavailable or full. Your progress is held for this visit only. Export a backup before leaving.',
      );
    }
  }
  function markRead(id: string) {
    save({
      ...progress,
      read: progress.read.includes(id)
        ? progress.read.filter((x) => x !== id)
        : [...progress.read, id],
    });
  }
  function rate(id: string, rating: Rating) {
    save({
      ...progress,
      ratings: {
        ...progress.ratings,
        [id]: {
          rating,
          reviewedAt: new Date().toISOString(),
          reviews: (progress.ratings[id]?.reviews ?? 0) + 1,
        },
      },
    });
  }
  function exportProgress() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = `recall-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('Progress backup exported. It includes read concepts and flashcard assessments.');
  }
  async function importProgress(file?: File) {
    if (!file) return;
    try {
      if (file.size > 1_000_000)
        throw new Error(
          'This file is too large for a Recall progress backup. Choose a file smaller than 1 MB.',
        );
      const next = parseProgress(await file.text());
      if (
        !window.confirm(
          'Replace your current progress with this backup? Export first if you want to keep a copy.',
        )
      )
        return;
      save(next);
      setSession(null);
      setNotice('Progress restored from your backup.');
    } catch (e) {
      setNotice((e as Error).message);
    } finally {
      if (importInput.current) importInput.current.value = '';
    }
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('library');
          }}
          aria-label="Recall home"
        >
          <span>
            <BookOpen size={24} strokeWidth={1.6} />
          </span>
          Recall<span className="brand-period">.</span>
        </a>
        <nav aria-label="Main navigation" className="main-nav">
          <button
            className={view === 'library' ? 'active' : ''}
            aria-current={view === 'library' ? 'page' : undefined}
            onClick={() => navigate('library')}
          >
            <BookOpen size={20} />
            Library
          </button>
          <button
            className={view === 'flashcards' ? 'active' : ''}
            aria-current={view === 'flashcards' ? 'page' : undefined}
            onClick={() => navigate('flashcards')}
          >
            <Layers size={20} />
            Flashcards
          </button>
        </nav>
        <div className="field-navigation">
          <h2>Fields</h2>
          <nav aria-label="Browse fields">
            <button
              className={view === 'library' && field === 'all' ? 'field-active' : ''}
              onClick={() => navigate('library', 'all')}
            >
              <LayoutGrid size={17} />
              All fields<span>{concepts.length}</span>
            </button>
            {fields.map((f) => (
              <button
                key={f.id}
                className={view === 'library' && field === f.id ? 'field-active' : ''}
                onClick={() => navigate('library', f.id)}
              >
                <FieldIcon field={f.id} size={18} />
                {f.name}
                <span>4</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="sidebar-bottom">
          <div className="storage-status">
            <HardDrive size={16} />
            <span>{storageError ? 'Backup recommended' : 'Saved on this device'}</span>
            <i className={storageError ? 'storage-dot warning' : 'storage-dot'} />
          </div>
          <div className="backup-buttons">
            <button onClick={exportProgress}>
              <Download size={15} />
              Export
            </button>
            <button onClick={() => importInput.current?.click()}>
              <Upload size={15} />
              Import
            </button>
          </div>
          <p>Your knowledge. Your own pace.</p>
          <input
            ref={importInput}
            className="sr-only"
            type="file"
            accept=".json,application/json"
            aria-label="Import progress backup"
            onChange={(e) => {
              void importProgress(e.target.files?.[0]);
            }}
          />
        </div>
      </aside>
      <main id="main" ref={main} tabIndex={-1}>
        <header className="topbar">
          <div className="breadcrumb">
            <Home size={15} />
            <ChevronRight size={14} />
            <span>Computer science</span>
            {view === 'flashcards' && (
              <>
                <ChevronRight size={14} />
                <span>Flashcards</span>
              </>
            )}
          </div>
          {view === 'library' ? (
            <button className="button primary top-action" onClick={() => navigate('flashcards')}>
              <Play size={15} />
              Practice flashcards
            </button>
          ) : (
            <button className="button secondary top-action" onClick={() => navigate('library')}>
              <BookOpen size={16} />
              Back to library
            </button>
          )}
        </header>
        {storageError && (
          <div className="banner warning-banner" role="alert">
            {storageError}
            <button className="text-button" onClick={exportProgress}>
              Export backup
              <Download size={15} />
            </button>
          </div>
        )}
        {notice && (
          <div className="banner" role="status">
            <span>{notice}</span>
            <button
              className="icon-button"
              aria-label="Dismiss notification"
              onClick={() => setNotice('')}
            >
              <X size={17} />
            </button>
          </div>
        )}
        <div className="page-content">
          {view === 'library' ? (
            <Library
              field={field}
              onField={setField}
              progress={progress}
              onOpen={setArticle}
              onPractice={() => navigate('flashcards')}
            />
          ) : (
            <Flashcards
              key={practiceField}
              progress={progress}
              initialField={practiceField}
              session={session}
              setSession={setSession}
              onRate={rate}
              onOpen={setArticle}
              onLibrary={() => navigate('library')}
            />
          )}
        </div>
        <footer className="main-footer">
          <span>Built for understanding, one concept at a time.</span>
          <span>
            Computer science fundamentals
            <ArrowRight size={12} />
          </span>
        </footer>
      </main>
      {article && (
        <Reader
          key={article.id}
          concept={article}
          progress={progress}
          onRead={markRead}
          onClose={() => setArticle(null)}
          onPractice={view === 'library' ? () => navigate('flashcards', article.field) : undefined}
        />
      )}
    </div>
  );
}
