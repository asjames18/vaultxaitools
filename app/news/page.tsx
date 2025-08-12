import { redirect } from 'next/navigation';

export default async function NewsPage() {
  // Temporarily redirect to homepage while we work on the news functionality
  redirect('/');
} 