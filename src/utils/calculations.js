export const calculateWheelAverage = (wheelOfLife) => {
  const total = Object.values(wheelOfLife).reduce((sum, area) => sum + area.current, 0);
  return (total / 8).toFixed(1);
};

export const calculateVAKADTotals = (vakadAnswers) => {
  return Object.values(vakadAnswers).reduce((acc, q) => {
    acc.V += q.V || 0;
    acc.A += q.A || 0;
    acc.K += q.K || 0;
    acc.Ad += q.Ad || 0;
    return acc;
  }, { V: 0, A: 0, K: 0, Ad: 0 });
};

export const getDominantVAKAD = (vakadTotals) => {
  return Object.entries(vakadTotals).sort((a, b) => b[1] - a[1])[0];
};

export const calculateSpiralDynamicsLevel = (spiralDynamicsAnswers) => {
  const levels = Object.entries(spiralDynamicsAnswers).reduce((acc, [key, value]) => {
    if (value && value !== '') {
      const level = key.split('-')[0];
      acc[level] = (acc[level] || 0) + 1;
    }
    return acc;
  }, {});

  return Object.entries(levels).sort((a, b) => b[1] - a[1])[0];
};

export const calculateOverallProgress = (data) => {
  let completed = 0;
  let total = 13;

  if (data.clientName) completed++;
  if (data.sessionDate) completed++;
  if (Object.values(data.wheelOfLife).some(area => area.current > 0)) completed++;
  if (data.quickAssessment.readiness > 0) completed++;
  if (data.totalScore > 0) completed++;
  if (Object.keys(data.vakadAnswers).length > 0) completed++;
  if (Object.keys(data.personalColorAnswers).length > 0) completed++;
  if (Object.keys(data.spiralDynamicsAnswers).length > 0) completed++;
  if (Object.keys(data.metaProgramAnswers).length > 0) completed++;
  if (data.sessionNotes) completed++;
  if (data.coachObservations) completed++;
  if (data.actionPlan.some(a => a)) completed++;
  if (Object.keys(data.personalHistoryAnswers).length > 0) completed++;

  return Math.round((completed / total) * 100);
};

export const getReadinessLevel = (score) => {
  if (score >= 140) return {
    level: 'Sẵn sàng cao',
    color: 'text-green-600',
    bg: 'bg-green-50',
    icon: '✅',
    tools: 'SOM, VAKAD, Timeline Therapy, Meta Programs'
  };
  if (score >= 100) return {
    level: 'Sẵn sàng trung bình',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    icon: '⚠️',
    tools: 'Well-Formed Outcome, Values Work, Map Update'
  };
  if (score >= 60) return {
    level: 'Sẵn sàng thấp',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    icon: '⚠️',
    tools: 'Belief Audit, Motivation Building, Rapport'
  };
  return {
    level: 'Chưa sẵn sàng',
    color: 'text-red-600',
    bg: 'bg-red-50',
    icon: '❌',
    tools: 'Tạm hoãn coaching, Tư vấn thêm'
  };
};

export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateClientId = () => {
  return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTimeAgo = (date) => {
  if (!date) return '';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' năm trước';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' tháng trước';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' ngày trước';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' giờ trước';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' phút trước';

  return Math.floor(seconds) + ' giây trước';
};
