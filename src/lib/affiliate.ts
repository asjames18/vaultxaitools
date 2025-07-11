import type { Tool } from '@/data/tools';

export interface AffiliateConfig {
  enabled: boolean;
  baseUrl: string;
  trackingParams: {
    source: string;
    medium: string;
    campaign: string;
  };
  disclosureText: string;
}

export interface SponsoredSlot {
  id: string;
  toolId: string;
  position: 'top' | 'sidebar' | 'category' | 'search';
  startDate: Date;
  endDate: Date;
  priority: number;
  budget: number;
  impressions: number;
  clicks: number;
}

export interface AffiliateLink {
  originalUrl: string;
  affiliateUrl: string;
  toolId: string;
  clicks: number;
  revenue: number;
  lastClicked: Date;
}

// Default affiliate configuration
export const defaultAffiliateConfig: AffiliateConfig = {
  enabled: true,
  baseUrl: 'https://vaultxaitools.com',
  trackingParams: {
    source: 'vaultx',
    medium: 'affiliate',
    campaign: 'ai-tools'
  },
  disclosureText: 'This link may earn us a commission if you make a purchase.'
};

/**
 * Generate affiliate tracking URL
 */
export function generateAffiliateUrl(
  originalUrl: string, 
  toolId: string, 
  config: AffiliateConfig = defaultAffiliateConfig
): string {
  if (!config.enabled) return originalUrl;

  try {
    const url = new URL(originalUrl);
    
    // Add tracking parameters
    url.searchParams.set('utm_source', config.trackingParams.source);
    url.searchParams.set('utm_medium', config.trackingParams.medium);
    url.searchParams.set('utm_campaign', config.trackingParams.campaign);
    url.searchParams.set('utm_content', toolId);
    url.searchParams.set('ref', 'vaultx');
    
    return url.toString();
  } catch (error) {
    console.error('Error generating affiliate URL:', error);
    return originalUrl;
  }
}

/**
 * Track affiliate link click
 */
export async function trackAffiliateClick(
  toolId: string, 
  originalUrl: string, 
  affiliateUrl: string
): Promise<void> {
  try {
    // In a real implementation, this would send to your analytics service
    const clickData = {
      toolId,
      originalUrl,
      affiliateUrl,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
      referrer: typeof window !== 'undefined' ? document.referrer : ''
    };

    // Send to analytics endpoint
    await fetch('/api/analytics/affiliate-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clickData)
    });

    // Store in localStorage for local tracking
    if (typeof window !== 'undefined') {
      const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
      clicks.push(clickData);
      localStorage.setItem('affiliate_clicks', JSON.stringify(clicks.slice(-100))); // Keep last 100
    }
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
  }
}

/**
 * Check if a tool has sponsored placement
 */
export function isSponsored(
  toolId: string, 
  position: string, 
  sponsoredSlots: SponsoredSlot[]
): boolean {
  const now = new Date();
  return sponsoredSlots.some(slot => 
    slot.toolId === toolId && 
    slot.position === position &&
    slot.startDate <= now && 
    slot.endDate >= now
  );
}

/**
 * Get sponsored tools for a specific position
 */
export function getSponsoredTools(
  position: string, 
  sponsoredSlots: SponsoredSlot[],
  allTools: Tool[]
): Tool[] {
  const now = new Date();
  const activeSlots = sponsoredSlots
    .filter(slot => 
      slot.position === position &&
      slot.startDate <= now && 
      slot.endDate >= now
    )
    .sort((a, b) => b.priority - a.priority);

  return activeSlots
    .map(slot => allTools.find(tool => tool.id === slot.toolId))
    .filter(Boolean) as Tool[];
}

/**
 * Get disclosure text for sponsored content
 */
export function getDisclosureText(
  isSponsored: boolean, 
  hasAffiliate: boolean,
  config: AffiliateConfig = defaultAffiliateConfig
): string | null {
  const disclosures = [];
  
  if (isSponsored) {
    disclosures.push('Sponsored');
  }
  
  if (hasAffiliate) {
    disclosures.push(config.disclosureText);
  }
  
  return disclosures.length > 0 ? disclosures.join(' • ') : null;
}

/**
 * Calculate affiliate revenue
 */
export function calculateAffiliateRevenue(
  clicks: number, 
  conversionRate: number = 0.02, // 2% default conversion rate
  averageOrderValue: number = 50 // $50 default AOV
): number {
  const conversions = clicks * conversionRate;
  return conversions * averageOrderValue;
}

/**
 * Get affiliate performance metrics
 */
export function getAffiliateMetrics(
  affiliateLinks: AffiliateLink[]
): {
  totalClicks: number;
  totalRevenue: number;
  averageCtr: number;
  topPerformingTools: Array<{ toolId: string; clicks: number; revenue: number }>;
} {
  const totalClicks = affiliateLinks.reduce((sum, link) => sum + link.clicks, 0);
  const totalRevenue = affiliateLinks.reduce((sum, link) => sum + link.revenue, 0);
  
  const topPerformingTools = affiliateLinks
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)
    .map(link => ({
      toolId: link.toolId,
      clicks: link.clicks,
      revenue: link.revenue
    }));

  return {
    totalClicks,
    totalRevenue,
    averageCtr: totalClicks > 0 ? (totalClicks / affiliateLinks.length) : 0,
    topPerformingTools
  };
}

/**
 * Validate affiliate URL
 */
export function validateAffiliateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get sponsored badge styling
 */
export function getSponsoredBadgeStyle(): {
  className: string;
  text: string;
  icon: string;
} {
  return {
    className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    text: "Sponsored",
    icon: "💎"
  };
}

/**
 * Get affiliate disclosure styling
 */
export function getAffiliateDisclosureStyle(): {
  className: string;
  text: string;
  icon: string;
} {
  return {
    className: "bg-gradient-to-r from-blue-500 to-green-500 text-white",
    text: "Affiliate",
    icon: "🔗"
  };
} 