const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'not set');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedTools() {
  const filePath = path.join(process.cwd(), 'data', 'tools.json');
  const tools = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const upsertData = tools.map((t) => ({
    name: t.name,
    blurb: t.blurb,
    category: t.category,
    price_tier: t.priceTier,
    affiliate_url: t.affiliateUrl,
    logo: t.logo || '🔧', // Provide a default logo if missing
    description: t.blurb || 'No description provided.', // Always provide a description
    website: t.affiliateUrl || 'https://example.com', // Use affiliateUrl as website, fallback to default
    pricing: t.priceTier || 'Unknown' // Always provide a value for pricing
  }));

  const { error } = await supabase
    .from('tools')
    .upsert(upsertData, { onConflict: 'name' });
  if (error) {
    console.error('Error seeding tools:', error);
  } else {
    console.log('Seeded all tools');
  }
}

seedTools().catch(console.error); 