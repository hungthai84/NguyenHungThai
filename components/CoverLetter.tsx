import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useI18n } from '../contexts/i18n';
import PageLayout from './PageLayout';
import * as Icons from './Icons';
import CardTitle from './CardTitle';

interface CoverLetterProps {
    id?: string;
}

const CoverLetter: React.FC<CoverLetterProps> = ({ id }) => {
    const { t } = useI18n();
    const pageData = t.coverLetterPage || { badge: 'Thư ngỏ', paragraphs: [], greeting: '', closing: '', signature: '' };
    const paragraphs: string[] = pageData.paragraphs || [];
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isTogglingPlay, setIsTogglingPlay] = useState(false);
    const [showHint, setShowHint] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);
    const videoWrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHint(false);
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    const handlePlayPause = useCallback(async () => {
        const video = videoRef.current;
        if (!video || isTogglingPlay) return;
    
        setIsTogglingPlay(true);
        setShowHint(false);
        try {
            if (video.paused) {
                await video.play();
            } else {
                video.pause();
            }
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                 console.error("Video play/pause error:", error);
            }
        } finally {
            setIsTogglingPlay(false);
        }
    }, [isTogglingPlay]);

    return (
        <PageLayout id={id}>
            <style>{`
                .custom-video-player-wrapper {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    width: 100px;
                    height: 100px;
                    z-index: 50;
                    overflow: visible !important;
                }
                
                .custom-video-player-wrapper.is-playing::before {
                    content: '';
                    position: absolute;
                    top: -4px;
                    left: -4px;
                    right: -4px;
                    bottom: -4px;
                    background: linear-gradient(45deg, #ff0000, #dc2626, #991b1b, #ef4444, #7f1d1d, #f87171, #b91c1c);
                    background-size: 400%;
                    z-index: -1;
                    filter: blur(5px);
                    width: calc(100% + 8px);
                    height: calc(100% + 8px);
                    animation: glowing-border 20s linear infinite;
                    opacity: 1;
                    border-radius: 50%;
                }

                @keyframes glowing-border {
                    0% { background-position: 0 0; }
                    50% { background-position: 400% 0; }
                    100% { background-position: 0 0; }
                }

                .custom-video-player-wrapper .cover-letter-video-container {
                    width: 100px;
                    height: 100px;
                    overflow: hidden;
                    border-radius: 50%;
                    position: relative;
                    z-index: 2;
                    border: 2px solid rgba(255, 255, 255, 0.8);
                }
                .cover-letter-video-element {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .custom-video-player-wrapper .custom-play-button {
                    width: 30px;
                    height: 30px;
                    bottom: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                }
                .custom-video-player-wrapper .custom-play-button svg {
                    width: 14px;
                    height: 14px;
                }

                .cover-letter-hint-bubble {
                    position: absolute;
                    right: calc(100% + 15px);
                    top: 50%;
                    transform: translateY(-50%);
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    color: white;
                    padding: 10px 16px;
                    border-radius: 18px 18px 4px 18px;
                    font-size: 13.5px;
                    font-weight: 500;
                    line-height: 1.4;
                    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
                    z-index: 60;
                    pointer-events: auto;
                    animation: cover-letter-hint-bounce-x 1.5s infinite ease-in-out;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    cursor: pointer;
                    width: max-content;
                    max-width: 200px;
                    text-align: left;
                }
                @media (min-width: 640px) {
                    .cover-letter-hint-bubble {
                        right: calc(100% + 20px);
                    }
                }
                .cover-letter-hint-bubble::after {
                    content: '';
                    position: absolute;
                    bottom: 6px;
                    right: -6px;
                    transform: none;
                    border-width: 6px 0 6px 6px;
                    border-style: solid;
                    border-color: transparent transparent transparent #dc2626;
                    display: block;
                    width: 0;
                }
                @keyframes cover-letter-hint-bounce-x {
                    0%, 100% { transform: translate(0, -50%); }
                    50% { transform: translate(-6px, -50%); }
                }
            `}</style>
            <div className="info-card flex flex-col h-full">
                <CardTitle
                    icon={<Icons.DocumentTextIcon />}
                    text={pageData.badge}
                    tooltipTitle={pageData.tooltipTitle}
                    tooltipText={pageData.tooltipText}
                    style={{ marginBottom: '1.5rem' }}
                />

                <div className={`custom-video-player-wrapper ${isPlaying ? 'is-playing' : ''}`} ref={videoWrapperRef}>
                    {showHint && (
                        <div 
                            className="cover-letter-hint-bubble"
                            onClick={() => {
                                setShowHint(false);
                                handlePlayPause();
                            }}
                            title="Bấm vào để xem video"
                        >
                            <span>Bấm vào để xem video giới thiệu của anh!</span>
                        </div>
                    )}
                    <div 
                        className="cover-letter-video-container" 
                        title={isPlaying ? "Tạm dừng video" : "Xem video giới thiệu"}
                        onClick={handlePlayPause}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePlayPause(); }}
                        role="button"
                        tabIndex={0}
                        aria-label="Play or pause the introduction video"
                    >
                        <video
                            ref={videoRef}
                            src="https://cdn.scena.ai/project/9626/f4d02f974e1736ae00f0875bc7845fa8fac2226a618b4ac4bf99eaa8e8988b42.mp4"
                            playsInline
                            loop
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => setIsPlaying(false)}
                            className="cover-letter-video-element"
                            poster="https://i.ibb.co/5Xk5Fckg/Avata-Gif.gif"
                        >
                            Trình duyệt của bạn không hỗ trợ thẻ video.
                        </video>
                    </div>
                    <button 
                        className="custom-play-button" 
                        onClick={handlePlayPause} 
                        aria-label={isPlaying ? "Tạm dừng video" : "Phát video"}
                    >
                        {isPlaying ? <Icons.PauseIcon /> : <Icons.PlayIcon style={{ marginLeft: '2px' }}/>}
                    </button>
                </div>
                
                <div className="cover-letter-content no-scrollbar" ref={contentRef} style={{ padding: '0.5rem' }}>
                    <div className="cover-letter-inner-card" style={{ 
                        lineHeight: '1.6', 
                        padding: '2rem', 
                        marginTop: '0px',
                        background: 'var(--card-bg)',
                        backdropFilter: 'var(--glass-blur)',
                        borderRadius: '16px',
                        border: '1px solid var(--card-border)',
                        boxShadow: 'var(--card-box-shadow)',
                        color: 'var(--color-brand-text-primary)',
                        fontSize: '13px'
                    }}>
                        <p className="font-bold text-slate-900 dark:text-white text-fluid-body border-l-4 border-orange-500 pl-3">Kính chào Quý Công ty!</p>

                        <p className="text-fluid-body">
                          Tôi là <span className="text-orange-500 font-bold">Nguyễn Hùng Thái</span>, Trưởng phòng Chăm sóc Khách hàng với hơn <span className="text-orange-500 font-bold border-b border-orange-500/20 pb-0.5">22 năm thực chiến sâu sắc</span> trong lĩnh vực xây dựng, vận hành và phát triển dịch vụ khách hàng.
                        </p>
                        
                        <div className="space-y-4 border-l-2 border-slate-300 dark:border-slate-700 pl-4 ml-2">
                          <div className="relative">
                            <div className="absolute -left-[21px] top-1.5 w-2 h-2 bg-orange-500 rounded-full"></div>
                            <p className="text-fluid-body">
                              Tôi bắt đầu sự nghiệp từ năm <span className="font-bold text-slate-900 dark:text-white">2002 tại MobiFone</span>, nơi tôi được đào tạo nền tảng vững chắc về dịch vụ khách hàng, quản lý tổng đài, xử lý sự cố và xây dựng quy trình phục vụ theo tiêu chuẩn khắt khe của ngành viễn thông.
                            </p>
                          </div>
                        
                          <div className="relative">
                            <div className="absolute -left-[21px] top-1.5 w-2 h-2 bg-orange-500 rounded-full"></div>
                            <p className="text-fluid-body">
                              Tiếp đó, tại <span className="font-bold text-slate-900 dark:text-white">Viễn Liên V247</span>, tôi phát triển năng lực quản lý đội ngũ, trực tiếp giám sát chất lượng dịch vụ và tối ưu hiệu quả vận hành của trung tâm chăm sóc khách hàng.
                            </p>
                          </div>
                        
                          <div className="relative">
                            <div className="absolute -left-[21px] top-1.5 w-2 h-2 bg-orange-500 rounded-full"></div>
                            <p className="text-fluid-body">
                              Một cột mốc quan trọng trong sự nghiệp của tôi là khi gia nhập <span className="font-bold text-slate-900 dark:text-white">LBC – Truyền hình Cáp HTV</span>, nơi tôi lần đầu tiên đảm nhiệm vị trí <span className="font-bold text-slate-900 dark:text-white">Trưởng phòng Chăm sóc Khách hàng</span>. Đây là giai đoạn giúp tôi chuyển mình từ một nhà quản lý vận hành sang một nhà quản trị toàn diện. Tôi học cách điều hành hoạt động của cả phòng ban, xây dựng và chuẩn hóa quy trình, phát triển đội ngũ, thiết lập các chỉ số quản trị (KPI) và phối hợp hiệu quả với nhiều phòng ban nhằm nâng cao chất lượng dịch vụ.
                            </p>
                          </div>
                        
                          <div className="relative">
                            <div className="absolute -left-[21px] top-1.5 w-2 h-2 bg-orange-500 rounded-full"></div>
                            <p className="text-fluid-body">
                              Khi làm việc tại <span className="font-bold text-slate-900 dark:text-white">Garena</span>, tôi quản lý hoạt động chăm sóc khách hàng trong lĩnh vực thể thao điện tử, nơi đòi hỏi tốc độ xử lý nhanh, chính xác và khả năng đáp ứng tốt khối lượng khách hàng cực kỳ lớn.
                            </p>
                          </div>
                        
                          <div className="relative">
                            <div className="absolute -left-[21px] top-1.5 w-2 h-2 bg-orange-500 rounded-full"></div>
                            <p className="text-fluid-body">
                              Trong giai đoạn phát triển <span className="font-bold text-slate-900 dark:text-white">VED, Shopee và AirPay</span>, tôi tham gia sâu sát vào xây dựng trải nghiệm khách hàng trong lĩnh vực thương mại điện tử và thanh toán số, với định hướng nhất quán lấy khách hàng làm trung tâm.
                            </p>
                          </div>
                        
                          <div className="relative">
                            <div className="absolute -left-[21px] top-1.5 w-2 h-2 bg-orange-500 rounded-full"></div>
                            <p className="text-fluid-body">
                              Tại <span className="font-bold text-slate-900 dark:text-white">MoMo</span>, tôi tiếp tục mở rộng kinh nghiệm trong lĩnh vực dịch vụ tài chính số, tối ưu hóa các quy trình hỗ trợ khách hàng đa kênh và nâng cao hiệu quả vận hành trên nền tảng công nghệ cao.
                            </p>
                          </div>
                        
                          <div className="relative">
                            <div className="absolute -left-[21px] top-1.5 w-2 h-2 bg-orange-500 rounded-full"></div>
                            <p className="text-fluid-body">
                              Làm việc tại <span className="font-bold text-slate-900 dark:text-white">Prudential và Ví ECO (Finviet)</span> giúp tôi hiểu sâu sắc hơn về trải nghiệm khách hàng trong lĩnh vực bảo hiểm và tài chính công nghệ, nơi sự chính xác, minh bạch và niềm tin luôn được đặt lên hàng đầu.
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-fluid-body">
                          Qua mỗi môi trường làm việc đầy thử thách, tôi nhận ra rằng chăm sóc khách hàng không chỉ là giải quyết vấn đề đơn thuần, mà còn là xây dựng một hệ thống tối ưu giúp doanh nghiệp phát triển bền vững.
                        </p>
                        
                        <div className="glass-panel p-4 rounded-xl border border-orange-500/10 my-4 bg-orange-500/5">
                          <p className="text-fluid-small text-orange-500 uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                            <i className="fa-solid fa-graduation-cap"></i> Ba nguyên tắc cốt lõi của tôi:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-3 bg-white/20 dark:bg-slate-900/40 rounded-lg text-center border border-white/10">
                              <i className="fa-solid fa-sliders text-orange-500 mb-1 text-base block"></i>
                              <span className="font-bold text-slate-800 dark:text-white text-fluid-xs">QUY TRÌNH TẠO NỀN TẢNG</span>
                            </div>
                            <div className="p-3 bg-white/20 dark:bg-slate-900/40 rounded-lg text-center border border-white/10">
                              <i className="fa-solid fa-users text-blue-500 mb-1 text-base block"></i>
                              <span className="font-bold text-slate-800 dark:text-white text-fluid-xs">CON NGƯỜI TẠO GIÁ TRỊ</span>
                            </div>
                            <div className="p-3 bg-white/20 dark:bg-slate-900/40 rounded-lg text-center border border-white/10">
                              <i className="fa-solid fa-bolt text-purple-500 mb-1 text-base block"></i>
                              <span className="font-bold text-slate-800 dark:text-white text-fluid-xs">CÔNG NGHỆ TẠO ĐÒN BẨY</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-fluid-body">
                          Từ những nguyên tắc đó, tôi tập trung xây dựng các hệ thống CRM, Dashboard quản trị, AI Chatbot và các giải pháp tự động hóa nhằm nâng cao tối đa hiệu quả vận hành. Bên cạnh công nghệ, tôi luôn chú trọng đào tạo đội ngũ biết lắng nghe, thấu cảm chân thành và mang đến những trải nghiệm vượt mong đợi cho khách hàng.
                        </p>
                        
                        <div className="glass-panel p-4 rounded-xl border-l-4 border-r-4 border-orange-500/60 bg-gradient-to-r from-orange-500/5 to-transparent text-left my-4">
                          <i className="fa-solid fa-quote-left text-orange-500/30 text-2xl -mt-2 block"></i>
                          <p className="text-fluid-body italic font-semibold text-slate-800 dark:text-amber-100/95 leading-relaxed pl-4 -mt-2">
                            "Sự hài lòng của khách hàng không đến từ sự hoàn hảo, mà đến từ <span className="text-orange-500 dark:text-orange-400 font-bold underline decoration-2 underline-offset-4">sự đồng cảm kịp thời</span>."
                          </p>
                        </div>
                        
                        <p className="text-fluid-body">
                          Tôi mong muốn được đồng hành cùng Quý Công ty để xây dựng một hệ thống chăm sóc khách hàng hiện đại, lấy khách hàng làm trung tâm, tối ưu hiệu quả vận hành và tạo ra giá trị phát triển bền vững lâu dài.
                        </p>

                        <div className="flex justify-between items-end mt-8 border-t border-slate-500/10 pt-4 flex-shrink-0">
                            <div className="text-left">
                                <p className="text-fluid-small text-slate-400 mb-1 italic">Xin trân trọng cảm ơn Quý Công ty đã dành thời gian lắng nghe!</p>
                                <p className="font-bold text-[13px] text-orange-500 m-0 font-play uppercase tracking-wider">Nguyễn Hùng Thái</p>
                            </div>
                            <div className="relative group cursor-pointer text-right flex flex-col items-end">
                                <img className="h-10 md:h-12 w-auto opacity-90 transition-transform group-hover:scale-105 duration-300 filter dark:brightness-110" src="https://i.postimg.cc/VNfdSvPT/Ch-k.png" alt="Chữ ký Nguyễn Hùng Thái" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default CoverLetter;