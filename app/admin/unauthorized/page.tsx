import { redirect } from 'next/navigation';

export default function UnauthorizedPage() {
  // Temporary bypass: always redirect to simple-test page
  redirect('/simple-test');
  return null;
} 