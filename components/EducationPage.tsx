import React, { useEffect, useRef } from 'react';
import { useI18n } from '../contexts/i18n';
import PageLayout from './PageLayout';
import * as Icons from './Icons';
import CardTitle from './CardTitle';

// --- Type definitions ---
interface EducationItem {
    year: string;
    title: string;
    institution: string;
    description: string;
    icon: keyof typeof Icons;
    color?: string;
    location?: string;
}

interface EducationPageProps {
    id?: string;
}

// --- Sub-components ---
const EducationCard: React.FC<{ item: EducationItem, index: number, yearPrefix: string }> = ({ item, index, yearPrefix }) => {
    const { language } = useI18n();
    const Icon = Icons[item.icon] || Icons.AcademicCapIcon;
    const cardRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const element = cardRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    element.classList.add('is-visible');
                    observer.unobserve(element);
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(element);
        return () => {
            if (element) {
                observer.disconnect();
            }
        };
    }, []);

    const itemColor = item.color || 'var(--accent-color)';

    // Define label and value for location and study at based on language
    const studyAtLabel = language === 'vi' ? 'Học tại:' : 'Study at:';

    return (
        <div 
            ref={cardRef} 
            className="education-box fade-in-up-on-scroll relative flex flex-col justify-between overflow-hidden" 
            style={{ 
                '--item-color': itemColor, 
                transitionDelay: `${index * 50}ms`,
                height: 'auto',
                width: 'auto',
                border: 'none'
            } as React.CSSProperties}
        >
            <div className="education-card-glow absolute inset-0 pointer-events-none opacity-50" style={{ background: `radial-gradient(120% 120% at 50% -20%, ${itemColor}15, transparent 70%)` }} />
            
            {/* Left accent indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-1 opacity-80" style={{ backgroundColor: itemColor }} />

            <div className="education-card-content flex flex-col h-full relative z-10 p-[5px]">
                <div className="education-title-wrapper" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', minWidth: 0, flex: 1 }}>
                        <div className="mt-1 flex-shrink-0 bg-white/5 p-2 rounded-lg" style={{ color: itemColor, border: 'none' }}>
                            <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                        </div>
                        <h4 style={{ 
                            color: itemColor, 
                            fontSize: '18px', 
                            fontWeight: '700', 
                            margin: 0, 
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }} title={item.title}>{item.title}</h4>
                    </div>
                    <span style={{ 
                        flexShrink: 0,
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: itemColor, 
                        background: `${itemColor}15`, 
                        border: `1px solid ${itemColor}30`,
                        padding: '4px 10px', 
                        borderRadius: '20px',
                        textAlign: 'center',
                        display: 'inline-block'
                    }}>
                        {yearPrefix ? `${yearPrefix} ` : ''}{item.year}
                    </span>
                </div>
                <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <div className="mt-0.5 opacity-70" style={{ color: 'var(--color-brand-text-primary)', flexShrink: 0 }}>
                            <Icons.AcademicCapIcon size={16} />
                        </div>
                        <p style={{ fontWeight: 600, color: 'var(--color-brand-text-primary)', margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>
                            <span style={{ opacity: 0.7, fontWeight: "bold", marginRight: '6px' }}>{studyAtLabel}</span>
                            <span>{item.institution}</span>
                        </p>
                    </div>
                </div>
                <div className="mt-auto pt-2">
                    <p className="education-description" style={{ fontSize: '14px', opacity: 0.75, margin: 0, lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{item.description}</p>
                </div>
            </div>
        </div>
    );
};


// --- Main Page Component ---
const EducationPage: React.FC<EducationPageProps> = ({ id }) => {
    const { t } = useI18n();
    const pageData = t.educationPage || { title: '', items: [] };
    const items: EducationItem[] = (pageData.items as EducationItem[]) || [];
    const yearPrefix = pageData.yearPrefix || 'Năm';

    return (
        <PageLayout id={id}>
            <div className="info-card is-education flex flex-col h-full" >
                <CardTitle
                    icon={<Icons.AcademicCapIcon />}
                    text={pageData.title}
                    tooltipTitle={pageData.tooltipTitle}
                    tooltipText={pageData.tooltipText}
                    style={{ marginBottom: '1.5rem' }}
                />
                <div className="education-grid no-scrollbar flex-1 min-h-0" style={{ width: "auto", margin: "15px", display: "grid", gridTemplateColumns: "repeat(2, minmax(400px, 1fr))", gridAutoRows: "min-content", gap: "1.5rem", overflowY: "auto", overflowX: "auto", alignContent: "start" }}>
                    {items.length > 0 ? (
                        items.slice(0, 8).map((item, index) => (
                           <EducationCard key={index} item={item} index={index} yearPrefix={yearPrefix} />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-brand-text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gridColumn: '1 / -1' }}>
                            <Icons.AcademicCapIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }}/>
                            <p>Dữ liệu về học vấn đang được cập nhật. <br/>Vui lòng quay lại sau.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default EducationPage;