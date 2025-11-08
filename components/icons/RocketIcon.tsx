import React from 'react';

interface RocketIconProps {
  className?: string;
}

const RocketIcon: React.FC<RocketIconProps> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default RocketIcon;
