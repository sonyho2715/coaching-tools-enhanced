/**
 * Readiness-Based Routing System
 * Controls access to tools based on client readiness score
 */

export const getReadinessRouting = (readinessScore) => {
  // Calculate total readiness score
  const totalScore = typeof readinessScore === 'object'
    ? Object.values(readinessScore).flat().reduce((a, b) => a + b, 0)
    : readinessScore || 0;

  if (totalScore < 60) {
    return {
      level: 'not-ready',
      score: totalScore,
      message: '⚠️ Khách hàng chưa sẵn sàng cho coaching chuyên sâu',
      recommendation: 'Tập trung vào xây dựng rapport, động lực và sẵn sàng thay đổi trước',
      allowedTools: [
        'home',
        'sessiontimer',
        'personalhistory',
        'readiness',
        'wheel',
        'som',
        'questions',
        'email',
        'sessionnotes',
        'worksheet'
      ],
      lockedTools: [
        'values',
        'beliefs',
        'energy',
        'goals',
        'reframing',
        'anchoring',
        'timeline',
        'spiraldynamics',
        'metaprograms',
        'personalcolor'
      ],
      suggestedNext: ['wheel', 'som', 'sessionnotes'],
      warningColor: 'red'
    };
  }

  if (totalScore >= 60 && totalScore < 100) {
    return {
      level: 'low-readiness',
      score: totalScore,
      message: '🟡 Khách hàng có sẵn sàng cơ bản',
      recommendation: 'Có thể bắt đầu với các công cụ đơn giản. Tránh kỹ thuật NLP nâng cao.',
      allowedTools: [
        'home',
        'sessiontimer',
        'personalhistory',
        'readiness',
        'wheel',
        'som',
        'vakad',
        'mapupdate',
        'questions',
        'email',
        'problemidentifier',
        'toolrecommender',
        'sessionnotes',
        'worksheet',
        'followup'
      ],
      lockedTools: [
        'values',
        'beliefs',
        'reframing',
        'anchoring',
        'timeline',
        'spiraldynamics',
        'metaprograms'
      ],
      suggestedNext: ['wheel', 'vakad', 'mapupdate'],
      warningColor: 'yellow'
    };
  }

  if (totalScore >= 100 && totalScore < 140) {
    return {
      level: 'medium-readiness',
      score: totalScore,
      message: '🟢 Khách hàng sẵn sàng tốt',
      recommendation: 'Có thể sử dụng hầu hết công cụ. Thận trọng với Timeline Therapy.',
      allowedTools: [
        'home',
        'sessiontimer',
        'personalhistory',
        'readiness',
        'wheel',
        'som',
        'vakad',
        'personalcolor',
        'spiraldynamics',
        'metaprograms',
        'values',
        'energy',
        'goals',
        'mapupdate',
        'reframing',
        'questions',
        'email',
        'problemidentifier',
        'toolrecommender',
        'sessionnotes',
        'worksheet',
        'followup',
        'analytics'
      ],
      lockedTools: [
        'beliefs',
        'anchoring',
        'timeline'
      ],
      suggestedNext: ['values', 'vakad', 'goals'],
      warningColor: 'green'
    };
  }

  // Score >= 140
  return {
    level: 'high-readiness',
    score: totalScore,
    message: '⭐ Khách hàng rất sẵn sàng!',
    recommendation: 'Có thể sử dụng tất cả công cụ including Timeline Therapy và Anchoring.',
    allowedTools: 'all', // All tools available
    lockedTools: [],
    suggestedNext: ['values', 'beliefs', 'timeline', 'anchoring'],
    warningColor: 'blue'
  };
};

export const isToolAllowed = (toolId, readinessScore) => {
  const routing = getReadinessRouting(readinessScore);

  if (routing.allowedTools === 'all') {
    return true;
  }

  return routing.allowedTools.includes(toolId);
};

