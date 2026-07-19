import React from 'react';
import * as Icons from './Icons';
import { useTheme } from '../contexts/ThemeContext';

export interface VideoControlButtonsProps {
    type: 'play' | 'cancel';
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    label: string;
    height?: string;
    title?: string;
    className?: string;
    isMuted?: boolean;
    onMuteToggle?: (e: React.MouseEvent) => void;
}

export const VideoControlButtons: React.FC<VideoControlButtonsProps> = ({
    type,
    onClick,
    label,
    height = '48px',
    title,
    className = '',
    isMuted = true,
    onMuteToggle
}) => {
    const { themeMode } = useTheme();
    
    // Determine light/dark mode
    const isDark = themeMode === 'system'
        ? (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
        : themeMode === 'dark';

    // Parse height to calculate responsive proportions
    const numericHeight = parseInt(height) || 48;
    const leftIconSize = Math.round(numericHeight * 0.38);
    const rightIconSize = Math.round(numericHeight * 0.34);
    const fontSizeClass = numericHeight >= 48 ? 'text-sm md:text-base' : 'text-xs md:text-sm';

    // Styles according to the design specifications
    let backgroundStyle = '';
    let borderStyle = '';
    let textColorClass = '';
    let leftBlockBg = '';
    let shadowStyle = '';

    if (type === 'play') {
        // Play button: uses rgba(255,255,255,.12) in dark mode with 12px blur & translateY(-2px) hover
        if (isDark) {
            backgroundStyle = 'rgba(255, 255, 255, 0.12)';
            borderStyle = '1px solid rgba(255, 255, 255, 0.2)';
            textColorClass = 'text-white';
            leftBlockBg = 'rgba(255, 255, 255, 0.08)';
            shadowStyle = '0 8px 32px 0 rgba(0, 0, 0, 0.2)';
        } else {
            // Light mode: adjusted for visibility while maintaining the elegant glass feel
            backgroundStyle = 'rgba(255, 255, 255, 0.65)';
            borderStyle = '1px solid rgba(15, 23, 42, 0.15)';
            textColorClass = 'text-slate-800';
            leftBlockBg = 'rgba(15, 23, 42, 0.05)';
            shadowStyle = '0 8px 32px 0 rgba(31, 41, 55, 0.08)';
        }
    } else {
        // Cancel button: uses blue tone #3b82f6 with glassmorphism styling
        if (isDark) {
            backgroundStyle = 'rgba(59, 130, 246, 0.25)';
            borderStyle = '1px solid rgba(59, 130, 246, 0.45)';
            textColorClass = 'text-blue-200';
            leftBlockBg = 'rgba(59, 130, 246, 0.15)';
            shadowStyle = '0 8px 32px 0 rgba(59, 130, 246, 0.15)';
        } else {
            backgroundStyle = 'rgba(59, 130, 246, 0.12)';
            borderStyle = '1px solid rgba(59, 130, 246, 0.35)';
            textColorClass = 'text-blue-700';
            leftBlockBg = 'rgba(59, 130, 246, 0.08)';
            shadowStyle = '0 8px 32px 0 rgba(59, 130, 246, 0.1)';
        }
    }

    return (
        <button
            onClick={onClick}
            title={title || label}
            className={`group relative flex items-center overflow-hidden rounded-full font-bold transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98] ${textColorClass} ${className}`}
            style={{
                background: backgroundStyle,
                border: borderStyle,
                height: height,
                padding: '0',
                boxShadow: shadowStyle,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                cursor: 'pointer',
                userSelect: 'none',
            }}
        >
            {/* Left Glass Icon Block (Mute/Speaker icon) */}
            <div
                className="flex items-center justify-center h-full"
                style={{
                    background: leftBlockBg,
                    borderTopLeftRadius: '999px',
                    borderBottomLeftRadius: '999px',
                    borderRight: borderStyle,
                    padding: `0 ${Math.round(numericHeight * 0.42)}px`,
                }}
                onClick={(e) => {
                    if (onMuteToggle) {
                        e.stopPropagation();
                        onMuteToggle(e);
                    }
                }}
            >
                {isMuted ? (
                    <Icons.SpeakerOffIcon 
                        size={leftIconSize} 
                        className={`transition-transform duration-300 group-hover:scale-110 ${type === 'play' && !isDark ? 'text-slate-700' : type === 'cancel' && !isDark ? 'text-blue-600' : 'text-white'}`} 
                    />
                ) : (
                    <Icons.SpeakerWaveIcon 
                        size={leftIconSize} 
                        className={`transition-transform duration-300 group-hover:scale-110 ${type === 'play' && !isDark ? 'text-slate-700' : type === 'cancel' && !isDark ? 'text-blue-600' : 'text-white'}`} 
                    />
                )}
            </div>

            {/* Right Label & Sparkles/XMark Icon Block */}
            <div 
                className="flex items-center justify-center gap-2 h-full"
                style={{
                    paddingLeft: `${Math.round(numericHeight * 0.42)}px`,
                    paddingRight: `${Math.round(numericHeight * 0.5)}px`,
                }}
            >
                <span className={`${fontSizeClass} tracking-wide font-extrabold select-none`}>
                    {label}
                </span>
                {type === 'play' ? (
                    <Icons.SparklesIcon 
                        size={rightIconSize} 
                        className={`animate-pulse ${!isDark ? 'text-amber-500' : 'text-yellow-200'}`} 
                    />
                ) : (
                    <Icons.XMarkIcon 
                        size={rightIconSize} 
                        className="transition-transform duration-300 group-hover:rotate-90 text-blue-500" 
                    />
                )}
            </div>
        </button>
    );
};

export default VideoControlButtons;
