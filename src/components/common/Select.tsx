import React, { useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  id: customId,
  className = '',
  required,
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
        <select
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          required={required}
          className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border bg-white text-[#192420] text-sm appearance-none transition-colors focus-visible:ring-2 focus-visible:ring-[#0F4C3A] focus-visible:ring-offset-1 focus-visible:border-transparent outline-none pr-10 cursor-pointer ${
            error
              ? 'border-[#DC2626] focus-visible:ring-[#DC2626]'
              : 'border-[#D8D5CD] hover:border-[#A8A49C]'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3.5 pointer-events-none text-[#738079]">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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
