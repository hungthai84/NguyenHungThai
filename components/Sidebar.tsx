import React from 'react';
import { useI18n } from '../contexts/i18n';
import * as Icons from './Icons';
import { useTheme } from '../contexts/ThemeContext';

interface NavItem {
    key: string;
    tKey: string;
    icon: keyof typeof Icons;
    component: React.FC<any>;
    showInMenu?: boolean;
}

interface SidebarProps {
    navStructure: NavItem[];
    activeItemKey: string;
    setActiveItemKey: (key: string) => void;
    isMobile?: boolean;
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const itemColors: Record<string, string> = {
    home: '#22c55e',
    coverLetter: '#06b6d4',
    about: '#f59e0b',
    experience: '#ef4444',
    education: '#8b5cf6',
    services: '#14b8a6',
    skills: '#f97316',
    projects: '#ec4899',
    systems: '#06b6d4',
    interview: '#3b82f6',
    horoscope: '#d946ef',
    memories: '#f43f5e',
    achievements: '#eab308',
    blog: '#a855f7',
    scheduler: '#10b981',
    aiChat: '#6366f1',
    settings: '#64748b',
    print: '#0284c7'
};

const getTooltipData = (key: string, t: any) => {
    switch (key) {
        case 'home':
            return { title: t.hero?.tooltipTitle, text: t.hero?.tooltipText };
        case 'coverLetter':
            return { title: t.coverLetterPage?.tooltipTitle, text: t.coverLetterPage?.tooltipText };
        case 'about':
            return { title: t.aboutPage?.tooltipTitle, text: t.aboutPage?.tooltipText };
        case 'experience':
            return { title: t.workExperiencePage?.tooltipTitle, text: t.workExperiencePage?.tooltipText };
        case 'skills':
            return { title: t.skillsPage?.tooltipTitle || t.sidebar.nav.skills, text: t.skillsPage?.tooltipText || '' };
        case 'education':
            return { title: t.educationPage?.tooltipTitle || t.sidebar.nav.education, text: t.educationPage?.tooltipText || '' };
        case 'services':
            return { title: t.servicesPage?.tooltipTitle || t.sidebar.nav.services, text: t.servicesPage?.tooltipText || '' };
        case 'projects':
            return { title: t.projectsPage?.tooltipTitle || t.sidebar.nav.projects, text: t.projectsPage?.tooltipText || '' };
        case 'systems':
            return { title: t.systemsPage?.tooltipTitle || t.sidebar.nav.systems, text: t.systemsPage?.tooltipText || '' };
        case 'interview':
            return { title: t.interviewPage?.tooltipTitle || t.sidebar.nav.interview, text: t.interviewPage?.tooltipText || '' };
        case 'horoscope':
            return { title: t.horoscopePage?.tooltipTitle || t.sidebar.nav.horoscope, text: t.horoscopePage?.tooltipText || '' };
        case 'memories':
            return { title: t.memoriesPage?.tooltipTitle || t.sidebar.nav.memories, text: t.memoriesPage?.tooltipText || '' };
        default:
            return null;
    }
};

const Sidebar: React.FC<SidebarProps> = ({ 
    navStructure,
    activeItemKey, 
    setActiveItemKey,
    isCollapsed,
    toggleSidebar
}) => {
    const { t } = useI18n();
    const { themePreset } = useTheme();
    const navLabels = t.sidebar.nav;
    const [hoveredKey, setHoveredKey] = React.useState<string | null>(null);

    const handleNavClick = (pageKey: string) => {
        setActiveItemKey(pageKey);
    };

    return (
        <aside 
            className={`left-sidebar no-scrollbar ${isCollapsed ? '' : 'is-expanded'}`}
            style={{ zIndex: 99999 }}
        >
            <button className="sidebar-toggle-btn" onClick={toggleSidebar} aria-label="Toggle Sidebar">
                {isCollapsed ? <Icons.ChevronRightIcon size={16} /> : <Icons.ChevronLeftIcon size={16} />}
            </button>
            <nav className="main-menu" style={{ overflow: "visible", display: "flex", flexDirection: "column", flex: 1, height: "100%" }}>
                <ul className="flex flex-col justify-between h-full py-8 w-full" style={{ margin: 0 }}>
                    {navStructure
                        .filter(item => item.showInMenu !== false)
                        .map((item) => {
                            const Icon = Icons[item.icon] || Icons.FolderIcon;
                            const label = navLabels[item.tKey as keyof typeof navLabels] || item.tKey;
                            
                            // Determine if the current item is the 'projects' page and if a project post is active
                            const isProjectsParent = item.key === 'projects';
                            const isProjectPostActive = activeItemKey.startsWith('project-');
                            const isActive = activeItemKey === item.key || (isProjectsParent && isProjectPostActive);
                            
                            const itemColor = 'var(--primary)';
                            const isHovered = hoveredKey === item.key;
                            const tooltipData = getTooltipData(item.key, t);
                            
                            return (
                                <li 
                                    key={item.key} 
                                    className="relative group flex items-center justify-center w-full"
                                >
                                    <a
                                        href={`#${item.key}`}
                                        className={isActive ? 'active' : ''}
                                        data-key={item.key}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavClick(item.key);
                                        }}
                                        onMouseEnter={() => setHoveredKey(item.key)}
                                        onMouseLeave={() => setHoveredKey(null)}
                                        aria-label={label}
                                        style={{
                                            color: isActive ? 'var(--primary)' : isHovered ? 'var(--text)' : 'var(--text-secondary)',
                                            backgroundColor: isActive ? 'rgba(255, 255, 255, 0.18)' : isHovered ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                                            border: isActive ? '1px solid rgba(255, 255, 255, 0.25)' : isHovered ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid transparent',
                                            boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.05)' : 'none',
                                            transform: isHovered ? 'translateY(-1px)' : 'none',
                                            borderRadius: '14px',
                                            padding: isCollapsed ? '0' : '0 12px',
                                            margin: '0.12rem auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: isCollapsed ? 'center' : 'flex-start',
                                            gap: isCollapsed ? '0' : '10px',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            width: isCollapsed ? '44px' : 'calc(100% - 24px)',
                                            height: isCollapsed ? '44px' : '42px',
                                            alignSelf: 'center',
                                            backdropFilter: 'none',
                                            WebkitBackdropFilter: 'none',
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Icon 
                                            aria-hidden="true" 
                                            size={isCollapsed ? 16 : 14}
                                            style={{
                                                color: isActive ? 'var(--primary)' : isHovered ? 'var(--text)' : 'var(--text-secondary)',
                                                transition: 'all 0.25s ease',
                                                flexShrink: 0
                                            }} 
                                        />
                                        {!isCollapsed && (
                                            <span 
                                                style={{
                                                    color: isActive ? 'var(--primary)' : isHovered ? 'var(--text)' : 'var(--text-secondary)',
                                                    transition: 'color 0.25s ease',
                                                    fontWeight: 'bold',
                                                    fontSize: '15px',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {label}
                                            </span>
                                        )}
                                    </a>

                                    {tooltipData && isCollapsed && (
                                        <div 
                                            className="sidebar-tooltip"
                                            style={{
                                                position: 'absolute',
                                                left: '65px',
                                                top: '50%',
                                                transform: hoveredKey === item.key 
                                                    ? 'translateY(-50%) translateX(5px)' 
                                                    : 'translateY(-50%) translateX(-5px)',
                                                opacity: hoveredKey === item.key ? 1 : 0,
                                                visibility: hoveredKey === item.key ? 'visible' : 'hidden',
                                                pointerEvents: 'none',
                                                transition: 'opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease',
                                                zIndex: 999999,
                                                background: 'var(--sidebar-bg)',
                                                border: 'var(--color-brand-glass-border)',
                                                borderRadius: '15px',
                                                padding: '1rem',
                                                boxShadow: 'var(--card-box-shadow)',
                                                width: '280px',
                                                backdropFilter: 'none',
                                                WebkitBackdropFilter: 'none',
                                            }}
                                        >
                                            <div className="tooltip-inner" style={{ position: 'relative' }}>
                                                <div className="tooltip-header" style={{
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    marginBottom: '0.75rem'
                                                }}>
                                                    <div className="tooltip-icon-wrapper" style={{
                                                        width: '2.25rem',
                                                        height: '2.25rem',
                                                        borderRadius: '50%',
                                                        backgroundColor: 'var(--sidebar-bg)',
                                                        border: `1px solid ${itemColor}`,
                                                        color: itemColor,
                                                        alignItems: 'center',
                                                        flexShrink: 0
                                                    }}>
                                                        <Icon size={18} />
                                                    </div>
                                                    <h3 style={{
                                                        margin: 0,
                                                        fontSize: '0.9375rem',
                                                        fontWeight: 'bold',
                                                        color: 'var(--color-brand-text-primary)'
                                                    }}>{tooltipData.title}</h3>
                                                </div>
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: '0.8rem',
                                                    lineHeight: '1.4',
                                                    color: 'var(--color-brand-text-secondary)',
                                                    textAlign: 'left',
                                                    whiteSpace: 'normal',
                                                    overflow: 'visible',
                                                }}>{tooltipData.text}</p>
                                                <div className="sidebar-tooltip-arrow" style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    right: '100%',
                                                    transform: 'translateY(-50%)',
                                                    borderWidth: '6px',
                                                    borderStyle: 'solid',
                                                    borderColor: 'transparent var(--sidebar-bg) transparent transparent',
                                                    marginLeft: '-12px'
                                                }}></div>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;