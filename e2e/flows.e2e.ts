import { test, expect } from '@playwright/test';
import { cards, concepts, fields, fieldCounts } from '../src/data';

test('library search, sourced reader, read state and refresh persistence', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page).toHaveTitle('Recall — Computer science foundations');
  await expect(page.getByRole('heading', { name: 'A stronger foundation.' })).toBeVisible();
  await expect(page.locator('.concept-row')).toHaveCount(concepts.length);
  await page.screenshot({ path: '/private/tmp/recall-desktop.png', fullPage: false });
  await page.getByRole('textbox', { name: 'Search knowledge library' }).fill('binary');
  await expect(page.getByRole('button', { name: /Binary & hexadecimal/ })).toBeVisible();
  await page.getByRole('button', { name: /Binary & hexadecimal/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Binary & hexadecimal' })).toBeVisible();
  await expect(dialog.getByRole('link', { name: /Harvard CS50/ })).toHaveAttribute(
    'href',
    'https://cs50.harvard.edu/x/notes/0/',
  );
  await dialog.getByRole('button', { name: 'Mark as read', exact: true }).click();
  await expect(dialog.getByRole('button', { name: 'Read · mark unread' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await page.reload();
  await expect(page.getByText(`1 of ${concepts.length} read`)).toBeVisible();
  await page.getByRole('textbox', { name: 'Search knowledge library' }).fill('zzzznotfound');
  await expect(page.getByRole('heading', { name: 'No matching concepts' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.concept-row')).toHaveCount(concepts.length);
  await page.getByRole('combobox', { name: 'Filter library by field' }).selectOption('systems');
  await expect(page.locator('.concept-row')).toHaveCount(fieldCounts.systems.concepts);
  expect(errors).toEqual([]);
});

test('single-field flashcards reveal, rate, preserve reader state and show results', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Practice flashcards', exact: true }).click();
  await page.getByRole('radio', { name: /Single field/ }).check();
  await page.getByRole('radio', { name: /Algorithms/ }).check();
  await page.getByRole('combobox', { name: 'Session length' }).selectOption('5');
  await page.screenshot({ path: '/private/tmp/recall-setup.png', fullPage: false });
  await page.getByRole('button', { name: 'Start session', exact: true }).click();
  await expect(page.locator('.session-field-summary')).toHaveText('Your fields: Algorithms');
  await expect(page.locator('#question-title')).toBeFocused();
  const exitPrompt = page.waitForEvent('dialog');
  await page.evaluate(() => {
    setTimeout(() => window.location.reload(), 0);
  });
  const prompt = await exitPrompt;
  expect(prompt.type()).toBe('beforeunload');
  await prompt.dismiss();
  await expect(page.getByText('Question 1 of 5', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confident', exact: true })).toHaveCount(0);
  const seen: string[] = [];
  for (let i = 0; i < 5; i++) {
    seen.push(await page.locator('#question-title').innerText());
    await expect(page.getByText(`Question ${i + 1} of 5`, { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Reveal answer', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Expected answer', exact: true })).toBeFocused();
    if (i === 0) {
      await page.getByRole('button', { name: 'Read the explanation' }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(
        page.getByRole('heading', { name: 'Expected answer', exact: true }),
      ).toBeVisible();
      await page.screenshot({ path: '/private/tmp/recall-card.png', fullPage: false });
    }
    await page
      .getByRole('button', { name: i === 0 ? 'Needs practice' : 'Confident', exact: true })
      .click();
  }
  expect(new Set(seen).size).toBe(5);
  await expect(page.getByRole('heading', { name: 'One session stronger.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'One session stronger.' })).toBeFocused();
  await expect(page.locator('.result-counts .confident strong')).toHaveText('4');
  await expect(page.locator('.result-counts .practice strong')).toHaveText('1');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('recall-progress-v1')!));
  expect(Object.keys(saved.ratings)).toHaveLength(5);
  await page.getByRole('button', { name: 'Practise 1 to revisit' }).click();
  await expect(page.getByText('Question 1 of 1', { exact: true })).toBeVisible();
  await expect(page.locator('#question-title')).toHaveText(seen[0]);
});

test('multiple and random fields work, invalid backup preserves data and valid backup restores it', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Practice flashcards', exact: true }).click();
  for (const field of fields.filter((field) => !['algorithms', 'databases'].includes(field.id)))
    await page
      .getByRole('checkbox', {
        name: new RegExp(field.name),
      })
      .uncheck();
  await page.getByRole('button', { name: 'Start session', exact: true }).click();
  const selectedFields = (await page.locator('.session-field-summary').innerText())
    .replace('Your fields: ', '')
    .split(' · ');
  expect(new Set(selectedFields)).toEqual(new Set(['Algorithms', 'Databases']));
  page.on('dialog', (d) => d.accept());
  await page.getByRole('button', { name: 'End session', exact: true }).click();
  await page.getByRole('radio', { name: /Random fields/ }).check();
  await page.getByRole('button', { name: 'Start session', exact: true }).click();
  const fieldText = await page.locator('.session-field-summary').innerText();
  expect(fieldText.split(' · ').length).toBeGreaterThanOrEqual(2);
  await page.getByRole('button', { name: 'End session', exact: true }).click();
  const upload = page.getByLabel('Import progress backup');
  await upload.setInputFiles({
    name: 'bad.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":9}'),
  });
  await expect(page.getByRole('status')).toContainText('not a valid Recall');
  expect(await page.evaluate(() => localStorage.getItem('recall-progress-v1'))).toBeNull();
  const p = {
    version: 1,
    read: ['binary'],
    ratings: {
      'binary-1': { rating: 'partial', reviewedAt: '2026-11-07T00:00:00.000Z', reviews: 1 },
    },
  };
  await upload.setInputFiles({
    name: 'valid.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(p)),
  });
  await expect(page.getByRole('status')).toContainText('Progress restored');
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('recall-progress-v1')!)),
  ).toEqual(p);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^recall-progress-.*\.json$/);
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  expect(JSON.parse(Buffer.concat(chunks).toString())).toEqual(p);
});

test('mobile layout, keyboard entry, and unavailable browser storage remain usable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('storage unavailable');
    };
  });
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  await page.locator('#main').evaluate((element) => element.blur());
  await page.evaluate(() => window.scrollTo(0, 0));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '/private/tmp/recall-mobile.png', fullPage: false });
  await page.getByRole('button', { name: /Binary & hexadecimal/ }).click();
  await page.getByRole('button', { name: 'Mark as read', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('alert')).toContainText('Browser storage is unavailable');
  await page.getByRole('button', { name: 'Practice flashcards', exact: true }).click();
  await page.getByRole('button', { name: 'Start session', exact: true }).click();
  await page.getByRole('button', { name: 'Reveal answer', exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '/private/tmp/recall-mobile-card.png', fullPage: false });
  expect(errors).toEqual([]);
});

