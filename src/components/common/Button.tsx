import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:ring-2 focus-visible:ring-[#0F4C3A] focus-visible:ring-offset-2 outline-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.99]';

  const sizeClasses = {
    sm: 'min-h-[38px] px-3.5 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'min-h-[44px] px-5 py-2.5 text-sm rounded-xl gap-2',
    lg: 'min-h-[50px] px-6 py-3 text-base rounded-xl gap-2.5 font-semibold',
  };

  const variantClasses = {
    primary: 'bg-[#0F4C3A] hover:bg-[#0B3A2C] text-white shadow-xs',
    accent: 'bg-[#D97706] hover:bg-[#B45309] text-white shadow-xs',
    secondary: 'bg-[#E8F2EE] hover:bg-[#D4E6DF] text-[#0F4C3A]',
    outline: 'border border-[#D8D5CD] bg-white hover:bg-[#F3F1EB] text-[#192420]',
    ghost: 'bg-transparent hover:bg-[#E8F2EE] text-[#4A5550] hover:text-[#0F4C3A]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
