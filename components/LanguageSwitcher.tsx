import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../contexts/i18n';
import * as Icons from './Icons';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'vi', name: 'Tiếng Việt' },
        { code: 'en', name: 'English' }
    ];
    
    const currentLanguageName = language === 'vi' ? 'Tiếng Việt' : 'English';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleLanguageChange = (langCode: 'vi' | 'en') => {
        setLanguage(langCode);
        setIsOpen(false);
    }

    return (
        <div className="language-switcher-dropdown relative" ref={dropdownRef}>
            <button 
                className="glass-settings-btn flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95" 
                onClick={() => setIsOpen(!isOpen)} 
                aria-haspopup="true" 
                aria-expanded={isOpen}
                title={currentLanguageName}
                style={{
                    height: '48px',
                    padding: '0 16px',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <Icons.LanguagesIcon size={20} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentLanguageName}</span>
            </button>
            {isOpen && (
                <div className="language-dropdown-panel absolute right-0 mt-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl shadow-xl py-2 min-w-[140px] backdrop-blur-md z-[10000]">
                    <div className="px-3 py-1 mb-1 text-[10px] uppercase tracking-wider font-bold text-[var(--text-secondary)] opacity-60">
                        {language === 'vi' ? 'Ngôn ngữ' : 'Language'}
                    </div>
                    {languages.map(lang => (
                        <button 
                            key={lang.code} 
                            className={`dropdown-item flex items-center justify-between w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${language === lang.code ? 'text-[var(--accent-color)] font-bold' : 'text-[var(--text-primary)]'}`}
                            onClick={() => handleLanguageChange(lang.code as 'vi' | 'en')}
                        >
                            {lang.name}
                            {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-color)]"></div>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
