import { Metadata } from 'next';
import TrendingClient from './TrendingClient';
import { generateTrendingMetadata } from '@/lib/seo';

export const metadata: Metadata = generateTrendingMetadata();

export default function Trending() {
  return <TrendingClient />;
} 