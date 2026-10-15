import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus.ts';
import { useTranslation } from '../../localization/LanguageContext.tsx';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useTranslation();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex items-center gap-2.5 rounded-xl bg-[#D97706] px-4 py-2.5 text-xs sm:text-sm font-medium text-white shadow-lg animate-in slide-in-from-bottom-2"
    >
      <svg
        className="w-4 h-4 shrink-0 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 4.243a9 9 0 01-2.829-2.829m0 0L3 21m2.829-5.657a5 5 0 010-7.072M9 9l3 3m0 0l3 3"
        />
      </svg>
      <span>{t.offlineBanner}</span>
    </div>
  );
};
