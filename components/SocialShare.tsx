'use client';

import { useState } from 'react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  className?: string;
}

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function SocialShare({ 
  url, 
  title, 
  description = '', 
  hashtags = ['AI', 'AITools'], 
  className = '' 
}: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareData = {
    url,
    title,
    description,
    hashtags: hashtags.join(',')
  };

  const handleTwitterShare = () => {
    const text = `${title}${description ? ` - ${description}` : ''}`;
    const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtagString)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if ('share' in navigator) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback to copy link if native sharing is not available
      handleCopyLink();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Native Share Button (mobile) */}
      {'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          aria-label="Share"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </button>
      )}

      {/* Twitter */}
      <button
        onClick={handleTwitterShare}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] transition-colors"
        aria-label="Share on Twitter"
      >
        <TwitterIcon className="w-5 h-5" />
      </button>

      {/* Facebook */}
      <button
        onClick={handleFacebookShare}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#4267B2] text-white hover:bg-[#365899] transition-colors"
        aria-label="Share on Facebook"
      >
        <FacebookIcon className="w-5 h-5" />
      </button>

      {/* LinkedIn */}
      <button
        onClick={handleLinkedInShare}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#0077B5] text-white hover:bg-[#006097] transition-colors"
        aria-label="Share on LinkedIn"
      >
        <LinkedInIcon className="w-5 h-5" />
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
          copied
            ? 'bg-green-600 text-white'
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }`}
        aria-label="Copy link"
      >
        {copied ? (
          <CheckIcon className="w-5 h-5" />
        ) : (
          <CopyIcon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
} 