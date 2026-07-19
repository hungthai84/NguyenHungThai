import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import * as Icons from './Icons';
import { useI18n } from '../contexts/i18n';

const ThemeButton: React.FC = () => {
    const { themeMode, setThemeMode } = useTheme();
    const {} = useI18n();
    const [isSystemDark, setIsSystemDark] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsSystemDark(mediaQuery.matches);
        
        const handleChange = (e: MediaQueryListEvent) => {
            setIsSystemDark(e.matches);
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const isCurrentlyDark = themeMode === 'dark' || (themeMode === 'system' && isSystemDark);

    const handleToggle = () => {
        if (isCurrentlyDark) {
            setThemeMode('light');
        } else {
            setThemeMode('dark');
        }
    };

    const getThemeLabel = () => {
        return isCurrentlyDark ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối';
    };

    return (
        <div className="relative">
            <button 
                className="glass-settings-btn flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95" 
                onClick={handleToggle}
                title={getThemeLabel()}
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: isCurrentlyDark ? '#FFB800' : '#F59E0B',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}
            >
                {isCurrentlyDark ? <Icons.MoonIcon size={20} /> : <Icons.SunIcon size={22} />}
            </button>
        </div>
    );
};

export default ThemeButton;
