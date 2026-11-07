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
import { concepts, fields, fieldCounts, installCatalogue } from './data';
import { parseProgress, STORAGE_KEY } from './domain';
import { api } from './api';
import { FieldIcon, Reader } from './components';
import Library from './Library';
import Flashcards from './Flashcards';
import type { Bootstrap, StoredSession } from '../shared/contracts';
import type { Concept, SessionConfig } from './types';

export type Draft = { itemId: string; answerText: string; selectedChoiceIds: string[] };
export default function App() {
  const [initial, setInitial] = useState<Bootstrap | null>(null);
  const [error, setError] = useState('');
  const [migrationError, setMigrationError] = useState('');
  const [loading, setLoading] = useState(false);
  async function load() {
    setLoading(true);
    setError('');
    try {
      let result = await api.bootstrap();
      installCatalogue(result.catalogue);
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          await api.import(parseProgress(raw), true);
          result = await api.bootstrap();
        }
      } catch {
        setMigrationError(
          'Existing browser progress could not be migrated. It has been preserved. Use Import to retry your progress backup.',
        );
      }
      setInitial(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  if (!initial)
    return (
      <main className="page-content">
        <h1>Recall.</h1>
        <p role={error ? 'alert' : 'status'}>{error || 'Opening your library…'}</p>
        {!loading && (
          <button className="button primary" onClick={() => void load()}>
            Retry connection
          </button>
        )}
      </main>
    );
  return <RecallApp initial={initial} migrationError={migrationError} />;
}
function RecallApp({ initial, migrationError }: { initial: Bootstrap; migrationError: string }) {
  const [progress, setProgress] = useState(initial.progress);
  const [storageError, setStorageError] = useState(migrationError);
  const [notice, setNotice] = useState('');
  const [view, setView] = useState<'library' | 'flashcards'>('library');
  const [field, setField] = useState('all');
  const [practiceField, setPracticeField] = useState('all');
  const [article, setArticle] = useState<Concept | null>(null);
  const [session, setSession] = useState<StoredSession | null>(null);
  const [history, setHistory] = useState(initial.sessions);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [draftError, setDraftError] = useState('');
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const lock = useRef(false);
  const importInput = useRef<HTMLInputElement>(null);
  const main = useRef<HTMLElement>(null);
  async function refresh() {
    const data = await api.bootstrap();
    setProgress(data.progress);
    setHistory(data.sessions);
  }
  async function perform(run: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    try {
      await run();
      setStorageError('');
    } catch (e) {
      setStorageError((e as Error).message);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function accept(next: StoredSession) {
    sessionRef.current = next;
    setSession(next);
  }
  async function saveDraft() {
    const current = sessionRef.current,
      d = draftRef.current;
    if (!current || !d) return;
    const item = current.items.find((i) => i.id === d.itemId);
    if (!item || item.status !== 'pending' || current.status !== 'active') return;
    if (
      item.answerText === d.answerText &&
      JSON.stringify(item.selectedChoiceIds) === JSON.stringify(d.selectedChoiceIds)
    )
      return;
    const next = await api.change(current, { action: 'answer', itemId: d.itemId, response: d });
    accept(next);
    setDraftError('');
  }
  useEffect(() => {
    const item = session?.items.find((i) => i.id === draft?.itemId);
    if (
      !draft ||
      busy ||
      draftError ||
      !item ||
      item.status !== 'pending' ||
      session?.status !== 'active' ||
      (item.answerText === draft.answerText &&
        JSON.stringify(item.selectedChoiceIds) === JSON.stringify(draft.selectedChoiceIds))
    )
      return;
    const timer = setTimeout(() => {
      void perform(async () => {
        try {
          await saveDraft();
        } catch (e) {
          setDraftError((e as Error).message);
          throw e;
        }
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [draft, busy, draftError]);
  const pending = Boolean(
    draft &&
    session?.items.some(
      (i) =>
        i.id === draft.itemId &&
        i.status === 'pending' &&
        (i.answerText !== draft.answerText ||
          JSON.stringify(i.selectedChoiceIds) !== JSON.stringify(draft.selectedChoiceIds)),
    ),
  );
  useEffect(() => {
    if (!pending) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [pending]);
  function navigate(next: 'library' | 'flashcards', nextField?: string) {
    setArticle(null);
    setView(next);
    if (nextField !== undefined) setField(nextField);
    if (next === 'flashcards') setPracticeField(nextField ?? field);
    main.current?.scrollTo(0, 0);
  }
  function markRead(id: string) {
    void perform(async () => {
      setProgress(await api.read(id, !progress.read.includes(id)));
    });
  }
  function start(config: SessionConfig, cardIds?: string[]) {
    void perform(async () => {
      await saveDraft();
      accept(await api.start(config, cardIds));
      setDraft(null);
      setDraftError('');
      await refresh();
    });
  }
  function action(action: string, itemId?: string, rating?: string) {
    void perform(async () => {
      const current = sessionRef.current;
      if (!current) return;
      const response = draftRef.current?.itemId === itemId ? draftRef.current : undefined;
      if (action !== 'reveal') await saveDraft();
      accept(
        await api.change(sessionRef.current!, {
          action,
          itemId,
          rating,
          ...(action === 'reveal' && response ? { response } : {}),
        }),
      );
      if (action === 'reveal' || action === 'rate') {
        setDraft(null);
        setDraftError('');
      }
      await refresh();
    });
  }
  function openSession(id: string) {
    void perform(async () => {
      await saveDraft();
      accept(await api.session(id));
      setDraft(null);
      setDraftError('');
    });
  }
  function closeSession() {
    void perform(async () => {
      await saveDraft();
      setSession(null);
      setDraft(null);
      await refresh();
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
    setNotice(
      'Progress exported. Session answers and library content remain in your database; see README for full database backups.',
    );
  }
  async function importProgress(file?: File) {
    if (!file) return;
    try {
      if (file.size > 1_000_000) throw new Error('Choose a progress backup smaller than 1 MB.');
      const next = parseProgress(await file.text());
      if (
        !window.confirm(
          'Replace current read progress and latest ratings? Historical sessions will remain. Export first to keep a copy.',
        )
      )
        return;
      await perform(async () => {
        await saveDraft();
        setProgress(await api.import(next));
        setNotice('Progress restored. Session history has been preserved.');
      });
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
                <span>{fieldCounts[f.id].concepts}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="sidebar-bottom">
          <div className="storage-status">
            <HardDrive size={16} />
            <span>
              {storageError
                ? 'Save needs attention'
                : busy || pending
                  ? 'Saving…'
                  : 'Saved in local database'}
            </span>
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
              progress={progress}
              initialField={practiceField}
              session={session}
              history={history}
              busy={busy}
              draft={draft}
              pending={pending}
              draftError={draftError}
              onDraft={setDraft}
              onRetrySave={() => {
                setDraftError('');
                void perform(saveDraft);
              }}
              onStart={start}
              onAction={action}
              onSession={openSession}
              onCloseSession={closeSession}
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
