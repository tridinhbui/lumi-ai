/**
 * ProtectedFeature Component
 * 
 * Wrapper component that conditionally renders content based on permissions.
 * Shows locked state for free users, actual content for premium users.
 */

import React from 'react';
import { useFeatureAccess } from '../hooks/usePermissions';
import PremiumLock from './PremiumLock';

interface ProtectedFeatureProps {
  requiresPremium: boolean;
  featureName?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  lockVariant?: 'overlay' | 'card' | 'inline';
  className?: string;
}

/**
 * ProtectedFeature Component
 * 
 * Usage:
 * <ProtectedFeature requiresPremium={true} featureName="Advanced Analytics">
 *   <AdvancedAnalyticsComponent />
 * </ProtectedFeature>
 * 
 * This component:
 * - Checks if user has access
 * - Shows premium lock if access denied
 * - Renders children if access granted
 * - Provides smooth UX with clear upgrade path
 */
const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({
  requiresPremium,
  featureName,
  children,
  fallback,
  lockVariant = 'overlay',
  className = '',
}) => {
  const permission = useFeatureAccess(requiresPremium);

  // Free feature or user has access
  if (permission.hasAccess) {
    return <>{children}</>;
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show premium lock
  return (
    <div className={`relative ${className}`}>
      {/* Blurred content preview */}
      <div className="blur-sm pointer-events-none opacity-50">
        {children}
      </div>
      {/* Lock overlay */}
      <PremiumLock
        permission={permission}
        featureName={featureName}
        variant={lockVariant}
      />
    </div>
  );
};

export default ProtectedFeature;

