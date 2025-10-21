import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TIERS, hasFeature, isToolAllowed, getClientLimit } from '../config/pricing';

const useSubscriptionStore = create(
  persist(
    (set, get) => ({
      // User subscription data
      user: null,
      tier: TIERS.FREE,
      subscriptionStatus: 'inactive', // inactive, active, past_due, canceled
      subscriptionId: null,
      customerId: null,
      billingPeriod: 'monthly', // monthly or yearly

      // Set user data
      setUser: (user) => set({ user }),

      // Set subscription tier
      setTier: (tier) => set({ tier }),

      // Set full subscription data
      setSubscription: (subscriptionData) =>
        set({
          tier: subscriptionData.tier || TIERS.FREE,
          subscriptionStatus: subscriptionData.status || 'inactive',
          subscriptionId: subscriptionData.subscriptionId,
          customerId: subscriptionData.customerId,
          billingPeriod: subscriptionData.billingPeriod || 'monthly'
        }),

      // Clear subscription (logout)
      clearSubscription: () =>
        set({
          user: null,
          tier: TIERS.FREE,
          subscriptionStatus: 'inactive',
          subscriptionId: null,
          customerId: null
        }),

      // Helper methods
      isFeatureAllowed: (feature) => {
        const { tier } = get();
        return hasFeature(tier, feature);
      },

      isToolAllowed: (toolId) => {
        const { tier } = get();
        return isToolAllowed(tier, toolId);
      },

      getClientLimit: () => {
        const { tier } = get();
        return getClientLimit(tier);
      },

      isPro: () => {
        const { tier } = get();
        return tier === TIERS.PRO;
      },

      isProfessional: () => {
        const { tier } = get();
        return tier === TIERS.PROFESSIONAL || tier === TIERS.PRO;
      },

      isFree: () => {
        const { tier } = get();
        return tier === TIERS.FREE;
      },

      // Check if subscription is active and valid
      isSubscriptionActive: () => {
        const { subscriptionStatus } = get();
        return subscriptionStatus === 'active';
      }
    }),
    {
      name: 'subscription-storage', // localStorage key
      partialPersist: (state) => ({
        tier: state.tier,
        subscriptionStatus: state.subscriptionStatus,
        billingPeriod: state.billingPeriod
      })
    }
  )
);

export default useSubscriptionStore;
