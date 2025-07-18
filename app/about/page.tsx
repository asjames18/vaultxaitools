import { Metadata } from 'next';
import AboutClient from './AboutClient';
import { generateAboutMetadata } from '@/lib/seo';

export const metadata: Metadata = generateAboutMetadata();

export default function About() {
  return <AboutClient />;
} 