/**
 * Permission System Types
 * 
 * This file defines the data structures for the permission layer.
 * The system supports two tiers: Free and Premium.
 */

export type AccountTier = 'free' | 'premium';

export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'none';

/**
 * User Model Extension
 * 
 * These fields extend the existing User type to support permission management.
 * 
 * accountTier: Determines the user's current access level
 *   - "free": Limited access to basic features
 *   - "premium": Full access to all features including advanced ones
 * 
 * subscriptionStatus: Current state of the subscription
 *   - "active": Subscription is paid and valid
 *   - "canceled": User canceled but still has access until expiration
 *   - "expired": Subscription has expired, user should be downgraded
 *   - "none": No subscription exists (free tier)
 * 
 * subscriptionExpiresAt: Timestamp when premium access ends
 *   - Used to check if subscription is still valid
 *   - Allows grace period handling
 *   - Enables automatic tier downgrade
 */
export interface SubscriptionInfo {
  accountTier: AccountTier;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt: number | null; // Unix timestamp in milliseconds
}

/**
 * Extended User Type
 * 
 * This extends the existing User interface to include subscription information.
 * In production, this would be stored in your database and synced with Stripe.
 */
export interface UserWithSubscription {
  id: string;
  name: string;
  email: string;
  picture?: string;
  subscription?: SubscriptionInfo;
}

/**
 * Feature Permission Configuration
 * 
 * Defines which features require premium access.
 * This allows easy management of feature gating.
 */
export interface FeatureConfig {
  id: string;
  name: string;
  requiresPremium: boolean;
  description?: string;
}

/**
 * Permission Check Result
 * 
 * Result of checking if a user can access a feature.
 */
export interface PermissionResult {
  hasAccess: boolean;
  reason?: 'free_tier' | 'expired' | 'canceled' | 'none';
  expiresAt?: number;
  canUpgrade: boolean;
}

