import React from 'react';
import * as Icons from './Icons';
import { useI18n } from '../contexts/i18n';
import { useTheme } from '../contexts/ThemeContext';

interface MobileHeaderProps {
    title: string;
    onMenuClick: () => void;
    onOpenAiChat: () => void;
    isIdle?: boolean;
    activePageKey?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
    title, 
    onMenuClick,
    onOpenAiChat,
    isIdle,
    activePageKey,
}) => {
    const { t } = useI18n();
    const { themeMode, setThemeMode } = useTheme();

    return (
        <header className="mobile-header">
            <button
                className="header-icon-button menu-toggle-btn"
                onClick={onMenuClick}
                aria-label="Open menu"
            >
                <Icons.MenuIcon size={20} />
            </button>
            {activePageKey !== 'home' && <h1 className="mobile-header-title" style={{ fontSize: '1.125rem' }}>{title}</h1>}
            <div className="mobile-header-controls">
                <button onClick={onOpenAiChat} className={`header-icon-button ${isIdle && activePageKey !== 'aiChat' ? 'ai-chat-pulse' : ''}`} aria-label="Trợ lý AI" title="Trợ lý AI">
                    <Icons.BotIcon size={20} />
                </button>
                <a href="https://zalo.me/0909097882" target="_blank" rel="noopener noreferrer" className="header-icon-button control-zalo" title="Chat Zalo">
                    <Icons.MessageCircleIcon size={20} />
                </a>
            </div>
        </header>
    );
};

export default MobileHeader;