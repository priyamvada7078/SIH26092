/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';
import en from './en';
import hi from './hi';

const dictionaries = { en, hi };

const LanguageContext = createContext(null);

function getValue(dictionary, path) {
  return path.split('.').reduce((current, key) => current?.[key], dictionary);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const value = useMemo(() => {
    const dictionary = dictionaries[language] || dictionaries.en;

    return {
      language,
      setLanguage,
      t(path) {
        return getValue(dictionary, path) ?? getValue(dictionaries.en, path) ?? path;
      },
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
