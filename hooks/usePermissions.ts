/**
 * usePermissions Hook
 * 
 * React hook for checking user permissions in components.
 * This provides a clean API for components to check access.
 */

import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { checkPremiumAccess, checkFeatureAccess, getEffectiveTier } from '../utils/permissions';
import { PermissionResult, UserWithSubscription } from '../types/permissions';

/**
 * Hook to check premium access
 * 
 * Returns permission result that updates when user changes.
 * Memoized for performance.
 */
export const usePremiumAccess = (): PermissionResult => {
  const { user } = useAuth();

  return useMemo(() => {
    const userWithSub: UserWithSubscription | null = user ? {
      ...user,
      subscription: user.subscription || {
        accountTier: 'free',
        subscriptionStatus: 'none',
        subscriptionExpiresAt: null,
      },
    } : null;

    return checkPremiumAccess(userWithSub);
  }, [user]);
};

/**
 * Hook to check specific feature access
 * 
 * Use this when checking access to a specific feature.
 */
export const useFeatureAccess = (requiresPremium: boolean): PermissionResult => {
  const { user } = useAuth();

  return useMemo(() => {
    const userWithSub: UserWithSubscription | null = user ? {
      ...user,
      subscription: user.subscription || {
        accountTier: 'free',
        subscriptionStatus: 'none',
        subscriptionExpiresAt: null,
      },
    } : null;

    return checkFeatureAccess(userWithSub, requiresPremium);
  }, [user, requiresPremium]);
};

/**
 * Hook to get user's effective tier
 * 
 * Returns the current tier the user should have (handles expired subscriptions).
 */
export const useUserTier = (): 'free' | 'premium' => {
  const { user } = useAuth();

  return useMemo(() => {
    const userWithSub: UserWithSubscription | null = user ? {
      ...user,
      subscription: user.subscription || {
        accountTier: 'free',
        subscriptionStatus: 'none',
        subscriptionExpiresAt: null,
      },
    } : null;

    return getEffectiveTier(userWithSub);
  }, [user]);
};

