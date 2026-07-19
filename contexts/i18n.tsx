import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import * as translations from '../translations';

export type Language = 'vi' | 'en';
type Translations = typeof translations.vi;

interface I18nContextType {
    t: Translations;
    language: Language;
    setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('language') as Language;
            if (saved === 'vi' || saved === 'en') return saved;
            // Fallback to browser language
            const browserLang = navigator.language.split('-')[0];
            return browserLang === 'vi' ? 'vi' : 'en';
        }
        return 'vi';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);
    
    const t = useMemo(() => {
        // Return English if selected, otherwise fallback to Vietnamese
        const allTrans = translations as any;
        return language === 'vi' ? translations.vi : (allTrans.en || translations.vi);
    }, [language]);

    return (
        <I18nContext.Provider value={{ t, language, setLanguage }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (context === undefined) {
        console.warn('useI18n was called outside I18nProvider. Using fallback translations.');
        return {
            t: translations.vi,
            language: 'vi' as Language,
            setLanguage: () => {}
        };
    }
    return context;
};