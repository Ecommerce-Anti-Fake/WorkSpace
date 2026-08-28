import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const backendRoot = join(root, 'back-end');
const frontendRoot = join(root, 'Front-End');
const outputRoot = join(root, 'docs', 'performance');

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
      files.push(...(await walk(path)));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}

function md(value) {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function routeShape(path) {
  return path
    .replaceAll(/\$\{[^}]+\}/g, ':param')
    .replaceAll(/\([^)]*\)/g, ':param')
    .split('?')[0]
    .replaceAll(/\/+/g, '/')
    .replace(/\/$/, '') || '/';
}

function pathMatches(route, reference) {
  const left = routeShape(route).split('/').filter(Boolean);
  const right = routeShape(reference).split('/').filter(Boolean);
  return left.length === right.length && left.every((part, index) => part.startsWith(':') || part === right[index] || right[index].startsWith(':'));
}

function decoratorValue(match) {
  return (match?.[2] ?? '').trim().replace(/^['"]|['"]$/g, '');
}

async function buildApiInventory() {
  const files = (await walk(join(backendRoot, 'apps', 'api-gateway', 'src'))).filter((file) => file.endsWith('.controller.ts'));
  const frontendFiles = (await walk(join(frontendRoot, 'src', 'services'))).filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'));
  const frontendRefs = [];
  for (const file of frontendFiles) {
    const source = await readFile(file, 'utf8');
    const regex = /(?:`|'|")([^`'"\r\n]*\/api\/[^`'"\r\n]*)/g;
    for (const match of source.matchAll(regex)) {
      const raw = match[1];
      const methodMatch = source.slice(Math.max(0, match.index - 180), match.index + 320).match(/method\s*:\s*['"](GET|POST|PUT|PATCH|DELETE)/i);
      frontendRefs.push({
        method: (methodMatch?.[1] ?? 'GET').toUpperCase(),
        path: routeShape(raw.slice(raw.indexOf('/api/'))),
        file: relative(root, file).replaceAll('\\', '/'),
      });
    }
  }

  const routes = [];
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const controller = source.match(/@Controller\((['"]?)([^'")]*)\1\)/);
    const base = controller?.[2] ?? '';
    const guardNames = [...new Set([...source.matchAll(/@UseGuards\(([^)]*)\)/g)].map((match) => match[1].replaceAll(/\s+/g, ' ').trim()))];
    const roleNames = [...new Set([...source.matchAll(/@Roles\(([^)]*)\)/g)].map((match) => match[1].replaceAll(/\s+/g, ' ').trim()))];
    const routeRegex = /^\s*@(Get|Post|Put|Patch|Delete|Options|Head|Sse)\(([^)]*)\)/gm;
    for (const match of source.matchAll(routeRegex)) {
      const route = routeShape(`/api/${base}/${decoratorValue([null, null, match[2]])}`);
      const callers = frontendRefs.filter((ref) => ref.method === match[1].toUpperCase() && pathMatches(route, ref.path)).map((ref) => ref.file);
      routes.push({
        method: match[1].toUpperCase(),
        route,
        source: relative(root, file).replaceAll('\\', '/'),
        module: relative(join(backendRoot, 'apps', 'api-gateway', 'src', 'modules'), dirname(file)).replaceAll('\\', '/') || 'observability',
        guards: [roleNames.length ? `roles: ${roleNames.join(', ')}` : '', guardNames.length ? `guards: ${guardNames.join(', ')}` : ''].filter(Boolean).join('; ') || 'global JWT/ownership or public decorator; verify in source',
        callers: [...new Set(callers)].join(', ') || 'not statically matched',
      });
    }
  }

  routes.sort((a, b) => a.route.localeCompare(b.route) || a.method.localeCompare(b.method));
  const lines = [
    '# API inventory',
    '',
    `Generated from gateway controllers and frontend services on ${new Date().toISOString().slice(0, 10)}.`,
    '',
    `Static inventory: **${routes.length} gateway routes**, **${frontendRefs.length} frontend URL references**.`,
    'The caller column is conservative static matching; `not statically matched` means runtime/indirect use still needs browser or API smoke evidence.',
    'Role/ownership rules can also live in guards and application use-cases, so this document is an index, not an authorization specification.',
    '',
    '| Method | URL | Gateway module | Controller | Guard/role hints | Frontend caller(s) |',
    '|---|---|---|---|---|---|',
    ...routes.map((route) => `| ${route.method} | \`${md(route.route)}\` | ${md(route.module)} | \`${md(route.source)}\` | ${md(route.guards)} | ${md(route.callers)} |`),
    '',
    '## Frontend references not matched to a controller',
    '',
    ...frontendRefs.filter((ref) => !routes.some((route) => route.method === ref.method && pathMatches(route.route, ref.path))).map((ref) => `- ${ref.method} \`${md(ref.path)}\` — \`${md(ref.file)}\``),
  ];
  return lines.join('\n') + '\n';
}

async function buildDatabaseInventory() {
  const schema = await readFile(join(backendRoot, 'prisma', 'schema.prisma'), 'utf8');
  const sourceFiles = (await walk(join(backendRoot, 'libs'))).filter((file) => file.endsWith('.ts'));
  const uses = new Map();
  for (const file of sourceFiles) {
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(/prisma\.([A-Za-z0-9_]+)\.(findMany|findFirst|findUnique|createMany|create|updateMany|update|upsert|deleteMany|delete|count|aggregate|groupBy)\b/g)) {
      const key = `${match[1]}:${match[2]}`;
      const item = uses.get(key) ?? { model: match[1], operations: new Set(), files: new Set() };
      item.operations.add(match[2]);
      item.files.add(relative(root, file).replaceAll('\\', '/'));
      uses.set(key, item);
    }
  }

  const models = [];
  for (const match of schema.matchAll(/^model\s+(\w+)\s*\{([\s\S]*?)^\}/gm)) {
    const body = match[2];
    const indexes = body.split('\n').filter((line) => /@@(index|unique)|@unique/.test(line)).map((line) => line.trim());
    const model = match[1];
    const prismaModel = model[0].toLowerCase() + model.slice(1);
    const queryUses = [...uses.values()].filter((item) => item.model === prismaModel).map((item) => `${[...item.operations].sort().join(', ')} (${[...item.files].slice(0, 3).join(', ')})`);
    models.push({ model, indexes, queryUses });
  }

  const lines = [
    '# Database and Prisma query map',
    '',
    'Generated from `back-end/prisma/schema.prisma` and `back-end/libs` on ' + new Date().toISOString().slice(0, 10) + '.',
    '',
    `The merged schema contains **${models.length} models**. Query locations below are static references; timing and query-count claims require runtime instrumentation.`,
    '',
    '| Model | Declared indexes/uniques | Observed Prisma operations and locations |',
    '|---|---|---|',
    ...models.map((item) => `| \`${item.model}\` | ${item.indexes.length ? item.indexes.map(md).join('<br>') : 'none declared in model'} | ${item.queryUses.length ? item.queryUses.map(md).join('<br>') : 'no direct `prisma.<model>` use found in libs'} |`),
    '',
    '## Static audit flags',
    '',
    '- Validate every high-volume list against actual `take`/cursor limits; source-level inventory cannot prove effective caps after DTO transformation.',
    '- Use `EXPLAIN (ANALYZE, BUFFERS)` on production-like data before adding indexes.',
    '- Treat `include`, count/aggregate, loops around Prisma calls, and network calls inside transactions as review candidates, not confirmed bottlenecks.',
    '- Prisma uses one `PrismaService` provider per imported module; confirm process-level client/connection behavior with runtime connection metrics before changing pool settings.',
  ];
  return lines.join('\n') + '\n';
}

await mkdir(outputRoot, { recursive: true });
await writeFile(join(outputRoot, 'api-inventory.md'), await buildApiInventory(), 'utf8');
await writeFile(join(outputRoot, 'database-query-map.md'), await buildDatabaseInventory(), 'utf8');
console.log(JSON.stringify({ outputRoot: relative(root, outputRoot).replaceAll('\\', '/'), generated: ['api-inventory.md', 'database-query-map.md'] }));
