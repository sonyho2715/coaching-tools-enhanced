import { useState } from 'react';
import { Check, X, Zap, Crown, Gift, ArrowRight } from 'lucide-react';
import { TIER_CONFIG, TIERS } from '../config/pricing';
import useSubscriptionStore from '../store/subscriptionStore';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState('yearly'); // monthly or yearly
  const { tier: currentTier } = useSubscriptionStore();

  const tiers = [
    {
      id: TIERS.FREE,
      icon: Gift,
      color: 'gray',
      popular: false
    },
    {
      id: TIERS.PROFESSIONAL,
      icon: Zap,
      color: 'blue',
      popular: true
    },
    {
      id: TIERS.PRO,
      icon: Crown,
      color: 'purple',
      popular: false
    }
  ];

  const getPrice = (tier) => {
    const config = TIER_CONFIG[tier];
    if (tier === TIERS.FREE) return 0;
    return billingPeriod === 'yearly' ? config.priceYearly : config.priceMonthly;
  };

  const getMonthlyPrice = (tier) => {
    const config = TIER_CONFIG[tier];
    if (tier === TIERS.FREE) return 0;
    return billingPeriod === 'yearly'
      ? (config.priceYearly / 12).toFixed(0)
      : config.priceMonthly;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
          Chọn Gói Của Bạn
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Chuyển đổi hoạt động coaching của bạn với các công cụ đánh giá chuyên nghiệp
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              billingPeriod === 'monthly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Hàng Tháng
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2 rounded-lg font-semibold transition relative ${
              billingPeriod === 'yearly'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Hàng Năm
            <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
              Tiết kiệm 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {tiers.map(({ id, icon: Icon, color, popular }) => {
          const config = TIER_CONFIG[id];
          const price = getPrice(id);
          const monthlyPrice = getMonthlyPrice(id);
          const isCurrentTier = currentTier === id;

          return (
            <div
              key={id}
              className={`relative rounded-2xl border-2 ${
                popular
                  ? 'border-blue-600 shadow-2xl scale-105'
                  : 'border-gray-200 dark:border-gray-700'
              } bg-white dark:bg-gray-800 overflow-hidden`}
            >
              {/* Popular Badge */}
              {popular && (
                <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-bl-xl">
                  PHỔ BIẾN NHẤT
                </div>
              )}

              <div className="p-8">
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-${color}-100 dark:bg-${color}-900 rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {config.name}
                    </h3>
                    {isCurrentTier && (
                      <span className="text-xs text-green-600 font-semibold">
                        Gói Hiện Tại
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {id === TIERS.FREE ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-gray-900 dark:text-white">
                        Free
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-gray-900 dark:text-white">
                        ${monthlyPrice}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">/tháng</span>
                    </div>
                  )}
                  {id !== TIERS.FREE && billingPeriod === 'yearly' && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Thanh toán ${price}/năm
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                    popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                      : isCurrentTier
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                  }`}
                  disabled={isCurrentTier}
                >
                  {isCurrentTier ? (
                    'Gói Hiện Tại'
                  ) : id === TIERS.FREE ? (
                    'Bắt Đầu Miễn Phí'
                  ) : (
                    <>
                      Nâng Cấp Ngay
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Features */}
                <div className="mt-8 space-y-3">
                  <p className="font-semibold text-gray-900 dark:text-white mb-4">
                    {id === TIERS.FREE ? 'Tính năng cơ bản:' : 'Bao gồm tất cả Free, thêm:'}
                  </p>

                  {id === TIERS.FREE && (
                    <>
                      <Feature included text="3 khách hàng hoạt động" />
                      <Feature included text="5 công cụ đánh giá cơ bản" />
                      <Feature included text="Đồng hồ phiên coaching" />
                      <Feature included text="Xuất PDF cơ bản" />
                      <Feature included text="3 mẫu email" />
                      <Feature included={false} text="Công cụ NLP nâng cao" />
                      <Feature included={false} text="Bảng phân tích Analytics" />
                      <Feature included={false} text="Không giới hạn khách hàng" />
                    </>
                  )}

                  {id === TIERS.PROFESSIONAL && (
                    <>
                      <Feature included text="Không giới hạn khách hàng" highlight />
                      <Feature included text="Tất cả 15+ công cụ đánh giá" highlight />
                      <Feature included text="Bảng phân tích Analytics" highlight />
                      <Feature included text="Hệ thống theo dõi" />
                      <Feature included text="20+ mẫu email" />
                      <Feature included text="Báo cáo toàn diện" />
                      <Feature included text="Hỗ trợ email ưu tiên" />
                      <Feature included={false} text="Tùy chỉnh thương hiệu" />
                      <Feature included={false} text="Cổng khách hàng" />
                    </>
                  )}

                  {id === TIERS.PRO && (
                    <>
                      <Feature included text="Bao gồm tất cả Professional" />
                      <Feature included text="Tùy chỉnh thương hiệu" highlight />
                      <Feature included text="White label" highlight />
                      <Feature included text="Cổng khách hàng" highlight />
                      <Feature included text="Cộng tác nhóm (5 người)" />
                      <Feature included text="Tùy chỉnh đánh giá" />
                      <Feature included text="Truy cập API" />
                      <Feature included text="Tích hợp" />
                      <Feature included text="Hỗ trợ điện thoại ưu tiên" />
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          So Sánh Tính Năng Chi Tiết
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-white">
                  Tính Năng
                </th>
                <th className="text-center py-4 px-6 font-bold text-gray-900 dark:text-white">
                  Free
                </th>
                <th className="text-center py-4 px-6 font-bold text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900">
                  Professional
                </th>
                <th className="text-center py-4 px-6 font-bold text-gray-900 dark:text-white">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              <ComparisonRow
                feature="Khách Hàng Hoạt Động"
                free="3"
                professional="Không giới hạn"
                pro="Không giới hạn"
              />
              <ComparisonRow
                feature="Đánh Giá Cơ Bản"
                free={true}
                professional={true}
                pro={true}
              />
              <ComparisonRow
                feature="Công Cụ NLP Nâng Cao"
                free={false}
                professional={true}
                pro={true}
              />
              <ComparisonRow
                feature="Bảng Phân Tích Analytics"
                free={false}
                professional={true}
                pro={true}
              />
              <ComparisonRow
                feature="Tùy Chỉnh Thương Hiệu"
                free={false}
                professional={false}
                pro={true}
              />
              <ComparisonRow
                feature="Cổng Khách Hàng"
                free={false}
                professional={false}
                pro={true}
              />
              <ComparisonRow
                feature="Thành Viên Nhóm"
                free="1"
                professional="1"
                pro="5"
              />
              <ComparisonRow
                feature="Truy Cập API"
                free={false}
                professional={false}
                pro={true}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Câu Hỏi Thường Gặp
        </h2>
        <div className="space-y-4">
          <FAQ
            question="Tôi có thể dùng thử trước khi mua không?"
            answer="Có! Chúng tôi cung cấp dùng thử miễn phí 14 ngày cho gói Professional. Không cần thẻ tín dụng."
          />
          <FAQ
            question="Tôi có thể hủy bất cứ lúc nào không?"
            answer="Hoàn toàn được! Bạn có thể hủy đăng ký bất cứ lúc nào. Không có câu hỏi gì thêm."
          />
          <FAQ
            question="Dữ liệu của tôi sẽ ra sao nếu tôi hạ cấp?"
            answer="Dữ liệu của bạn sẽ không bao giờ bị xóa. Nếu bạn hạ cấp, bạn chỉ mất quyền truy cập vào các tính năng cao cấp nhưng tất cả dữ liệu vẫn được bảo vệ an toàn."
          />
          <FAQ
            question="Có hoàn tiền không?"
            answer="Có, chúng tôi cung cấp đảm bảo hoàn tiền 30 ngày nếu bạn không hài lòng."
          />
        </div>
      </div>
    </div>
  );
}

function Feature({ included, text, highlight }) {
  return (
    <div className="flex items-start gap-2">
      {included ? (
        <Check className={`w-5 h-5 flex-shrink-0 ${highlight ? 'text-green-600' : 'text-green-500'}`} />
      ) : (
        <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
      )}
      <span className={`text-sm ${included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'} ${highlight ? 'font-semibold' : ''}`}>
        {text}
      </span>
    </div>
  );
}

function ComparisonRow({ feature, free, professional, pro }) {
  const renderCell = (value) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-400 mx-auto" />
      );
    }
    return <span className="text-gray-700 dark:text-gray-300">{value}</span>;
  };

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      <td className="py-4 px-6 text-gray-900 dark:text-white">{feature}</td>
      <td className="py-4 px-6 text-center">{renderCell(free)}</td>
      <td className="py-4 px-6 text-center bg-blue-50 dark:bg-blue-900 bg-opacity-30">
        {renderCell(professional)}
      </td>
      <td className="py-4 px-6 text-center">{renderCell(pro)}</td>
    </tr>
  );
}

function FAQ({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-4 font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-between"
      >
        {question}
        <span className={`transform transition ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
          {answer}
        </div>
      )}
    </div>
  );
}
