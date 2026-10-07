'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'hi' | 'de' | 'fr';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'es', label: 'Español', nativeName: 'Español' },
  { code: 'hi', label: 'हिंदी / संस्कृत', nativeName: 'Sanskrit / Hindi' },
  { code: 'de', label: 'Deutsch', nativeName: 'Deutsch' },
  { code: 'fr', label: 'Français', nativeName: 'Français' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (_key, fallback) => fallback,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('justprem_lang') as Language;
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('justprem_lang', lang);
  };

  const t = (_key: string, fallback: string) => {
    // Modular translation fallback engine for easy future i18n key maps expansion
    return fallback;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
