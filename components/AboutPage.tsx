import React from 'react';
import { useI18n } from '../contexts/i18n';
import PageLayout from './PageLayout';
import * as Icons from './Icons';
import CardTitle from './CardTitle';
import VideoControlButtons from './VideoControlButtons';

const AboutPage: React.FC<{ id?: string }> = ({ id }) => {
    const { t } = useI18n();
    const pageData = t.aboutPage || {};

    const DEFAULT_VIDEO = "https://cdn.scena.ai/project/8606/e48a67884f3a52e8a68cf06b97979f3b22835ec92bf466a058c0d78da97c83b0.mp4";
    const INTRO_VIDEO = "https://cdn.scena.ai/project/9626/42eba857297b415c8be72327102671129b5ebbdbaab55ac9eb6897411b4bdeda.mp4";

    const [videoUrl, setVideoUrl] = React.useState(DEFAULT_VIDEO);
    const [isMuted, setIsMuted] = React.useState(true);

    const isIntroPlaying = videoUrl === INTRO_VIDEO;

    const handleToggleIntro = () => {
        if (isIntroPlaying) {
            setVideoUrl(DEFAULT_VIDEO);
            setIsMuted(true);
        } else {
            setVideoUrl(INTRO_VIDEO);
            setIsMuted(false);
        }
    };

    return (
        <PageLayout id={id}>
            <div className="info-card flex flex-col h-full" style={{ background: "transparent", boxShadow: "none", border: "none" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <CardTitle
                        icon={<Icons.UserIcon />}
                        text={pageData.badge}
                        tooltipTitle={pageData.tooltipTitle}
                        tooltipText={pageData.tooltipText}
                        style={{ marginBottom: '0' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                    </div>
                </div>
                <div className="about-page-content-wrapper no-scrollbar" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                    <div className="about-page-grid" style={{ flex: 1, minHeight: 0 }}>
                        {/* Left Column: Personal Info Card containing the Video (Swapped from Right) */}
                        <div className="about-left-column scena-banner-column" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
                            {/* Personal Info Card (Now containing the Video inside) */}
                            {pageData.infoItems && pageData.infoItems.length > 0 && (
                                <div className="about-personal-info-card" style={{ flex: 1, width: '100%', padding: '0px', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                                    <h3 className="personal-info-title" style={{ marginBottom: '10px', paddingTop: '15px', paddingBottom: '10px', paddingLeft: '15px', paddingRight: '15px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Icons.UserIcon size={18} style={{ color: 'var(--color-brand-text-primary)' }} />
                                        {pageData.personalInfoTitle}
                                    </h3>

                                    {/* HTML5 Video Player lồng trực tiếp vào đây */}
                                    <div className="scena-banner-video-container" style={{ 
                                        width: 'calc(100% - 2rem)', 
                                        margin: '0 1rem',
                                        aspectRatio: '16/9',
                                        borderRadius: '10px', 
                                        overflow: 'hidden', 
                                        border: 'var(--color-brand-glass-border)',
                                        boxShadow: 'var(--card-box-shadow)',
                                        position: 'relative',
                                        flexShrink: 0
                                    }}>
                                        <video 
                                            key={videoUrl}
                                            autoPlay 
                                            muted={isMuted} 
                                            loop={!isIntroPlaying} 
                                            playsInline 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'cover',
                                                borderRadius: '10px',
                                                display: 'block'
                                            }}
                                            src={videoUrl}
                                            onEnded={() => {
                                                if (isIntroPlaying) {
                                                    setVideoUrl(DEFAULT_VIDEO);
                                                    setIsMuted(true);
                                                }
                                            }}
                                        />
                                        {/* Introduction Overlay Button */}
                                        <style>{`
    .glass-btn-container {
        display: flex;
        align-items: center;
        gap: 12px;
        position: absolute;
        bottom: 12px;
        right: 12px;
        z-index: 20;
    }
    .premium-intro-btn.glass-btn {
        display: flex;
        align-items: center;
        height: 44px;
        border-radius: 25px;
        background: linear-gradient(135deg, var(--primary, #8A5CF6) 0%, var(--accent-color, #FF63C9) 100%);
        border: 1.5px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px rgba(var(--primary-rgb, 138, 92, 246), 0.25);
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        width: 190px;
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
        width: 44px;
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
        gap: 8px;
        padding: 0 15px;
        transition: background 0.2s ease;
    }
    .premium-main-toggle:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    .premium-btn-text {
        color: white;
        font-weight: 700;
        font-size: 0.95rem;
        letter-spacing: 0.5px;
    }
    .premium-btn-icon {
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`}</style>
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
                                                        <Icons.SpeakerOffIcon size={18} style={{ color: 'white' }} />
                                                    ) : (
                                                        <Icons.SpeakerWaveIcon size={18} style={{ color: 'white' }} className="animate-pulse" />
                                                    )}
                                                </div>
                                                <div 
                                                    className="premium-main-toggle"
                                                    onClick={handleToggleIntro}
                                                    title={isIntroPlaying ? 'Hủy bỏ' : 'Xem Giới thiệu'}
                                                >
                                                    <span className="premium-btn-text">
                                                        {isIntroPlaying ? 'Hủy bỏ' : 'Giới thiệu'}
                                                    </span>
                                                    <div className="premium-btn-icon">
                                                        {isIntroPlaying ? <Icons.XMarkIcon size={18} /> : <Icons.PlayIcon size={18} />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="personal-info-grid no-scrollbar" style={{
                                        flex: 1,
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        alignContent: 'center',
                                        gap: '1rem',
                                        overflowY: 'auto',
                                        width: 'auto',
                                        marginLeft: '15px',
                                        marginRight: '15px',
                                        marginBottom: '15px',
                                        marginTop: '15px',
                                        paddingLeft: '15px',
                                        paddingRight: '15px',
                                        paddingBottom: '15px',
                                        paddingTop: '15px',
                                    }}>
                                        {pageData.infoItems.map((item, idx) => {
                                            const Icon = Icons[item.icon as keyof typeof Icons] || Icons.UserIcon;
                                            
                                            // Zodiac icons mapping
                                            const zodiacIcons: Record<string, string> = {
                                                "Tý": "https://api.iconify.design/noto:rat.svg",
                                                "Sửu": "https://api.iconify.design/noto:ox.svg",
                                                "Dần": "https://api.iconify.design/noto:tiger.svg",
                                                "Mão": "https://api.iconify.design/noto:rabbit.svg",
                                                "Thìn": "https://api.iconify.design/noto:dragon.svg",
                                                "Tỵ": "https://api.iconify.design/noto:snake.svg",
                                                "Ngọ": "https://api.iconify.design/noto:horse.svg",
                                                "Mùi": "https://api.iconify.design/noto:goat.svg",
                                                "Thân": "https://api.iconify.design/noto:monkey.svg",
                                                "Dậu": "https://api.iconify.design/noto:rooster.svg",
                                                "Tuất": "https://api.iconify.design/noto:dog.svg",
                                                "Hợi": "https://api.iconify.design/noto:pig.svg"
                                            };

                                            const isZodiac = item.key === 'zodiac';
                                            let zodiacIconUrl = "";
                                            if (isZodiac) {
                                                const zodiacName = item.value.split(' ')[0]; // Get "Tý", "Thân", etc.
                                                zodiacIconUrl = zodiacIcons[zodiacName] || zodiacIcons["Tý"];
                                            }

                                            return (
                                                <div key={item.key} className="personal-info-item" style={{ 
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    padding: '0.5rem'
                                                }}>
                                                    <div style={{
                                                        width: '42px',
                                                        height: '42px',
                                                        borderRadius: '10px',
                                                        background: isZodiac ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                                                        border: isZodiac ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(255, 255, 255, 0.12)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0
                                                    }}>
                                                        {isZodiac ? (
                                                            <img src={zodiacIconUrl} alt={item.value} style={{ width: '28px', height: '28px' }} />
                                                        ) : (
                                                            <Icon className="info-item-icon" style={{ width: '18px', height: '18px', color: 'var(--color-brand-text-primary)' }} />
                                                        )}
                                                    </div>
                                                    <div className="info-item-text">
                                                        <span className="info-item-label" style={{ fontSize: '0.72rem', opacity: 1, fontWeight: 700 }}>{item.label}</span>
                                                        <span className="info-item-value" style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', color: isZodiac ? 'var(--accent-color)' : 'inherit' }}>
                                                            {item.link ? (
                                                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                                    {item.key === 'website' ? 'Liên kết' : item.value}
                                                                </a>
                                                            ) : (
                                                                item.value
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Bio Text Card (Swapped from Left) */}
                        <div className="about-right-column" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, marginTop: '0px', marginLeft: '0px', paddingLeft: '0px', marginRight: '0px', marginBottom: '70px' }}>
                            {/* Bio Text Card */}
                            <div className="about-bio-text-card no-scrollbar" style={{ flex: '1 1 0%', minHeight: 0, overflowY: 'auto', padding: '0px' }}>
                                <h3 className="personal-info-title" style={{ marginBottom: '10px', paddingTop: '15px', paddingBottom: '10px', paddingLeft: '15px', paddingRight: '15px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Icons.SparklesIcon size={18} />
                                    {pageData.tooltipTitle}
                                </h3>
                                <div className="about-bio-and-video-container m-0" style={{ gap: '1rem', padding: '1.25rem', fontSize: '13px' }}>
                                    {pageData.paragraphs.map((p, index) => (
                                        <p key={index} className="m-0 p-0" style={{ marginTop: '0px', marginBottom: '0px' }} dangerouslySetInnerHTML={{ __html: p }} />
                                    ))}
                                    <div className="core-values m-0 p-0" role="complementary" style={{ marginTop: '0px', marginBottom: '0px', paddingBottom: '0px', paddingTop: '0px', paddingRight: '0px', paddingLeft: '0px' }}>
                                        {pageData.coreValues}
                                    </div>
                                    <p className="m-0 p-0" style={{ marginTop: '0px', marginBottom: '0px' }} dangerouslySetInnerHTML={{ __html: pageData.concludingParagraph }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default AboutPage;