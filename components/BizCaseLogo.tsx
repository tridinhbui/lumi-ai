import React from 'react';

interface BizCaseLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const BizCaseLogo: React.FC<BizCaseLogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Shield Icon with Book and Arrow */}
      <svg
        className={sizeClasses[size]}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shield */}
        <path
          d="M50 10 L20 20 L20 50 Q20 70 35 80 L50 90 L65 80 Q80 70 80 50 L80 20 Z"
          stroke="#153A73"
          strokeWidth="3"
          fill="none"
          className="loading-shield"
        />
        {/* Book */}
        <path
          d="M35 50 L35 65 L50 70 L65 65 L65 50"
          stroke="#153A73"
          strokeWidth="2.5"
          fill="none"
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="70"
          stroke="#153A73"
          strokeWidth="2.5"
        />
        {/* Arrow */}
        <path
          d="M65 50 L75 40 L80 45 L70 55 Z"
          stroke="#153A73"
          strokeWidth="2.5"
          fill="#153A73"
        />
        <line
          x1="65"
          y1="50"
          x2="80"
          y2="35"
          stroke="#153A73"
          strokeWidth="2.5"
        />
      </svg>
      
      {/* Text */}
      {showText && (
        <div className="flex flex-col animate-logo-text">
          <span className={`font-bold text-[#1F4AA8] ${textSizes[size]} leading-tight`}>
            BizCase Lab
          </span>
          <span className="text-xs text-[#737373] font-medium -mt-1">
            From Cases to Career Growth
          </span>
        </div>
      )}
    </div>
  );
};

export default BizCaseLogo;

