#!/usr/bin/env node

/*
  Verify critical environment variables for running and deploying the app.
  Usage:
    node scripts/verify-env.js            # autodetects .env files via dotenv
    node scripts/verify-env.js production # enforce prod-required vars
*/

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: fs.existsSync('.env.local') ? '.env.local' : undefined });

const modeArg = process.argv[2] || process.env.NODE_ENV || 'development';
const mode = modeArg.toLowerCase();

const requiredForAll = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

const requiredForProd = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'ADMIN_EMAILS',
];

const recommended = [
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'GOOGLE_VERIFICATION',
  'YANDEX_VERIFICATION',
  'YAHOO_VERIFICATION',
];

function check(vars) {
  const missing = [];
  const details = [];
  for (const key of vars) {
    if (!process.env[key] || String(process.env[key]).trim().length === 0) {
      missing.push(key);
    } else {
      // simple validations
      if (key === 'NEXT_PUBLIC_SUPABASE_URL' && !/supabase\.(co|in)$/i.test(new URL(process.env[key]).host)) {
        details.push(`WARN: ${key} does not look like a Supabase URL → ${process.env[key]}`);
      }
      if (key === 'ADMIN_EMAILS' && !process.env[key].includes('@')) {
        details.push('WARN: ADMIN_EMAILS should be a comma-separated list of emails');
      }
    }
  }
  return { missing, details };
}

const { missing: missingAll, details: detailsAll } = check(requiredForAll);
const { missing: missingProd, details: detailsProd } = mode === 'production' ? check(requiredForProd) : { missing: [], details: [] };

const missing = [...missingAll, ...missingProd];
const details = [...detailsAll, ...detailsProd];

const warn = recommended.filter(k => !process.env[k] || String(process.env[k]).trim().length === 0);

const header = `\nVerifying environment variables (${mode})\n`;
console.log(header);

if (missing.length === 0) {
  console.log('✅ Required variables present');
} else {
  console.log('❌ Missing required variables:');
  missing.forEach(v => console.log(`  - ${v}`));
}

if (details.length > 0) {
  console.log('\nNotes:');
  details.forEach(d => console.log(`  - ${d}`));
}

if (warn.length > 0) {
  console.log('\n⚠️  Recommended variables not set:');
  warn.forEach(v => console.log(`  - ${v}`));
}

if (missing.length > 0) {
  process.exitCode = 1;
}



