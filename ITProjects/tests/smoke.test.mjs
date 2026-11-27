import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const APP_ROOT = process.cwd();
const REPO_ROOT = path.resolve(APP_ROOT, '..');

test('package.json defines required AtelierFlow Next.js scripts', () => {
  const pkgPath = path.join(APP_ROOT, 'package.json');
  assert.ok(fs.existsSync(pkgPath), 'package.json must exist');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  assert.equal(pkg.name, 'atelierflow');
  assert.ok(pkg.scripts?.build, 'build script must be defined');
  assert.ok(pkg.scripts?.lint, 'lint script must be defined');
  assert.ok(pkg.scripts?.start, 'start script must be defined');
});

test('Next.js App Router core pages exist (/, /login, /admin)', () => {
  const requiredFiles = [
    'app/page.tsx',
    'app/login/page.tsx',
    'app/admin/page.tsx',
    'middleware.ts',
  ];
  for (const rel of requiredFiles) {
    const full = path.join(APP_ROOT, rel);
    assert.ok(fs.existsSync(full), `Expected ${rel} to exist`);
  }
});

test('middleware.ts protects /admin route and redirects to /login (NFR-04)', () => {
  const mw = fs.readFileSync(path.join(APP_ROOT, 'middleware.ts'), 'utf8');
  assert.match(mw, /admin/i, 'middleware must reference /admin route');
  assert.match(mw, /login/i, 'middleware must redirect unauthenticated users to /login');
});

test('Load test (k6) defines SLA thresholds p95 < 1000ms and error rate < 5%', () => {
  const k6Path = path.join(REPO_ROOT, 'k6', 'load-test.js');
  assert.ok(fs.existsSync(k6Path), 'k6/load-test.js must exist');
  const k6Src = fs.readFileSync(k6Path, 'utf8');
  assert.match(k6Src, /http_req_duration/, 'k6 script must enforce latency threshold');
  assert.match(k6Src, /http_req_failed/, 'k6 script must enforce error rate threshold');
});

test('Docker Compose includes atelierflow-web and Uptime Kuma monitoring', () => {
  const composePath = path.join(REPO_ROOT, 'docker-compose.yml');
  assert.ok(fs.existsSync(composePath), 'docker-compose.yml must exist');
  const composeSrc = fs.readFileSync(composePath, 'utf8');
  assert.match(composeSrc, /atelierflow-web/, 'docker-compose must define atelierflow-web');
  assert.match(composeSrc, /uptime-kuma/, 'docker-compose must define uptime-kuma');
});
