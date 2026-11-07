import { test, expect } from '@playwright/test';
import { Pool } from 'pg';
import { cards, concepts, fields, fieldCounts } from '../src/seed-data';
const url = new URL(
  process.env.DATABASE_URL ?? 'postgresql://recall:recall_local@127.0.0.1:54329/recall',
);
url.pathname = '/recall_e2e';
const db = new Pool({ connectionString: url.toString() });
test.beforeEach(async () => {
  // Only reset the dedicated e2e database, never the personal database.
  await db.query('TRUNCATE session_items,sessions,read_progress,card_progress,legacy_imports');
  await db.query("UPDATE fields SET archived_at=now() WHERE id='choice-field'");
});
test.afterAll(async () => {
  await db.end();
});
async function practice(page: any) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Practice flashcards', exact: true }).click();
}
async function start(page: any, field = 'Algorithms') {
  await practice(page);
  await page.getByRole('radio', { name: /Single field/ }).check();
  await page.getByRole('radio', { name: new RegExp(field) }).check();
  await page.getByRole('combobox', { name: 'Session length' }).selectOption('5');
  await page.getByRole('button', { name: 'Start session', exact: true }).click();
  await expect(page.locator('#question-title')).toBeVisible();
}

test('library search, sources, read progress and mobile keyboard access', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('.concept-row')).toHaveCount(concepts.length);
  await page.screenshot({ path: '/private/tmp/recall-desktop.png' });
  await page.getByRole('textbox', { name: 'Search knowledge library' }).fill('binary');
  await page.getByRole('button', { name: /Binary & hexadecimal/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('link', { name: /Harvard CS50/ })).toHaveAttribute(
    'href',
    'https://cs50.harvard.edu/x/notes/0/',
  );
  await dialog.getByRole('button', { name: 'Mark as read', exact: true }).click();
  await expect(dialog.getByRole('button', { name: 'Read · mark unread' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.getByText(`1 of ${concepts.length} read`)).toBeVisible();
  await page.getByRole('combobox', { name: 'Filter library by field' }).selectOption('computing');
  await expect(page.locator('.concept-row')).toHaveCount(fieldCounts.computing.concepts);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(page.locator('.concept-row')).toHaveCount(concepts.length);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '/private/tmp/recall-mobile.png' });
  expect(errors).toEqual([]);
});

