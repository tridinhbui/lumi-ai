/**
 * PremiumButton Component
 * 
 * Button that shows locked state for free users and navigates to upgrade.
 * Use this for premium-only actions.
 */

import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePremiumAccess } from '../hooks/usePermissions';
import { useLanguage } from '../contexts/LanguageContext';

interface PremiumButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

/**
 * PremiumButton Component
 * 
 * Automatically handles premium access:
 * - Shows locked state for free users
 * - Navigates to subscription page on click
 * - Shows normal button for premium users
 * 
 * Usage:
 * <PremiumButton onClick={handlePremiumAction}>
 *   Export Report
 * </PremiumButton>
 */
const PremiumButton: React.FC<PremiumButtonProps> = ({
  onClick,
  children,
  className = '',
  variant = 'primary',
  disabled = false,
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const permission = usePremiumAccess();

  const handleClick = () => {
    if (!permission.hasAccess) {
      navigate('/subscription');
      return;
    }

    if (onClick && !disabled) {
      onClick();
    }
  };

  const baseStyles = 'inline-flex items-center justify-center space-x-2 font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: permission.hasAccess
      ? 'bg-[#1F4AA8] dark:bg-[#4C86FF] text-white hover:bg-[#153A73] dark:hover:bg-[#1F4AA8] shadow-sm hover:shadow-md'
      : 'bg-gradient-to-r from-[#1F4AA8] to-[#4C86FF] text-white hover:shadow-xl shadow-lg',
    secondary: permission.hasAccess
      ? 'bg-white dark:bg-[#1e293b] text-[#1F4AA8] dark:text-[#4C86FF] border border-[#1F4AA8] dark:border-[#4C86FF] hover:bg-[#F8F9FB] dark:hover:bg-[#0f172a]'
      : 'bg-gradient-to-r from-[#1F4AA8] to-[#4C86FF] text-white hover:shadow-xl shadow-lg',
    ghost: permission.hasAccess
      ? 'text-[#1F4AA8] dark:text-[#4C86FF] hover:bg-[#F8F9FB] dark:hover:bg-[#0f172a]'
      : 'text-[#1F4AA8] dark:text-[#4C86FF] hover:bg-[#F8F9FB] dark:hover:bg-[#0f172a]',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled && permission.hasAccess}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {!permission.hasAccess && (
        <>
          <Lock className="w-4 h-4" />
          <Sparkles className="w-4 h-4" />
        </>
      )}
      {children}
      {!permission.hasAccess && (
        <span className="text-xs ml-1">
          ({language === 'vi' ? 'Premium' : 'Premium'})
        </span>
      )}
    </button>
  );
};

export default PremiumButton;

