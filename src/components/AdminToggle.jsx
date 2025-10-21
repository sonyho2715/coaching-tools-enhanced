import { useState } from 'react';
import { Crown, Lock, Unlock } from 'lucide-react';
import useSubscriptionStore from '../store/subscriptionStore';
import { TIERS } from '../config/pricing';

export default function AdminToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const { tier, setTier } = useSubscriptionStore();

  const tiers = [
    { value: TIERS.FREE, label: '🆓 Free', color: 'gray' },
    { value: TIERS.PROFESSIONAL, label: '💼 Professional', color: 'blue' },
    { value: TIERS.PRO, label: '👑 Pro', color: 'purple' }
  ];

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all text-sm font-semibold"
        title="Admin: Change Tier"
      >
        <Crown className="w-4 h-4" />
        <span className="hidden sm:inline">Admin Mode</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-purple-200 dark:border-purple-600 z-50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                <div>
                  <h3 className="font-bold">Quản Trị Admin</h3>
                  <p className="text-xs opacity-90">Chuyển đổi gói đăng ký</p>
                </div>
              </div>
            </div>

            {/* Current Tier */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Gói Hiện Tại:</p>
              <p className="font-bold text-gray-900 dark:text-white">
                {tier === TIERS.FREE && '🆓 Free'}
                {tier === TIERS.PROFESSIONAL && '💼 Professional'}
                {tier === TIERS.PRO && '👑 Pro'}
              </p>
            </div>

            {/* Tier Options */}
            <div className="p-2">
              {tiers.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => {
                    setTier(value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition mb-1 ${
                    tier === value
                      ? `bg-${color}-100 dark:bg-${color}-900 border-2 border-${color}-500`
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className={`font-medium ${tier === value ? `text-${color}-700 dark:text-${color}-300` : 'text-gray-700 dark:text-gray-300'}`}>
                    {label}
                  </span>
                  {tier === value ? (
                    <Unlock className={`w-4 h-4 text-${color}-600`} />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Info */}
            <div className="px-4 py-3 bg-yellow-50 dark:bg-yellow-900 border-t border-yellow-200 dark:border-yellow-700">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                ⚠️ Chỉ dành cho admin. Gói của bạn được lưu cục bộ để kiểm thử.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
