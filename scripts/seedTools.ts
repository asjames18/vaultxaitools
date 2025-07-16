import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedTools() {
  const filePath = path.join(process.cwd(), 'data', 'tools.json');
  const tools = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const upsertData = tools.map((t: any) => ({
    name: t.name,
    blurb: t.blurb,
    category: t.category,
    price_tier: t.priceTier,
    affiliate_url: t.affiliateUrl,
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