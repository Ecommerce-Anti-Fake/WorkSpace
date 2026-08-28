const baseUrl = (process.env.SMOKE_BASE_URL ?? 'https://antifake.io.vn').replace(/\/$/, '');
const paths = (process.env.SMOKE_PATHS ?? '/,/auth,/search,/categories,/live,/community,/cart,/profile,/notification,/messages,/seller,/admin')
  .split(',')
  .map((path) => path.trim())
  .filter(Boolean);

const results = [];
for (const path of paths) {
  const started = performance.now();
  try {
    const response = await fetch(`${baseUrl}${path}`, { redirect: 'follow' });
    const body = await response.arrayBuffer();
    results.push({
      path,
      status: response.status,
      finalUrl: new URL(response.url).pathname,
      durationMs: performance.now() - started,
      bytes: body.byteLength,
    });
  } catch (error) {
    results.push({ path, error: error instanceof Error ? `${error.name}: ${error.message}` : 'unknown error' });
  }
}

const report = {
  measuredAt: new Date().toISOString(),
  baseUrl,
  results,
  note: 'Read-only GET smoke. No credentials, request bodies or response bodies are logged.',
};
if (process.env.SMOKE_OUTPUT_FILE) {
  const { mkdir, writeFile } = await import('node:fs/promises');
  const { dirname } = await import('node:path');
  await mkdir(dirname(process.env.SMOKE_OUTPUT_FILE), { recursive: true });
  await writeFile(process.env.SMOKE_OUTPUT_FILE, JSON.stringify(report, null, 2) + '\n', 'utf8');
}
console.log(JSON.stringify(report, null, 2));
