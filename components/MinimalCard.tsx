import React from 'react';

interface MinimalCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const MinimalCard: React.FC<MinimalCardProps> = ({
  children,
  className = '',
  hover = true,
  padding = 'md',
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const hoverStyles = hover 
    ? 'transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)]' 
    : '';
  
  return (
    <div
      className={`
        bg-white border border-[#E6E9EF] rounded-2xl shadow-sm
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default MinimalCard;

