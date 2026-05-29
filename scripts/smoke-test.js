#!/usr/bin/env node

/**
 * Smoke tests for project structure and CI readiness.
 * Does not require a production build (Windows-safe).
 */

const fs = require('fs');
const path = require('path');

console.log('Running smoke tests...\n');

let allTestsPassed = true;

function runTest(name, fn) {
  process.stdout.write(`${name}... `);
  try {
    const ok = fn();
    if (ok) {
      console.log('ok');
      return true;
    }
    console.log('failed');
    allTestsPassed = false;
    return false;
  } catch (error) {
    console.log(`failed (${error.message})`);
    allTestsPassed = false;
    return false;
  }
}

runTest('package.json scripts', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  const required = ['dev', 'build', 'start', 'lint', 'typecheck', 'test', 'ci'];
  return required.every((script) => Boolean(pkg.scripts?.[script]));
});

runTest('TypeScript config', () => fs.existsSync(path.join(process.cwd(), 'tsconfig.json')));

runTest('Next.js config', () =>
  fs.existsSync(path.join(process.cwd(), 'next.config.ts')) ||
  fs.existsSync(path.join(process.cwd(), 'next.config.js'))
);

runTest('env.example', () => fs.existsSync(path.join(process.cwd(), 'env.example')));

runTest('app router structure', () => {
  const required = ['app', 'components', 'lib', 'middleware.ts'];
  return required.every((entry) => fs.existsSync(path.join(process.cwd(), entry)));
});

runTest('project intelligence docs', () =>
  fs.existsSync(path.join(process.cwd(), 'docs/project-intelligence/03-architecture.md'))
);

runTest('dependencies installed', () =>
  fs.existsSync(path.join(process.cwd(), 'node_modules')) &&
  fs.existsSync(path.join(process.cwd(), 'package-lock.json'))
);

runTest('supabase migration present', () =>
  fs.existsSync(path.join(process.cwd(), 'supabase/migrations/002_schema_alignment.sql'))
);

console.log('\n' + '='.repeat(40));
if (allTestsPassed) {
  console.log('All smoke tests passed.');
  process.exit(0);
}

console.log('Some smoke tests failed.');
process.exit(1);
