import { Lock, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import UpgradeModal from './UpgradeModal';
import { TIERS } from '../config/pricing';

export default function LockedFeature({
  feature,
  title,
  description,
  children,
  requiredTier = TIERS.PROFESSIONAL,
  showPreview = true
}) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <>
      <div className="relative">
        {/* Content (blurred if showPreview) */}
        {showPreview && (
          <div className="filter blur-sm pointer-events-none select-none opacity-60">
            {children}
          </div>
        )}

        {/* Lock Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50/90 to-purple-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm">
          <div className="text-center max-w-md mx-auto p-8">
            {/* Lock Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {title || '🔒 Tính Năng Cao Cấp'}
            </h3>

            {/* Description */}
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {description || 'Tính năng này có sẵn trong gói Professional và Pro'}
            </p>

            {/* Tier Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-full shadow-md mb-6">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Có sẵn trong gói
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-full">
                {requiredTier === TIERS.PRO ? 'Pro' : 'Professional'}
              </span>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Mở Khóa Tính Năng Này
              <ArrowUpRight className="w-5 h-5" />
            </button>

            {/* Pricing hint */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              Bắt đầu từ ${requiredTier === TIERS.PRO ? '49' : '19'}/tháng
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={feature}
        requiredTier={requiredTier}
      />
    </>
  );
}

// Compact version for menu items
export function LockedMenuItem({ onClick, icon: Icon, name, requiredTier = TIERS.PROFESSIONAL }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition cursor-pointer group"
    >
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="w-5 h-5" />}
        <span className="font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
        <span className="text-xs px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold">
          {requiredTier === TIERS.PRO ? 'Pro' : 'Pro'}
        </span>
      </div>
    </button>
  );
}
