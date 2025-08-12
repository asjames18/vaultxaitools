"use client";

import { useState } from 'react';
import { 
  generateAffiliateUrl, 
  trackAffiliateClick, 
  getDisclosureText,
  getSponsoredBadgeStyle,
  getAffiliateDisclosureStyle,
  type AffiliateConfig 
} from '@/lib/affiliate';

interface AffiliateLinkProps {
  href: string;
  toolId: string;
  children: React.ReactNode;
  className?: string;
  isSponsored?: boolean;
  hasAffiliate?: boolean;
  config?: AffiliateConfig;
  showDisclosure?: boolean;
  onClick?: () => void;
  showBadge?: boolean; // NEW: allow suppressing badge
}

export default function AffiliateLink({
  href,
  toolId,
  children,
  className = "",
  isSponsored = false,
  hasAffiliate = true,
  config,
  showDisclosure = true,
  onClick,
  showBadge = true // NEW: default true
}: AffiliateLinkProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // DISABLE AFFILIATE FUNCTIONALITY
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      // Just open the original link, no affiliate logic
      window.open(href, '_blank', 'noopener,noreferrer');
      if (onClick) onClick();
    } catch (error) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } finally {
      setIsLoading(false);
    }
  };

  // const disclosureText = getDisclosureText(isSponsored, hasAffiliate, config);
  // const sponsoredBadge = getSponsoredBadgeStyle();
  // const affiliateBadge = getAffiliateDisclosureStyle();

  return (
    <div className="relative inline-block">
      <a
        href={href}
        onClick={handleClick}
        className={`${className} ${isLoading ? 'opacity-75 cursor-wait' : ''}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        rel="noopener noreferrer"
      >
        {children}
      </a>
      {/* Affiliate and sponsored badges are disabled for now */}
      {/* Disclosure Tooltip is disabled for now */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}

// Simple affiliate link component for basic use cases
export function SimpleAffiliateLink({
  href,
  toolId,
  children,
  className = "",
  config
}: {
  href: string;
  toolId: string;
  children: React.ReactNode;
  className?: string;
  config?: AffiliateConfig;
}) {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      const affiliateUrl = generateAffiliateUrl(href, toolId, config);
      await trackAffiliateClick(toolId, href, affiliateUrl);
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error handling affiliate link:', error);
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
} 