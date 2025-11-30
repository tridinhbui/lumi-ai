# Permission System Documentation

## Overview

This document describes the complete permission layer for the BizCase Lab web application. The system supports two access tiers: **Free** and **Premium**, with a clean separation between business logic and permission checks.

## 1. User Data Structure

### Fields

#### `accountTier: "free" | "premium"`
**Purpose**: Determines the user's current access level in the system.

**Why needed**:
- Quick lookup for tier-based feature gating
- Allows efficient permission checks without complex subscription logic
- Enables UI to show/hide premium features immediately

**How it's used**:
- Checked first in permission flow for fast path
- Updated when subscription status changes
- Can be cached for performance

#### `subscriptionStatus: "active" | "canceled" | "expired" | "none"`
**Purpose**: Tracks the current state of the user's subscription.

**Why needed**:
- **"active"**: Subscription is paid and valid - user has full premium access
- **"canceled"**: User canceled but still has access until expiration (grace period)
- **"expired"**: Subscription expired - user should be downgraded to free
- **"none"**: No subscription exists - user is on free tier

**How it's used**:
- Combined with `subscriptionExpiresAt` to determine actual access
- Allows grace periods for canceled subscriptions
- Enables proper messaging in UI (e.g., "Your subscription expired")

#### `subscriptionExpiresAt: number | null`
**Purpose**: Timestamp (milliseconds) when premium access ends.

**Why needed**:
- Validates if subscription is still active (even if status is "active")
- Enables countdown displays in UI
- Allows automatic tier downgrade when expired
- `null` indicates lifetime subscription

**How it's used**:
- Checked against current time to validate subscription
- Used for expiration warnings (e.g., "7 days remaining")
- Enables automatic cleanup jobs

### Example User Object

```typescript
{
  id: "user_123",
  name: "John Doe",
  email: "john@example.com",
  picture: "https://...",
  subscription: {
    accountTier: "premium",
    subscriptionStatus: "active",
    subscriptionExpiresAt: 1735689600000 // Jan 1, 2025
  }
}
```

## 2. Permission Handling Flow

### Flow Diagram

```
User attempts to access feature
    ↓
Check if feature requires premium
    ↓ (No) → Allow access
    ↓ (Yes)
Get user's effective tier
    ↓
Is tier "premium"?
    ↓ (Yes)
Check subscription validity
    ↓
Is subscription valid?
    ↓ (Yes) → Allow access
    ↓ (No)
Return permission denied with reason
    ↓
Show upgrade prompt in UI
```

### Core Logic

The permission system uses a three-step validation:

1. **Tier Check**: Quick check of `accountTier`
2. **Status Validation**: Verify `subscriptionStatus` is valid
3. **Expiration Check**: Ensure `subscriptionExpiresAt` is in the future

This layered approach handles edge cases:
- Expired subscriptions are automatically treated as free
- Canceled subscriptions still work until expiration
- System preference is respected (grace periods)

### Sample Backend Logic

```javascript
// utils/permissions.js (Backend)

/**
 * Check if subscription is currently valid
 */
function isSubscriptionValid(status, expiresAt) {
  // No subscription
  if (status === 'none' || status === 'expired') {
    return false;
  }

  // Active or canceled subscriptions are valid if not expired
  if (status === 'active' || status === 'canceled') {
    if (expiresAt === null) {
      return true; // Lifetime subscription
    }
    return expiresAt > Date.now(); // Check if expiration is in the future
  }

  return false;
}

/**
 * Get user's effective tier
 * Handles expired subscriptions automatically
 */
function getEffectiveTier(user) {
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
}

/**
 * Main permission check function
 */
function checkPremiumAccess(user) {
  const effectiveTier = getEffectiveTier(user);

  if (effectiveTier === 'premium') {
    return {
      hasAccess: true,
      expiresAt: user.subscription?.subscriptionExpiresAt,
      canUpgrade: false,
    };
  }

  // Determine reason for upgrade prompt
  const subscription = user?.subscription;
  let reason = 'free_tier';

  if (subscription) {
    if (subscription.subscriptionStatus === 'expired') {
      reason = 'expired';
    } else if (subscription.subscriptionStatus === 'canceled') {
      reason = 'canceled';
    }
  }

  return {
    hasAccess: false,
    reason,
    canUpgrade: true,
  };
}

// Express.js Middleware Example
const requirePremium = async (req, res, next) => {
  const userId = req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await db.users.findById(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const permission = checkPremiumAccess(user);
  
  if (!permission.hasAccess) {
    return res.status(403).json({
      error: 'Premium subscription required',
      reason: permission.reason,
      upgradeUrl: '/subscription',
    });
  }

  req.user.subscription = user.subscription;
  next();
};

// Usage in routes
app.get('/api/premium-feature', requirePremium, (req, res) => {
  res.json({ data: 'Premium content' });
});
```

