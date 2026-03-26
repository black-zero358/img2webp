import { createContext, useContext, useState, useEffect } from 'react';
import { translations, detectLang } from './i18n';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(detectLang);

  // Keep the html[lang] attribute in sync for accessibility / SEO.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => {
    const next = lang === 'en' ? 'zh' : 'en';
    localStorage.setItem('lang', next);
    setLang(next);
  };

  const t = (key, ...args) => {
    const dict = translations[lang] ?? translations.en;
    const val = dict[key] ?? translations.en[key] ?? key;
    return typeof val === 'function' ? val(...args) : val;
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within a LangProvider');
  return ctx;
}
