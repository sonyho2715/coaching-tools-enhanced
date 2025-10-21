import { X, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import { TIER_CONFIG, TIERS, getUpgradeMessage } from '../config/pricing';
import useSubscriptionStore from '../store/subscriptionStore';

export default function UpgradeModal({ isOpen, onClose, feature, requiredTier }) {
  const { tier: currentTier } = useSubscriptionStore();

  if (!isOpen) return null;

  const upgradeInfo = getUpgradeMessage(feature);
  const targetTier = requiredTier || upgradeInfo.tier;
  const tierConfig = TIER_CONFIG[targetTier];

  const handleUpgrade = () => {
    // Navigate to pricing page
    window.location.href = '/#pricing';
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {upgradeInfo.title || 'Cần Nâng Cấp'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Message */}
          <p className="text-gray-700 dark:text-gray-300 text-center">
            {upgradeInfo.message}
          </p>

          {/* Tier Recommendation */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-600">
            <div className="text-center mb-4">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {tierConfig.name}
              </h4>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-black text-blue-600">
                  ${tierConfig.priceMonthly}
                </span>
                <span className="text-gray-600 dark:text-gray-400">/tháng</span>
              </div>
              {tierConfig.priceYearly && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  hoặc ${tierConfig.priceYearly}/năm (tiết kiệm ${tierConfig.priceMonthly * 12 - tierConfig.priceYearly})
                </p>
              )}
            </div>

            {/* Key Features */}
            <div className="space-y-2">
              <p className="font-semibold text-gray-900 dark:text-white mb-2">
                Bao gồm:
              </p>
              {targetTier === TIERS.PROFESSIONAL && (
                <>
                  <FeatureItem text="Không giới hạn khách hàng" />
                  <FeatureItem text="Tất cả 15+ công cụ đánh giá" />
                  <FeatureItem text="Bảng phân tích Analytics" />
                  <FeatureItem text="Hệ thống theo dõi" />
                  <FeatureItem text="Hỗ trợ email ưu tiên" />
                </>
              )}
              {targetTier === TIERS.PRO && (
                <>
                  <FeatureItem text="Bao gồm tất cả Professional" />
                  <FeatureItem text="Tùy chỉnh thương hiệu & white label" />
                  <FeatureItem text="Cổng khách hàng" />
                  <FeatureItem text="Cộng tác nhóm (5 coaches)" />
                  <FeatureItem text="Truy cập API & tích hợp" />
                  <FeatureItem text="Hỗ trợ điện thoại ưu tiên" />
                </>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              Nâng Cấp Lên {tierConfig.name}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-xl transition"
            >
              Để Sau
            </button>
          </div>

          {/* Guarantee */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Dùng thử 14 ngày miễn phí • Hủy bất cứ lúc nào • Không cần thẻ tín dụng
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
      <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  );
}
