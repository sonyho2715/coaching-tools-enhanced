// Subscription Tiers Configuration

export const TIERS = {
  FREE: 'free',
  PROFESSIONAL: 'professional',
  PRO: 'pro'
};

export const TIER_CONFIG = {
  [TIERS.FREE]: {
    name: 'Starter Coach',
    price: 0,
    priceMonthly: 0,
    priceYearly: 0,
    stripe_price_id_monthly: null,
    stripe_price_id_yearly: null,
    features: {
      maxClients: 3,
      basicAssessments: true,
      advancedNLP: false,
      analytics: false,
      followUp: false,
      emailTemplates: 3,
      customBranding: false,
      whiteLabel: false,
      clientPortal: false,
      teamMembers: 1,
      apiAccess: false,
      customAssessments: false,
      integrations: false,
      prioritySupport: false
    },
    allowedTools: [
      'home',
      'sessiontimer',
      'problemidentifier',
      'toolrecommender',
      'sessionnotes',
      'personalhistory',
      'readiness',
      'wheel',
      'vakad',
      'personalcolor',
      'questions',
      'email',
      'worksheet'
    ]
  },

  [TIERS.PROFESSIONAL]: {
    name: 'Professional Coach',
    price: 19,
    priceMonthly: 19,
    priceYearly: 190, // Save $38/year
    stripe_price_id_monthly: 'price_professional_monthly', // Replace with actual Stripe price ID
    stripe_price_id_yearly: 'price_professional_yearly',
    features: {
      maxClients: Infinity,
      basicAssessments: true,
      advancedNLP: true,
      analytics: true,
      followUp: true,
      emailTemplates: Infinity,
      customBranding: false,
      whiteLabel: false,
      clientPortal: false,
      teamMembers: 1,
      apiAccess: false,
      customAssessments: false,
      integrations: false,
      prioritySupport: 'email'
    },
    allowedTools: 'all' // All tools unlocked
  },

  [TIERS.PRO]: {
    name: 'Master Coach',
    price: 49,
    priceMonthly: 49,
    priceYearly: 490, // Save $98/year
    stripe_price_id_monthly: 'price_pro_monthly',
    stripe_price_id_yearly: 'price_pro_yearly',
    features: {
      maxClients: Infinity,
      basicAssessments: true,
      advancedNLP: true,
      analytics: true,
      followUp: true,
      emailTemplates: Infinity,
      customBranding: true,
      whiteLabel: true,
      clientPortal: true,
      teamMembers: 5,
      apiAccess: true,
      customAssessments: true,
      integrations: true,
      prioritySupport: 'phone'
    },
    allowedTools: 'all'
  }
};

// Feature descriptions for marketing
export const FEATURE_DESCRIPTIONS = {
  basicAssessments: {
    name: 'Basic Assessments',
    description: 'Personal History, Readiness, Wheel of Life, VAKAD, Personal Color'
  },
  advancedNLP: {
    name: 'Advanced NLP Tools',
    description: 'SOM, Spiral Dynamics, Meta-Programs, Timeline, Anchoring, Reframing, Map Update, Goals, Values, Beliefs, Energy Audit'
  },
  analytics: {
    name: 'Analytics Dashboard',
    description: 'Track client progress, session statistics, and assessment completion rates'
  },
  followUp: {
    name: 'Follow-up System',
    description: 'Manage follow-up sessions and track progress notes'
  },
  customBranding: {
    name: 'Custom Branding',
    description: 'Add your logo, custom colors, and domain'
  },
  whiteLabel: {
    name: 'White Label',
    description: 'Remove all Sony Ho branding and present as your own tool'
  },
  clientPortal: {
    name: 'Client Portal',
    description: 'Let clients login to view their own reports and progress'
  },
  apiAccess: {
    name: 'API Access',
    description: 'REST API and webhooks for custom integrations'
  },
  customAssessments: {
    name: 'Custom Assessment Builder',
    description: 'Create your own assessments with custom questions and scoring'
  },
  integrations: {
    name: 'Integrations',
    description: 'Calendly, Zoom, Stripe, CRM integrations, and more'
  }
};

// Check if a feature is available for a tier
export function hasFeature(tier, feature) {
  if (!tier || !TIER_CONFIG[tier]) return false;
  return TIER_CONFIG[tier].features[feature];
}

// Check if a tool is allowed for a tier
export function isToolAllowed(tier, toolId) {
  if (!tier || !TIER_CONFIG[tier]) return false;

  const config = TIER_CONFIG[tier];
  if (config.allowedTools === 'all') return true;

  return config.allowedTools.includes(toolId);
}

// Get client limit for a tier
export function getClientLimit(tier) {
  if (!tier || !TIER_CONFIG[tier]) return 0;
  return TIER_CONFIG[tier].features.maxClients;
}

// Get upgrade message for a locked feature
export function getUpgradeMessage(feature) {
  const messages = {
    advancedNLP: {
      title: '🔒 Advanced NLP Tools',
      message: 'Unlock powerful tools like Spiral Dynamics, Meta-Programs, and Timeline Therapy',
      tier: TIERS.PROFESSIONAL
    },
    analytics: {
      title: '🔒 Analytics Dashboard',
      message: 'Track client progress and session statistics',
      tier: TIERS.PROFESSIONAL
    },
    customBranding: {
      title: '🔒 Custom Branding',
      message: 'Add your logo, colors, and domain to make it yours',
      tier: TIERS.PRO
    },
    clientPortal: {
      title: '🔒 Client Portal',
      message: 'Let clients access their reports online',
      tier: TIERS.PRO
    },
    maxClients: {
      title: '⚠️ Client Limit Reached',
      message: 'You\'ve reached the 3-client limit for the free plan',
      tier: TIERS.PROFESSIONAL
    }
  };

  return messages[feature] || {
    title: '🔒 Upgrade Required',
    message: 'This feature is available in paid plans',
    tier: TIERS.PROFESSIONAL
  };
}

export default TIER_CONFIG;
