import React from 'react';
import { useI18n } from '../contexts/i18n';
import PageLayout from './PageLayout';
import * as Icons from './Icons';
import CardTitle from './CardTitle';
import MagneticButton from './MagneticButton';
import PersonalInfoCard from './PersonalInfoCard';

const AboutPage: React.FC<{ id?: string }> = ({ id }) => {
    const { t, language } = useI18n();
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
            <div className="info-card flex flex-col h-full !p-0" style={{ background: "transparent", boxShadow: "none", border: "none" }}>
                <div style={{ padding: "24px 24px 0 24px", display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <CardTitle
                        icon={<Icons.UserIcon />}
                        text={pageData.badge}
                        tooltipTitle={pageData.tooltipTitle}
                        tooltipText={pageData.tooltipText}
                        style={{ marginBottom: '0' }}
                    />
                </div>
                
            <style>
                {`
                .about-page-grid {
                    flex: 1;
                    min-height: 0;
                    display: flex;
                    flex-direction: row;
                    gap: 1rem;
                }
                .about-left-column {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    min-height: 0;
                    width: 70%;
                    flex: 7;
                    min-width: 0;
                }
                .about-bio-text-card {
                    flex: 1 1 0%;
                    min-height: 0;
                    overflow-y: auto;
                }
                .about-right-column {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    min-height: 0;
                    width: 30%;
                    flex: 3;
                    min-width: 0;
                    overflow-y: auto;
                }
                .personal-info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    width: 100%;
                }
                @media (max-width: 1200px) {
                    .personal-info-grid {
                        grid-template-columns: 1fr;
                    }
                }
                @media (max-width: 992px) {
                    .about-page-grid {
                        flex-direction: column;
                        overflow-y: auto;
                    }
                    .about-left-column {
                        width: 100%;
                        height: auto;
                        overflow-y: visible;
                        flex: none;
                    }
                    .about-bio-text-card {
                        flex: none;
                        height: auto;
                        overflow-y: visible;
                    }
                    .about-right-column {
                        width: 100%;
                        height: auto;
                        overflow-y: visible;
                        flex: none;
                    }
                    .about-page-content-wrapper {
                        overflow-y: auto !important;
                    }
                    .personal-info-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 576px) {
                    .personal-info-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                .personal-info-card-container {
                    perspective: 1000px;
                    cursor: pointer;
                    height: 68px;
                    background-color: transparent;
                    border: none;
                    box-shadow: none;
                    transition: transform 0.3s ease;
                    border-radius: 12px;
                    width: 100%;
                }
                .personal-info-card-container:hover {
                    transform: translateY(-4px);
                }
                .personal-info-card-inner {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.6s;
                    transform-style: preserve-3d;
                    border-radius: 12px;
                    display: flex;
                    justify-content: stretch;
                }
                .personal-info-card-container.is-flipped .personal-info-card-inner {
                    transform: rotateY(180deg);
                }
                .personal-info-card-front, .personal-info-card-back {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 100%;
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                    border-radius: 12px;
                    padding: 8px 12px;
                    box-sizing: border-box;
                    background-color: transparent;
                    backdrop-filter: var(--glass-blur);
                    -webkit-backdrop-filter: var(--glass-blur-webkit);
                    border: 1px solid var(--card-border);
                    box-shadow: var(--card-box-shadow);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .personal-info-card-back {
                    transform: rotateY(180deg);
                    justify-content: center;
                    background-color: var(--card-bg);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                }
                .personal-info-card-back .back-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    width: 100%;
                }
                .personal-info-card-back .visit-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--accent-color);
                    font-weight: 700;
                    font-size: 14px;
                    text-decoration: none;
                    padding: 6px 12px;
                    border-radius: 8px;
                    background: color-mix(in srgb, var(--accent-color), transparent 85%);
                    transition: all 0.2s ease;
                }
                .personal-info-card-back .visit-link:hover {
                    background: var(--accent-color);
                    color: white;
                }
                `}
            </style>

            <div className="about-page-content-wrapper no-scrollbar" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                    <div className="about-page-grid">
                        {/* Left Column: Bio Text Card (50%) */}
                        <div className="about-left-column">
                            <div className="about-bio-text-card no-scrollbar" style={{ padding: "0px" }}>
                                <h3 className="personal-info-title" style={{ marginBottom: '10px', paddingTop: '15px', paddingBottom: '10px', paddingLeft: '15px', paddingRight: '15px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Icons.SparklesIcon size={18} />
                                    {pageData.tooltipTitle}
                                </h3>
                                
                                {/* Video moved here */}
                                <div className="scena-banner-video-container" style={{ 
                                    width: 'calc(100% - 2rem)', 
                                    margin: '0 1rem 1rem 1rem',
                                    height: '50%',
                                    borderRadius: '10px', 
                                    overflow: 'hidden', 
                                    border: '1px solid var(--card-border)',
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
                                        onEnded={(e) => {
                                            if (isIntroPlaying) {
                                                setVideoUrl(DEFAULT_VIDEO);
                                                setIsMuted(true);
                                            } else {
                                                e.currentTarget.currentTime = 0;
                                                e.currentTarget.play().catch(() => {});
                                            }
                                        }}
                                    />
                                    <div className="glass-btn-container">
                                        <MagneticButton distance={150} strength={0.4}>
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
                                        </MagneticButton>
                                    </div>
                                </div>

                                <div className="about-bio-and-video-container m-0" style={{ gap: '1rem', padding: '1.25rem', fontSize: '13px' }}>
                                        {pageData.paragraphs.map((p: any, index: number) => (
                                            <p key={index} className="m-0 p-0" style={{ marginTop: '0px', marginBottom: '0px', fontSize: '13.792px' }} dangerouslySetInnerHTML={{ __html: p }} />
                                        ))}
                                    <div className="core-values m-0 p-0" role="complementary" style={{ marginTop: '0px', marginBottom: '0px', paddingBottom: '0px', paddingTop: '0px', paddingRight: '0px', paddingLeft: '0px', fontSize: '15.65px' }}>
                                        {pageData.coreValues}
                                    </div>
                                    <p className="m-0 p-0" style={{ marginTop: '0px', marginBottom: '0px', fontSize: '13.792px' }} dangerouslySetInnerHTML={{ __html: pageData.concludingParagraph }} />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Personal Info Card (50%) */}
                        <div className="about-right-column no-scrollbar">
                            {/* Personal Info Card */}
                            {pageData.infoItems && pageData.infoItems.length > 0 && (
                                <div className="info-card about-personal-info-card" style={{ 
                                    width: '100%', 
                                    padding: '1.25rem', 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    height: 'max-content', 
                                    boxSizing: 'border-box'
                                }}>
                                    <h3 className="personal-info-title" style={{ 
                                        marginBottom: '1.25rem', 
                                        paddingTop: '0px', 
                                        paddingBottom: '0px', 
                                        paddingLeft: '0px', 
                                        paddingRight: '0px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '0.5rem' 
                                    }}>
                                        <Icons.UserIcon size={18} style={{ color: 'var(--color-brand-text-primary)' }} />
                                        {pageData.personalInfoTitle}
                                    </h3>
                                    
                                    <div className="personal-info-grid" style={{
                                        boxSizing: 'border-box',
                                        width: '100%'
                                    }}>
                                        {['gender', 'birthday', 'status', 'ethnicity', 'residence', 'tempResidence', 'email', 'phoneZalo', 'website', 'linkedin'].map((key) => {
                                            const item = pageData.infoItems?.find((i: any) => i.key === key);
                                            if (!item) return null;
                                            
                                            const Icon = Icons[item.icon as keyof typeof Icons] || Icons.UserIcon;
                                            let displayValue: React.ReactNode = item.value;
                                            if (key === 'tempResidence') {
                                                displayValue = language === 'vi' ? 'Q7, Hồ Chí Minh' : 'District 7, Ho Chi Minh City';
                                            } else if (key === 'residence') {
                                                displayValue = language === 'vi' ? 'Mỹ Tho, Tiền Giang' : 'My Tho, Tien Giang';
                                            }
                                            
                                            let displayLabel = item.label;
                                            if (language === 'vi') {
                                                if (key === 'phoneZalo') displayLabel = 'Điện thoại / Zalo';
                                                if (key === 'email') displayLabel = 'Email';
                                                if (key === 'website') displayLabel = 'Website';
                                                if (key === 'linkedin') displayLabel = 'LinkedIn';
                                                if (key === 'gender') displayLabel = 'Giới tính';
                                                if (key === 'ethnicity') displayLabel = 'Dân tộc';
                                                if (key === 'status') displayLabel = 'Tình trạng';
                                                if (key === 'birthday') displayLabel = 'Ngày sinh';
                                                if (key === 'tempResidence') displayLabel = 'Tạm trú';
                                                if (key === 'residence') displayLabel = 'Cư trú';
                                            } else {
                                                if (key === 'phoneZalo') displayLabel = 'Phone / Zalo';
                                                if (key === 'email') displayLabel = 'Email';
                                                if (key === 'website') displayLabel = 'Website';
                                                if (key === 'linkedin') displayLabel = 'LinkedIn';
                                                if (key === 'gender') displayLabel = 'Gender';
                                                if (key === 'ethnicity') displayLabel = 'Ethnicity';
                                                if (key === 'status') displayLabel = 'Status';
                                                if (key === 'birthday') displayLabel = 'Date of birth';
                                                if (key === 'tempResidence') displayLabel = 'Temporary residence';
                                                if (key === 'residence') displayLabel = 'Residence';
                                            }

                                            let iconColor = 'var(--color-brand-text-secondary)';
                                            if (key === 'phoneZalo') iconColor = '#3b82f6';
                                            if (key === 'email') iconColor = '#f97316';
                                            if (key === 'website') iconColor = '#06b6d4';
                                            if (key === 'linkedin') iconColor = '#0ea5e9';
                                            if (key === 'gender') iconColor = '#8b5cf6';
                                            if (key === 'ethnicity') iconColor = '#f59e0b';
                                            if (key === 'status') iconColor = '#ef4444';
                                            if (key === 'birthday') iconColor = '#ec4899';
                                            if (key === 'tempResidence') iconColor = '#10b981';
                                            if (key === 'residence') iconColor = '#a855f7';

                                            return <PersonalInfoCard key={key} item={item} displayLabel={displayLabel} displayValue={displayValue} Icon={Icon} iconColor={iconColor} language={language} />;
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default AboutPage;
