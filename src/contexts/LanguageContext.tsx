import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'de' | 'en';

type TranslationValue = string | string[];

interface Translations {
  [key: string]: TranslationValue;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => TranslationValue | string;
}

const translations: Record<Language, Translations> = {
  de: {
    // Navigation
    'nav.calendar': '📅',
    'nav.agenda': '📋',

    // Calendar Screen
    'calendar.title': 'Pflanzkalender',
    'calendar.addPlant': 'Neue Pflanze',
    'calendar.months.short': ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],

    // Agenda Screen
    'agenda.previous': 'Vorher',
    'agenda.current': 'Aktuell',
    'agenda.next': 'Demnächst',
    'agenda.noActivities': 'Keine Aktivitäten',
    'agenda.months': [
      'Jan 1-15', 'Jan 16-31', 'Feb 1-15', 'Feb 16-28', 'Mär 1-15', 'Mär 16-31',
      'Apr 1-15', 'Apr 16-30', 'Mai 1-15', 'Mai 16-31', 'Jun 1-15', 'Jun 16-30',
      'Jul 1-15', 'Jul 16-31', 'Aug 1-15', 'Aug 16-31', 'Sep 1-15', 'Sep 16-30',
      'Okt 1-15', 'Okt 16-31', 'Nov 1-15', 'Nov 16-30', 'Dez 1-15', 'Dez 16-31',
    ],

    // Settings Screen
    'settings.title': 'Pflanzkalender',
    'settings.theme': '🌙 System / Dunkel',
    'settings.language': '🌐 Deutsch / English',
    'settings.export': '📤 Daten als JSON exportieren',
    'settings.support': '☕ Support me',
    'settings.feedback': '📧 Feedback',
    'settings.about': 'Über',
    'settings.version': 'Version 1.2.0',
    'settings.license': 'Lizenz',
    'settings.licenseDetails': 'Open Source • MIT Lizenz\nKeine kommerzielle Nutzung ohne Genehmigung',
  },
  en: {
    // Navigation
    'nav.calendar': '📅',
    'nav.agenda': '📋',

    // Calendar Screen
    'calendar.title': 'Plant Calendar',
    'calendar.addPlant': 'New Plant',
    'calendar.months.short': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    // Agenda Screen
    'agenda.previous': 'Previous',
    'agenda.current': 'Current',
    'agenda.next': 'Next',
    'agenda.noActivities': 'No activities',
    'agenda.months': [
      'Jan 1-15', 'Jan 16-31', 'Feb 1-15', 'Feb 16-28', 'Mar 1-15', 'Mar 16-31',
      'Apr 1-15', 'Apr 16-30', 'May 1-15', 'May 16-31', 'Jun 1-15', 'Jun 16-30',
      'Jul 1-15', 'Jul 16-31', 'Aug 1-15', 'Aug 16-31', 'Sep 1-15', 'Sep 16-30',
      'Oct 1-15', 'Oct 16-31', 'Nov 1-15', 'Nov 16-30', 'Dec 1-15', 'Dec 16-31',
    ],

    // Settings Screen
    'settings.title': 'Plant Calendar',
    'settings.theme': '🌙 System / Dark',
    'settings.language': '🌐 German / English',
    'settings.export': '📤 Export data as JSON',
    'settings.support': '☕ Support me',
    'settings.feedback': '📧 Feedback',
    'settings.about': 'About',
    'settings.version': 'Version 1.2.0',
    'settings.license': 'License',
    'settings.licenseDetails': 'Open Source • MIT License\nNo commercial use without permission',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('de');

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const t = (key: string): TranslationValue | string => {
    return translations[language][key] || key;
  };

  // Load language from storage on mount
  React.useEffect(() => {
    AsyncStorage.getItem('language').then((storedLang) => {
      if (storedLang === 'de' || storedLang === 'en') {
        setLanguageState(storedLang);
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
