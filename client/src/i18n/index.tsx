import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import enModule, { type Translations } from "./en";
import trModule from "./tr";
import idModule from "./id";
import ruModule from "./ru";

export type Locale = "en" | "tr" | "id" | "ru";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "id", label: "Bahasa", flag: "🇮🇩" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

// Load translations - use default export or the module itself
const en: Translations = enModule;
const tr: Translations = trModule;
const id: Translations = idModule;
const ru: Translations = ruModule;

// Build translations object - all loaded from local files, no API calls
const translations: Record<Locale, Translations> = {
  en,
  tr,
  id,
  ru,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: en,
});

const STORAGE_KEY = "baseone-locale";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      // Only use saved locale if it exists in translations (safety check)
      if (saved && translations[saved]) return saved;
    } catch {
      // Ignore localStorage errors
    }
    return "en"; // Default to English
  });

  const setLocale = useCallback((l: Locale) => {
    // Safety check: only set if translation exists
    if (!translations[l]) {
      console.warn(`[i18n] Translation for locale "${l}" not found, falling back to English`);
      setLocaleState("en");
      return;
    }
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // Ignore localStorage errors
    }
    document.documentElement.lang = l;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // Get translation with fallback - never return undefined
  const currentTranslation = translations[locale] || translations.en;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: currentTranslation }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
