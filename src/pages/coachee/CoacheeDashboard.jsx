import { useState } from 'react';
import { useCoaching } from '../../contexts/CoachingContext';
import { Target, TrendingUp, CheckCircle, Circle, Heart, Calendar } from 'lucide-react';

const CoacheeDashboard = () => {
  const coaching = useCoaching();
  const { clientName, wheelOfLife, readinessScores, actionPlan } = coaching;

  // Calculate overall readiness score
  const totalReadinessScore = Object.values(readinessScores).flat().reduce((a, b) => a + b, 0);
  const readinessPercentage = Math.round((totalReadinessScore / 160) * 100);

  // Calculate wheel average
  const wheelScores = Object.values(wheelOfLife).map(item => item.current);
  const wheelAverage = wheelScores.length > 0
    ? (wheelScores.reduce((a, b) => a + b, 0) / wheelScores.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {clientName || 'there'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Your personal growth dashboard</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Readiness Score */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Readiness Score</h3>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600">{readinessPercentage}%</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${readinessPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Your commitment level</p>
          </div>

          {/* Life Balance */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Life Balance</h3>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Circle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-600">{wheelAverage}/10</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(wheelAverage / 10) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Overall satisfaction</p>
          </div>

          {/* Active Goals */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">Active Goals</h3>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600">3</div>
            <p className="text-sm text-gray-600 mt-2">In progress</p>
          </div>
        </div>

        {/* Wheel of Life Visualization */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Circle className="w-5 h-5 text-purple-600" />
            Your Life Balance
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries({
              spirituality: { label: '🙏 Spirituality', color: 'bg-purple-500' },
              career: { label: '💼 Career', color: 'bg-blue-500' },
              family: { label: '👨‍👩‍👧 Family', color: 'bg-green-500' },
              relationships: { label: '❤️ Relationships', color: 'bg-pink-500' },
              health: { label: '💪 Health', color: 'bg-red-500' },
              personal: { label: '📚 Personal Growth', color: 'bg-yellow-500' },
              leisure: { label: '🎉 Fun & Leisure', color: 'bg-indigo-500' },
              contribution: { label: '🌟 Contribution', color: 'bg-teal-500' }
            }).map(([key, { label, color }]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {wheelOfLife[key]?.current || 0}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${((wheelOfLife[key]?.current || 0) / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Action Plan */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Your Action Plan
          </h3>

          {actionPlan ? (
            <div className="space-y-3">
              {actionPlan.split('\n').filter(line => line.trim()).map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-gray-700 flex-1">{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No action items yet. Your coach will set these up in your next session.</p>
          )}
        </div>

        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-8 text-white text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <blockquote className="text-xl font-medium mb-2">
            "The only impossible journey is the one you never begin."
          </blockquote>
          <p className="text-sm opacity-90">— Tony Robbins</p>
        </div>
      </div>
    </div>
  );
};

export default CoacheeDashboard;
