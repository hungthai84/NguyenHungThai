import React, { useState, useRef, useCallback } from 'react';
import * as Icons from './Icons';
import CardTitle from './CardTitle';
import { useI18n } from '../contexts/i18n';

interface VideoInterviewCardProps {
    pageData: any;
}

const VIDEO_1_URL = "https://cdn.scena.ai/project/9741/f7053626ae15c847304143dc6cf41f1fd2cf1611b27c30ff75ac9da6e47d005b.mp4";
const VIDEO_2_URL = "https://cdn.scena.ai/project/9741/021c21b2f677c4341e06c62c9432d06d251e22c83716e55b927633e254a67730.mp4";

const VideoInterviewCard: React.FC<VideoInterviewCardProps> = ({ pageData }) => {
    const { t } = useI18n();
    const videoRef = useRef<HTMLVideoElement>(null);
    
    const [isMuted, setIsMuted] = useState(true);
    const [activeVideo, setActiveVideo] = useState<'video1' | 'video2'>('video1');

    const handlePlayPause = useCallback(async () => {
        const video = videoRef.current;
        if (!video) return;
        
        try {
            if (video.paused) {
                await video.play();
                
            } else {
                video.pause();
                
            }
        } catch (error) {
            console.error("Video play/pause error:", error);
        }
    }, []);

    const handleToggleMute = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    }, [isMuted]);

    const handleSwitchVideo = useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const nextVideo = activeVideo === 'video1' ? 'video2' : 'video1';
        setActiveVideo(nextVideo);
        
        const nextMuted = nextVideo === 'video1';
        setIsMuted(nextMuted);
        
        
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            videoRef.current.muted = nextMuted;
            setTimeout(() => {
                videoRef.current?.play().catch(() => {});
            }, 100);
        }
    }, [activeVideo]);

    const handleVideoEnded = () => {
        if (activeVideo === 'video2') {
            handleSwitchVideo();
        }
    };

    return (
        <div className="info-card flex flex-col h-full">
            <CardTitle
                icon={<Icons.PresentationIcon />}
                text={pageData?.badge || "Phỏng vấn"}
                tooltipTitle={pageData?.tooltipTitle}
                tooltipText={pageData?.tooltipText}
                style={{ marginBottom: '1.5rem' }}
            />
            
            <div className="cover-letter-content no-scrollbar" style={{ padding: '0', marginRight: '0', flex: 1, overflowY: 'auto' }}>
                <div className="cover-letter-inner-card" style={{ 
                     lineHeight: '1.6', 
                     padding: '0', 
                     marginTop: '0px',
                    background: '#000',
                    borderRadius: '16px',
                    border: '1px solid var(--card-border)',
                    boxShadow: 'var(--card-box-shadow)',
                    color: 'var(--color-brand-text-primary)',
                    height: '560.071px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <video
                        ref={videoRef}
                        src={activeVideo === 'video1' ? VIDEO_1_URL : VIDEO_2_URL}
                        playsInline
                        autoPlay
                        loop={activeVideo === 'video1'}
                        muted={isMuted}
                        onEnded={handleVideoEnded}
                        onClick={handlePlayPause}
                        style={{
                            width: '100%',
                            height: '560.071px',
                            objectFit: 'cover',
                            cursor: 'pointer'
                        }}
                    />
                    
                    <style>{`
    .glass-btn-container {
        display: flex;
        align-items: center;
        gap: 12px;
        position: absolute;
        bottom: 20px;
        right: 20px;
        z-index: 20;
    }
    .premium-intro-btn.glass-btn {
        display: flex;
        align-items: center;
        height: 44px;
        border-radius: 25px;
        background: rgba(0, 102, 255, 0.4);
        border: 1.5px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 8px 32px rgba(0, 102, 255, 0.25);
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        width: 220px;
        cursor: pointer;
        user-select: none;
    }
    .premium-intro-btn.glass-btn:hover {
        background: rgba(0, 102, 255, 0.38);
        border-color: rgba(255, 255, 255, 0.55);
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 12px 36px rgba(0, 102, 255, 0.4);
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
        width: 120.822px;
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
                                onClick={handleToggleMute}
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
                                onClick={handleSwitchVideo}
                                title={activeVideo === 'video1' ? 'Xem Phỏng vấn mẫu' : 'Hủy'}
                            >
                                <span className="premium-btn-text">
                                    {activeVideo === 'video1' ? 'Phỏng vấn mẫu' : 'Hủy'}
                                </span>
                                <div className="premium-btn-icon">
                                    {activeVideo === 'video1' ? <Icons.PlayIcon size={18} /> : <Icons.XMarkIcon size={18} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoInterviewCard;
