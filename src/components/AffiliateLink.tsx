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

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Generate affiliate URL
      const affiliateUrl = generateAffiliateUrl(href, toolId, config);
      
      // Track the click
      if (hasAffiliate) {
        await trackAffiliateClick(toolId, href, affiliateUrl);
      }
      
      // Call custom onClick if provided
      if (onClick) {
        onClick();
      }
      
      // Open the link
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('Error handling affiliate link click:', error);
      // Fallback to original URL
      window.open(href, '_blank', 'noopener,noreferrer');
    } finally {
      setIsLoading(false);
    }
  };

  const disclosureText = getDisclosureText(isSponsored, hasAffiliate, config);
  const sponsoredBadge = getSponsoredBadgeStyle();
  const affiliateBadge = getAffiliateDisclosureStyle();

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
      
      {/* Sponsored Badge */}
      {showBadge && isSponsored && (
        <span className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium ${sponsoredBadge.className} shadow-sm`}>
          {sponsoredBadge.icon} {sponsoredBadge.text}
        </span>
      )}
      
      {/* Affiliate Badge */}
      {showBadge && hasAffiliate && !isSponsored && (
        <span className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-medium ${affiliateBadge.className} shadow-sm`}>
          {affiliateBadge.icon} {affiliateBadge.text}
        </span>
      )}
      
      {/* Disclosure Tooltip */}
      {showDisclosure && disclosureText && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 whitespace-nowrap">
          {disclosureText}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
      
      {/* Loading Indicator */}
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