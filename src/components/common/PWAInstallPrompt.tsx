import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall.ts';
import { useTranslation } from '../../localization/LanguageContext.tsx';

export const PWAInstallPrompt: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { language } = useTranslation();

  // If already installed as standalone PWA, suppress the prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop Install Flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-1.5 font-medium rounded-xl transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F4C3A] ${
          compact
            ? 'min-h-[38px] px-3 py-1.5 text-xs bg-[#E8F2EE] hover:bg-[#D4E6DF] text-[#0F4C3A]'
            : 'min-h-[44px] px-4 py-2 text-sm bg-[#0F4C3A] hover:bg-[#0B3A2C] text-white shadow-xs'
        }`}
        title={language === 'bn' ? 'ফোনে বাসার চাবি অ্যাপ ইনস্টল করুন' : 'Install Bashar Chabi App'}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>{language === 'bn' ? 'অ্যাপ ইনস্টল করুন' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari Flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-1.5 font-medium rounded-xl border border-[#D8D5CD] bg-white hover:bg-[#F3F1EB] text-[#192420] transition-colors cursor-pointer ${
            compact ? 'min-h-[38px] px-3 py-1.5 text-xs' : 'min-h-[44px] px-4 py-2 text-sm'
          }`}
        >
          <svg
            className="w-4 h-4 text-[#0F4C3A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>{language === 'bn' ? 'অ্যাপ যুক্ত করুন (iOS)' : 'Install on iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
            <div className="w-full max-w-sm bg-white rounded-2xl border border-[#E8E6DF] p-6 shadow-xl">
              <h3 className="text-base font-semibold text-[#192420]">
                {language === 'bn' ? 'আইফোন / আইপ্যাডে ইনস্টল করুন' : 'Install on iPhone / iPad'}
              </h3>
              <div className="mt-3 text-sm text-[#4A5550] space-y-2">
                <p>
                  ১. সাফারি ব্রাউজারের নিচের <strong>Share</strong> (শেয়ার) আইকন চাপুন।
                </p>
                <p>
                  ২. একটু নিচে স্ক্রল করে <strong>Add to Home Screen</strong> চাপুন।
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full min-h-[44px] rounded-xl bg-[#FAF9F5] border border-[#D8D5CD] text-sm font-medium text-[#192420] hover:bg-[#F3F1EB]"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