export const getToolLockMessage = (toolId, readinessScore) => {
  const routing = getReadinessRouting(readinessScore);

  const messages = {
    'values': {
      minScore: 100,
      message: 'Values Hierarchy yêu cầu điểm sẵn sàng ≥ 100',
      tip: 'Làm Wheel of Life và VAKAD trước'
    },
    'beliefs': {
      minScore: 140,
      message: 'Limiting Beliefs Work yêu cầu điểm sẵn sàng ≥ 140',
      tip: 'Công cụ này cần mức độ tự nhận thức và sẵn sàng cao'
    },
    'reframing': {
      minScore: 100,
      message: 'Reframing Toolkit yêu cầu điểm sẵn sàng ≥ 100',
      tip: 'Khách hàng cần sẵn sàng nhìn nhận vấn đề từ góc độ khác'
    },
    'anchoring': {
      minScore: 140,
      message: 'Anchoring Guide yêu cầu điểm sẵn sàng ≥ 140',
      tip: 'Kỹ thuật NLP nâng cao - cần kinh nghiệm và sẵn sàng cao'
    },
    'timeline': {
      minScore: 140,
      message: 'Timeline Therapy yêu cầu điểm sẵn sàng ≥ 140',
      tip: 'Làm việc với trauma quá khứ - chỉ dành cho khách hàng rất sẵn sàng'
    },
    'spiraldynamics': {
      minScore: 100,
      message: 'Spiral Dynamics yêu cầu điểm sẵn sàng ≥ 100',
      tip: 'Cần khả năng tư duy trừu tượng'
    },
    'metaprograms': {
      minScore: 100,
      message: 'Meta-Programs yêu cầu điểm sẵn sàng ≥ 100',
      tip: 'Phân tích sâu về patterns - cần sự tập trung cao'
    }
  };

  return messages[toolId] || {
    minScore: 60,
    message: `Công cụ này yêu cầu điểm sẵn sàng cao hơn (hiện tại: ${routing.score})`,
    tip: 'Làm Readiness Assessment để nâng điểm'
  };
};

export const shouldShowWarning = (readinessScore) => {
  const routing = getReadinessRouting(readinessScore);
  return routing.score < 100;
};

export const getReadinessAdvice = (readinessScore) => {
  const routing = getReadinessRouting(readinessScore);

  const advice = {
    'not-ready': {
      title: '⚠️ Chưa Sẵn Sàng Coaching',
      actions: [
        'Xây dựng rapport mạnh mẽ hơn',
        'Khám phá động lực thay đổi (Wheel of Life)',
        'Giải quyết red flags nếu có',
        'Tập trung vào cam kết nhỏ (Quick wins)'
      ],
      avoid: [
        'Không ép buộc cam kết lớn',
        'Tránh các công cụ phức tạp',
        'Không làm Timeline Therapy hoặc Beliefs Work'
      ]
    },
    'low-readiness': {
      title: '🟡 Sẵn Sàng Cơ Bản',
      actions: [
        'Sử dụng Wheel of Life để tăng awareness',
        'VAKAD để hiểu learning style',
        'Map Update cho responsibility shift',
        'Bắt đầu với mục tiêu nhỏ, đạt được'
      ],
      avoid: [
        'Tránh Timeline Therapy',
        'Chưa làm Beliefs Work',
        'Không anchor hoặc deep NLP techniques'
      ]
    },
    'medium-readiness': {
      title: '🟢 Sẵn Sàng Tốt',
      actions: [
        'Values Hierarchy để hiểu core values',
        'SMART Goals cho action planning',
        'Reframing techniques',
        'Meta-Programs cho deeper understanding'
      ],
      avoid: [
        'Cẩn thận với Timeline nếu có trauma',
        'Anchoring cần practice trước'
      ]
    },
    'high-readiness': {
      title: '⭐ Rất Sẵn Sàng!',
      actions: [
        'Timeline Therapy cho past issues',
        'Beliefs Work cho transformation',
        'Anchoring cho resource states',
        'Spiral Dynamics cho big picture'
      ],
      avoid: []
    }
  };

  return advice[routing.level];
};