### Future Extensions

The system is designed to support:

1. **Free Trials**: Add `trialEndsAt` field, check before subscription
2. **Grace Periods**: Extend expiration check with grace period window
3. **Feature Flags**: Per-feature permission checks
4. **Usage Limits**: Track usage counts for free tier

## 3. UI Integration

### Component Architecture

The permission system integrates through reusable components:

1. **PremiumLock**: Shows locked state with upgrade prompt
2. **ProtectedFeature**: Wraps premium content
3. **PremiumButton**: Button that handles premium access
4. **SubscriptionBadge**: Shows subscription status

### Locked Feature States

**Purpose**: Clearly indicate when a feature requires premium access.

**Implementation**:
```tsx
<ProtectedFeature requiresPremium={true} featureName="Advanced Analytics">
  <AdvancedAnalyticsDashboard />
</ProtectedFeature>
```

**UX Benefits**:
- Users see what they're missing (blurred preview)
- Clear call-to-action to upgrade
- No confusion about why feature is unavailable

### Upgrade Paywall Popups

**Purpose**: Convert free users to premium with clear value proposition.

**Implementation**:
```tsx
<PremiumLock 
  permission={permission}
  featureName="PDF Processing"
  variant="overlay"
/>
```

**UX Benefits**:
- Non-intrusive overlay (doesn't break flow)
- Contextual messaging (explains what feature does)
- Direct upgrade path (one click to subscription)

### Active Subscription Indicators

**Purpose**: Show premium users their subscription status.

**Implementation**:
```tsx
<SubscriptionBadge variant="header" showExpiration={true} />
```

**UX Benefits**:
- Builds trust (users see their premium status)
- Expiration warnings prevent surprise downgrades
- Countdown creates urgency for renewal

### Disabled Buttons/Icons

**Purpose**: Prevent accidental clicks on premium features.

**Implementation**:
```tsx
<PremiumButton onClick={handleExport}>
  Export Report
</PremiumButton>
```

**UX Benefits**:
- Visual indication (lock icon)
- Clear labeling ("Premium" badge)
- Automatic navigation to upgrade page

### Smooth Experience Flow

**Upgrade Flow**:
1. User clicks premium feature → See locked state
2. Click "Upgrade" → Navigate to subscription page
3. Complete payment → Return to feature
4. Feature now unlocked → Seamless experience

**Why this works**:
- No dead ends (always a path forward)
- Context preserved (user knows what they're upgrading for)
- Quick return (feature works immediately after payment)

## Integration Examples

### Example 1: Protect a Dashboard Component

```tsx
import { ProtectedFeature } from '../components/ProtectedFeature';

function AnalyticsPage() {
  return (
    <div>
      <h1>Analytics</h1>
      
      {/* Free feature - always visible */}
      <BasicStats />
      
      {/* Premium feature - locked for free users */}
      <ProtectedFeature 
        requiresPremium={true}
        featureName="Advanced Analytics Dashboard"
      >
        <AdvancedAnalyticsDashboard />
      </ProtectedFeature>
    </div>
  );
}
```

### Example 2: Premium-Only Button

```tsx
import { PremiumButton } from '../components/PremiumButton';

function ExportPanel() {
  const handleExport = () => {
    // Export logic
  };

  return (
    <div>
      <PremiumButton onClick={handleExport}>
        Export to PDF
      </PremiumButton>
    </div>
  );
}
```

### Example 3: Conditional Rendering

```tsx
import { usePremiumAccess } from '../hooks/usePermissions';

function FeatureList() {
  const permission = usePremiumAccess();

  return (
    <div>
      <Feature name="Basic Chat" available={true} />
      <Feature name="PDF Upload" available={permission.hasAccess} />
      <Feature name="Advanced Analytics" available={permission.hasAccess} />
    </div>
  );
}
```

## Best Practices

1. **Always check permissions client-side AND server-side**
2. **Show locked states, don't hide features completely**
3. **Provide clear upgrade paths from every locked feature**
4. **Use consistent messaging across the app**
5. **Cache permission checks for performance**
6. **Handle edge cases (expired, canceled subscriptions)**

## Testing

Test scenarios:
- Free user accessing premium feature → Should show lock
- Premium user with active subscription → Should have access
- Premium user with expired subscription → Should show lock
- Premium user with canceled subscription → Should have access until expiration
- User upgrading → Should immediately gain access

## Summary

The permission system provides:
- ✅ Clean separation of concerns
- ✅ Reusable components
- ✅ Smooth user experience
- ✅ Extensible architecture
- ✅ Production-ready code

All existing features remain unchanged - the permission layer is added on top.

