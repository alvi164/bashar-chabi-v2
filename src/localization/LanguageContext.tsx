import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Language, Translations } from './types.ts';
import { bn } from './bn.ts';
import { en } from './en.ts';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  resolveBilingual: (bnText?: string, enText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'basharchabi_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'bn') {
        return stored;
      }
    } catch {
      // ignore localStorage errors in sandboxed contexts
    }
    return 'bn'; // Bangla-first by default
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  useEffect(() => {
    // Keep document HTML lang attribute in sync
    document.documentElement.lang = language;
  }, [language]);

  const t = useMemo(() => {
    // Use selected language dictionary with Bangla fallback for any missing keys
    const active = language === 'bn' ? bn : en;
    return new Proxy(active, {
      get(target, prop: keyof Translations) {
        return target[prop] || bn[prop] || '';
      },
    });
  }, [language]);

  /**
   * Helper to display bilingual content gracefully:
   * If current language is English, try enText first; if empty or missing, fallback to bnText.
   * If current language is Bangla, show bnText (or enText if bnText missing).
   */
  const resolveBilingual = (bnText?: string, enText?: string): string => {
    if (language === 'en') {
      return (enText && enText.trim()) || bnText || '';
    }
    return (bnText && bnText.trim()) || enText || '';
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        resolveBilingual,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
