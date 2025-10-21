import React from 'react';
import { CheckCircle } from 'lucide-react';

const ProgressBar = ({ progress, showLabel = true }) => {
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Tiến độ hoàn thành
          </span>
          <span className="text-sm font-bold text-gray-900">
            {progress}%
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${getProgressColor(progress)} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {progress === 100 && showLabel && (
        <div className="flex items-center gap-1 mt-1 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Hoàn thành!</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
