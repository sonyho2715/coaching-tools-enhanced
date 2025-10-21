import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const AutoSaveIndicator = ({ lastSaved, isSaving, sessionTimer }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatSessionTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-3 z-50">
      <Clock className="w-4 h-4 text-blue-600" />
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">Thời gian</span>
        <span className="text-sm font-semibold text-gray-800">
          {formatTime(currentTime)}
        </span>
      </div>
      {sessionTimer && sessionTimer.isRunning && (
        <>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Session</span>
            <span className="text-sm font-semibold text-green-600">
              {formatSessionTime(sessionTimer.elapsed)}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default AutoSaveIndicator;
