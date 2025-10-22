import { useState, useEffect } from 'react';

const SessionTimer = () => {
  const [sessionTimer, setSessionTimer] = useState({
    duration: 60,
    elapsed: 0,
    isRunning: false,
    startTime: null
  });

  // Cleanup interval on unmount
  useEffect(() => {
    let interval;
    if (sessionTimer.isRunning) {
      interval = setInterval(() => {
        setSessionTimer(prev => {
          if (!prev.isRunning) {
            clearInterval(interval);
            return prev;
          }
          return {...prev, elapsed: Math.floor((Date.now() - prev.startTime) / 1000)};
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionTimer.isRunning, sessionTimer.startTime]);

  const handleStart = () => {
    if (!sessionTimer.isRunning) {
      setSessionTimer({
        ...sessionTimer,
        isRunning: true,
        startTime: Date.now() - (sessionTimer.elapsed * 1000)
      });
    }
  };

  const handlePause = () => {
    setSessionTimer({...sessionTimer, isRunning: false});
  };

  const handleReset = () => {
    setSessionTimer({duration: 60, elapsed: 0, isRunning: false, startTime: null});
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">⏱️ Session Timer - Đồng Hồ Buổi Coaching</h2>

      <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-l-4 border-blue-500 p-4 rounded-lg">
        <p className="font-bold">Theo dõi thời gian buổi coaching</p>
        <p className="text-sm mt-2">Giúp coach quản lý thời gian và đảm bảo buổi coaching hiệu quả</p>
      </div>

      <div className="border-2 border-blue-200 rounded-lg p-8 bg-white shadow-lg text-center">
        <div className="text-6xl font-bold text-blue-600 mb-6">
          {Math.floor(sessionTimer.elapsed / 60)}:{(sessionTimer.elapsed % 60).toString().padStart(2, '0')}
        </div>
        <div className="text-sm text-gray-600 mb-6">
          Mục tiêu: {sessionTimer.duration} phút
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
            disabled={sessionTimer.isRunning}
          >
            ▶️ Bắt Đầu
          </button>
          <button
            onClick={handlePause}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold"
            disabled={!sessionTimer.isRunning}
          >
            ⏸️ Tạm Dừng
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border-2 border-purple-200 rounded-lg p-4 bg-white">
          <label className="block text-sm font-bold mb-2 text-purple-800">Thời lượng mục tiêu (phút)</label>
          <input
            type="number"
            value={sessionTimer.duration}
            onChange={(e) => setSessionTimer({...sessionTimer, duration: parseInt(e.target.value) || 60})}
            className="w-full p-3 border border-gray-300 rounded-lg"
            min="15"
            max="180"
            step="15"
          />
        </div>
      </div>
    </div>
  );
};

export default SessionTimer;
