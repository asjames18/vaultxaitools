#!/usr/bin/env node

/**
 * CI runner with placeholder env vars when .env.local is absent.
 * Usage: node scripts/run-ci.js
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: fs.existsSync('.env.local') ? '.env.local' : undefined });

const placeholders = {
  NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'placeholder-service-key',
  ADMIN_EMAILS: 'admin@example.com',
};

for (const [key, value] of Object.entries(placeholders)) {
  if (!process.env[key] || String(process.env[key]).trim() === '') {
    process.env[key] = value;
  }
}

const usingPlaceholders = Object.keys(placeholders).some(
  (key) => process.env[key] === placeholders[key]
);
if (usingPlaceholders) {
  console.warn(
    '\n⚠️  Using placeholder env vars for CI. Production values are loaded from Vercel at deploy time.\n' +
      '   To use real Supabase credentials in GitHub Actions, add repo secrets (optional).\n'
  );
}

process.env.NODE_ENV = 'production';

const steps = [
  ['node', ['scripts/verify-env.js', 'production']],
  ['npm', ['run', 'lint']],
  ['npm', ['run', 'typecheck']],
  ['npm', ['test', '--', '--ci']],
  ['npm', ['run', 'smoke-test']],
];

if (process.platform !== 'win32') {
  steps.splice(3, 0, ['npm', ['run', 'build']]);
} else {
  console.warn('\n⚠️  Skipping production build on Windows (known EISDIR/webpack issue). Run build in Linux CI or WSL.\n');
}

for (const [cmd, args] of steps) {
  console.log(`\n> ${cmd} ${args.join(' ')}\n`);
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
    cwd: path.resolve(__dirname, '..'),
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('\nCI completed successfully.\n');
