import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  subtitle,
  color = 'indigo',
  onClick
}) => {
  const colorVariants = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      icon: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-100 dark:bg-indigo-800/40',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'hover:border-indigo-200 dark:hover:border-indigo-700'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-800/40',
      text: 'text-green-600 dark:text-green-400',
      border: 'hover:border-green-200 dark:hover:border-green-700'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-800/40',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'hover:border-blue-200 dark:hover:border-blue-700'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      icon: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-800/40',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'hover:border-purple-200 dark:hover:border-purple-700'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      icon: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-100 dark:bg-orange-800/40',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'hover:border-orange-200 dark:hover:border-orange-700'
    }
  };

  const colors = colorVariants[color] || colorVariants.indigo;

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400';
    if (trend === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div
      onClick={onClick}
      className={`
        ${colors.bg}
        rounded-xl p-6
        border-2 border-transparent
        ${colors.border}
        transition-all duration-200
        hover-lift
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`${colors.iconBg} p-3 rounded-lg`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>

      {(trend || trendValue) && (
        <div className="mt-4 flex items-center gap-1">
          <span className={`flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">{trendValue}</span>
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            so với tháng trước
          </span>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
