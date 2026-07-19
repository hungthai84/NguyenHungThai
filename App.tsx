
import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { createPortal } from 'react-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import * as Icons from './components/Icons';
import { useTheme } from './contexts/ThemeContext';
import { useI18n } from './contexts/i18n';
import MobileHeader from './components/MobileHeader';

import ThemeButton from './components/ThemeButton';
import ClockWeatherWidget from './components/ClockWeatherWidget';
import PdfFallbackModal from './components/PdfFallbackModal';
import { generatePdfFromElement } from './utils/pdfGenerator';

// Lazy load page components to minimize initial bundle size and optimize website load speeds
const SkillsPage = lazy(() => import('./components/SkillsPage'));
const CoverLetter = lazy(() => import('./components/CoverLetter'));
const AiChatPage = lazy(() => import('./components/AiChatPage'));
const EducationPage = lazy(() => import('./components/EducationPage'));
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const ProjectPostPopup = lazy(() => import('./components/ProjectPostPopup'));
const SettingsPage = lazy(() => import('./components/SettingsPanel'));
const WorkExperiencePage = lazy(() => import('./components/WorkExperiencePage'));
const SchedulerPage = lazy(() => import('./components/SchedulerPage'));
const PrintableView = lazy(() => import('./components/PrintableView'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const SystemsPage = lazy(() => import('./components/SystemsPage'));
const InterviewPage = lazy(() => import('./components/InterviewPage'));
const HoroscopePage = lazy(() => import('./components/HoroscopePage'));

// Lazy load heavy components
const ProjectsPage = lazy(() => import('./components/ProjectsPage'));
const MemoriesPage = lazy(() => import('./components/MemoriesPage'));

const LoadingFallback: React.FC = () => (
    <div className="flex justify-center items-center h-full w-full">
        <div className="w-8 h-8 rounded-full border-2 border-t-2 border-[var(--accent-color)] border-t-transparent animate-spin"></div>
    </div>
);


const baseNavStructure: {
    key: string;
    tKey: string;
    icon: keyof typeof Icons;
    component: React.FC<any>;
    showInMenu?: boolean;
}[] = [
    { key: 'home', tKey: 'home', icon: 'HomeIcon', component: MainContent },
    { key: 'coverLetter', tKey: 'coverLetter', icon: 'DocumentTextIcon', component: CoverLetter },
    { key: 'about', tKey: 'about', icon: 'UserIcon', component: AboutPage },
    { key: 'experience', tKey: 'experience', icon: 'BriefcaseIcon', component: WorkExperiencePage },
    { key: 'education', tKey: 'education', icon: 'AcademicCapIcon', component: EducationPage },
    { key: 'services', tKey: 'services', icon: 'LayersIcon', component: ServicesPage },
    { key: 'skills', tKey: 'skills', icon: 'LightBulbIcon', component: SkillsPage },
    { 
        key: 'projects', 
        tKey: 'projects', 
        icon: 'FolderIcon', 
        component: ProjectsPage,
    },
    { key: 'systems', tKey: 'systems', icon: 'ServerIcon', component: SystemsPage },
    { key: 'interview', tKey: 'interview', icon: 'PresentationIcon', component: InterviewPage },
    { key: 'horoscope', tKey: 'horoscope', icon: 'SparklesIcon', component: HoroscopePage },
    { key: 'memories', tKey: 'memories', icon: 'CameraIcon', component: MemoriesPage },
    { key: 'scheduler', tKey: 'scheduler', icon: 'CalendarDaysIcon', component: SchedulerPage, showInMenu: false },
    { key: 'aiChat', tKey: 'aiChat', icon: 'BotIcon', component: AiChatPage, showInMenu: false },
    { key: 'settings', tKey: 'settings', icon: 'SettingsIcon', component: SettingsPage, showInMenu: false },
    { key: 'print', tKey: 'print', icon: 'PrinterIcon', component: () => null, showInMenu: false }, // Special item for mobile menu
];

const App: React.FC = () => {
    const { t } = useI18n();
    const { isSoundOn, wallpaper } = useTheme();

    const { allPages, pageKeys, mainPages, mainPageKeys } = React.useMemo(() => {
        const projects = t.projectsPage?.projects || [];
        const projectPostPages = projects.map(p => ({
            key: `project-${p.id}`,
            tKey: p.title,
            icon: 'DocumentTextIcon' as keyof typeof Icons,
            component: ProjectPostPopup,
            showInMenu: false,
        }));
        
        const allPages = [...baseNavStructure, ...projectPostPages];
        const pageKeys = allPages.map(p => p.key);
        const mainPages = baseNavStructure.filter(p => p.showInMenu !== false);
        const mainPageKeys = mainPages.map(p => p.key);

        return { allPages, pageKeys, mainPages, mainPageKeys };
    }, [t.projectsPage?.projects]);
    
    const [activeIndex, setActiveIndex] = useState(0);
    const pageContainerRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);
    const [isPdfFallbackOpen, setIsPdfFallbackOpen] = useState(false);
    const [fallbackPdfUrl, setFallbackPdfUrl] = useState<string | undefined>(undefined);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [pdfProgress, setPdfProgress] = useState(0);
    const [pdfStatus, setPdfStatus] = useState('');
    const [scrollPercent, setScrollPercent] = useState(0);
    const [isIdle, setIsIdle] = useState(false);
    const [isIntroPlaying, setIsIntroPlaying] = useState(false);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 1200;
        }
        return false;
    });
    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
    
    const clickSound = useRef<HTMLAudioElement | null>(null);

    const handleScroll = useCallback(() => {
        if (isMobile) {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                setScrollPercent((scrollTop / scrollHeight) * 100);
            } else {
                setScrollPercent(0);
            }
        } else {
            const container = pageContainerRef.current;
            if (container) {
                const scrollTop = container.scrollTop;
                const scrollHeight = container.scrollHeight - container.clientHeight;
                if (scrollHeight > 0) {
                    setScrollPercent((scrollTop / scrollHeight) * 100);
                } else {
                    setScrollPercent(0);
                }
            }
        }
    }, [isMobile]);

    useEffect(() => {
        setScrollPercent(0);

        if (isMobile) {
            window.addEventListener('scroll', handleScroll, { passive: true });
            return () => window.removeEventListener('scroll', handleScroll);
        } else {
            const container = pageContainerRef.current;
            if (container) {
                container.addEventListener('scroll', handleScroll, { passive: true });
                return () => container.removeEventListener('scroll', handleScroll);
            }
        }
    }, [isMobile, activeIndex, handleScroll]);
    
    // Parallax effect removed to prevent scroll lag and CPU usage on every render frame
    useEffect(() => {
        const background = backgroundRef.current;
        if (background) {
            background.style.transform = 'translateY(0px)';
        }
    }, [activeIndex]);

    const playClickSound = useCallback(() => {
        if (isSoundOn) {
            if (!clickSound.current) {
                clickSound.current = new Audio('https://rainbowit.net/themes/inbio/wp-content/themes/inbio/template-parts/audio/link-hover-and-click.wav');
                clickSound.current.volume = 0.3;
            }
            clickSound.current.currentTime = 0;
            clickSound.current.play().catch(() => {});
        }
        // Haptic feedback for a more tactile response on supported devices
        if (navigator.vibrate) {
            navigator.vibrate(10); // A short, subtle vibration
        }
    }, [isSoundOn]);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 767);
            if (width < 1200) {
                setIsSidebarCollapsed(true);
            } else {
                setIsSidebarCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Ensure the view starts at the top on initial load
    useEffect(() => {
        if (isMobile) {
            window.scrollTo(0, 0);
        } else {
            pageContainerRef.current?.scrollTo(0, 0);
        }
    }, [isMobile]);

    // Idle tracker
    useEffect(() => {
        let idleTimer: ReturnType<typeof setTimeout>;
        const resetIdle = () => {
            setIsIdle(false);
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => setIsIdle(true), 5000); // 5 seconds of inactivity
        };
        resetIdle();
        window.addEventListener('mousemove', resetIdle, { passive: true });
        window.addEventListener('keydown', resetIdle, { passive: true });
        window.addEventListener('touchstart', resetIdle, { passive: true });
        return () => {
            window.removeEventListener('mousemove', resetIdle);
            window.removeEventListener('keydown', resetIdle);
            window.removeEventListener('touchstart', resetIdle);
            clearTimeout(idleTimer);
        };
    }, []);
    
    const navigateTo = useCallback((key: string) => {
        const newIndex = pageKeys.findIndex(pKey => pKey === key);
        if (newIndex !== -1) {
            if (isMobile) {
                const element = document.getElementById(key);
                if (element) {
                    element.scrollIntoView({ behavior: 'auto' });
                    setActiveIndex(newIndex);
                } else {
                    window.scrollTo({ top: 0, behavior: 'auto' });
                    setActiveIndex(newIndex);
                }
            } else {
                if (newIndex !== activeIndex) {
                    pageContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
                    setActiveIndex(newIndex);
                } else {
                    pageContainerRef.current?.scrollTo({ top: 0, behavior: 'auto' });
                }
            }
        }
    }, [isMobile, pageKeys, activeIndex]);

    const handleSetPage = useCallback((key: string) => {
        if (key === 'print') {
            setIsPrintViewOpen(true);
            return;
        }
        navigateTo(key);
    }, [navigateTo]);

    useEffect(() => {
        const loader = document.getElementById('line-loader');
        if (loader) {
            const timer = setTimeout(() => {
                loader.classList.add('preloaded');
                setTimeout(() => loader.remove(), 1500); 
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const handleInteraction = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const interactiveSelector = 'a, button, [role="button"], .toggle-slider, .timeline-milestone, .color-dot, .wallpaper-thumbnail, .achievement-card';

            if (target.closest(interactiveSelector)) {
                playClickSound();
            }
        };

        document.addEventListener('mousedown', handleInteraction);
        return () => document.removeEventListener('mousedown', handleInteraction);
    }, [playClickSound]);
    
    const activePageKey = pageKeys[activeIndex];
    
    useEffect(() => {
        const currentKey = activePageKey;
        const prevKey = pageKeys.find(key => document.body.classList.contains(`on-page-${key}`));
        if (prevKey) {
            document.body.classList.remove(`on-page-${prevKey}`);
        }
        if (currentKey) {
            document.body.classList.add(`on-page-${currentKey}`);
        }

        if (isPrintViewOpen) {
            document.body.classList.add('popup-open');
        } else {
            document.body.classList.remove('popup-open');
        }

    }, [activeIndex, isPrintViewOpen, pageKeys, activePageKey]);
    
    const activePageItem = allPages[activeIndex] || allPages[0];
    const activePageTitle = t.sidebar.nav[activePageItem?.tKey as keyof typeof t.sidebar.nav] || activePageItem?.tKey || t.sidebar.nav.home;


    const handleSetPageAndCloseMenu = useCallback((key: string) => {
        handleSetPage(key);
        setIsMobileMenuOpen(false);
    }, [handleSetPage]);

    const sidebarProps = React.useMemo(() => {
        const navWithMobileItems = baseNavStructure.map(item => {
            if ((item.key === 'scheduler' || item.key === 'print') && isMobile) {
                return { ...item, showInMenu: true };
            }
            return item;
        });
        return {
            navStructure: navWithMobileItems,
            activeItemKey: pageKeys[activeIndex],
            setActiveItemKey: isMobile ? handleSetPageAndCloseMenu : handleSetPage,
        };
    }, [activeIndex, isMobile, handleSetPageAndCloseMenu, handleSetPage, pageKeys]);
    
    const ActivePageComponent = allPages[activeIndex]?.component;
    const componentProps = React.useMemo(() => {
        const props: any = {
            id: activePageKey,
            onNavigate: handleSetPage,
            onIntroToggle: setIsIntroPlaying,
        };
        if (activePageKey && activePageKey.startsWith('project-')) {
            props.projectId = activePageKey.replace('project-', '');
        }
        return props;
    }, [activePageKey, handleSetPage]);

    const currentMainPageIndex = mainPageKeys.indexOf(activePageKey);
    const isOnMainPage = currentMainPageIndex !== -1;
    const isLastMainPage = isOnMainPage && currentMainPageIndex === mainPageKeys.length - 1;
    const canGoPrev = isOnMainPage && currentMainPageIndex > 0;
    
    const handleNextPage = useCallback(() => {
        if (!isLastMainPage && isOnMainPage) {
            handleSetPage(mainPageKeys[currentMainPageIndex + 1]);
        }
    }, [isLastMainPage, isOnMainPage, mainPageKeys, currentMainPageIndex]);

    const handlePrevPage = useCallback(() => {
        if (canGoPrev) {
            handleSetPage(mainPageKeys[currentMainPageIndex - 1]);
        }
    }, [canGoPrev, mainPageKeys, currentMainPageIndex]);
    
    // Swipe up on mobile to go to next page
    useEffect(() => {
        if (!isMobile || !isOnMainPage) return;
        
        let touchStartY = 0;
        let atBottom = false;

        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
            const scrollableHeight = document.documentElement.scrollHeight;
            const scrolledHeight = window.innerHeight + window.scrollY;
            atBottom = scrolledHeight >= scrollableHeight - 20;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (!atBottom || isLastMainPage) return;
            const touchEndY = e.changedTouches[0].clientY;
            // Must swipe up at least 50px 
            if (touchStartY - touchEndY > 50) {
                handleNextPage();
            }
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isMobile, isOnMainPage, isLastMainPage, handleNextPage]);

    // Track scrolling on mobile to update active index
    useEffect(() => {
        if (!isMobile || !isOnMainPage) return;

        const observers = mainPageKeys.map((key) => {
            const element = document.getElementById(key);
            if (!element) return null;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        const newActiveIndex = pageKeys.indexOf(key);
                        if (newActiveIndex !== -1) {
                            setActiveIndex(prev => prev !== newActiveIndex ? newActiveIndex : prev);
                        }
                    }
                },
                { threshold: 0.3, rootMargin: '-80px 0px -20% 0px' }
            );
            observer.observe(element);
            return observer;
        });

        return () => {
            observers.forEach(obs => obs?.disconnect());
        };
    }, [isMobile, isOnMainPage, mainPageKeys, pageKeys]);

    const handleGoToTop = () => {
        handleSetPage(mainPageKeys[0]);
    };

    const handleDownloadPdf = async () => {
        setIsGeneratingPdf(true);
        setPdfProgress(0);
        setPdfStatus('Starting...');
        try {
            const result = await generatePdfFromElement(
                'printable-content', 
                `CV_Nguyen_Hung_Thai_VI.pdf`,
                (progress, status) => {
                    setPdfProgress(progress);
                    setPdfStatus(status);
                }
            );
            if (!result.success) {
                console.error("PDF generation failed:", result.error);
                setFallbackPdfUrl(result.blobUrl);
                setIsPdfFallbackOpen(true);
            } else {
                // If it succeeded but might have been blocked by browser download settings,
                // we still provide the fallback option if the blobUrl is available.
                setFallbackPdfUrl(result.blobUrl);
                // We don't necessarily open the modal if success was reported,
                // but if we want to be "robust" we could show it if it takes too long.
            }
        } catch (error) {
            console.error("Error in handleDownloadPdf:", error);
            setIsPdfFallbackOpen(true);
        } finally {
            setIsGeneratingPdf(false);
        }
    };

        const PageNavButtons = () => {
        return (
            <>
                {canGoPrev && (
                    <button onClick={handlePrevPage} className="header-icon-button page-nav-button relative flex items-center justify-center overflow-hidden" aria-label="Previous Page" title="Trang trước" style={{ width: '48px', height: '48px', border: '1px solid var(--card-border)', borderRadius: '50%', background: 'var(--card-bg)', backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur-webkit)' }}>
                        <Icons.ChevronUpIcon size={24} className="z-10" />
                    </button>
                )}
                {isOnMainPage && (
                    isLastMainPage ? (
                        <button onClick={handleGoToTop} className="header-icon-button page-nav-button relative flex items-center justify-center overflow-hidden" aria-label="Back to Top" title="Về đầu trang" style={{ width: '48px', height: '48px', border: '1px solid var(--card-border)', borderRadius: '50%', background: 'var(--card-bg)', backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur-webkit)' }}>
                            <Icons.ArrowUpIcon size={24} className="z-10" />
                        </button>
                    ) : (
                        <button onClick={handleNextPage} className="header-icon-button page-nav-button relative flex items-center justify-center overflow-hidden" aria-label="Next Page" title="Trang sau" style={{ width: '48px', height: '48px', border: '1px solid var(--card-border)', borderRadius: '50%', background: 'var(--card-bg)', backdropFilter: 'var(--glass-blur)', WebkitBackdropFilter: 'var(--glass-blur-webkit)' }}>
                            <Icons.ChevronDownIcon size={24} className="z-10" />
                        </button>
                    )
                )}
            </>
        );
    };

    const isVideo = wallpaper.startsWith('https') && wallpaper.toLowerCase().includes('.mp4');
    const isImage = wallpaper.startsWith('https') && !wallpaper.toLowerCase().includes('.mp4');
    const isCustomOrbiting = wallpaper === 'orbiting-planets';
    const isCustomDotted = wallpaper === 'dotted-pattern';
    const isCustomDarkDotted = wallpaper === 'dark-dotted-pattern';
    const isGeminiAi = wallpaper === 'gemini-ai';
    const isGlassmorphismEffect = wallpaper === 'glassmorphism-effect';
    const isSoftPastelGradient = wallpaper === 'soft-pastel-gradient';
    const isAppleGlass = wallpaper === 'apple-glass';
    const isGlassFluentHybrid = wallpaper === 'glass-fluent-hybrid';
    const isMaterialDesign3 = wallpaper === 'material-design-3';
    const isNeumorphism = wallpaper === 'neumorphism';
    return (
        <>
            <div ref={backgroundRef} className={`app-background fixed inset-0 z-[-1] ${isCustomOrbiting ? 'wallpaper-orbiting-planets' : ''} ${isCustomDotted ? 'wallpaper-dotted-pattern' : ''} ${isCustomDarkDotted ? 'wallpaper-dark-dotted-pattern' : ''} ${isGeminiAi ? 'wallpaper-gemini-ai' : ''} ${isGlassmorphismEffect ? 'wallpaper-glassmorphism' : ''} ${isSoftPastelGradient ? 'wallpaper-soft-pastel-gradient' : ''} ${isAppleGlass ? 'wallpaper-apple-glass' : ''} ${isGlassFluentHybrid ? 'wallpaper-glass-fluent-hybrid' : ''} ${isMaterialDesign3 ? 'wallpaper-material-design-3' : ''} ${isNeumorphism ? 'wallpaper-neumorphism' : ''}`}
                style={isImage ? { 
                    backgroundImage: `url(${wallpaper})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                } : {}}
            >
                {isVideo ? (
                    <video 
                        src={wallpaper}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : isImage ? (
                    null
                ) : isCustomOrbiting ? (
                    <div className="holder"></div>
                ) : isCustomDotted || isCustomDarkDotted ? (
                    null
                                ) : isGlassmorphismEffect ? (
                    <div className="glassmorphism-background">
                        <div className="glass-blob glass-blob-1"></div>
                        <div className="glass-blob glass-blob-2"></div>
                        <div className="glass-blob glass-blob-3"></div>
                        <div className="glass-blob glass-blob-4"></div>
                    </div>
                ) : isGlassFluentHybrid ? (
                    <div className="wallpaper-glass-fluent-hybrid h-full w-full relative">
                        <div className="fluent-blob fluent-blob-1"></div>
                        <div className="fluent-blob fluent-blob-2"></div>
                        <div className="fluent-blob fluent-blob-3"></div>
                        <div className="fluent-noise"></div>
                    </div>
                ) : isMaterialDesign3 ? (
                    <div className="wallpaper-material-design-3 h-full w-full relative">
                        <div className="m3-shape m3-shape-1"></div>
                        <div className="m3-shape m3-shape-2"></div>
                        <div className="m3-shape m3-shape-3"></div>
                    </div>
                ) : isNeumorphism ? (
                    <div className="wallpaper-neumorphism h-full w-full"></div>
                ) : isGeminiAi ? (
                    <div className="gemini-ai-background">
                        <div className="glow-blob blob-1"></div>
                        <div className="glow-blob blob-2"></div>
                        <div className="glow-blob blob-3"></div>
                        
                        <div className="gemini-content">
                            <h1>Trải nghiệm tương lai</h1>
                            <p>Giao diện được lấy cảm hứng từ AI</p>
                        </div>
                    </div>
                ) : (
                     <div 
                        className="background-gradient"
                        style={wallpaper !== 'gradient' ? { background: wallpaper } : {}}
                    ></div>
                )}
            </div>
            
            <div className={`site-wrapper`}>
                 {/* Left Sidebar (Desktop) */}
                {!isMobile && (
                    <Sidebar {...sidebarProps} isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
                )}
                
                                    
<main className={`content is-${isMobile && isOnMainPage ? 'mobile-all-pages' : activePageKey} ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    {/* Subtle Progressive Scroll Indicator */}
                    <div 
                        className="scroll-progress-container animate-fade-in"
                        style={{
                            position: isMobile ? 'fixed' : 'absolute',
                            top: isMobile ? 'var(--mobile-header-height)' : '0',
                            left: 0,
                            right: 0,
                            height: '3px',
                            zIndex: 101,
                            background: 'rgba(255, 255, 255, 0.02)',
                            pointerEvents: 'none',
                        }}
                    >
                        <div 
                            className="scroll-progress-fill"
                            style={{
                                width: `${scrollPercent}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, var(--primary, #8A5CF6), var(--accent-color, #FF63C9))',
                                transition: 'width 0.1s cubic-bezier(0.1, 0.8, 0.25, 1)',
                                boxShadow: '0 0 10px var(--accent-color, #FF63C9)',
                            }}
                        ></div>
                    </div>

                    <div className="page-container no-scrollbar" ref={pageContainerRef}>
                        <Suspense fallback={<LoadingFallback />}>
                            {isMobile && isOnMainPage ? (
                                mainPages.map((page, index) => {
                                    const PageComp = page.component;
                                    return (
                                        <React.Fragment key={page.key}>
                                            <PageComp id={page.key} onNavigate={handleSetPage} />
                                            {index < mainPages.length - 1 && (
                                                <div className="section-divider py-[5px] px-6 flex items-center justify-center">
                                                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent opacity-40"></div>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                ActivePageComponent && <ActivePageComponent key={activePageKey} {...componentProps} />
                            )}
                        </Suspense>
                    </div>
                </main>

                {/* Right Panel (Desktop) */}
                {!isMobile && (
                    <div className="right-panel">
                        <div className="right-panel-top-content">
                             <ClockWeatherWidget />
                            <div className="right-panel-middle-controls" style={{ marginBottom: "0px", marginRight: "0px", marginTop: "30px" }}>
                                {/* Printer Icon */}
                                <button 
                                    onClick={() => setIsPrintViewOpen(true)} 
                                    className="header-icon-button control-cv shadow-sm hover:shadow-md transition-all" 
                                    aria-label="View or download CV"
                                    title="Xem & In CV"
                                >
                                    <Icons.PrinterIcon size={22} />
                                </button>
                                
                                {/* Calendar Days Icon */}
                                <button 
                                    onClick={() => handleSetPage('scheduler')} 
                                    className={`header-icon-button control-scheduler shadow-sm hover:shadow-md transition-all ${pageKeys[activeIndex] === 'scheduler' ? 'active ring-2 ring-[var(--accent-color)]' : ''}`} 
                                    aria-label="Lên lịch hẹn"
                                    title="Lên Lịch Hẹn"
                                >
                                    <Icons.CalendarDaysIcon size={22} />
                                </button>

                                {/* AI Chat Icon */}
                                <button 
                                    onClick={() => handleSetPage('aiChat')} 
                                    className={`header-icon-button control-ai shadow-sm hover:shadow-md transition-all ${pageKeys[activeIndex] === 'aiChat' ? 'active ring-2 ring-[var(--accent-color)]' : ''}`} 
                                    aria-label="Chat AI"
                                    title="Trợ Lý AI"
                                >
                                    <Icons.BotIcon size={22} />
                                </button>

                                {/* Zalo Link */}
                                <a 
                                    href="https://zalo.me/0909097882" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="header-icon-button control-zalo"
                                    title="Trực Tiếp Zalo"
                                >
                                    <Icons.MessageCircleIcon size={24} />
                                </a>
                            </div>
                    </div>
                        <div className="right-panel-bottom-controls">
                            <PageNavButtons />
                        </div>
                    </div>
                )}
                
                {/* Mobile Navigation */}
                {isMobile && (
                    <>
                        <MobileHeader
                            title={activePageTitle}
                            onMenuClick={() => setIsMobileMenuOpen(true)}
                            onOpenAiChat={() => handleSetPage('aiChat')}
                            isIdle={isIdle}
                            activePageKey={pageKeys[activeIndex]}
                        />
                        <div 
                            className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <div onClick={e => e.stopPropagation()}>
                                <Sidebar {...sidebarProps} isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {isMobile && isOnMainPage && (
                <div className="mobile-page-nav">
                    <PageNavButtons />
                </div>
            )}

            {isPdfFallbackOpen && (
                <PdfFallbackModal 
                    isOpen={isPdfFallbackOpen} 
                    onClose={() => setIsPdfFallbackOpen(false)} 
                    pdfUrl={fallbackPdfUrl}
                />
            )}

            {isPrintViewOpen && document.getElementById('popup-root') && createPortal(
                <div className="print-preview-overlay">
                    <div className="print-preview-floating-controls">
                        <button 
                            onClick={handleDownloadPdf} 
                            className={`header-icon-button ${isGeneratingPdf ? 'animate-pulse opacity-70' : ''}`} 
                            title="Tải file PDF"
                            disabled={isGeneratingPdf}
                        >
                            {isGeneratingPdf ? <Icons.ArrowPathIcon className="animate-spin" /> : <Icons.DownloadIcon />}
                        </button>
                        <button onClick={() => setIsPrintViewOpen(false)} className="header-icon-button" title="Đóng">
                            <Icons.XMarkIcon />
                        </button>
                    </div>
                    {isGeneratingPdf && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
                            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 flex flex-col items-center text-center">
                                <div className="relative w-16 h-16 mb-6">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-[var(--border-color)] stroke-current"
                                            strokeWidth="3"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="text-[var(--accent-color)] stroke-current"
                                            strokeWidth="3"
                                            strokeDasharray={`${pdfProgress}, 100`}
                                            strokeLinecap="round"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            style={{ transition: 'stroke-dasharray 0.3s ease' }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-sm font-semibold text-[var(--text-primary)]">{pdfProgress}%</span>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">Đang tạo PDF</h3>
                                <p className="text-sm text-[var(--text-secondary)]">{pdfStatus}</p>
                            </div>
                        </div>
                    )}
                    <div className="print-preview-content">
                        <Suspense fallback={<LoadingFallback />}>
                            <PrintableView activePageKey={activePageKey} />
                        </Suspense>
                    </div>
                </div>,
                document.getElementById('popup-root')!
            )}

            <div className="floating-action-menu fixed right-0 top-1/2 -translate-y-1/2 z-[9999] flex flex-col gap-3">
                
                <button
                    onClick={() => handleSetPage('settings')}
                    className={`floating-action-btn settings-btn group ${pageKeys[activeIndex] === 'settings' ? 'active ring-2 ring-[var(--accent-color)]' : ''}`}
                    title="Cài đặt"
                    aria-label="Settings"
                >
                    <Icons.Settings2Icon size={22} />
                </button>
            </div>
        </>
    );
};

export default App;
