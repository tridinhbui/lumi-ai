/**
 * Permission Handling Utilities
 * 
 * This file contains the core logic for checking user permissions.
 * It implements the permission handling flow without modifying existing features.
 */

import { AccountTier, SubscriptionStatus, PermissionResult, UserWithSubscription } from '../types/permissions';

/**
 * Check if subscription is currently valid
 * 
 * A subscription is valid if:
 * 1. Status is "active" OR "canceled" (canceled users still have access until expiration)
 * 2. Expiration date is in the future (or null for lifetime subscriptions)
 * 
 * This allows grace periods and respects canceled subscriptions until they expire.
 */
export const isSubscriptionValid = (
  status: SubscriptionStatus,
  expiresAt: number | null
): boolean => {
  // No subscription
  if (status === 'none' || status === 'expired') {
    return false;
  }

  // Active or canceled subscriptions are valid if not expired
  if (status === 'active' || status === 'canceled') {
    if (expiresAt === null) {
      // Lifetime subscription
      return true;
    }
    // Check if expiration is in the future
    return expiresAt > Date.now();
  }

  return false;
};

/**
 * Get user's effective tier
 * 
 * This determines the actual tier a user should have based on subscription status.
 * Even if accountTier is "premium", if subscription is expired, user should be treated as "free".
 * 
 * This prevents edge cases where subscription data is out of sync.
 */
export const getEffectiveTier = (user: UserWithSubscription | null): AccountTier => {
  if (!user || !user.subscription) {
    return 'free';
  }

  const { accountTier, subscriptionStatus, subscriptionExpiresAt } = user.subscription;

  // If marked as premium, verify subscription is still valid
  if (accountTier === 'premium') {
    if (isSubscriptionValid(subscriptionStatus, subscriptionExpiresAt)) {
      return 'premium';
    }
    // Subscription expired, downgrade to free
    return 'free';
  }

  return accountTier;
};

/**
 * Check if user has access to a premium feature
 * 
 * This is the main permission check function used throughout the application.
 * 
 * Flow:
 * 1. Get user's effective tier (handles expired subscriptions)
 * 2. Check if tier is premium
 * 3. Return detailed result for UI handling
 * 
 * Returns PermissionResult with:
 * - hasAccess: boolean indicating if access is granted
 * - reason: why access is denied (for UI messaging)
 * - expiresAt: when subscription expires (for countdown)
 * - canUpgrade: whether user can upgrade (always true for free users)
 */
export const checkPremiumAccess = (
  user: UserWithSubscription | null
): PermissionResult => {
  const effectiveTier = getEffectiveTier(user);

  if (effectiveTier === 'premium') {
    const subscription = user?.subscription;
    return {
      hasAccess: true,
      expiresAt: subscription?.subscriptionExpiresAt || undefined,
      canUpgrade: false, // Already premium
    };
  }

  // Free tier - determine reason for upgrade prompt
  const subscription = user?.subscription;
  let reason: 'free_tier' | 'expired' | 'canceled' | 'none' = 'free_tier';

  if (subscription) {
    if (subscription.subscriptionStatus === 'expired') {
      reason = 'expired';
    } else if (subscription.subscriptionStatus === 'canceled') {
      reason = 'canceled';
    } else if (subscription.subscriptionStatus === 'none') {
      reason = 'none';
    }
  }

  return {
    hasAccess: false,
    reason,
    canUpgrade: true,
  };
};

/**
 * Check if user can access a specific feature
 * 
 * Generic function to check feature access based on feature configuration.
 * This allows easy feature gating by just checking the feature config.
 */
export const checkFeatureAccess = (
  user: UserWithSubscription | null,
  requiresPremium: boolean
): PermissionResult => {
  if (!requiresPremium) {
    // Free feature - everyone has access
    return {
      hasAccess: true,
      canUpgrade: false,
    };
  }

  // Premium feature - check premium access
  return checkPremiumAccess(user);
};

/**
 * Format subscription expiration for display
 * 
 * Helper to format expiration timestamp for UI display.
 */
export const formatExpirationDate = (timestamp: number | null | undefined): string => {
  if (!timestamp) {
    return 'Never';
  }

  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Get days until expiration
 * 
 * Calculates days remaining in subscription for countdown displays.
 */
export const getDaysUntilExpiration = (expiresAt: number | null | undefined): number | null => {
  if (!expiresAt) {
    return null; // Lifetime subscription
  }

  const now = Date.now();
  const diff = expiresAt - now;

  if (diff < 0) {
    return 0; // Already expired
  }

  return Math.ceil(diff / (1000 * 60 * 60 * 24)); // Convert to days
};

/**
 * Sample Backend Logic (Node.js/Express example)
 * 
 * This shows how the permission check would work on the backend.
 * In production, this would be a middleware or service function.
 */

/*
// Backend Permission Middleware Example
export const requirePremium = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id; // From authentication middleware
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Fetch user from database
  const user = await db.users.findById(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check premium access
  const permission = checkPremiumAccess(user);
  
  if (!permission.hasAccess) {
    return res.status(403).json({
      error: 'Premium subscription required',
      reason: permission.reason,
      upgradeUrl: '/subscription',
    });
  }

  // Add subscription info to request for use in route handlers
  req.user.subscription = user.subscription;
  next();
};

// Usage in routes:
app.get('/api/premium-feature', requirePremium, (req, res) => {
  // This route is only accessible to premium users
  res.json({ data: 'Premium content' });
});
*/

