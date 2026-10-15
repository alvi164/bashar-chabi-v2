import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  id: customId,
  className = '',
  required,
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const id = customId || generatedId;
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#192420] flex items-center gap-1 select-none"
        >
          <span>{label}</span>
          {required && <span className="text-[#D97706] font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {startIcon && (
          <span className="absolute left-3.5 text-[#738079] pointer-events-none flex items-center">
            {startIcon}
          </span>
        )}

        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          required={required}
          disabled={disabled}
          className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border bg-white text-[#192420] text-sm placeholder:text-[#9DA7A2] transition-colors focus-visible:ring-2 focus-visible:ring-[#0F4C3A] focus-visible:ring-offset-1 focus-visible:border-transparent outline-none disabled:bg-[#F3F1EB] disabled:cursor-not-allowed ${
            startIcon ? 'pl-10' : ''
          } ${endIcon ? 'pr-10' : ''} ${
            error
              ? 'border-[#DC2626] focus-visible:ring-[#DC2626]'
              : 'border-[#D8D5CD] hover:border-[#A8A49C]'
          } ${className}`}
          {...props}
        />

        {endIcon && (
          <span className="absolute right-3.5 text-[#738079] pointer-events-none flex items-center">
            {endIcon}
          </span>
        )}
      </div>

      {error ? (
        <p id={errorId} className="text-xs text-[#DC2626] font-medium mt-0.5">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-[#738079] mt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
