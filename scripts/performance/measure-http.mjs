import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const baseUrl = (process.env.PERF_BASE_URL ?? 'http://127.0.0.1:3001').replace(/\/$/, '');
const paths = (process.env.PERF_PATHS ?? '/api/health,/api/offers?page=1&pageSize=10,/api/categories,/api/brands,/api/shops?page=1&pageSize=10,/api/live/sessions?page=1&pageSize=10')
  .split(',')
  .map((path) => path.trim())
  .filter(Boolean);
const iterations = Number(process.env.PERF_ITERATIONS ?? 3);
const concurrency = Number(process.env.PERF_CONCURRENCY ?? 1);
const bearerToken = process.env.PERF_BEARER_TOKEN?.trim();

function percentile(values, fraction) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)];
}

async function measure(path) {
  const samples = [];
  const statuses = {};
  let errors = 0;
  for (let start = 0; start < iterations; start += concurrency) {
    const batch = Array.from({ length: Math.min(concurrency, iterations - start) }, async () => {
      const started = performance.now();
      try {
        const response = await fetch(`${baseUrl}${path}`, {
          headers: bearerToken ? { authorization: `Bearer ${bearerToken}` } : undefined,
          redirect: 'manual',
        });
        const body = await response.arrayBuffer();
        const durationMs = performance.now() - started;
        samples.push({ durationMs, bytes: body.byteLength });
        statuses[response.status] = (statuses[response.status] ?? 0) + 1;
        if (!response.ok) errors += 1;
      } catch {
        errors += 1;
        samples.push({ durationMs: performance.now() - started, bytes: 0 });
      }
    });
    await Promise.all(batch);
  }
  const durations = samples.map((sample) => sample.durationMs);
  const bytes = samples.map((sample) => sample.bytes);
  return {
    path,
    iterations,
    concurrency,
    p50Ms: percentile(durations, 0.5),
    p95Ms: percentile(durations, 0.95),
    p99Ms: percentile(durations, 0.99),
    minMs: durations.length ? Math.min(...durations) : null,
    maxMs: durations.length ? Math.max(...durations) : null,
    averageBytes: bytes.length ? Math.round(bytes.reduce((sum, value) => sum + value, 0) / bytes.length) : null,
    statuses,
    errorRate: iterations ? errors / iterations : null,
  };
}

const results = [];
for (const path of paths) results.push(await measure(path));
const report = {
  measuredAt: new Date().toISOString(),
  baseUrl,
  results,
  note: 'Response bodies, authorization values and cookies are intentionally not logged.',
};
const outputFile = process.env.PERF_OUTPUT_FILE;
if (outputFile) {
  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, JSON.stringify(report, null, 2) + '\n', 'utf8');
}
console.log(JSON.stringify(report, null, 2));
