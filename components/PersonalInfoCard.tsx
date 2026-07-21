import React from 'react';
import * as Icons from './Icons';

export interface PersonalInfoItem {
    key: string;
    label: string;
    value: string;
    icon: string;
    link?: string;
}

const PersonalInfoCard: React.FC<{ 
    item: PersonalInfoItem, 
    displayLabel: string, 
    displayValue: React.ReactNode, 
    Icon: any, 
    iconColor: string,
    language: string
}> = ({ item, displayLabel, displayValue, Icon, iconColor, language }) => {
    const [isFlipped, setIsFlipped] = React.useState(false);
    const hasLink = !!item.link;

    // CTA texts for flipped cards (when hasLink is true)
    let ctaText = '';
    if (hasLink) {
        if (item.key === 'website') {
            ctaText = language === 'vi' ? 'Vào Website' : 'Visit Website';
        } else if (item.key === 'linkedin') {
            ctaText = language === 'vi' ? 'Kết nối LinkedIn' : 'Connect LinkedIn';
        } else if (item.key === 'email') {
            ctaText = language === 'vi' ? 'Gửi Email' : 'Send Email';
        } else if (item.key === 'phoneZalo') {
            ctaText = language === 'vi' ? 'Liên hệ Phone / Zalo' : 'Zalo / Phone';
        } else {
            ctaText = language === 'vi' ? 'Xem liên kết' : 'View Link';
        }
    }

    return (
        <div 
            className={`personal-info-card-container ${isFlipped && hasLink ? 'is-flipped' : ''}`}
            onMouseEnter={() => hasLink && setIsFlipped(true)}
            onMouseLeave={() => hasLink && setIsFlipped(false)}
            onClick={() => {
                if (hasLink) {
                    window.open(item.link, '_blank');
                }
            }}
            style={{ cursor: hasLink ? 'pointer' : 'default' }}
        >
            <div className="personal-info-card-inner">
                {/* Front Side */}
                <div className="personal-info-card-front">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', width: '100%' }}>
                        <Icon size={32} style={{ color: iconColor, flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', minWidth: 0, flex: 1 }}>
                            <div 
                                style={{ 
                                    color: iconColor, 
                                    fontWeight: 700, 
                                    fontSize: '0.75rem', 
                                    lineHeight: '1.2', 
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                {displayLabel}
                            </div>
                            <div 
                                style={{ 
                                    color: 'var(--color-brand-text-primary)',
                                    fontWeight: 800, 
                                    fontSize: '0.95rem', 
                                    lineHeight: '1.3',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                {hasLink ? ctaText : displayValue}
                                {hasLink && <Icons.ExternalLinkIcon size={12} style={{ opacity: 0.6, flexShrink: 0 }} />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Side */}
                <div className="personal-info-card-back" style={{ padding: '8px 12px' }}>
                    {hasLink ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', width: '100%' }}>
                            <Icon size={32} style={{ color: iconColor, flexShrink: 0 }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', minWidth: 0, flex: 1 }}>
                                <div 
                                    style={{ 
                                        color: iconColor, 
                                        fontWeight: 700, 
                                        fontSize: '0.75rem', 
                                        lineHeight: '1.2', 
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}
                                >
                                    {displayLabel}
                                </div>
                                <div 
                                    style={{ 
                                        color: 'var(--color-brand-text-primary)',
                                        fontWeight: 800, 
                                        fontSize: '0.88rem', 
                                        lineHeight: '1.3',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                    title={typeof displayValue === 'string' ? displayValue : undefined}
                                >
                                    {displayValue}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoCard;