test('drafts resume after reload, reveal survives reader and ratings save immediately', async ({
  page,
}) => {
  await start(page);
  await expect(page.getByRole('button', { name: 'Confident', exact: true })).toHaveCount(0);
  const first = await page.locator('#question-title').innerText();
  await page.locator('#answer-notes').fill('My durable answer');
  await expect(page.getByText('Session saved', { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Practice flashcards', exact: true }).click();
  await page.getByRole('button', { name: /Active session/ }).click();
  await expect(page.locator('#question-title')).toHaveText(first);
  await expect(page.locator('#answer-notes')).toHaveValue('My durable answer');
  const seen: string[] = [];
  for (let i = 0; i < 5; i++) {
    seen.push(await page.locator('#question-title').innerText());
    await page.getByRole('button', { name: 'Reveal answer', exact: true }).click();
    await expect(page.locator('#expected-answer')).toBeFocused();
    if (i === 0) {
      await page.getByRole('button', { name: 'Read the explanation' }).click();
      await page.keyboard.press('Escape');
      await expect(page.locator('#expected-answer')).toBeVisible();
      await page.screenshot({ path: '/private/tmp/recall-card.png' });
    }
    await page
      .getByRole('button', { name: i === 0 ? 'Needs practice' : 'Confident', exact: true })
      .click();
    if (i < 4)
      await expect(page.getByText(`Question ${i + 2} of 5`, { exact: true })).toBeVisible();
  }
  expect(new Set(seen).size).toBe(5);
  await expect(page.getByRole('heading', { name: 'One session stronger.' })).toBeVisible();
  expect((await db.query('SELECT count(*)::int AS n FROM card_progress')).rows[0].n).toBe(5);
  await page.locator('.history-answer summary').first().click();
  await expect(page.getByText('My durable answer', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Practise 1 to revisit' }).click();
  await expect(page.getByText('Question 1 of 1', { exact: true })).toBeVisible();
  await expect(page.locator('#question-title')).toHaveText(first);
});

test('mixed/random fields, pause/resume and valid/invalid progress imports', async ({ page }) => {
  await practice(page);
  for (const f of fields.filter((f) => !['algorithms', 'databases'].includes(f.id)))
    await page.getByRole('checkbox', { name: new RegExp(f.name) }).uncheck();
  await page.getByRole('button', { name: 'Start session', exact: true }).click();
  await expect(page.locator('.session-field-summary')).toContainText('Algorithms');
  await expect(page.locator('.session-field-summary')).toContainText('Databases');
  await page.getByRole('button', { name: 'Pause session', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Reveal answer' })).toBeDisabled();
  await page.getByRole('button', { name: 'Resume session', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Reveal answer' })).toBeEnabled();
  page.on('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'End session', exact: true }).click();
  await page.getByRole('button', { name: 'Build another session' }).click();
  await page.getByRole('radio', { name: /Random fields/ }).check();
  await page.getByRole('button', { name: 'Start session', exact: true }).click();
  await expect(page.locator('.session-field-summary')).toContainText(' · ');
  await page.getByRole('button', { name: 'End session', exact: true }).click();
  const upload = page.getByLabel('Import progress backup');
  await upload.setInputFiles({
    name: 'bad.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":9}'),
  });
  await expect(page.getByText(/not a valid Recall/)).toBeVisible();
  const progress = {
    version: 1,
    read: ['binary'],
    ratings: {
      'binary-1': { rating: 'partial', reviewedAt: '2026-11-07T00:00:00.000Z', reviews: 1 },
    },
  };
  await upload.setInputFiles({
    name: 'valid.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(progress)),
  });
  await expect(page.getByText(/Progress restored/)).toBeVisible();
  expect((await db.query('SELECT count(*)::int AS n FROM sessions')).rows[0].n).toBe(2);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  expect(JSON.parse(Buffer.concat(chunks).toString())).toEqual(progress);
});

test('legacy migration is repeatable and database failures keep the answer available', async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'recall-progress-v1',
      JSON.stringify({ version: 1, read: ['binary'], ratings: {} }),
    ),
  );
  await page.goto('/');
  await expect(page.getByText(`1 of ${concepts.length} read`)).toBeVisible();
  await page.reload();
  await expect(page.getByText(`1 of ${concepts.length} read`)).toBeVisible();
  expect((await db.query('SELECT count(*)::int AS n FROM legacy_imports')).rows[0].n).toBe(1);
  await start(page);
  await page.route('**/api/sessions/*', (route) =>
    route.request().method() === 'PATCH'
      ? route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Database save failed.' }),
        })
      : route.continue(),
  );
  await page.locator('#answer-notes').fill('Keep this unsaved text');
  await expect(page.getByRole('alert')).toContainText('Database save failed');
  await expect(page.locator('#answer-notes')).toHaveValue('Keep this unsaved text');
  await page.unroute('**/api/sessions/*');
  await page.getByRole('button', { name: 'Retry save', exact: true }).click();
  await expect(page.getByText('Session saved', { exact: true })).toBeVisible();
  expect(
    (await db.query("SELECT answer_text FROM session_items WHERE answer_text<>''")).rows[0]
      .answer_text,
  ).toBe('Keep this unsaved text');
});

test('multiple correct choices and accepted alternatives work on mobile', async ({
  page,
  request,
}) => {
  const input = {
    fields: [{ id: 'choice-field', name: 'Choice field', description: 'Fixture', color: 'green' }],
    concepts: [
      {
        id: 'choice-concept',
        field: 'choice-field',
        title: 'Choice example',
        summary: 'Example',
        explanation: ['Example'],
        example: 'Example',
        takeaway: 'Example',
        sources: [],
      },
    ],
    cards: [
      {
        id: 'choice-card',
        conceptId: 'choice-concept',
        kind: 'multiple_choice',
        question: 'Choose A and B',
        answers: ['A and B', 'Both options A and B'],
        choices: [
          { id: 'a', label: 'Option A', correct: true },
          { id: 'b', label: 'Option B', correct: true },
          { id: 'c', label: 'Option C', correct: false },
        ],
      },
    ],
  };
  expect((await request.post('/api/catalogue', { data: input })).ok()).toBe(true);
  await db.query("UPDATE fields SET archived_at=NULL WHERE id='choice-field'");
  await page.setViewportSize({ width: 390, height: 844 });
  await start(page, 'Choice field');
  await page.getByRole('checkbox', { name: 'Option A', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Option B', exact: true }).check();
  await page.getByRole('button', { name: 'Reveal answer', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Accepted answers', exact: true })).toBeVisible();
  await expect(page.getByText('Both options A and B', { exact: true })).toBeVisible();
  await expect(page.getByText('Your selection is correct.', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '/private/tmp/recall-mobile-card.png' });
  await page.getByRole('button', { name: 'Confident', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'One session stronger.' })).toBeVisible();
});
