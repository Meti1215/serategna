import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface VerifiedEmployerBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function VerifiedEmployerBadge({
  size = 'md',
  showText = true,
  className = '',
}: VerifiedEmployerBadgeProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <ShieldCheck className={`${sizeClasses[size]} text-emerald-600`} />
      {showText && (
        <span className={`${textSizeClasses[size]} font-semibold text-emerald-700`}>
          Verified Employer
        </span>
      )}
    </div>
  );
}
