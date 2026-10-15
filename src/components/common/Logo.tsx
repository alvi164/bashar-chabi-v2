import React from 'react';
import { useTranslation } from '../../localization/LanguageContext.tsx';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = false, className = '' }) => {
  const { language } = useTranslation();

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-bold',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Handcrafted original House + Key SVG emblem */}
      <div
        className={`${iconSizes[size]} shrink-0 rounded-xl bg-[#0F4C3A] flex items-center justify-center p-1.5 shadow-sm text-white`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Gable Roof */}
          <path
            d="M24 6L6 20H12V40C12 41.1 12.9 42 14 42H34C35.1 42 36 41.1 36 40V20H42L24 6Z"
            stroke="#FAF9F5"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Key Bow */}
          <circle cx="24" cy="22" r="4.5" stroke="#F59E0B" strokeWidth="3" />
          {/* Key Shaft */}
          <path
            d="M24 26.5V36"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Key Teeth */}
          <path
            d="M24 31H28"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M24 35H29"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`${textSizes[size]} tracking-tight text-[#0F4C3A] leading-tight`}>
          {language === 'bn' ? 'বাসার চাবি' : 'Bashar Chabi'}
        </span>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-[#738079] leading-none mt-0.5">
            {language === 'bn' ? 'Find your home' : 'বাসার চাবি, এখন আপনার হাতে'}
          </span>
        )}
      </div>
    </div>
  );
};
