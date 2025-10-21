import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useCoaching } from '../contexts/CoachingContext';
import { calculateWheelAverage, calculateVAKADTotals } from '../utils/calculations';
import { TrendingUp, BarChart3, Target, Award } from 'lucide-react';

const AnalyticsDashboard = () => {
  const { sessionHistory, clients, currentClientId } = useCoaching();

  const currentClient = useMemo(() => {
    return clients.find(c => c.id === currentClientId);
  }, [clients, currentClientId]);

  // Prepare session progress data
  const sessionProgressData = useMemo(() => {
    if (!sessionHistory || sessionHistory.length === 0) return [];

    return sessionHistory.map((session, index) => {
      const wheelAvg = calculateWheelAverage(session.wheelOfLife);
      const totalScore = Object.values(session.readinessScores).flat().reduce((a, b) => a + b, 0);

      return {
        name: `Phiên ${index + 1}`,
        date: new Date(session.savedAt).toLocaleDateString('vi-VN'),
        wheelOfLife: parseFloat(wheelAvg),
        readiness: session.quickAssessment.readiness,
        detailedScore: totalScore
      };
    });
  }, [sessionHistory]);

  // Prepare Wheel of Life comparison data
  const wheelComparisonData = useMemo(() => {
    if (!sessionHistory || sessionHistory.length === 0) return [];

    const firstSession = sessionHistory[0];
    const latestSession = sessionHistory[sessionHistory.length - 1];

    return [
      {
        area: 'Tâm Linh',
        'Phiên Đầu': firstSession.wheelOfLife.spirituality.current,
        'Phiên Mới Nhất': latestSession.wheelOfLife.spirituality.current
      },
      {
        area: 'Sự Nghiệp',
        'Phiên Đầu': firstSession.wheelOfLife.career.current,
        'Phiên Mới Nhất': latestSession.wheelOfLife.career.current
      },
      {
        area: 'Gia Đình',
        'Phiên Đầu': firstSession.wheelOfLife.family.current,
        'Phiên Mới Nhất': latestSession.wheelOfLife.family.current
      },
      {
        area: 'Quan Hệ',
        'Phiên Đầu': firstSession.wheelOfLife.relationships.current,
        'Phiên Mới Nhất': latestSession.wheelOfLife.relationships.current
      },
      {
        area: 'Sức Khỏe',
        'Phiên Đầu': firstSession.wheelOfLife.health.current,
        'Phiên Mới Nhất': latestSession.wheelOfLife.health.current
      },
      {
        area: 'Phát Triển',
        'Phiên Đầu': firstSession.wheelOfLife.personal.current,
        'Phiên Mới Nhất': latestSession.wheelOfLife.personal.current
      },
      {
        area: 'Giải Trí',
        'Phiên Đầu': firstSession.wheelOfLife.leisure.current,
        'Phiên Mới Nhất': latestSession.wheelOfLife.leisure.current
      },
      {
        area: 'Đóng Góp',
        'Phiên Đầu': firstSession.wheelOfLife.contribution.current,
        'Phiên Mới Nhất': latestSession.wheelOfLife.contribution.current
      }
    ];
  }, [sessionHistory]);

  // Calculate overall improvements
  const improvements = useMemo(() => {
    if (!sessionHistory || sessionHistory.length < 2) return null;

    const firstSession = sessionHistory[0];
    const latestSession = sessionHistory[sessionHistory.length - 1];

    const firstWheel = parseFloat(calculateWheelAverage(firstSession.wheelOfLife));
    const latestWheel = parseFloat(calculateWheelAverage(latestSession.wheelOfLife));
    const wheelImprovement = ((latestWheel - firstWheel) / firstWheel * 100).toFixed(1);

    const firstReadiness = firstSession.quickAssessment.readiness;
    const latestReadiness = latestSession.quickAssessment.readiness;
    const readinessImprovement = ((latestReadiness - firstReadiness) / firstReadiness * 100).toFixed(1);

    return {
      wheelImprovement: parseFloat(wheelImprovement),
      readinessImprovement: parseFloat(readinessImprovement),
      totalSessions: sessionHistory.length
    };
  }, [sessionHistory]);

  // VAKAD trends
  const vakadTrendsData = useMemo(() => {
    if (!sessionHistory || sessionHistory.length === 0) return [];

    return sessionHistory.map((session, index) => {
      const vakadTotals = calculateVAKADTotals(session.vakadAnswers);
      return {
        name: `S${index + 1}`,
        V: vakadTotals.V,
        A: vakadTotals.A,
        K: vakadTotals.K,
        Ad: vakadTotals.Ad
      };
    });
  }, [sessionHistory]);

  if (!currentClient) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">
          Chọn một khách hàng để xem phân tích
        </p>
      </div>
    );
  }

  if (!sessionHistory || sessionHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">
          Chưa có dữ liệu session nào.<br />
          Hãy hoàn thành một session để xem phân tích.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">📊 Bảng Phân Tích</h2>
          <p className="text-sm text-gray-600 mt-1">
            Phân tích tiến trình của {currentClient.name}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      {improvements && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Bánh Xe Cuộc Sống</span>
            </div>
            <p className="text-3xl font-bold text-blue-700">
              {improvements.wheelImprovement > 0 ? '+' : ''}
              {improvements.wheelImprovement}%
            </p>
            <p className="text-xs text-gray-600 mt-1">So với phiên đầu tiên</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Điểm Sẵn Sàng</span>
            </div>
            <p className="text-3xl font-bold text-green-700">
              {improvements.readinessImprovement > 0 ? '+' : ''}
              {improvements.readinessImprovement}%
            </p>
            <p className="text-xs text-gray-600 mt-1">Cải thiện độ sẵn sàng</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-8 h-8 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Tổng Số Phiên</span>
            </div>
            <p className="text-3xl font-bold text-purple-700">{improvements.totalSessions}</p>
            <p className="text-xs text-gray-600 mt-1">Tổng số buổi coaching</p>
          </div>
        </div>
      )}

      {/* Progress Over Time */}
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-800">📈 Tiến Trình Theo Thời Gian</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sessionProgressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="wheelOfLife"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Bánh Xe Cuộc Sống"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="readiness"
              stroke="#10b981"
              strokeWidth={2}
              name="Độ Sẵn Sàng"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Wheel of Life Comparison */}
      {sessionHistory.length >= 2 && (
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-800">🎡 So Sánh Wheel of Life</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={wheelComparisonData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="area" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10 }} />
              <Radar
                name="Phiên Đầu"
                dataKey="Phiên Đầu"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
              />
              <Radar
                name="Phiên Mới Nhất"
                dataKey="Phiên Mới Nhất"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* VAKAD Trends */}
      {vakadTrendsData.length > 0 && (
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-800">👁️👂🤲 Xu Hướng Phong Cách Học VAKAD</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vakadTrendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="V" fill="#8b5cf6" name="Thị Giác (V)" />
              <Bar dataKey="A" fill="#3b82f6" name="Thính Giác (A)" />
              <Bar dataKey="K" fill="#10b981" name="Vận Động (K)" />
              <Bar dataKey="Ad" fill="#f59e0b" name="Thính Giác Số (Ad)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Session History Table */}
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="text-lg font-bold mb-4 text-gray-800">📋 Lịch Sử Các Phiên</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left p-2 font-semibold">Phiên</th>
                <th className="text-left p-2 font-semibold">Ngày</th>
                <th className="text-left p-2 font-semibold">TB Bánh Xe</th>
                <th className="text-left p-2 font-semibold">Sẵn Sàng</th>
                <th className="text-left p-2 font-semibold">Mức Kẹt</th>
              </tr>
            </thead>
            <tbody>
              {sessionHistory.map((session, index) => {
                const wheelAvg = calculateWheelAverage(session.wheelOfLife);
                return (
                  <tr key={session.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-2 font-medium">Phiên {index + 1}</td>
                    <td className="p-2 text-gray-600">
                      {new Date(session.savedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-2">
                      <span className="font-bold text-blue-600">{wheelAvg}/10</span>
                    </td>
                    <td className="p-2">
                      <span className="font-bold text-green-600">
                        {session.quickAssessment.readiness}/10
                      </span>
                    </td>
                    <td className="p-2 text-gray-600">
                      {session.quickAssessment.stuckLevel || 'Không có'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
