import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Đang tải...', fullScreen = false }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerClass = fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <Loader2 className={`${sizes[size]} text-indigo-600 animate-spin mx-auto mb-4`} />
        {text && <p className="text-gray-600 font-medium">{text}</p>}
      </div>
    </div>
  );
};

export const SkeletonLoader = ({ className = '', rows = 3 }) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
