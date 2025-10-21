import React from 'react';
import { Users, Zap, BarChart3, ArrowRight } from 'lucide-react';

const OnboardingWizard = ({ onSelectFlow }) => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-3">🚀 Chào Mừng Đến Với Coaching Tools</h2>
        <p className="text-lg opacity-95">Bắt đầu session coaching chuyên nghiệp trong vài bước đơn giản</p>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
        <h3 className="text-xl font-bold text-blue-900 mb-4">💡 Bạn muốn làm gì hôm nay?</h3>
        <p className="text-sm text-blue-800 mb-6">Chọn một trong các lựa chọn dưới đây để bắt đầu:</p>

        <div className="grid md:grid-cols-3 gap-4">
          {/* New Client Flow */}
          <div
            onClick={() => onSelectFlow('newClient')}
            className="bg-white border-3 border-cyan-300 rounded-xl p-6 hover:shadow-xl hover:border-cyan-500 transition-all cursor-pointer group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">👤 Khách Hàng Mới</h4>
              <p className="text-sm text-gray-600 mb-4">Session đầu tiên - Thu thập thông tin & đánh giá toàn diện</p>
              <div className="flex items-center text-cyan-600 font-semibold">
                <span>Bắt đầu</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Smart Assistant Flow */}
          <div
            onClick={() => onSelectFlow('smartAssistant')}
            className="bg-gradient-to-br from-purple-50 to-pink-50 border-3 border-purple-400 rounded-xl p-6 hover:shadow-xl hover:border-purple-600 transition-all cursor-pointer group relative overflow-hidden"
          >
            {/* Recommended Badge */}
            <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              ⭐ GỢI Ý
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">💡 Trợ Lý Thông Minh</h4>
              <p className="text-sm text-gray-600 mb-4">Hệ thống tự động gợi ý công cụ phù hợp với vấn đề của khách hàng</p>
              <div className="flex items-center text-purple-600 font-semibold">
                <span>Khám phá</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Existing Client Flow */}
          <div
            onClick={() => onSelectFlow('existingClient')}
            className="bg-white border-3 border-green-300 rounded-xl p-6 hover:shadow-xl hover:border-green-500 transition-all cursor-pointer group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">📊 Khách Hàng Hiện Tại</h4>
              <p className="text-sm text-gray-600 mb-4">Session tiếp theo - Theo dõi tiến độ & làm việc chuyên sâu</p>
              <div className="flex items-center text-green-600 font-semibold">
                <span>Tiếp tục</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-4 rounded-lg shadow-lg">
          <div className="text-3xl font-bold mb-1">18+</div>
          <div className="text-sm opacity-90">Công cụ coaching chuyên nghiệp</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg">
          <div className="text-3xl font-bold mb-1">NLP</div>
          <div className="text-sm opacity-90">Kỹ thuật NLP tiên tiến</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-4 rounded-lg shadow-lg">
          <div className="text-3xl font-bold mb-1">AI</div>
          <div className="text-sm opacity-90">Gợi ý thông minh tự động</div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h4 className="font-bold text-gray-800 mb-3">❓ Không chắc nên bắt đầu từ đâu?</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong className="text-purple-600">→ Khách hàng lần đầu?</strong> Chọn "Khách Hàng Mới" để làm đánh giá đầy đủ</p>
          <p><strong className="text-purple-600">→ Cần gợi ý nhanh?</strong> Dùng "Trợ Lý Thông Minh" - chỉ cần mô tả vấn đề!</p>
          <p><strong className="text-purple-600">→ Đã có dữ liệu?</strong> Chọn "Khách Hàng Hiện Tại" để theo dõi tiến độ</p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
