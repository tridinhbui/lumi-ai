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
    ? 'transition-all duration-200 hover:shadow-md hover:border-neutral-300' 
    : '';
  
  return (
    <div
      className={`
        bg-white border border-neutral-200 rounded-2xl shadow-sm
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

