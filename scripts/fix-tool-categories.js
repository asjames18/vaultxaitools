// scripts/fix-tool-categories.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Official category names (update if you add more)
const OFFICIAL_CATEGORIES = [
  'Language',
  'Design',
  'Development',
  'Productivity',
  'Marketing',
  'Writing',
  'Video',
  'Audio',
  'Data',
];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function normalizeCategory(cat) {
  if (!cat) return null;
  const trimmed = cat.trim().toLowerCase();
  for (const official of OFFICIAL_CATEGORIES) {
    if (official.toLowerCase() === trimmed) return official;
  }
  return null;
}

async function main() {
  const { data: tools, error } = await supabase
    .from('tools')
    .select('id, name, category');

  if (error) {
    console.error('Error fetching tools:', error);
    process.exit(1);
  }

  let updated = 0;
  for (const tool of tools) {
    const normalized = normalizeCategory(tool.category);
    if (normalized && tool.category !== normalized) {
      const { error: updateError } = await supabase
        .from('tools')
        .update({ category: normalized })
        .eq('id', tool.id);
      if (updateError) {
        console.error(`Failed to update tool ${tool.id} (${tool.name}):`, updateError);
      } else {
        console.log(`Updated tool ${tool.id} (${tool.name}): '${tool.category}' -> '${normalized}'`);
        updated++;
      }
    }
  }
  console.log(`\nDone! Updated ${updated} tools.`);
}

main(); 