test('absolute basics are browsable and full-field sessions use the actual question bank', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('combobox', { name: 'Filter library by field' }).selectOption('computing');
  await expect(page.locator('.concept-row')).toHaveCount(fieldCounts.computing.concepts);
  await expect(page.locator('.library-meta')).toContainText(
    `${fieldCounts.computing.cards} flashcards`,
  );
  const firstConcept = concepts.find((concept) => concept.field === 'computing')!;
  await page.locator('.concept-row').first().click();
  await expect(
    page.getByRole('dialog').getByRole('heading', { name: firstConcept.title }),
  ).toBeVisible();
  await expect(page.getByRole('dialog').locator('.sources a').first()).toHaveAttribute(
    'href',
    firstConcept.sources[0].url,
  );
  await page.getByRole('button', { name: 'Practise this field' }).click();
  await expect(page.getByRole('radio', { name: /Single field/ })).toBeChecked();
  await page.getByRole('combobox', { name: 'Session length' }).selectOption(String(cards.length));
  await page.getByRole('button', { name: 'Start session', exact: true }).click();
  await expect(
    page.getByText(`Question 1 of ${fieldCounts.computing.cards}`, { exact: true }),
  ).toBeVisible();
  await expect(page.locator('.session-field-summary')).toHaveText('Your fields: Computer basics');
  await page.screenshot({
    path: '/private/tmp/recall-computing-fundamentals.png',
    fullPage: false,
  });
});
