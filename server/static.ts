import type { IncomingMessage, ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
};
/** Serve only built assets; API routing and origin checks remain in the HTTP layer. */
export async function serveStatic(
  req: IncomingMessage,
  res: ServerResponse,
  directory: string,
): Promise<void> {
  if (!['GET', 'HEAD'].includes(req.method ?? '')) {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, HEAD');
    res.end();
    return;
  }
  let pathname: string;
  try {
    pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  } catch {
    res.statusCode = 400;
    res.end();
    return;
  }
  const root = resolve(directory),
    target = resolve(root, pathname === '/' ? 'index.html' : '.' + pathname);
  if (!target.startsWith(root + sep) || pathname.includes('\0') || pathname.includes('\\')) {
    res.statusCode = 404;
    res.end();
    return;
  }
  try {
    const body = await readFile(target);
    res.setHeader('Content-Type', types[extname(target)] ?? 'application/octet-stream');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Length', body.length);
    res.setHeader(
      'Cache-Control',
      pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'no-store',
    );
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not found');
  }
}
