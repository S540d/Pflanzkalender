import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as i18n from '../i18n';
import type { TranslationValue, Translations } from '../i18n';

export type Language = 'de' | 'en' | 'fr' | 'es' | 'it' | 'pl' | 'nl' | 'pt';

export const SUPPORTED_LANGUAGES: { code: Language; nativeLabel: string }[] = [
  { code: 'de', nativeLabel: 'Deutsch' },
  { code: 'en', nativeLabel: 'English' },
  { code: 'fr', nativeLabel: 'Français' },
  { code: 'es', nativeLabel: 'Español' },
  { code: 'it', nativeLabel: 'Italiano' },
  { code: 'pl', nativeLabel: 'Polski' },
  { code: 'nl', nativeLabel: 'Nederlands' },
  { code: 'pt', nativeLabel: 'Português' },
];

// Languages with full translations across ALL screens (including ClimateScreen).
// Used for the picker AND for initial language resolution so users never end up
// in a language where some screens are not yet localized.
// Expand once ClimateScreen is localized for FR/ES/IT/PL/NL/PT (Issue #83 follow-up).
const FULLY_LOCALIZED: Language[] = ['de', 'en'];

export const PICKER_LANGUAGES = SUPPORTED_LANGUAGES.filter((l) => FULLY_LOCALIZED.includes(l.code));

const translations: Record<Language, Translations> = {
  de: i18n.de,
  en: i18n.en,
  fr: i18n.fr,
  es: i18n.es,
  it: i18n.it,
  pl: i18n.pl,
  nl: i18n.nl,
  pt: i18n.pt,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => TranslationValue | string;
}

function detectSystemLanguage(): Language {
  try {
    let locale: string | undefined;
    if (Platform.OS === 'web') {
      // platform-safe: navigator only available in web context
      locale = typeof navigator !== 'undefined' ? navigator.language : undefined;
    }
    if (!locale) return 'de';
    const code = locale.split('-')[0].toLowerCase() as Language;
    return FULLY_LOCALIZED.includes(code) ? code : 'de';
  } catch {
    return 'de';
  }
}

const STORAGE_KEY = 'language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('de');
  const isUserSetRef = React.useRef(false);

  const setLanguage = async (lang: Language) => {
    isUserSetRef.current = true;
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const t = (key: string): TranslationValue | string => {
    return translations[language][key] || key;
  };

  // Load language from storage on mount; skip if user already chose a language
  React.useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((storedLang) => {
      if (isUserSetRef.current) return;
      if (storedLang && FULLY_LOCALIZED.includes(storedLang as Language)) {
        setLanguageState(storedLang as Language);
      } else {
        setLanguageState(detectSystemLanguage());
      }
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
