import React from 'react';
import { ArrowRight, Clock, TrendingUp, Lock } from 'lucide-react';

const NextStepSuggestion = ({ currentSection, readinessScore, onNavigate }) => {
  // Define the recommended flow and next steps
  const getNextStep = () => {
    const sectionFlow = {
      'home': {
        next: 'problemidentifier',
        label: 'Trợ Lý Thông Minh',
        reason: 'Xác định vấn đề và nhận gợi ý công cụ phù hợp',
        time: '5-10 phút',
        icon: '💡',
        alternative: {
          section: 'personalhistory',
          label: 'Personal History (Khách hàng mới)',
          icon: '📋'
        }
      },
      'problemidentifier': {
        next: 'toolrecommender',
        label: 'Xem Gợi Ý Công Cụ',
        reason: 'Nhận danh sách công cụ phù hợp với vấn đề đã xác định',
        time: '2-3 phút',
        icon: '🎯'
      },
      'toolrecommender': {
        next: 'readiness',
        label: 'Đánh Giá Sẵn Sàng',
        reason: 'Đánh giá mức độ sẵn sàng của khách hàng trước khi làm việc sâu',
        time: '10-15 phút',
        icon: '✅'
      },
      'personalhistory': {
        next: 'readiness',
        label: 'Đánh Giá Sẵn Sàng',
        reason: 'Đánh giá mức độ cam kết và sẵn sàng thay đổi',
        time: '10-15 phút',
        icon: '✅'
      },
      'readiness': {
        next: readinessScore >= 140 ? 'wheel' : (readinessScore >= 100 ? 'vakad' : 'wheel'),
        label: readinessScore >= 140 ? 'Wheel of Life' : (readinessScore >= 100 ? 'VAKAD Test' : 'Wheel of Life'),
        reason: readinessScore >= 140
          ? 'Điểm cao! Sẵn sàng cho công việc chuyên sâu - bắt đầu với Wheel of Life'
          : readinessScore >= 100
          ? 'Điểm khá tốt! Hiểu phong cách học tập của khách hàng'
          : 'Xây dựng sự hiểu biết về các lĩnh vực cuộc sống',
        time: '10-15 phút',
        icon: readinessScore >= 140 ? '⭐' : readinessScore >= 100 ? '👁️' : '⭕',
        warning: readinessScore < 60 ? 'Điểm thấp - tập trung vào xây dựng rapport và động lực trước' : null
      },
      'wheel': {
        next: readinessScore >= 100 ? 'values' : 'som',
        label: readinessScore >= 100 ? 'Values Hierarchy' : 'SOM Tool',
        reason: readinessScore >= 100
          ? 'Khám phá giá trị cốt lõi của khách hàng'
          : 'Đo lường cường độ cảm xúc và trạng thái',
        time: '15-20 phút',
        icon: readinessScore >= 100 ? '❤️' : '🎯'
      },
      'vakad': {
        next: 'wheel',
        label: 'Wheel of Life',
        reason: 'Đánh giá toàn diện 8 lĩnh vực cuộc sống',
        time: '15-20 phút',
        icon: '⭕'
      },
      'som': {
        next: 'mapupdate',
        label: 'Map Update',
        reason: 'Chuyển từ blame sang trách nhiệm cá nhân',
        time: '15-20 phút',
        icon: '🗺️'
      },
      'values': {
        next: readinessScore >= 140 ? 'beliefs' : 'goals',
        label: readinessScore >= 140 ? 'Limiting Beliefs' : 'SMART Goals',
        reason: readinessScore >= 140
          ? 'Làm việc với niềm tin hạn chế'
          : 'Thiết lập mục tiêu cụ thể và khả thi',
        time: '20-30 phút',
        icon: readinessScore >= 140 ? '🧠' : '🎯'
      },
      'beliefs': {
        next: 'reframing',
        label: 'Reframing Toolkit',
        reason: 'Áp dụng kỹ thuật reframe để thay đổi góc nhìn',
        time: '20-25 phút',
        icon: '🔄'
      },
      'goals': {
        next: 'mapupdate',
        label: 'Map Update',
        reason: 'Xây dựng trách nhiệm cá nhân với mục tiêu',
        time: '15-20 phút',
        icon: '🗺️'
      },
      'reframing': {
        next: readinessScore >= 140 ? 'timeline' : 'worksheet',
        label: readinessScore >= 140 ? 'Timeline Therapy' : 'Worksheet',
        reason: readinessScore >= 140
          ? 'Làm việc với sự kiện quá khứ và cảm xúc'
          : 'Tổng hợp và lập kế hoạch hành động',
        time: readinessScore >= 140 ? '30-40 phút' : '10-15 phút',
        icon: readinessScore >= 140 ? '⏳' : '📄'
      },
      'timeline': {
        next: 'worksheet',
        label: 'Worksheet',
        reason: 'Tổng hợp toàn bộ session và lập action plan',
        time: '10-15 phút',
        icon: '📄'
      },
      'mapupdate': {
        next: 'worksheet',
        label: 'Worksheet',
        reason: 'Tổng hợp kết quả và lập kế hoạch hành động',
        time: '10-15 phút',
        icon: '📄'
      },
      'worksheet': {
        next: 'followup',
        label: 'Lên Lịch Follow-up',
        reason: 'Theo dõi tiến độ và cam kết tiếp theo',
        time: '5 phút',
        icon: '📈'
      }
    };

    return sectionFlow[currentSection] || null;
  };

  const nextStep = getNextStep();

  if (!nextStep || currentSection === 'home') return null;

  return (
    <div className="mt-8 border-t-2 border-gray-200 pt-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-blue-900">Bước Tiếp Theo Được Gợi Ý</h3>
            </div>

            {nextStep.warning && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-4 rounded">
                <p className="text-sm text-yellow-800 font-semibold">⚠️ {nextStep.warning}</p>
              </div>
            )}

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border-2 border-blue-200 hover:border-blue-400 transition">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{nextStep.icon}</span>
                    <h4 className="text-xl font-bold text-gray-800">{nextStep.label}</h4>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{nextStep.time}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{nextStep.reason}</p>

                <button
                  onClick={() => onNavigate(nextStep.next)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition shadow-md hover:shadow-lg"
                >
                  <span>Tiếp tục với {nextStep.label}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {nextStep.alternative && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-300">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Hoặc bạn có thể:</p>
                  <button
                    onClick={() => onNavigate(nextStep.alternative.section)}
                    className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 px-3 rounded-lg flex items-center justify-center space-x-2 transition text-sm"
                  >
                    <span>{nextStep.alternative.icon}</span>
                    <span>{nextStep.alternative.label}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextStepSuggestion;
