
import React, { useEffect, useRef } from 'react';
import { useI18n } from '../contexts/i18n';
import PageLayout from './PageLayout';
import * as Icons from './Icons';
import CardTitle from './CardTitle';

// --- Type definitions ---
interface Service {
    key: string;
    title: string;
    description: string;
    icon: keyof typeof Icons;
    color: string;
    logos: string[]; // URLs of logos
}

interface ServicesPageProps {
    id?: string;
}

// --- Sub-components ---
const ServiceCard: React.FC<{ service: Service, index: number }> = ({ service, index }) => {
    const Icon = Icons[service.icon] || Icons.FolderIcon;
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
    
    const isConsulting = service.key === 'consulting';
    const displayColor = isConsulting ? '#22c55e' : service.color;

    return (
        <div 
            ref={cardRef} 
            className="service-box fade-in-up-on-scroll h-[250px]" 
            style={{ 
                '--item-color': displayColor, 
                transitionDelay: `${index * 50}ms` 
            } as React.CSSProperties}
        >
            <div className="service-card-glow" style={{ background: `radial-gradient(circle at 50% 50%, ${displayColor}25, transparent 70%)` }} />
            <div className="service-card-content" style={{ textAlign: 'left' }}>
                <div className="service-title-wrapper" style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Icon style={{ color: displayColor, marginRight: '-5px' }} />
                    <h4 style={{ color: displayColor, margin: 0, fontSize: '20px', fontWeight: 'bold', marginLeft: '10px' }}>{service.title}</h4>
                </div>
                <p className="service-description" style={{ textAlign: 'left' }}>{service.description}</p>
            </div>
            {service.logos && service.logos.length > 0 && (
                <div className="service-logos-container">
                    {service.logos.map((logoUrl, logoIndex) => logoUrl ? (
                        <img key={logoIndex} src={logoUrl} alt={`Logo ${logoIndex + 1}`} className="service-logo-item-new" />
                    ) : null)}
                </div>
            )}
            <div className="service-card-indicator" style={{ backgroundColor: displayColor }} />
        </div>
    );
};

// --- Main Page Component ---
const ServicesPage: React.FC<ServicesPageProps> = ({ id }) => {
    const { t } = useI18n();
    const pageData = t.servicesPage || { badge: 'Dịch vụ', services: [] };
    const services: Service[] = (pageData.services as Service[]) || [];

    return (
        <PageLayout id={id}>
            <div className="info-card is-services flex flex-col h-full" >
                <div className="about-header">
                     <CardTitle
                        icon={<Icons.LayersIcon />}
                        text={pageData.badge}
                        tooltipTitle={pageData.tooltipTitle}
                        tooltipText={pageData.tooltipText}
                    />
                </div>

                <div className="services-grid no-scrollbar" style={{ background: "transparent" }}>
                     {services.length > 0 ? (
                        services.map((service, index) => (
                           <ServiceCard key={service.key} service={service} index={index} />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-brand-text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gridColumn: '1 / -1' }}>
                            <Icons.LayersIcon size={48} style={{ marginBottom: '1rem', opacity: 0.5 }}/>
                            <p>Dữ liệu về lĩnh vực chuyên môn đang được cập nhật. <br/>Vui lòng quay lại sau.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default ServicesPage;
