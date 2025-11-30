/**
 * PremiumLock Component
 * 
 * Displays a locked state for premium features with upgrade prompt.
 * This is the main UI component for gating premium features.
 */

import React from 'react';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { PermissionResult } from '../types/permissions';

interface PremiumLockProps {
  permission: PermissionResult;
  featureName?: string;
  className?: string;
  variant?: 'overlay' | 'card' | 'inline';
}

const PremiumLock: React.FC<PremiumLockProps> = ({
  permission,
  featureName,
  className = '',
  variant = 'overlay',
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const getReasonText = () => {
    if (!permission.reason) return '';
    
    const reasons = {
      free_tier: language === 'vi' 
        ? 'Tính năng này chỉ dành cho tài khoản Premium'
        : 'This feature is only available for Premium accounts',
      expired: language === 'vi'
        ? 'Gói Premium của bạn đã hết hạn'
        : 'Your Premium subscription has expired',
      canceled: language === 'vi'
        ? 'Gói Premium của bạn đã bị hủy'
        : 'Your Premium subscription has been canceled',
      none: language === 'vi'
        ? 'Nâng cấp lên Premium để sử dụng tính năng này'
        : 'Upgrade to Premium to use this feature',
    };

    return reasons[permission.reason];
  };

  const handleUpgrade = () => {
    navigate('/subscription');
  };

  if (variant === 'overlay') {
    return (
      <div className={`absolute inset-0 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10 ${className}`}>
        <div className="text-center p-8 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1F4AA8] to-[#4C86FF] rounded-2xl mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-[#1F4AA8] dark:text-[#4C86FF] mb-2">
            {language === 'vi' ? 'Tính Năng Premium' : 'Premium Feature'}
          </h3>
          {featureName && (
            <p className="text-[#737373] dark:text-[#94a3b8] mb-4">
              {featureName}
            </p>
          )}
          <p className="text-sm text-[#737373] dark:text-[#94a3b8] mb-6">
            {getReasonText()}
          </p>
          <button
            onClick={handleUpgrade}
            className="px-6 py-3 bg-gradient-to-r from-[#1F4AA8] to-[#4C86FF] text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center space-x-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            <span>{language === 'vi' ? 'Nâng Cấp Ngay' : 'Upgrade Now'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white dark:bg-[#1e293b] border-2 border-[#1F4AA8] dark:border-[#4C86FF] rounded-2xl p-6 text-center ${className}`}>
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#1F4AA8] to-[#4C86FF] rounded-xl mb-4">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-[#1F4AA8] dark:text-[#4C86FF] mb-2">
          {language === 'vi' ? 'Tính Năng Premium' : 'Premium Feature'}
        </h3>
        <p className="text-sm text-[#737373] dark:text-[#94a3b8] mb-4">
          {getReasonText()}
        </p>
        <button
          onClick={handleUpgrade}
          className="w-full px-4 py-2 bg-[#1F4AA8] dark:bg-[#4C86FF] text-white rounded-xl font-medium hover:bg-[#153A73] dark:hover:bg-[#1F4AA8] transition-all"
        >
          {language === 'vi' ? 'Nâng Cấp' : 'Upgrade'}
        </button>
      </div>
    );
  }

  // inline variant
  return (
    <div className={`flex items-center space-x-3 p-4 bg-[#F8F9FB] dark:bg-[#0f172a] border border-[#E6E9EF] dark:border-[#334155] rounded-xl ${className}`}>
      <Lock className="w-5 h-5 text-[#1F4AA8] dark:text-[#4C86FF] flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-[#2E2E2E] dark:text-[#e2e8f0]">
          {getReasonText()}
        </p>
      </div>
      <button
        onClick={handleUpgrade}
        className="px-4 py-2 bg-[#1F4AA8] dark:bg-[#4C86FF] text-white rounded-lg text-sm font-medium hover:bg-[#153A73] dark:hover:bg-[#1F4AA8] transition-all"
      >
        {language === 'vi' ? 'Nâng Cấp' : 'Upgrade'}
      </button>
    </div>
  );
};

export default PremiumLock;

