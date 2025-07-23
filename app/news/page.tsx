import { createClient } from '@/lib/supabase-server';
import NewsClient from './NewsClient';

export default async function NewsPage() {
  return (
    <NewsClient />
  );
} 