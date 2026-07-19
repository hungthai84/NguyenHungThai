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
}

interface EducationPageProps {
    id?: string;
}

// --- Sub-components ---
const EducationCard: React.FC<{ item: EducationItem, index: number, yearPrefix: string }> = ({ item, index, yearPrefix }) => {
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

    return (
        <div 
            ref={cardRef} 
            className="education-box fade-in-up-on-scroll h-[160px]" 
            style={{ 
                '--item-color': itemColor, 
                transitionDelay: `${index * 50}ms` 
            } as React.CSSProperties}
        >
            <div className="education-card-glow" style={{ background: `radial-gradient(circle at 50% 50%, ${itemColor}25, transparent 70%)` }} />
            <div className="education-card-content">
                <div className="education-title-wrapper">
                    <Icon style={{ color: itemColor }} />
                    <h4 
                        style={{ 
                            color: itemColor, 
                            width: '120px', 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'normal',
                            lineHeight: '1.2',
                            margin: 0
                        }} 
                        title={item.title}
                    >
                        {item.title}
                    </h4>
                    <span style={{ 
                        marginLeft: 'auto', 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        color: itemColor, 
                        background: `${itemColor}15`, 
                        padding: '2px 8px', 
                        borderRadius: '999px',
                        width: '60.0179px',
                        textAlign: 'center',
                        display: 'inline-block'
                    }}>
                        {yearPrefix ? `${yearPrefix} ` : ''}{item.year}
                    </span>
                </div>
                <div style={{ marginBottom: '8px' }}>
                    <p style={{ fontWeight: 700, color: 'var(--color-brand-text-primary)', margin: 0, fontSize: '0.9rem' }}>
                        {item.institution}
                    </p>
                </div>
                <p className="education-description" style={{ fontSize: '0.85rem', opacity: 0.8 }}>{item.description}</p>
            </div>
            <div className="education-card-indicator" style={{ backgroundColor: itemColor }} />
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
                <div className="education-grid no-scrollbar" style={{ width: 'auto' }}>
                    {items.length > 0 ? (
                        items.map((item, index) => (
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