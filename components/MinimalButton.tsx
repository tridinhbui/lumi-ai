import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MinimalButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const MinimalButton: React.FC<MinimalButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-[#1F4AA8] text-white hover:bg-[#153A73] focus:ring-[#1F4AA8] shadow-sm hover:shadow-md hover:-translate-y-0.5',
    secondary: 'bg-white text-[#2E2E2E] border border-[#E6E9EF] hover:bg-[#F8F9FB] hover:border-[#4C86FF] focus:ring-[#1F4AA8]',
    ghost: 'text-[#2E2E2E] hover:bg-[#F8F9FB] focus:ring-[#1F4AA8]',
    accent: 'bg-[#4C86FF] text-white hover:bg-[#0057E7] focus:ring-[#4C86FF] shadow-sm hover:shadow-md hover:-translate-y-0.5',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default MinimalButton;

