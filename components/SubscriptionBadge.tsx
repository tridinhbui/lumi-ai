/**
 * SubscriptionBadge Component
 * 
 * Displays user's subscription status in the UI.
 * Shows active subscription indicator with expiration info.
 */

import React from 'react';
import { Crown, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { usePremiumAccess } from '../hooks/usePermissions';
import { formatExpirationDate, getDaysUntilExpiration } from '../utils/permissions';

interface SubscriptionBadgeProps {
  variant?: 'header' | 'sidebar' | 'compact';
  showExpiration?: boolean;
}

const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({
  variant = 'header',
  showExpiration = true,
}) => {
  const { language } = useLanguage();
  const permission = usePremiumAccess();
  const daysUntilExpiration = permission.expiresAt 
    ? getDaysUntilExpiration(permission.expiresAt)
    : null;

  if (!permission.hasAccess) {
    return null; // Don't show badge for free users
  }

  if (variant === 'header') {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-[#1F4AA8] to-[#4C86FF] text-white rounded-lg text-sm font-medium">
        <Crown className="w-4 h-4" />
        <span>{language === 'vi' ? 'Premium' : 'Premium'}</span>
        {showExpiration && daysUntilExpiration !== null && daysUntilExpiration <= 7 && (
          <span className="text-xs opacity-90">
            ({daysUntilExpiration}d)
          </span>
        )}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="p-3 bg-gradient-to-br from-[#1F4AA8] to-[#4C86FF] rounded-xl text-white">
        <div className="flex items-center space-x-2 mb-2">
          <Crown className="w-5 h-5" />
          <span className="font-semibold">{language === 'vi' ? 'Tài Khoản Premium' : 'Premium Account'}</span>
        </div>
        {showExpiration && permission.expiresAt && (
          <div className="flex items-center space-x-1 text-xs opacity-90">
            <Clock className="w-3 h-3" />
            <span>
              {language === 'vi' ? 'Hết hạn' : 'Expires'}: {formatExpirationDate(permission.expiresAt)}
            </span>
          </div>
        )}
        {daysUntilExpiration !== null && daysUntilExpiration <= 7 && (
          <div className="mt-2 flex items-center space-x-1 text-xs bg-white/20 rounded px-2 py-1">
            <AlertCircle className="w-3 h-3" />
            <span>
              {language === 'vi' 
                ? `Còn ${daysUntilExpiration} ngày`
                : `${daysUntilExpiration} days remaining`}
            </span>
          </div>
        )}
      </div>
    );
  }

  // compact variant
  return (
    <div className="inline-flex items-center space-x-1 px-2 py-1 bg-[#E6F0FF] dark:bg-[#1F4AA8]/20 text-[#1F4AA8] dark:text-[#4C86FF] rounded-lg text-xs font-medium">
      <Crown className="w-3 h-3" />
      <span>Premium</span>
    </div>
  );
};

export default SubscriptionBadge;

