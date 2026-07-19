import React, { useEffect, useRef } from 'react';
// Note: 'typed.js' is loaded globally from a <script> tag in index.html
import { useI18n } from '../contexts/i18n';
import { useTheme } from '../contexts/ThemeContext';
import PageLayout from './PageLayout';
import * as Icons from './Icons';
import VideoHomeCard from './VideoHomeCard';
import ThemeButton from './ThemeButton';


declare var Typed: any; // Let TypeScript know Typed exists on the global scope

interface MainContentProps {
    id?: string;
    onIntroToggle?: (isPlaying: boolean) => void;
}

const getRandomVibrantColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70 + Math.floor(Math.random() * 20); // 70-90%
    const lightness = 65 + Math.floor(Math.random() * 10); // 65-75% for good visibility
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const MainContent: React.FC<MainContentProps> = ({ id, onIntroToggle }) => {
    const { t, language, setLanguage } = useI18n();
    const { themeMode, setThemeMode } = useTheme();
    const heroData = t.hero;
    const typedEl = useRef(null);
    const typedInstance = useRef<any>(null);

    const [isSystemDark, setIsSystemDark] = React.useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsSystemDark(mediaQuery.matches);
        
        const handleChange = (e: MediaQueryListEvent) => {
            setIsSystemDark(e.matches);
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const isCurrentlyDark = themeMode === 'dark' || (themeMode === 'system' && isSystemDark);

    const handleToggleTheme = () => {
        if (isCurrentlyDark) {
            setThemeMode('light');
        } else {
            setThemeMode('dark');
        }
    };
    
    const VIDEO_SETS = [
        {
            idle: " https://cdn.scena.ai/project/9741/73e39b037268a364ed0bac9563119e5c5ea6d6294e8b4a50052653303b75c52f.mp4",
            intro: " https://cdn.scena.ai/project/9306/95e20a75c4af34a76d83b97ffc7ddc0b099bd815eebaad65a9ceef3c73fa19dd.mp4"
        },
       {
            idle: "https://cdn.scena.ai/project/9741/2a39ca2d544de96eb461b9e895a283060fd87031bee393b94f68d2fbab586371.mp4",
            intro: "https://cdn.scena.ai/project/8606/2e7340744cbfe1651694fbd190c1b3e6f1c1960ba73310d7c5759d96f1449e91.mp4 "
        }
    ];

    const [videoSetIndex, setVideoSetIndex] = React.useState(0);
    const currentVideoSet = VIDEO_SETS[videoSetIndex];

    const [videoUrl, setVideoUrl] = React.useState(currentVideoSet.idle);
    const [isMuted, setIsMuted] = React.useState(true);
    const [welcomeMessage, setWelcomeMessage] = React.useState('');
    const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' ? window.innerWidth <= 767 : false);
    
    // Language dropdown state and ref
    const [isLangOpen, setIsLangOpen] = React.useState(false);
    const langDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 767);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isIntroPlaying = videoUrl === currentVideoSet.intro;

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isIntroPlaying) {
                setVideoSetIndex((prev) => (prev === 0 ? 1 : 0));
            }
        }, 5 * 60 * 1000); // 5 minutes
        return () => clearInterval(interval);
    }, [isIntroPlaying]);

    // Update videoUrl when set changes if not in intro
    useEffect(() => {
        if (!isIntroPlaying) {
            setVideoUrl(currentVideoSet.idle);
        }
    }, [videoSetIndex]);

    useEffect(() => {
        onIntroToggle?.(isIntroPlaying);
    }, [isIntroPlaying, onIntroToggle]);

    useEffect(() => {
        const hour = new Date().getHours();
        let timeGreeting = language === 'en' ? "Good morning" : "Chào buổi sáng";
        if (hour >= 12 && hour < 18) {
            timeGreeting = language === 'en' ? "Good afternoon" : "Chào buổi chiều";
        } else if (hour >= 18) {
            timeGreeting = language === 'en' ? "Good evening" : "Chào buổi tối";
        }

        const savedName = localStorage.getItem('userName');
        if (savedName) {
            setWelcomeMessage(`${timeGreeting}, ${savedName}!`);
        } else {
            setWelcomeMessage(`${timeGreeting}!`);
        }
    }, [language]);

    const handleToggleIntro = (setIndex?: number) => {
        const targetIndex = setIndex !== undefined ? setIndex : videoSetIndex;
        const targetSet = VIDEO_SETS[targetIndex];
        
        if (isIntroPlaying && videoSetIndex === targetIndex) {
            setVideoUrl(VIDEO_SETS[videoSetIndex].idle);
            setIsMuted(true);
        } else {
            setVideoSetIndex(targetIndex);
            setVideoUrl(targetSet.intro);
            setIsMuted(false);
        }
    };

    useEffect(() => {
        // Strings for the typing animation from translations
        const strings = heroData.taglines.map(
            (line: string) => `<span class="glass-tagline" style="color: ${getRandomVibrantColor()}">${line}</span>`
        );

        const options = {
            strings: strings,
            typeSpeed: 50,
            backSpeed: 25,
            backDelay: 2000,
            loop: true,
            smartBackspace: true,
            showCursor: true,
            cursorChar: '_',
        };

        if (typedEl.current) {
            // Ensure typed.js is loaded from the script tag
            if (typeof Typed !== 'undefined') {
                // Destroy previous instance if it exists to prevent conflicts on language change
                if (typedInstance.current) {
                    typedInstance.current.destroy();
                }
                typedInstance.current = new Typed(typedEl.current, options);
            } else {
                console.error("Typed.js not found. Make sure it's loaded.");
            }
        }

        return () => {
            // Destroy Typed instance on unmount to prevent memory leaks
            if (typedInstance.current) {
                typedInstance.current.destroy();
            }
        };
    }, [heroData.taglines]); // Re-run when language (and thus taglines) changes

    return (
        <PageLayout id={id} innerStyle={{ borderRadius: '16px', marginBottom: '21px' }}>
            <VideoHomeCard
                videoUrl={videoUrl}
                isMuted={isMuted}
                isIntroPlaying={isIntroPlaying}
                onEnded={() => {
                    if (isIntroPlaying) {
                        setVideoUrl(currentVideoSet.idle);
                        setIsMuted(true);
                    }
                }}
            >
                <div className="home-hero-card-overlay" style={{ opacity: 0 }}></div>
                <div className="home-hero-card-content-wrapper">
                    <style>{`
                        .glass-btn-container {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            position: absolute;
                            bottom: 30px;
                            right: 30px;
                            z-index: 10;
                        }
                        .premium-intro-btn.glass-btn {
                            display: flex;
                            align-items: center;
                            height: 50px;
                            border-radius: 25px;
                            background: linear-gradient(135deg, var(--primary, #8A5CF6) 0%, var(--accent-color, #FF63C9) 100%);
                            border: 1.5px solid rgba(255, 255, 255, 0.3);
                            box-shadow: 0 8px 32px rgba(var(--primary-rgb, 138, 92, 246), 0.25);
                            overflow: hidden;
                            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                            width: 250px;
                            cursor: pointer;
                            user-select: none;
                        }
                        .premium-intro-btn.glass-btn:hover {
                            transform: translateY(-2px) scale(1.02);
                            box-shadow: 0 12px 36px rgba(var(--primary-rgb, 138, 92, 246), 0.4);
                            filter: brightness(1.1);
                        }
                        .premium-intro-btn.glass-btn:active {
                            transform: translateY(1px);
                        }
                        .premium-sound-toggle {
                            width: 56px;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-right: 1.5px solid rgba(255, 255, 255, 0.35);
                            transition: background 0.2s ease;
                        }
                        .premium-sound-toggle:hover {
                            background: rgba(255, 255, 255, 0.15);
                        }
                        .premium-main-toggle {
                            flex: 1;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 12px;
                            transition: background 0.2s ease;
                        }
                        .premium-main-toggle:hover {
                            background: rgba(255, 255, 255, 0.08);
                        }
                        .premium-btn-text {
                            color: white;
                            font-weight: 700;
                            font-size: 1.1rem;
                            letter-spacing: 0.5px;
                            text-shadow: 0 1px 2px rgba(0,0,0,0.15);
                        }
                        .premium-btn-icon {
                            color: white;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                                   .round-intro-btn.glass-btn, .left-intro-btn.glass-btn {
                            position: absolute;
                            z-index: 20;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 50px;
                            height: 50px;
                            border-radius: 50%;
                            background: linear-gradient(135deg, var(--primary, #8A5CF6) 0%, var(--accent-color, #FF63C9) 100%);
                            border: 1.5px solid rgba(255, 255, 255, 0.3);
                            box-shadow: 0 8px 32px rgba(var(--primary-rgb, 138, 92, 246), 0.2);
                            color: white;
                            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                            cursor: pointer;
                            user-select: none;
                        }
                        
                        .round-intro-btn.glass-btn {
                            right: 25px;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                        
                        .left-intro-btn.glass-btn {
                            left: 25px;
                            top: 50%;
                            transform: translateY(-50%);
                        }
                        
                        .round-intro-btn.glass-btn.transparent, .left-intro-btn.glass-btn.transparent {
                            background: rgba(255, 255, 255, 0.1);
                            backdrop-filter: blur(10px);
                            -webkit-backdrop-filter: blur(10px);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                        }

                        .round-intro-btn.glass-btn:hover, .left-intro-btn.glass-btn:hover {
                            border-color: rgba(255, 255, 255, 0.55);
                            transform: translateY(-50%) scale(1.12);
                            box-shadow: 0 12px 36px rgba(var(--primary-rgb, 138, 92, 246), 0.35);
                            filter: brightness(1.1);
                        }
                        .round-intro-btn.glass-btn:active, .left-intro-btn.glass-btn:active {
                            transform: translateY(-50%) scale(0.95);
                        }
                        .round-intro-btn.glass-btn.active-set {
                            background: var(--accent-gradient, rgba(0, 102, 255, 0.5));
                            border-color: var(--accent-color, #2DB9FF);
                            box-shadow: 0 0 20px rgba(var(--accent-color-rgb), 0.5);
                        }

                        .hero-name-text {
                            font-size: 3.5rem;
                            font-weight: 800;
                            line-height: 1.1;
                            letter-spacing: -0.02em;
                        }

                        .hero-intro-text {
                            font-size: 1.25rem;
                            font-weight: 500;
                            margin-bottom: 0.5rem;
                            color: white;
                            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        }

                        @media (max-width: 767px) {
                            .hero-name-text {
                                font-size: 2.2rem;
                            }
                            .hero-intro-text {
                                font-size: 1rem;
                            }
                            .hero-name-row {
                                gap: 12px !important;
                                justify-content: center !important;
                                text-align: center;
                            }
                            .home-hero-content {
                                align-items: center;
                                text-align: center;
                            }
                        }

                        @media (max-width: 480px) {
                            .hero-name-text {
                                font-size: 1.8rem;
                            }
                        }

                        @media (max-width: 640px) {
                            .glass-btn-container {
                                bottom: 15px;
                                right: 15px;
                            }
                            .premium-intro-btn.glass-btn {
                                width: 190px;
                                height: 44px;
                            }
                            .premium-sound-toggle {
                                width: 44px;
                            }
                            .premium-btn-text {
                                font-size: 0.95rem;
                            }
                            .premium-main-toggle {
                                gap: 8px;
                            }
                            .round-intro-btn.glass-btn {
                                width: 44px;
                                height: 44px;
                                right: 12px;
                            }
                        }

                        @keyframes slideDownIn {
                            from {
                                opacity: 0;
                                transform: translateY(-8px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                    `}</style>

                    {!isMobile && !isIntroPlaying && (
                        <div className="top-right-actions flex items-center gap-3">
                            <ThemeButton />
                            <div className="relative" ref={langDropdownRef}>
                                <button 
                                    className="glass-settings-btn flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95" 
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    title={language === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
                                    style={{
                                        height: '48px',
                                        borderRadius: '24px',
                                        padding: '0 16px',
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        color: '#FFFFFF',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Icons.GlobeAltIcon size={20} style={{ color: '#FFFFFF' }} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.5px' }}>
                                        {language === 'vi' ? 'Tiếng Việt' : 'English'}
                                    </span>
                                    <Icons.ChevronDownIcon 
                                        size={14} 
                                        style={{ 
                                            color: '#FFFFFF', 
                                            opacity: 0.8,
                                            transform: isLangOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s ease'
                                        }} 
                                    />
                                </button>
                                
                                {isLangOpen && (
                                    <div 
                                        className="absolute right-0 mt-2 py-1 w-36 rounded-xl shadow-xl border border-white/10 overflow-hidden z-[9999]"
                                        style={{
                                            background: 'rgba(23, 23, 37, 0.85)',
                                            backdropFilter: 'blur(16px)',
                                            WebkitBackdropFilter: 'blur(16px)',
                                            animation: 'slideDownIn 0.2s ease forwards'
                                        }}
                                    >
                                        <button
                                            onClick={() => {
                                                setLanguage('vi');
                                                setIsLangOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors"
                                            style={{
                                                color: language === 'vi' ? 'var(--accent-color, #38bdf8)' : '#FFFFFF',
                                                cursor: 'pointer',
                                                background: language === 'vi' ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                                            }}
                                        >
                                            Tiếng Việt
                                        </button>
                                        <button
                                            onClick={() => {
                                                setLanguage('en');
                                                setIsLangOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-white/10 transition-colors"
                                            style={{
                                                color: language === 'en' ? 'var(--accent-color, #38bdf8)' : '#FFFFFF',
                                                cursor: 'pointer',
                                                background: language === 'en' ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                                            }}
                                        >
                                            English
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {!isIntroPlaying ? (
                        <>
                            <div className="home-hero-content" style={{ display: "flex", flexDirection: "column", gap: "0px", width: "100%" }}>
                                {welcomeMessage && (
                                    <div className="welcome-msg text-xl md:text-2xl font-medium text-white/90 mb-3 drop-shadow-md tracking-wide">
                                        {welcomeMessage}
                                    </div>
                                )}
                                <p className="hero-intro-text">{heroData.intro}</p>
                                <div className="hero-name-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "16px", flexWrap: "wrap" }}>
                                    <h1 className="hero-name-text" style={{ margin: 0 }}>{heroData.name}</h1>
                                    
                                    <div className="premium-intro-btn glass-btn" style={{ position: 'relative', flexShrink: 0, bottom: 0, right: 0 }}>
                                            <div 
                                                className="premium-sound-toggle"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsMuted(!isMuted);
                                                }}
                                                title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                                            >
                                                {isMuted ? (
                                                    <Icons.SpeakerOffIcon size={20} style={{ color: 'white' }} />
                                                ) : (
                                                    <Icons.SpeakerWaveIcon size={20} style={{ color: 'white' }} className="animate-pulse" />
                                                )}
                                            </div>
                                            <div 
                                                className="premium-main-toggle"
                                                onClick={() => handleToggleIntro(videoSetIndex)}
                                                title="Xem Giới thiệu"
                                            >
                                                <span className="premium-btn-text">
                                                    Giới thiệu
                                                </span>
                                                <div className="premium-btn-icon">
                                                    <Icons.PlayIcon size={20} />
                                                </div>
                                            </div>
                                        </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-between w-full gap-4" style={{ marginTop: '0.2rem' }}>
                                    <h2 className="hero-typed-text-container" style={{ margin: 0, flex: 1, minWidth: '250px' }}>
                                        <span ref={typedEl}></span>
                                    </h2>
                                </div>
                            </div>
                            
                        </>
                    ) : (
                        <div className="glass-btn-container">
                            <div className="premium-intro-btn glass-btn">
                                <div 
                                    className="premium-sound-toggle"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMuted(!isMuted);
                                    }}
                                    title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                                >
                                    {isMuted ? (
                                        <Icons.SpeakerOffIcon size={20} style={{ color: 'white' }} />
                                    ) : (
                                        <Icons.SpeakerWaveIcon size={20} style={{ color: 'white' }} className="animate-pulse" />
                                    )}
                                </div>
                                <div 
                                    className="premium-main-toggle"
                                    onClick={() => handleToggleIntro(videoSetIndex)}
                                    title="Hủy bỏ"
                                >
                                    <span className="premium-btn-text">
                                        Hủy bỏ
                                    </span>
                                    <div className="premium-btn-icon">
                                        <Icons.XMarkIcon size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Left Switch Video Button */}
                    <div 
                        className="left-intro-btn glass-btn transparent"
                        onClick={() => {
                            const nextIndex = 0;
                            setVideoSetIndex(nextIndex);
                            if (isIntroPlaying) {
                                setVideoUrl(VIDEO_SETS[nextIndex].intro);
                                setIsMuted(false);
                            } else {
                                setVideoUrl(VIDEO_SETS[nextIndex].idle);
                                setIsMuted(true);
                            }
                        }}
                        title={'Xem Giới thiệu 1'}
                    >
                        <Icons.ChevronLeftIcon size={24} />
                    </div>

                    {/* Right Switch Video Button */}
                    <div 
                        className={`round-intro-btn glass-btn ${videoSetIndex === 0 ? 'transparent' : ''}`}
                        onClick={() => {
                            const nextIndex = videoSetIndex === 0 ? 1 : 0;
                            setVideoSetIndex(nextIndex);
                            if (isIntroPlaying) {
                                setVideoUrl(VIDEO_SETS[nextIndex].intro);
                                setIsMuted(false);
                            } else {
                                setVideoUrl(VIDEO_SETS[nextIndex].idle);
                                setIsMuted(true);
                            }
                        }}
                        title={videoSetIndex === 0 ? 'Xem Giới thiệu 2' : 'Xem Giới thiệu 1'}
                    >
                        <Icons.ChevronRightIcon size={24} />
                    </div>
                </div>
            </VideoHomeCard>
        </PageLayout>
    );
};

export default MainContent;
