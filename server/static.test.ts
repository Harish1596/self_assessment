import { it, expect } from 'vitest';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApi } from './http';
import { testDatabase } from './test-db';
it('serves the built app and API on one origin without exposing other files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'recall-static-'));
  const dist = join(root, 'dist');
  await mkdir(join(dist, 'assets'), { recursive: true });
  await writeFile(join(dist, 'index.html'), '<html>Recall</html>');
  await writeFile(join(dist, 'assets', 'app.js'), 'console.log("Recall")');
  await writeFile(join(root, 'private.txt'), 'private');
  const db = await testDatabase(),
    server = createApi(db, dist);
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const url = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  try {
    const page = await fetch(url);
    expect(await page.text()).toContain('Recall');
    expect(page.headers.get('content-type')).toContain('text/html');
    expect(page.headers.get('cache-control')).toBe('no-store');
    const js = await fetch(url + '/assets/app.js');
    expect(js.headers.get('content-type')).toContain('text/javascript');
    expect(js.headers.get('cache-control')).toContain('immutable');
    expect(
      (await fetch(url + '/assets/app.js', { method: 'HEAD' })).headers.get('content-length'),
    ).toBe('21');
    expect((await fetch(url + '/api/health')).status).toBe(200);
    for (const path of ['/missing.js', '/%2e%2e%2fprivate.txt', '/.env', '/%5c..%5cprivate.txt'])
      expect((await fetch(url + path)).status).toBe(404);
    expect((await fetch(url + '/api/unknown')).status).toBe(404);
    expect(
      (
        await fetch(url + '/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        })
      ).status,
    ).toBe(405);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await db.close();
    await rm(root, { recursive: true, force: true });
  }
}, 20000);
