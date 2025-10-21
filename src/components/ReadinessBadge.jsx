import React from 'react';
import { CheckCircle, AlertCircle, XCircle, AlertTriangle } from 'lucide-react';

const ReadinessBadge = ({ level, score, size = 'md', showScore = true, showIcon = true }) => {
  const getReadinessConfig = (score) => {
    if (score >= 140) {
      return {
        level: 'Sẵn sàng cao',
        color: 'green',
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-700',
        text: 'text-green-700 dark:text-green-300',
        icon: CheckCircle,
        dotColor: 'bg-green-500'
      };
    }
    if (score >= 100) {
      return {
        level: 'Sẵn sàng trung bình',
        color: 'blue',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-700',
        text: 'text-blue-700 dark:text-blue-300',
        icon: AlertCircle,
        dotColor: 'bg-blue-500'
      };
    }
    if (score >= 60) {
      return {
        level: 'Sẵn sàng thấp',
        color: 'orange',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-700',
        text: 'text-orange-700 dark:text-orange-300',
        icon: AlertTriangle,
        dotColor: 'bg-orange-500'
      };
    }
    return {
      level: 'Chưa sẵn sàng',
      color: 'red',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-700',
      text: 'text-red-700 dark:text-red-300',
      icon: XCircle,
      dotColor: 'bg-red-500'
    };
  };

  const config = getReadinessConfig(score);
  const Icon = config.icon;

  const sizes = {
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 'w-3 h-3',
      dot: 'w-1.5 h-1.5',
      gap: 'gap-1'
    },
    md: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      dot: 'w-2 h-2',
      gap: 'gap-2'
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
      dot: 'w-2.5 h-2.5',
      gap: 'gap-2'
    }
  };

  const sizeConfig = sizes[size];

  return (
    <div
      className={`
        inline-flex items-center ${sizeConfig.gap}
        ${config.bg} ${config.border} ${config.text}
        ${sizeConfig.container}
        border-2 rounded-full font-medium
        transition-all duration-200
      `}
    >
      {showIcon && (
        <Icon className={sizeConfig.icon} />
      )}

      {!showIcon && (
        <span className={`${sizeConfig.dot} ${config.dotColor} rounded-full`}></span>
      )}

      <span>{level || config.level}</span>

      {showScore && (
        <span className="font-bold">({score})</span>
      )}
    </div>
  );
};

export default ReadinessBadge;
