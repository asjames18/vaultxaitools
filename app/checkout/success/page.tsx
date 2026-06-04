import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading your order...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
