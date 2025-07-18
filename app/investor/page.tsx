import { createClient } from '@/lib/supabase-server';
import { getUserRole } from '@/lib/auth';

export default async function InvestorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Check if user is admin
  if (!user || await getUserRole(user) !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Investor Information</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Company Overview</h2>
          <p className="text-gray-600 mb-4">
            VaultX AI Tools is a comprehensive platform that curates and reviews the best AI tools available in the market.
          </p>
          
          <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Growing user base with high engagement</li>
            <li>Comprehensive database of AI tools</li>
            <li>Strong SEO presence and organic traffic</li>
            <li>Monetization through affiliate partnerships</li>
          </ul>
          
          <h3 className="text-lg font-semibold mb-2">Investment Opportunity</h3>
          <p className="text-gray-600">
            We are seeking strategic partnerships and investment to accelerate our growth and expand our platform capabilities.
          </p>
        </div>
      </div>
    </div>
  );
} 