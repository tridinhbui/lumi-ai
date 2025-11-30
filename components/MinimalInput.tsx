import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MinimalInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  className?: string;
}

const MinimalInput: React.FC<MinimalInputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  icon: Icon,
  className = '',
}) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full bg-white border border-neutral-300 rounded-xl
          px-4 py-3 text-base text-neutral-900 placeholder-neutral-400
          transition-all duration-200
          focus:outline-none focus:border-neutral-600 focus:ring-2 focus:ring-neutral-100
          disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed
          ${Icon ? 'pl-12' : ''}
          ${className}
        `}
      />
    </div>
  );
};

export default MinimalInput;

