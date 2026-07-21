import React,
 { useEffect, useState } from 'react';
import { useI18n } from '../contexts/i18n';
import { useTheme, ACCENT_COLORS } from '../contexts/ThemeContext';
import PageLayout from './PageLayout';
import * as Icons from './Icons';
import GlassButton from './GlassButton';
import CardTitle from './CardTitle';
import Tooltip from './Tooltip';
import { useSpeechSynthesis } from './useSpeechSynthesis';

interface SettingsPageProps {
    id?: string;
}

const CSS_WALLPAPERS = [
    { id: 'gradient', name: 'Mặc định (Gradient)', value: 'gradient' },
    { id: 'glassmorphism-effect', name: 'Kính mờ Glassmorphism', value: 'glassmorphism-effect' },
    { id: 'gemini-ai', name: 'Cảm hứng Gemini AI', value: 'gemini-ai' },
    { id: 'orbiting-planets', name: 'Hành tinh Quỹ đạo', value: 'orbiting-planets' },
    { id: 'gradient-animated', name: 'Gradient Động (CodePen)', value: 'gradient-animated' },
    { id: 'animated-waves', name: 'Sóng Động (CodePen)', value: 'animated-waves' },
    { id: 'starry-night', name: 'Đêm đầy sao (CodePen)', value: 'starry-night' },
    { id: 'glass-card-gradient', name: 'Glass Card Gradient (CodePen)', value: 'glass-card-gradient' },
    { id: 'particles-background', name: 'Particles Effect (CodePen)', value: 'particles-background' },
    { id: 'aurora-dream', name: 'Aurora Dream (Premium)', value: 'aurora-dream' },
    { id: 'apple-glass', name: 'Apple Glass Design', value: 'apple-glass' },
    { id: 'ai-blob', name: 'Premium AI Blob', value: 'ai-blob' },
    { id: 'dotted-pattern', name: 'Hạt chấm Dotted', value: 'dotted-pattern' },
    { id: 'grad-1', name: 'Gradient Sunset', value: 'linear-gradient(to right, #3b82f6 0%, #a855f7 50%, #ec4899 100%)' },
    { id: 'grad-2', name: 'Gradient Deep Sea', value: 'linear-gradient(to right, #0f172a, #334155)' },
    { id: 'grad-5', name: 'Gradient Teal Ocean', value: 'linear-gradient(to top right, #0d9488, #0e7490, #1e40af)' },
    { id: 'grad-6', name: 'Gradient Indigo', value: 'linear-gradient(to top left, #3b82f6, #4f46e5, #4338ca)' },
    { id: 'grad-4', name: 'Gradient Zinc Metal', value: 'conic-gradient(at top, #3f3f46, #71717a, #d4d4d8)' }
];

const IMAGE_WALLPAPERS = [
    { id: 'img1', name: 'Tối giản thanh lịch 1', value: 'https://i.ibb.co/rKL4ffH2/2.jpg' },
    { id: 'img2', name: 'Tối giản thanh lịch 2', value: 'https://i.ibb.co/nq9GHB11/ta-i-xu-ng-12.jpg' },
    { id: 'img3', name: 'Ánh ngọc trai nhẹ nhàng', value: 'https://i.ibb.co/PZhKjDjP/Abstract-minimalistic-background-image-with-minimal-details-in-silvery-pearlescent-hues-subtle-tex.jpg' },
    { id: 'img4', name: 'Phong cảnh mộng mơ', value: 'https://i.ibb.co/Fc1dczn/Wallpaper.jpg' },
    { id: 'img5', name: 'Không gian tĩnh lặng 1', value: 'https://i.ibb.co/DDCj9TBk/ta-i-xu-ng-15.jpg' },
    { id: 'img6', name: 'Pastel thẩm mỹ', value: 'https://i.ibb.co/jPN1bS9c/Pastel-Minimal-Wallpaper-Clean-Aesthetic-for-Mac-Book.jpg' },
    { id: 'img7', name: 'Không gian tĩnh lặng 2', value: 'https://i.ibb.co/chRZYCFs/ta-i-xu-ng-14.jpg' },
    { id: 'img8', name: 'Không gian tĩnh lặng 3', value: 'https://i.ibb.co/k2jTwnTp/ta-i-xu-ng-13.jpg' },
    { id: 'img9', name: 'Không gian tĩnh lặng 4', value: 'https://i.ibb.co/G4tGQZbB/ta-i-xu-ng-16.jpg' },
    { id: 'img10', name: 'Vòng tròn Gradient', value: 'https://i.ibb.co/r2w5qZCT/Download-Abstract-Gradient-Circle-Background-for-free.jpg' },
    { id: 'img11', name: 'Sắc thái tinh thần', value: 'https://i.ibb.co/zhc5bK7G/Ton-mental-a-aussi-besoin-de-repos.jpg' },
    { id: 'img12', name: 'Màu sắc tối giản', value: 'https://i.ibb.co/d0Fw0xdW/Best-wallpaper-1.jpg' },
    { id: 'img13', name: 'Trắng tinh khiết', value: 'https://i.ibb.co/G47jTb1g/minimalist-white-background-3840x2160-bright-space-clean-aesthetic-27644.jpg' },
    { id: 'img14', name: 'Núi hình học', value: 'https://i.ibb.co/q2X19rq/geometric-mountain-wallpaper-3840x2160-calming-visuals-simple-patterns-26760.jpg' }
];

const VIDEO_WALLPAPERS = [
    { id: 'vid1', name: 'Hạt ánh sáng ảo diệu', value: 'https://cdn.dribbble.com/userupload/18230475/file/original-d7ab36998c2277e97c1996d837a4673c.mp4' },
    { id: 'vid2', name: 'Sóng màu trừu tượng', value: 'https://cdn.dribbble.com/userupload/9438742/file/original-9334dd4051bb585cc561e8be06870b39.mp4' },
    { id: 'vid3', name: 'Cực quang xanh mượt', value: 'https://cdn.dribbble.com/userupload/4241992/file/original-1fcb82b5ace105f3ec88a2deb08e842d.mp4' },
    { id: 'vid4', name: 'Không gian đa chiều', value: 'https://cdn.dribbble.com/userupload/34993295/file/original-2ea4b30fcd7c6eac3ca0f4d5bfd3d67b.mp4' },
    { id: 'vid5', name: 'Mây hồng rực rỡ', value: 'https://cdn.dribbble.com/userupload/32536603/file/original-db8060ba2540c3bf1cd2f30b4984cd51.mp4' },
    { id: 'vid6', name: 'Dòng chảy năng lượng', value: 'https://cdn.dribbble.com/userupload/32480516/file/original-f4a88d4031fee315e3175bf1834c24b4.mp4' },
    { id: 'vid7', name: 'Sương mù huyền bí', value: 'https://cdn.dribbble.com/userupload/32404914/file/original-57644971c47c0d16f90a68404a5e65c1.mp4' },
    { id: 'vid8', name: 'Hố đen vũ trụ', value: 'https://cdn.dribbble.com/userupload/16365481/file/original-527fee647d12f31fce8a309ad136c4bb.mp4' },
    { id: 'vid9', name: 'Tinh vân rực lửa', value: 'https://cdn.dribbble.com/userupload/15594644/file/original-6008d4b0ddcff73c116cb7989a144a71.mp4' },
    { id: 'vid10', name: 'Thiên hà xoáy', value: 'https://cdn.dribbble.com/userupload/14779635/file/original-1aca59fc5dc52bee9dcd291a27effcbf.mp4' },
    { id: 'vid11', name: 'Hành tinh xanh', value: 'https://cdn.dribbble.com/userupload/10782874/file/original-06f7280dda982b62cd9452b0da032598.mp4' },
    { id: 'vid12', name: 'Bụi sao vàng óng', value: 'https://cdn.dribbble.com/userupload/32524948/file/original-3c68e4ad227ae70e1875ef71289be2b0.mp4' },
    { id: 'vid13', name: 'Hạt ánh sáng lơ lửng', value: 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4' },
    { id: 'vid14', name: 'Cổng không gian', value: 'https://cdn.dribbble.com/userupload/16718734/file/original-f2df9314dbf922d5452d7a8a5885d744.mp4' },
    { id: 'vid15', name: 'Dải ngân hà hồng', value: 'https://cdn.dribbble.com/userupload/43797830/file/original-b9bafe56dd75a7ae175f827cfc662738.mp4' },
    { id: 'vid16', name: 'Siêu tân tinh', value: 'https://cdn.dribbble.com/userupload/16365364/file/original-dcc3ad4c0f5802c6670d36fcca720e5e.mp4' },
    { id: 'vid17', name: 'Mạng lưới thần kinh', value: 'https://cdn.dribbble.com/userupload/43797856/file/original-46c91cbdf46a3cbc3f30a85f061ed817.mp4' },
    { id: 'vid18', name: 'Khai thác dữ liệu', value: 'https://cdn.dribbble.com/userupload/12532568/file/original-816b8af88c5a4336e9f0467a7848033e.mp4' },
    { id: 'vid19', name: 'Công nghệ tương lai', value: 'https://cdn.dribbble.com/userupload/9535990/file/original-3a87c5fdf2433287d096795a11fa9ee4.mp4' },
    { id: 'vid20', name: 'Vòng xoáy thời gian', value: 'https://cdn.dribbble.com/userupload/13253460/file/original-85659da2508a303a516780470e3ae354.mp4' },
    { id: 'vid21', name: 'Ma trận ánh sáng', value: 'https://cdn.dribbble.com/userupload/9783516/file/original-47f57ffecea5c7874ff6d6c2f0ce42bf.mp4' }
];

const SettingsHelpTooltip: React.FC<{ title: string; text: string; isDark: boolean }> = ({ title, text, isDark }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const handleOutsideClick = () => {
            setIsOpen(false);
        };
        const timer = setTimeout(() => {
            window.addEventListener('click', handleOutsideClick);
        }, 50);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('click', handleOutsideClick);
        };
    }, [isOpen]);

    return (
        <span style={{ fontFamily: 'Play, sans-serif', position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: '6px' }} onClick={(e) => e.stopPropagation()}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'none',
                    border: 'none',
                    padding: '2px',
                    margin: 0,
                    cursor: 'pointer',
                    color: isOpen ? 'var(--accent-color)' : 'rgba(128, 128, 128, 0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    borderRadius: '50%',
                    outline: 'none'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent-color)';
                    e.currentTarget.style.background = 'rgba(128, 128, 128, 0.1)';
                }}
                onMouseLeave={(e) => {
                    if (!isOpen) {
                        e.currentTarget.style.color = 'rgba(128, 128, 128, 0.65)';
                        e.currentTarget.style.background = 'none';
                    }
                }}
                title="Nhấp để xem hướng dẫn"
            >
                <Icons.HelpCircleIcon size={16} />
            </button>
            {isOpen && (
                <div 
                    style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: 'calc(100% + 10px)',
                        transform: 'translateX(-50%)',
                        zIndex: 99999,
                        background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                        border: '1px solid var(--settings-section-border, rgba(255,255,255,0.2))',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
                        width: '280px',
                        pointerEvents: 'auto',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderTop: `8px solid ${isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.98)'}`,
                        zIndex: 100000,
                    }} />
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', borderBottom: '1px solid rgba(128,128,128,0.15)', paddingBottom: '6px' }}>
                        <Icons.LightBulbIcon size={14} style={{ color: 'var(--accent-color)' }} />
                        <span style={{ fontSize: '15px', fontWeight: 700, color: isDark ? 'white' : 'var(--text)' }}>
                            {title}
                        </span>
                    </div>
                    <p style={{
                        margin: 0,
                        fontSize: '0.75rem',
                        lineHeight: '1.4',
                        color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                        textAlign: 'left',
                        whiteSpace: 'normal',
                        fontWeight: 'normal'
                    }}>
                        {text}
                    </p>
                </div>
            )}
        </span>
    );
};

const SettingsPage: React.FC<SettingsPageProps> = ({ id }) => {
    const { t } = useI18n();
    const {
        themeMode,
        isSoundOn, setSoundOn,
        isMouseCursorOn, setMouseCursorOn,
        isAiVoiceOn, setAiVoiceOn,
        selectedAiVoiceName, setSelectedAiVoiceName,
        aiVoicePitch, setAiVoicePitch,
        aiVoiceRate, setAiVoiceRate,
        lightThemeColor, setLightThemeColor,
        darkThemeColor, setDarkThemeColor,
        accentColorType, setAccentColorType,
        wallpaper, setWallpaper,
        cardOpacity, setCardOpacity,
        sidebarOpacity, setSidebarOpacity,
        gridCardOpacity, setGridCardOpacity,
        contentOpacity, setContentOpacity,
        layoutOpacity, setLayoutOpacity,
        subComponentOpacity, setSubComponentOpacity,
        isGlassEnabled, setIsGlassEnabled,
        themePreset, setThemePreset,
        isSidebarDetached, setIsSidebarDetached,
        uiScaleMode, setUiScaleMode,
        uiScaleValue, setUiScaleValue,
        currentUiScale,
        globalFontSize, setGlobalFontSize,
        globalLineHeight, setGlobalLineHeight,
        sidebarFontSize, setSidebarFontSize,
        cardTitleFontSize, setCardTitleFontSize,
        contentFontSize, setContentFontSize,
        menuItemFontSize, setMenuItemFontSize,
        resetToDefault
    } = useTheme();
    const { voices, speak, cancel, isSpeaking } = useSpeechSynthesis();

    const [savedSection, setSavedSection] = useState<string | null>(null);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
// Custom Wallpapers State
    const [customCssWallpapers, setCustomCssWallpapers] = useState<{id: string, name: string, value: string}[]>(() => {
        try { return JSON.parse(localStorage.getItem('customCssWallpapers') || '[]'); } catch { return []; }
    });
    const [customImgWallpapers, setCustomImgWallpapers] = useState<{id: string, name: string, value: string}[]>(() => {
        try { return JSON.parse(localStorage.getItem('customImgWallpapers') || '[]'); } catch { return []; }
    });
    const [customVidWallpapers, setCustomVidWallpapers] = useState<{id: string, name: string, value: string}[]>(() => {
        try { return JSON.parse(localStorage.getItem('customVidWallpapers') || '[]'); } catch { return []; }
    });
    const [customAccentColor, setCustomAccentColor] = useState<string>('#ffffff');
    const [newWallpaperUrl, setNewWallpaperUrl] = useState<string>('');
    const [newWallpaperName, setNewWallpaperName] = useState<string>('');
    
    const handleAddWallpaper = () => {
        if (!newWallpaperUrl || !newWallpaperName) return;
        const newWp = { id: 'custom-' + Date.now(), name: newWallpaperName, value: newWallpaperUrl };
        if (wallpaperTab === 'css') {
            const next = [...customCssWallpapers, newWp];
            setCustomCssWallpapers(next);
            localStorage.setItem('customCssWallpapers', JSON.stringify(next));
        } else if (wallpaperTab === 'image') {
            const next = [...customImgWallpapers, newWp];
            setCustomImgWallpapers(next);
            localStorage.setItem('customImgWallpapers', JSON.stringify(next));
        } else if (wallpaperTab === 'video') {
            const next = [...customVidWallpapers, newWp];
            setCustomVidWallpapers(next);
            localStorage.setItem('customVidWallpapers', JSON.stringify(next));
        }
        setWallpaper(newWallpaperUrl);
        setNewWallpaperUrl('');
        setNewWallpaperName('');
    };

    const handleSaveSection = (sectionId: string) => {
        setSavedSection(sectionId);
        setTimeout(() => {
            setSavedSection(null);
        }, 1500);
    };
    
    // Documentation Modal Component
    const DocumentationModal = () => (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 999999,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }} onClick={() => setIsDocModalOpen(false)}>
            <div style={{
                background: isDark ? '#0f172a' : '#ffffff',
                color: isDark ? 'white' : 'black',
                padding: '24px', borderRadius: '16px', maxWidth: '800px', width: '100%',
                maxHeight: '90vh', overflowY: 'auto',
                border: '1px solid rgba(128,128,128,0.2)',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Hướng dẫn Portfolio</h2>
                    <button onClick={() => setIsDocModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><Icons.XMarkIcon /></button>
                </div>
                <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                    <h3>Tổng quan</h3>
                    <p>Chào mừng bạn đến với trang quản trị giao diện cá nhân. Đây là nơi bạn cá nhân hóa giao diện và trải nghiệm website Portfolio của mình.</p>
                    
                    <h3>Cá nhân hóa Giao diện</h3>
                    <ul>
                        <li><strong>Màu sắc chủ đạo:</strong> Lựa chọn từ 7 màu đá quý.</li>
                        <li><strong>Hình nền:</strong> Chọn CSS động, ảnh tĩnh, hoặc video Live.</li>
                        <li><strong>Độ trong suốt:</strong> Điều chỉnh Glassmorphism (5-95%) để tạo cảm giác sang trọng.</li>
                    </ul>

                    <h3>Trải nghiệm đa giác quan</h3>
                    <ul>
                        <li><strong>Âm thanh tương tác:</strong> Bật/tắt âm thanh khi click hoặc hover.</li>
                        <li><strong>Giọng nói AI (TTS):</strong> Cho phép trợ lý AI thuyết minh nội dung các trang.</li>
                    </ul>

                    <h3>Quản lý & Xuất dữ liệu</h3>
                    <ul>
                        <li><strong>Xuất cấu hình JSON:</strong> Đồng bộ thiết lập qua thiết bị khác.</li>
                        <li><strong>Báo cáo sự nghiệp:</strong> Xuất hồ sơ sự nghiệp ra file TXT chất lượng cao.</li>
                    </ul>

                    <h3>Thiết lập Thẻ chức năng (Cards)</h3>
                    <ul>
                        <li><strong>Thẻ Học vấn:</strong> Kích thước cố định 350px x 150px, tập trung vào thông tin cốt lõi.</li>
                        <li><strong>Thẻ Dự án:</strong> Hiển thị nhãn giai đoạn và chiến lược trực tiếp trên ảnh thẻ.</li>
                        <li><strong>Lưu tự động:</strong> Mọi thay đổi đều được lưu tức thì vào thiết bị.</li>
                    </ul>
                </div>
                            <button
                                type="button"
                                onClick={() => handleSaveSection('aivoice')}
                                style={{
                                    padding: '6px 16px',
                                    fontSize: '15px',
                                    borderRadius: '999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.3s ease',
                                    minWidth: '110px',
                                    justifyContent: 'center',
                                    fontWeight: '600',
                                    background: 'var(--card-bg, rgba(255, 255, 255, 0.05))',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
                                    color: 'var(--text-primary, inherit)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }}
                                className="glass-panel-hover"
                            >
                                {savedSection === 'aivoice' ? (
                                    <>
                                        <Icons.CheckIcon size={14} />
                                        Đã lưu ✓
                                    </>
                                ) : (
                                    <>
                                        <Icons.SaveIcon size={14} />
                                        Lưu lại
                                    </>
                                )}
                            </button>
            </div>
        </div>
    );

    const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
    const [updateMessage, setUpdateMessage] = useState<string | null>(null);

    const handleUpdateSettings = () => {
        setIsUpdatingSettings(true);
        setTimeout(() => {
            setIsUpdatingSettings(false);
            setUpdateMessage("Cài đặt đã được cập nhật thành công!");
            setTimeout(() => {
                setUpdateMessage(null);
            }, 2500);
        }, 1000);
    };

    const exportPromptsToText = () => {
        let content = `===========================================================\n`;
        content += `DANH SÁCH PROMPT AI CHẤT LƯỢNG CAO ĐỂ TẠO TỪNG TRANG WEBSITE\n`;
        content += `Ứng viên: ${t.sidebar?.name || 'Nguyễn Hùng Thái'}\n`;
        content += `Dành cho: AI Studio / Gemini / Claude / GPT\n`;
        content += `===========================================================\n`;
        content += `Ngày xuất tệp: ${new Date().toLocaleString('vi-VN')}\n\n`;

        // 1. Prompt chung cho toàn bộ website
        content += `[ PROMPT 1: THIẾT KẾ & PHONG CÁCH CHUNG (GLOBAL STYLE) ]\n`;
        content += `-----------------------------------------------------------\n`;
        content += `Hãy thiết kế một website Portfolio cá nhân chuyên nghiệp và đẳng cấp bằng React, Vite, Tailwind CSS và Framer Motion.\n`;
        content += `- Phong cách thiết kế: Kính mờ hiện đại (Glassmorphism), tối giản thanh lịch, sử dụng nền mờ đục linh hoạt từ 5% đến 95%.\n`;
        content += `- Tông màu chủ đạo: Sử dụng hệ màu thiết lập linh hoạt lấy cảm hứng từ đá quý (Ruby Red, Sapphire Blue, Emerald Green, Amethyst Purple).\n`;
        content += `- Trải nghiệm đa giác quan: Tích hợp âm thanh tương tác khi click/hover và giọng nói thuyết minh AI (TTS).\n`;
        content += `- Cấu trúc: Bao gồm một thanh Sidebar trái bo tròn mềm mại và khu vực hiển thị nội dung chính bên phải.\n\n\n`;

        // 2. Prompt cho trang Giới thiệu (About Page)
        content += `[ PROMPT 2: TRANG GIỚI THIỆU BẢN THÂN (ABOUT PAGE) ]\n`;
        content += `-----------------------------------------------------------\n`;
        content += `Hãy tạo một trang Giới thiệu bản thân (About Page) cực kỳ ấn tượng bằng React và Tailwind CSS cho ứng viên Nguyễn Hùng Thái.\n`;
        content += `Yêu cầu thiết kế:\n`;
        content += `- Hiển thị Thư ngỏ/Giới thiệu tóm tắt hành trình 22 năm trong ngành Dịch vụ & Trải nghiệm Khách hàng.\n`;
        content += `- Thiết kế một thẻ lớn chứa thông tin cá nhân và 4 thẻ giá trị cốt lõi (ví dụ: Chuyên nghiệp, Tận tâm, Thực chiến, Đổi mới).\n`;
        content += `- Hiển thị bảng Thông tin chi tiết (Ngày sinh: 1984, Email, Điện thoại, Địa chỉ: TP. Hồ Chí Minh, Website) bằng các thẻ nhỏ tinh tế.\n`;
        content += `- Nội dung thực tế sử dụng:\n`;
        if (t.aboutPage?.paragraphs) {
            t.aboutPage.paragraphs.forEach((p, idx) => {
                content += `  + Đoạn ${idx+1}: ${p.replace(/<\/?[^>]+(>|$)/g, "")}\n`;
            });
        }
        content += `  + Giá trị cốt lõi: ${t.aboutPage?.coreValues || "Chuyên nghiệp - Tận tâm - Thực chiến - Sáng tạo"}\n\n\n`;

        // 3. Prompt cho trang Kinh nghiệm (Experience Page)
        content += `[ PROMPT 3: TRANG KINH NGHIỆM SỰ NGHIỆP (EXPERIENCE PAGE) ]\n`;
        content += `-----------------------------------------------------------\n`;
        content += `Hãy thiết kế trang Kinh nghiệm làm việc (Experience Page) dạng dòng thời gian (Timeline) động đẹp mắt bằng React, Tailwind CSS và Framer Motion.\n`;
        content += `Yêu cầu thiết kế:\n`;
        content += `- Hiển thị timeline từ năm 2002 đến nay với các mốc thăng tiến sự nghiệp rõ ràng.\n`;
        content += `- Mỗi mốc công ty hiển thị logo thương hiệu nhỏ bo tròn, thời gian làm việc, chức danh, quy mô đội ngũ quản lý.\n`;
        content += `- Sử dụng cơ chế mở rộng (Accordion hoặc Read More) để hiển thị chi tiết các trách nhiệm chính, nhiệm vụ cụ thể và dự án tiêu biểu mà không làm rối mắt người dùng.\n`;
        content += `- Nội dung thực tế sử dụng:\n`;
        if (t.workExperiencePage?.jobs) {
            t.workExperiencePage.jobs.forEach((job) => {
                content += `  + Công ty: ${job.company} (${job.date}) - Chức danh: ${job.title}\n`;
                content += `    * Quy mô quản lý: ${job.teamSize}\n`;
                content += `    * Trách nhiệm: ${job.responsibilities?.join(' ')}\n`;
                if (job.tasks && job.tasks.length > 0) {
                    content += `    * Nhiệm vụ: ${job.tasks.join('; ')}\n`;
                }
                content += `\n`;
            });
        }
        content += `\n`;

        // 4. Prompt cho trang Học văn (Education Page)
        content += `[ PROMPT 4: TRANG HỌC VẤN & BẰNG CẤP (EDUCATION PAGE) ]\n`;
        content += `-----------------------------------------------------------\n`;
        content += `Hãy tạo một trang Học vấn và Bằng cấp (Education Page) bằng React và Tailwind CSS.\n`;
        content += `Yêu cầu thiết kế:\n`;
        content += `- Hiển thị danh sách các bằng cấp, chứng chỉ dưới dạng lưới (Grid) với các thẻ có kích thước cố định là 450px rộng, 160px cao.\n`;
        content += `- Mỗi thẻ học vấn bao gồm: Năm học, Tiêu đề khóa học, Nơi đào tạo và Mô tả chi tiết kết quả.\n`;
        content += `- Loại bỏ logo hình ảnh rườm rà để tập trung hoàn toàn vào nội dung cốt lõi và thẩm mỹ tối giản của thẻ.\n`;
        content += `- Nội dung thực tế sử dụng:\n`;
        if (t.educationPage?.items) {
            t.educationPage.items.forEach((item) => {
                content += `  + Năm ${item.year}: ${item.title} - Học tại: ${item.institution}\n`;
                content += `    Mô tả: ${item.description}\n`;
            });
        }
        content += `\n\n`;

        // 5. Prompt cho trang Lĩnh vực chuyên môn (Services Page)
        content += `[ PROMPT 5: TRANG LĨNH VỰC CHUYÊN MÔN (SERVICES PAGE) ]\n`;
        content += `-----------------------------------------------------------\n`;
        content += `Hãy thiết kế trang Lĩnh vực chuyên môn (Services Page) bằng React và Tailwind CSS hiển thị năng lực cốt lõi.\n`;
        content += `Yêu cầu thiết kế:\n`;
        content += `- Hiển thị các khối dịch vụ thế mạnh dạng thẻ bento grid hoặc cột lưới cân xứng.\n`;
        content += `- Mỗi lĩnh vực chuyên môn có biểu tượng đại diện (từ lucide-react) sinh động và hiệu ứng hover nhẹ nhàng phát sáng màu nhấn.\n`;
        content += `- Nội dung thực tế sử dụng:\n`;
        if (t.servicesPage?.services) {
            t.servicesPage.services.forEach((s) => {
                content += `  + Chuyên môn: ${s.title}\n`;
                content += `    Mô tả: ${s.description}\n`;
            });
        }
        content += `\n\n`;

        // 6. Prompt cho trang Kỹ năng (Skills Page)
        content += `[ PROMPT 6: TRANG KỸ NĂNG & NĂNG LỰC (SKILLS PAGE) ]\n`;
        content += `-----------------------------------------------------------\n`;
        content += `Hãy tạo trang Kỹ năng và Năng lực chuyên môn (Skills Page) trực quan sinh động bằng React và Tailwind CSS.\n`;
        content += `Yêu cầu thiết kế:\n`;
        content += `- Phân chia kỹ năng thành 3 nhóm rõ ràng: Kỹ năng quản trị chiến lược, Kỹ năng nghiệp vụ thực chiến và Công cụ kỹ thuật hỗ trợ.\n`;
        content += `- Hiển thị phần trăm năng lực của từng kỹ năng thông qua các thanh tiến trình (progress bar) có hiệu ứng chạy mượt từ trái sang phải khi tải trang.\n`;
        content += `- Nội dung thực tế sử dụng:\n`;
        if (t.skillsPage?.categories) {
            t.skillsPage.categories.forEach((cat) => {
                content += `  + Nhóm kỹ năng: ${cat.title}\n`;
                cat.skills?.forEach(s => {
                    content += `    * ${s.name}: ${s.level}%\n`;
                });
            });
        }
        content += `\n\n`;

        // 7. Prompt cho trang Dự án (Projects Page)
        content += `[ PROMPT 7: TRANG DANH SÁCH DỰ ÁN CHI TIẾT (PROJECTS PAGE) ]\n`;
        content += `-----------------------------------------------------------\n`;
        content += `Hãy thiết kế một trang quản lý và hiển thị danh sách dự án (Projects Page) thông minh bằng React và Tailwind CSS.\n`;
        content += `Yêu cầu thiết kế:\n`;
        content += `- Có bộ lọc dự án linh hoạt theo nhóm (ví dụ: Tất cả, Giai đoạn 1, Giai đoạn 2, Chăm sóc Khách hàng, Đào tạo, Công nghệ).\n`;
        content += `- Thẻ dự án hiển thị hình ảnh minh họa chất lượng cao làm nền, ở góc phải phía trên của layer ảnh có các nhãn giai đoạn và hashtag chiến lược (như #CS Strategy, #Lãnh đạo, #Cơ cấu) nổi bật để người dùng dễ nhận diện.\n`;
        content += `- Khi click vào thẻ dự án sẽ mở ra một popup bài viết chi tiết có bố cục tạp chí (editorial layout), hỗ trợ hiển thị thông tin mục tiêu, thách thức, kết quả và bình luận phản hồi.\n`;
        content += `- Nội dung thực tế sử dụng:\n`;
        if (t.projectsPage?.projects) {
            t.projectsPage.projects.forEach((p) => {
                content += `  + Dự án: ${p.title}\n`;
                content += `    Mô tả: ${p.description}\n`;
                content += `    Hashtags: ${p.hashtags?.join(' ')}\n`;
                content += `    Nhóm: ${p.group}\n\n`;
            });
        }
        content += `\n-----------------------------------------------------------\n`;
        content += `Tài liệu được sinh tự động nhằm mục đích hỗ trợ phát triển và tái tạo website Nguyễn Hùng Thái.\n`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Website-Generation-Prompts-Nguyen-Hung-Thai.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const exportAllDataToText = () => {
        let content = `BÁO CÁO TỔNG HỢP THÔNG TIN CÁ NHÂN & HÀNH TRÌNH SỰ NGHIỆP\n`;
        content += `Ứng viên: ${t.sidebar?.name || 'Nguyễn Hùng Thái'}\n`;
        content += `Vị trí: ${t.sidebar?.jobTitle || 'Trưởng Phòng Dịch vụ Khách hàng'}\n`;
        content += `===========================================================\n`;
        content += `Ngày xuất tệp: ${new Date().toLocaleString('vi-VN')}\n\n`;

        // 1. Giới thiệu bản thân
        if (t.aboutPage) {
            content += `[ I. GIỚI THIỆU BẢN THÂN ]\n`;
            content += `--------------------------\n`;
            if (t.aboutPage.paragraphs) {
                t.aboutPage.paragraphs.forEach(p => {
                    content += `${p.replace(/<\/?[^>]+(>|$)/g, "")}\n`;
                });
            }
            content += `Giá trị cốt lõi: ${t.aboutPage.coreValues || ''}\n\n`;
            
            content += `* Thông tin liên hệ:\n`;
            t.aboutPage.infoItems?.forEach(item => {
                content += ` - ${item.label}: ${item.value}\n`;
            });
            content += `\n`;
        }

        // 2. Hành trình sự nghiệp
        if (t.workExperiencePage?.jobs) {
            content += `[ II. HÀNH TRÌNH SỰ NGHIỆP ]\n`;
            content += `---------------------------\n`;
            t.workExperiencePage.jobs.forEach((job, idx) => {
                content += `${idx + 1}. ${job.company}\n`;
                content += `   Thời gian: ${job.date}\n`;
                content += `   Chức danh: ${job.title}\n`;
                content += `   Quy mô quản lý: ${job.teamSize}\n`;
                content += `   Trách nhiệm chính: ${job.responsibilities?.join(' ')}\n`;
                if (job.tasks && job.tasks.length > 0) {
                    content += `   Nhiệm vụ cụ thể:\n    + ${job.tasks.join('\n    + ')}\n`;
                }
                if (job.projects && job.projects[0] !== "N/A") {
                    content += `   Dự án tiêu biểu: ${job.projects.join(', ')}\n`;
                }
                content += `\n`;
            });
        }

        // 3. Học vấn & Bằng cấp
        if (t.educationPage?.items) {
            content += `[ III. HỌC VẤN & BẰNG CẤP ]\n`;
            content += `---------------------------\n`;
            t.educationPage.items.forEach(item => {
                content += ` - Năm ${item.year}: ${item.title} - ${item.institution}\n`;
                if (item.description) content += `   Mô tả: ${item.description}\n`;
            });
            content += `\n`;
        }

        // 4. Lĩnh vực chuyên môn
        if (t.servicesPage?.services) {
            content += `[ IV. LĨNH VỰC CHUYÊN MÔN ]\n`;
            content += `---------------------------\n`;
            t.servicesPage.services.forEach(s => {
                content += ` - ${s.title}: ${s.description}\n`;
            });
            content += `\n`;
        }

        // 5. Kỹ năng & Năng lực
        if (t.skillsPage?.categories) {
            content += `[ V. KỸ NĂNG & NĂNG LỰC ]\n`;
            content += `------------------------\n`;
            t.skillsPage.categories.forEach(cat => {
                content += `* ${cat.title}:\n`;
                cat.skills?.forEach(s => {
                    content += ` - ${s.name}: ${s.level}%\n`;
                });
            });
            content += `\n`;
        }

        // 6. Thành tựu tiêu biểu
        if (t.achievementsPage?.achievements) {
            content += `[ VI. THÀNH TỰU TIÊU BIỂU ]\n`;
            content += `--------------------------\n`;
            t.achievementsPage.achievements.forEach(a => {
                content += ` - ${a.title} (${a.category}): Hoàn thành ${a.rate}%\n`;
            });
            content += `\n`;
        }

        // 7. Dự án chi tiết
        if (t.projectsPage?.projects) {
            content += `[ VII. DANH SÁCH DỰ ÁN CHI TIẾT ]\n`;
            content += `--------------------------------\n`;
            t.projectsPage.projects.forEach(p => {
                content += ` - Dự án: ${p.title}\n`;
                content += `   Nhóm: ${p.group}\n`;
                content += `   Mô tả: ${p.description}\n`;
                content += `   Hashtags: ${p.hashtags?.join(' ')}\n\n`;
            });
        }

        content += `\n-----------------------------------------------------------\n`;
        content += `Tài liệu được trích xuất từ hệ thống Portfolio của Nguyễn Hùng Thái.\n`;
        content += `© 2026 Nguyễn Hùng Thái. Tất cả quyền được bảo lưu.\n`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Ho-So-Nguyen-Hung-Thai-Chat-Luong-Cao.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const [genderPreferred, setGenderPreferred] = useState<string>(() => {
        return localStorage.getItem('aiVoiceGenderPreferred') || 'female';
    });
    
    // Voice Filter States
    const [voiceLangFilter, setVoiceLangFilter] = useState<string>('vi');
    const [voiceGenderFilter, setVoiceGenderFilter] = useState<string>('female');
    const [voiceBrowserFilter, setVoiceBrowserFilter] = useState<string>('all');
    const [filteredVoice, setFilteredVoice] = useState<string>('');

    const handleGenderChange = (val: string) => {
        setGenderPreferred(val);
        localStorage.setItem('aiVoiceGenderPreferred', val);
    };

    const handleTestVoice = () => {
        if (isSpeaking) {
            cancel();
        } else {
            const isEnglish = selectedAiVoiceName?.toLowerCase().includes('en') || selectedAiVoiceName?.toLowerCase().includes('english') || (selectedAiVoiceName === '' && document.documentElement.lang !== 'vi');
            const testText = isEnglish 
                ? "Hello! This is a test of my AI voice." 
                : "Xin chào! Đây là giọng nói thử nghiệm của tôi.";
            speak(testText, {
                voiceName: selectedAiVoiceName,
                pitch: aiVoicePitch,
                rate: aiVoiceRate,
                gender: selectedAiVoiceName === '' ? (genderPreferred as any) : undefined
            });
        }
    };
    
    const getWallpaperTab = (wp: string) => {
        if (wp.startsWith('https') && wp.toLowerCase().includes('.mp4')) return 'video';
        if (wp.startsWith('https')) return 'image';
        return 'css';
    };
    
    const [wallpaperTab, setWallpaperTab] = useState<'css' | 'image' | 'video'>(() => getWallpaperTab(wallpaper));
    
    const handleResetTransparency = () => {
        setCardOpacity(0.4);
        setSidebarOpacity(0.4);
        setGridCardOpacity(0.45);
        setContentOpacity(0.05);
        setLayoutOpacity(0.02);
        setSubComponentOpacity(0.8);
    };
    
    const isDark = themeMode === 'system'
        ? (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
        : themeMode === 'dark';

    const pageData = t.settingsPage || { badge: 'Cài đặt' };

    return (
        <PageLayout id={id}>
            <div className="info-card is-settings flex flex-col h-full" style={{ padding: '15px' }}>
                <div className="about-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CardTitle
                        icon={<Icons.SettingsIcon style={{ color: isDark ? "white" : "var(--text)" }} />}
                        text={pageData.badge || 'Cài đặt'}
                        tooltipTitle={pageData.tooltipTitle}
                        tooltipText={pageData.tooltipText}
                    />
                    <button 
                        onClick={() => setIsDocModalOpen(true)}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: isDark ? 'white' : 'var(--text)',
                            transition: 'all 0.2s',
                            fontSize: '16px'
                        }}
                    >
                        <Icons.HelpCircleIcon size={20} />
                    </button>
                </div>
                
                {isDocModalOpen && <DocumentationModal />}
                
                <div className="settings-content no-scrollbar" style={{ overflowY: 'auto', flex: 1, paddingRight: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
                    
                    {/* Tính năng Âm thanh / Sound Features */}
                    <div className="settings-section" style={{ 
                        background: 'var(--settings-section-bg, rgba(255,255,255,0.1))', 
                        backdropFilter: 'blur(30px)',
                        border: '1px solid var(--settings-section-border, rgba(255,255,255,0.2))', 
                        borderRadius: '16px', 
                        padding: '20px',
                        boxShadow: 'var(--settings-section-shadow, 0 8px 32px rgba(0,0,0,0.1))'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Icons.SpeakerWaveIcon size={20} style={{ color: isDark ? 'white' : 'var(--text)' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: isDark ? 'white' : 'var(--text)', display: 'flex', alignItems: 'center' }}>
                                    Tính năng Âm thanh
                                    <SettingsHelpTooltip 
                                        title="Hướng dẫn Âm thanh" 
                                        text="Bật hoặc tắt âm thanh phản hồi (click, hover, transition) trên toàn bộ hệ thống để tăng tính sinh động hoặc giữ không gian làm việc tĩnh lặng." 
                                        isDark={isDark} 
                                    />
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleSaveSection('sound')}
                                style={{
                                    padding: '6px 16px',
                                    fontSize: '15px',
                                    borderRadius: '999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.3s ease',
                                    minWidth: '110px',
                                    justifyContent: 'center',
                                    fontWeight: '600',
                                    background: 'var(--card-bg, rgba(255, 255, 255, 0.05))',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
                                    color: 'var(--text-primary, inherit)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }}
                                className="glass-panel-hover"
                            >
                                {savedSection === 'sound' ? (
                                    <>
                                        <Icons.CheckIcon size={14} />
                                        Đã lưu ✓
                                    </>
                                ) : (
                                    <>
                                        <Icons.SaveIcon size={14} />
                                        Lưu lại
                                    </>
                                )}
                            </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(128,128,128,0.1)' }}>
                            <div>
                                <div style={{ fontWeight: 500 }}>Bật/Tắt âm thanh</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    Bật âm thanh cho toàn bộ hệ thống
                                </div>
                            </div>
                            <label className="switch-toggle" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                                <input 
                                    type="checkbox" 
                                    checked={isSoundOn} 
                                    onChange={(e) => setSoundOn(e.target.checked)} 
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span className="slider" style={{ 
                                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                                    backgroundColor: isSoundOn ? 'var(--accent-color)' : '#ccc', 
                                    transition: '.4s', borderRadius: '34px' 
                                }}>
                                    <span style={{
                                        position: 'absolute', content: '""', height: '18px', width: '18px', 
                                        left: isSoundOn ? '28px' : '4px', bottom: '4px', backgroundColor: 'white', 
                                        transition: '.4s', borderRadius: '50%'
                                    }}></span>
                                </span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                            <div>
                                <div style={{ fontWeight: 500 }}>Hiệu ứng chuột Magic Cursor</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    Hiệu ứng chuột ma thuật di chuyển theo con trỏ
                                </div>
                            </div>
                            <label className="switch-toggle" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                                <input 
                                    type="checkbox" 
                                    checked={isMouseCursorOn} 
                                    onChange={(e) => setMouseCursorOn(e.target.checked)} 
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span className="slider" style={{ 
                                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                                    backgroundColor: isMouseCursorOn ? 'var(--accent-color)' : '#ccc', 
                                    transition: '.4s', borderRadius: '34px' 
                                }}>
                                    <span style={{
                                        position: 'absolute', content: '""', height: '18px', width: '18px', 
                                        left: isMouseCursorOn ? '28px' : '4px', bottom: '4px', backgroundColor: 'white', 
                                        transition: '.4s', borderRadius: '50%'
                                    }}></span>
                                </span>
                            </label>
                        </div>

                        
                    </div>

                    {/* Giọng nói AI / AI Voice Features */}
                    <div className="settings-section" style={{ 
                        background: 'var(--settings-section-bg, rgba(255,255,255,0.1))', 
                        backdropFilter: 'blur(30px)',
                        border: '1px solid var(--settings-section-border, rgba(255,255,255,0.2))', 
                        borderRadius: '16px', 
                        padding: '20px',
                        boxShadow: 'var(--settings-section-shadow, 0 8px 32px rgba(0,0,0,0.1))'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Icons.BotIcon size={20} style={{ color: isDark ? 'white' : 'var(--text)' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: isDark ? 'white' : 'var(--text)', display: 'flex', alignItems: 'center' }}>
                                    Giọng nói AI
                                    <SettingsHelpTooltip 
                                        title="Hướng dẫn Giọng nói AI" 
                                        text="Kích hoạt tính năng hỗ trợ đọc văn bản tự động bằng AI. Bạn có thể chọn giọng đọc (Nam/Nữ, Anh/Việt), điều chỉnh tốc độ, tông giọng và nghe thử trực tiếp." 
                                        isDark={isDark} 
                                    />
                                </h3>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(128,128,128,0.1)' }}>
                            <div>
                                <div style={{ fontWeight: 500 }}>Bật/Tắt Giọng nói AI</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    Sử dụng AI để đọc nội dung
                                </div>
                            </div>
                            <label className="switch-toggle" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                                <input 
                                    type="checkbox" 
                                    checked={isAiVoiceOn} 
                                    onChange={(e) => setAiVoiceOn(e.target.checked)} 
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span className="slider" style={{ 
                                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                                    backgroundColor: isAiVoiceOn ? 'var(--accent-color)' : '#ccc', 
                                    transition: '.4s', borderRadius: '34px' 
                                }}>
                                    <span style={{
                                        position: 'absolute', content: '""', height: '18px', width: '18px', 
                                        left: isAiVoiceOn ? '28px' : '4px', bottom: '4px', backgroundColor: 'white', 
                                        transition: '.4s', borderRadius: '50%'
                                    }}></span>
                                </span>
                            </label>
                        </div>

                        {isAiVoiceOn && (
                            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '15px 0' }}>
                                <div>
                                    <div style={{ fontWeight: 500, marginBottom: '12px', fontSize: '0.9rem' }}>
                                        Lọc & Chọn Giọng nói (AI Voice)
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                        <div>
                                            <div style={{ fontSize: '15px', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', marginBottom: '4px', paddingLeft: '8px' }}>Ngôn ngữ:</div>
                                            <select
                                                value={voiceLangFilter}
                                                onChange={(e) => setVoiceLangFilter(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '8px', borderRadius: '999px',
                                                    background: 'var(--card-bg, rgba(255,255,255,0.05))',
                                                    border: '1px solid var(--border-color, rgba(255,255,255,0.2))',
                                                    color: 'var(--text)', outline: 'none', fontSize: '0.85rem'
                                                }}
                                            >
                                                <option value="all">Tất cả</option>
                                                <option value="vi">Tiếng Việt (vi-VN)</option>
                                                <option value="en">Tiếng Anh (en-US)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '15px', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', marginBottom: '4px', paddingLeft: '8px' }}>Giới tính:</div>
                                            <select
                                                value={voiceGenderFilter}
                                                onChange={(e) => setVoiceGenderFilter(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '8px', borderRadius: '999px',
                                                    background: 'var(--card-bg, rgba(255,255,255,0.05))',
                                                    border: '1px solid var(--border-color, rgba(255,255,255,0.2))',
                                                    color: 'var(--text)', outline: 'none', fontSize: '0.85rem'
                                                }}
                                            >
                                                <option value="all">Tất cả</option>
                                                <option value="female">Nữ giới</option>
                                                <option value="male">Nam giới</option>
                                            </select>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '15px', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', marginBottom: '4px', paddingLeft: '8px' }}>Trình duyệt:</div>
                                            <select
                                                value={voiceBrowserFilter}
                                                onChange={(e) => setVoiceBrowserFilter(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '8px', borderRadius: '999px',
                                                    background: 'var(--card-bg, rgba(255,255,255,0.05))',
                                                    border: '1px solid var(--border-color, rgba(255,255,255,0.2))',
                                                    color: 'var(--text)', outline: 'none', fontSize: '0.85rem'
                                                }}
                                            >
                                                <option value="all">Tất cả</option>
                                                <option value="google">Google</option>
                                                <option value="microsoft">Microsoft</option>
                                                <option value="apple">Apple / Safari</option>
                                            </select>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '15px', color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)', marginBottom: '4px', paddingLeft: '8px' }}>Giọng nói:</div>
                                            <select
                                                value={filteredVoice}
                                                onChange={(e) => setFilteredVoice(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '8px', borderRadius: '999px',
                                                    background: 'var(--card-bg, rgba(255,255,255,0.05))',
                                                    border: '1px solid var(--border-color, rgba(255,255,255,0.2))',
                                                    color: 'var(--text)', outline: 'none', fontSize: '0.85rem'
                                                }}
                                            >
                                                <option value="">-- Chọn --</option>
                                            {voices.filter(v => {
                                                if (voiceLangFilter !== 'all' && !v.lang.toLowerCase().includes(voiceLangFilter)) return false;
                                                const nameLower = v.name.toLowerCase();
                                                if (voiceGenderFilter === 'female' && nameLower.includes('male') && !nameLower.includes('female')) return false;
                                                if (voiceGenderFilter === 'male' && nameLower.includes('female')) return false;
                                                if (voiceBrowserFilter !== 'all' && !nameLower.includes(voiceBrowserFilter)) return false;
                                                return true;
                                            }).map(voice => (
                                                <option key={voice.name} value={voice.name}>
                                                    {voice.name} ({voice.lang})
                                                </option>
                                            ))}
                                        </select>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button
                                            onClick={() => {
                                                if (filteredVoice) {
                                                    setSelectedAiVoiceName(filteredVoice);
                                                } else {
                                                    setSelectedAiVoiceName(''); // Auto
                                                }
                                            }}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '999px',
                                                background: 'var(--accent-color)', color: 'white',
                                                border: 'none', fontWeight: 600, cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                            }}
                                        >
                                            <Icons.SaveIcon size={16} /> Thêm vào (Làm mặc định)
                                        </button>
                                    </div>
                                    <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        Đang chọn: <strong>{selectedAiVoiceName || 'Tự động (Đề xuất)'}</strong>
                                    </div>
<button 
                                        onClick={handleTestVoice}
                                        style={{
                                            marginTop: '10px',
                                            width: '100%',
                                            padding: '12px 16px',
                                            borderRadius: '999px',
                                            background: isSpeaking ? 'rgba(255, 107, 129, 0.3)' : 'rgba(var(--accent-color-rgb), 0.25)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                            color: isDark ? 'white' : 'var(--text)'
                                        }}
                                    >
                                        {isSpeaking ? (
                                            <>
                                                <Icons.SpeakerOffIcon size={16} style={{ color: 'inherit' }} />
                                                Dừng nghe thử
                                            </>
                                        ) : (
                                            <>
                                                <Icons.SpeakerWaveIcon size={16} style={{ color: 'inherit' }} />
                                                Nghe thử giọng nói
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                        <span style={{ fontWeight: 500 }}>Tốc độ đọc</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>{aiVoiceRate.toFixed(1)}x</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0.5" max="2" step="0.1" 
                                        value={aiVoiceRate} 
                                        onChange={(e) => setAiVoiceRate(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--accent-color)' }}
                                    />
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                        <span style={{ fontWeight: 500 }}>Tông giọng</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>{aiVoicePitch.toFixed(1)}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0.5" max="2" step="0.1" 
                                        value={aiVoicePitch} 
                                        onChange={(e) => setAiVoicePitch(parseFloat(e.target.value))}
                                        style={{ width: '100%', accentColor: 'var(--accent-color)' }}
                                    />
                                </div>
                            </div>
                        )}

                        
                    </div>

                    {/* Cài đặt màu nhấn / Accent Color Settings */}
                    <div className="settings-section" style={{ 
                        background: 'var(--settings-section-bg, rgba(255,255,255,0.1))', 
                        backdropFilter: 'blur(30px)',
                        border: '1px solid var(--settings-section-border, rgba(255,255,255,0.2))', 
                        borderRadius: '16px', 
                        padding: '20px',
                        boxShadow: 'var(--settings-section-shadow, 0 8px 32px rgba(0,0,0,0.1))'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Icons.PaletteIcon size={20} style={{ color: isDark ? 'white' : 'var(--text)' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: isDark ? 'white' : 'var(--text)', display: 'flex', alignItems: 'center' }}>
                                    Tính năng Màu sắc
                                    <SettingsHelpTooltip 
                                        title="Hướng dẫn Màu sắc" 
                                        text="Chọn màu chủ đạo cho toàn bộ website của bạn. Có 7 tông màu lấy cảm hứng từ đá quý và thiên nhiên, kết hợp hai phong cách hiển thị Màu trơn (Solid) truyền thống hoặc Màu Gradient sinh động." 
                                        isDark={isDark} 
                                    />
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleSaveSection('color')}
                                style={{
                                    padding: '6px 16px',
                                    fontSize: '15px',
                                    borderRadius: '999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.3s ease',
                                    minWidth: '110px',
                                    justifyContent: 'center',
                                    fontWeight: '600',
                                    background: 'var(--card-bg, rgba(255, 255, 255, 0.05))',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
                                    color: 'var(--text-primary, inherit)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }}
                                className="glass-panel-hover"
                            >
                                {savedSection === 'color' ? (
                                    <>
                                        <Icons.CheckIcon size={14} />
                                        Đã lưu ✓
                                    </>
                                ) : (
                                    <>
                                        <Icons.SaveIcon size={14} />
                                        Lưu lại
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Mode selection option */}
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: 500, marginBottom: '8px', fontSize: '0.9rem' }}>
                                Kiểu màu hiển thị
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <button
                                    onClick={() => setAccentColorType('solid')}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '999px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        border: '1px solid',
                                        borderColor: accentColorType === 'solid' ? (isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)') : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'),
                                        background: accentColorType === 'solid' ? 'rgba(var(--accent-color-rgb), 0.3)' : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'),
                                        backdropFilter: 'blur(10px)',
                                        color: accentColorType === 'solid' ? (isDark ? 'white' : 'var(--text)') : (isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-secondary)'),
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        textAlign: 'center',
                                        boxShadow: accentColorType === 'solid' ? '0 4px 15px rgba(0, 0, 0, 0.1)' : 'none'
                                    }}
                                >
                                    Màu bình thường
                                </button>
                                <button
                                    onClick={() => setAccentColorType('gradient')}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '999px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        border: '1px solid',
                                        borderColor: accentColorType === 'gradient' ? (isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)') : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'),
                                        background: accentColorType === 'gradient' ? 'rgba(var(--accent-color-rgb), 0.3)' : (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'),
                                        backdropFilter: 'blur(10px)',
                                        color: accentColorType === 'gradient' ? (isDark ? 'white' : 'var(--text)') : (isDark ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-secondary)'),
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        textAlign: 'center',
                                        boxShadow: accentColorType === 'gradient' ? '0 4px 15px rgba(0, 0, 0, 0.1)' : 'none'
                                    }}
                                >
                                    Màu Gradient
                                </button>
                            </div>
                        </div>

                        {/* 7 Color selection thumbnails */}
                        <div>
                            <div style={{ fontWeight: 500, marginBottom: '12px', fontSize: '0.9rem' }}>
                                Chọn màu nhấn (7 màu)
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Mã màu tùy chỉnh:</span>
                                <input 
                                    type="color" 
                                    value={customAccentColor}
                                    onChange={(e) => {
                                        setCustomAccentColor(e.target.value);
                                        setLightThemeColor(e.target.value);
                                        setDarkThemeColor(e.target.value);
                                        setAccentColorType('solid');
                                    }}
                                    style={{ width: '40px', height: '40px', padding: '0', border: 'none', borderRadius: '999px', cursor: 'pointer', background: 'transparent' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'flex-start', alignItems: 'center' }}>
                                {ACCENT_COLORS.map((color) => {
                                    const isSelected = lightThemeColor.toLowerCase() === color.solid.toLowerCase() || 
                                                       darkThemeColor.toLowerCase() === color.solid.toLowerCase();
                                    return (
                                        <button
                                            key={color.id}
                                            onClick={() => {
                                                setLightThemeColor(color.solid);
                                                setDarkThemeColor(color.solid);
                                            }}
                                            title={color.nameVi}
                                            style={{
                                                width: '38px',
                                                height: '38px',
                                                borderRadius: '50%',
                                                background: accentColorType === 'gradient' ? color.gradient : color.solid,
                                                border: '2px solid',
                                                borderColor: isSelected ? 'white' : 'transparent',
                                                boxShadow: isSelected 
                                                    ? '0 0 0 2px var(--accent-color), 0 4px 12px rgba(0,0,0,0.15)' 
                                                    : '0 2px 6px rgba(0,0,0,0.1)',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                position: 'relative',
                                                transform: isSelected ? 'scale(1.15)' : 'scale(1)'
                                            }}
                                        >
                                            {isSelected && (
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'var(--text)',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                                }}>
                                                    ✓
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {/* Selected color details */}
                            {(() => {
                                const activeColorItem = ACCENT_COLORS.find(
                                    c => c.solid.toLowerCase() === lightThemeColor.toLowerCase() || 
                                         c.solid.toLowerCase() === darkThemeColor.toLowerCase()
                                );
                                if (activeColorItem) {
                                    return (
                                        <div style={{ marginTop: '15px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: accentColorType === 'gradient' ? activeColorItem.gradient : activeColorItem.solid }}></span>
                                            <span>
                                                {`Đang chọn: ${activeColorItem.nameVi} (${accentColorType === 'gradient' ? 'Gradient' : 'Màu trơn'})`}
                                            </span>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>

                        
                    </div>

                    {/* Bố cục / Layout Settings */}
                    <div className="settings-section animate-fadeIn" style={{ 
                        background: 'var(--settings-section-bg, rgba(255,255,255,0.1))', 
                        backdropFilter: 'blur(30px)',
                        border: '1px solid var(--settings-section-border, rgba(255,255,255,0.2))', 
                        borderRadius: '16px', 
                        padding: '20px',
                        boxShadow: 'var(--settings-section-shadow, 0 8px 32px rgba(0,0,0,0.1))'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Icons.LayersIcon size={20} style={{ color: isDark ? 'white' : 'var(--text)' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: isDark ? 'white' : 'var(--text)', display: 'flex', alignItems: 'center' }}>
                                    Bố cục
                                    <SettingsHelpTooltip 
                                        title="Hướng dẫn Bố cục" 
                                        text="Tùy chỉnh cách hiển thị của thanh Menu trái (Sidebar). Giao diện hỗ trợ cố định thanh Sidebar (Dính Sidebar) hoặc tách rời cách các cạnh màn hình 10px kết hợp với các góc bo mềm mại." 
                                        isDark={isDark} 
                                    />
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleSaveSection('layout')}
                                style={{
                                    padding: '6px 16px',
                                    fontSize: '15px',
                                    borderRadius: '999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.3s ease',
                                    minWidth: '110px',
                                    justifyContent: 'center',
                                    fontWeight: '600',
                                    background: 'var(--card-bg, rgba(255, 255, 255, 0.05))',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
                                    color: 'var(--text-primary, inherit)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }}
                                className="glass-panel-hover"
                            >
                                {savedSection === 'layout' ? (
                                    <>
                                        <Icons.CheckIcon size={14} />
                                        Đã lưu ✓
                                    </>
                                ) : (
                                    <>
                                        <Icons.SaveIcon size={14} />
                                        Lưu lại
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Glassmorphism Effect */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '12px', borderRadius: '12px', background: 'rgba(var(--accent-color-rgb), 0.05)', border: '1px solid rgba(var(--accent-color-rgb), 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Icons.SparklesIcon size={18} style={{ color: isDark ? 'white' : 'var(--text)' }} />
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Glassmorphism Effect</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                        {isGlassEnabled ? 'Đang Bật - Tăng trải nghiệm mờ ảo' : 'Đang Tắt - Trải nghiệm phẳng tối giản'}
                                    </div>
                                </div>
                            </div>
                            <label className="switch-toggle" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                                <input 
                                    type="checkbox" 
                                    checked={isGlassEnabled} 
                                    onChange={(e) => setIsGlassEnabled(e.target.checked)}
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span className="slider" style={{ 
                                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                                    backgroundColor: isGlassEnabled ? 'var(--accent-color)' : '#ccc', 
                                    transition: '.4s', borderRadius: '34px' 
                                }}>
                                    <span style={{
                                        position: 'absolute', content: '""', height: '18px', width: '18px', 
                                        left: isGlassEnabled ? '28px' : '4px', bottom: '4px', backgroundColor: 'white', 
                                        transition: '.4s', borderRadius: '50%'
                                    }}></span>
                                </span>
                            </label>
                        </div>

                        {/* Sidebar Layout Options */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '12px', borderRadius: '12px', background: 'rgba(var(--accent-color-rgb), 0.05)', border: '1px solid rgba(var(--accent-color-rgb), 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Icons.LayersIcon size={18} style={{ color: isDark ? 'white' : 'var(--text)' }} />
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Dính Sidebar</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                        {!isSidebarDetached ? 'Đang Bật (dính liền) - Tắt để tách rời 10px, bo cong 16px' : 'Đang Tắt (tách rời 10px, bo cong 16px)'}
                                    </div>
                                </div>
                            </div>
                            <label className="switch-toggle" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                                <input 
                                    type="checkbox" 
                                    checked={!isSidebarDetached} 
                                    onChange={(e) => setIsSidebarDetached(!e.target.checked)}
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <span className="slider" style={{ 
                                    position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                                    backgroundColor: !isSidebarDetached ? 'var(--accent-color)' : '#ccc', 
                                    transition: '.4s', borderRadius: '34px' 
                                }}>
                                    <span style={{
                                        position: 'absolute', content: '""', height: '18px', width: '18px', 
                                        left: !isSidebarDetached ? '28px' : '4px', bottom: '4px', backgroundColor: 'white', 
                                        transition: '.4s', borderRadius: '50%'
                                    }}></span>
                                </span>
                            </label>
                        </div>

                        {/* UI Scaling / Co giãn tùy chọn */}
                        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '15px' }}>
                            <Tooltip text="Tự động hoặc thủ công điều chỉnh kích thước của các thành phần giao diện để phù hợp với màn hình của bạn." title="Hướng dẫn Co giãn" icon={<Icons.ScalingIcon />}>
                                <div style={{ fontWeight: 600, marginBottom: '10px', fontSize: '0.9rem', color: 'var(--text)' }}>
                                    Co giãn Tỷ lệ giao diện
                                </div>
                            </Tooltip>
                            
                            {/* Toggle Auto Scaling */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Tự động co giãn theo màn hình</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Tự động tối ưu giao diện theo kích thước trình duyệt</div>
                                </div>
                                <label className="switch-toggle" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={uiScaleMode === 'auto'} 
                                        onChange={(e) => setUiScaleMode(e.target.checked ? 'auto' : 'manual')}
                                        style={{ opacity: 0, width: 0, height: 0 }}
                                    />
                                    <span className="slider" style={{ 
                                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                                        backgroundColor: uiScaleMode === 'auto' ? 'var(--accent-color)' : '#ccc', 
                                        transition: '.4s', borderRadius: '34px' 
                                    }}>
                                        <span style={{
                                            position: 'absolute', content: '""', height: '18px', width: '18px', 
                                            left: uiScaleMode === 'auto' ? '28px' : '4px', bottom: '4px', backgroundColor: 'white', 
                                            transition: '.4s', borderRadius: '50%'
                                        }}></span>
                                    </span>
                                </label>
                            </div>

                            {/* Manual Scale Slider (only active if mode is manual) */}
                            {uiScaleMode === 'manual' && (
                                <div className="animate-fadeIn">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                                        <span>Tỷ lệ hiển thị thủ công</span>
                                        <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>{Math.round(uiScaleValue * 100)}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0.75" 
                                        max="1.25" 
                                        step="0.05"
                                        value={uiScaleValue} 
                                        onChange={(e) => setUiScaleValue(parseFloat(e.target.value))}
                                        style={{ 
                                            width: '100%', 
                                            accentColor: 'var(--accent-color)',
                                            background: 'var(--color-brand-progress-bg)'
                                        }} 
                                    />
                                </div>
                            )}
                            
                            <div style={{ marginTop: '10px', fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Icons.SparklesIcon size={12} style={{ color: isDark ? 'white' : 'var(--text)' }} />
                                <span>Tỷ lệ hiển thị hiện tại: <strong>{Math.round(currentUiScale * 100)}%</strong></span>
                            </div>
                        </div>

                        
                    </div>

                    {/* Cài đặt Phông chữ / Font Settings */}
                    <div className="settings-section animate-fadeIn" style={{ 
                        background: 'var(--settings-section-bg, rgba(255,255,255,0.1))', 
                        backdropFilter: 'blur(30px)',
                        border: '1px solid var(--settings-section-border, rgba(255,255,255,0.2))', 
                        borderRadius: '16px', 
                        padding: '20px',
                        boxShadow: 'var(--settings-section-shadow, 0 8px 32px rgba(0,0,0,0.1))'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Icons.SparklesIcon size={20} style={{ color: isDark ? 'white' : 'var(--text)' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: isDark ? 'white' : 'var(--text)', display: 'flex', alignItems: 'center' }}>
                                    Cài đặt Phông chữ
                                    <SettingsHelpTooltip 
                                        title="Hướng dẫn Phông chữ" 
                                        text="Thay đổi phông chữ và kích thước của từng thành phần văn bản trên giao diện bao gồm Tiêu đề chính, Tiêu đề thẻ, Văn bản nội dung và Danh mục Menu để đạt độ rõ nét tốt nhất cho đôi mắt của bạn." 
                                        isDark={isDark} 
                                    />
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleSaveSection('font')}
                                style={{
                                    padding: '6px 16px',
                                    fontSize: '15px',
                                    borderRadius: '999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.3s ease',
                                    minWidth: '110px',
                                    justifyContent: 'center',
                                    fontWeight: '600',
                                    background: 'var(--card-bg, rgba(255, 255, 255, 0.05))',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
                                    color: 'var(--text-primary, inherit)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }}
                                className="glass-panel-hover"
                            >
                                {savedSection === 'font' ? (
                                    <>
                                        <Icons.CheckIcon size={14} />
                                        Đã lưu ✓
                                    </>
                                ) : (
                                    <>
                                        <Icons.SaveIcon size={14} />
                                        Lưu lại
                                    </>
                                )}
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {[
                                { label: 'Kích thước chữ Hệ thống', value: globalFontSize, setter: setGlobalFontSize, min: 12, max: 24 },
                                { label: 'Khoảng cách dòng', value: globalLineHeight, setter: setGlobalLineHeight, min: 1.2, max: 2.2, step: 0.1 },
                                { label: 'Kích thước Tiêu đề chính', value: sidebarFontSize, setter: setSidebarFontSize, min: 24, max: 80 },
                                { label: 'Kích thước Tiêu đề thẻ', value: cardTitleFontSize, setter: setCardTitleFontSize, min: 14, max: 32 },
                                { label: 'Kích thước Văn bản nội dung', value: contentFontSize, setter: setContentFontSize, min: 12, max: 20 },
                                { label: 'Kích thước Danh mục Menu', value: menuItemFontSize, setter: setMenuItemFontSize, min: 10, max: 18 }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</div>
                                    <select 
                                        value={item.value} 
                                        onChange={(e) => item.setter(parseInt(e.target.value))}
                                        style={{ 
                                            padding: '6px 12px', 
                                            borderRadius: '999px', 
                                            background: 'rgba(255, 255, 255, 0.05)', 
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            color: 'var(--text)',
                                            fontSize: '0.85rem',
                                            outline: 'none'
                                        }}
                                    >
                                        {Array.from({ length: item.max - item.min + 1 }, (_, i) => item.min + i).map(size => (
                                            <option key={size} value={size}>{size}px</option>
                                        ))}
                                    </select>
                                </div>
                            ))}

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px', marginTop: '5px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    <span style={{ fontWeight: 500 }}>Khoảng cách dòng</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{globalLineHeight.toFixed(1)}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" max="2.5" step="0.1" 
                                    value={globalLineHeight} 
                                    onChange={(e) => setGlobalLineHeight(parseFloat(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--accent-color)' }}
                                />
                            </div>

                            
                        </div>
                    </div>

                    {/* Cài đặt Hình nền / Wallpaper Settings */}
                    <div className="settings-section animate-fadeIn" style={{ 
                        background: 'var(--settings-section-bg, rgba(255,255,255,0.1))', 
                        backdropFilter: 'blur(30px)',
                        border: '1px solid var(--settings-section-border, rgba(255,255,255,0.2))', 
                        borderRadius: '16px', 
                        padding: '20px',
                        boxShadow: 'var(--settings-section-shadow, 0 8px 32px rgba(0,0,0,0.1))'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Icons.PhotoIcon size={20} style={{ color: isDark ? 'white' : 'var(--text)' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: isDark ? 'white' : 'var(--text)', display: 'flex', alignItems: 'center' }}>
                                    Hình nền hệ thống
                                    <SettingsHelpTooltip 
                                        title="Hướng dẫn Hình nền" 
                                        text="Trang hoàng không gian làm việc của bạn bằng 3 loại hình nền: Hiệu ứng CSS động, Hình ảnh tối giản thanh lịch hoặc Video Động chất lượng cao để tăng thêm cảm hứng sáng tạo." 
                                        isDark={isDark} 
                                    />
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleSaveSection('wallpaper')}
                                style={{
                                    padding: '6px 16px',
                                    fontSize: '15px',
                                    borderRadius: '999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.3s ease',
                                    minWidth: '110px',
                                    justifyContent: 'center',
                                    fontWeight: '600',
                                    background: 'var(--card-bg, rgba(255, 255, 255, 0.05))',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
                                    color: 'var(--text-primary, inherit)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }}
                                className="glass-panel-hover"
                            >
                                {savedSection === 'wallpaper' ? (
                                    <>
                                        <Icons.CheckIcon size={14} />
                                        Đã lưu ✓
                                    </>
                                ) : (
                                    <>
                                        <Icons.SaveIcon size={14} />
                                        Lưu lại
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Tabs for wallpaper types */}
                        <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '12px', marginBottom: '15px', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)' }}>
                            {(['css', 'image', 'video'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setWallpaperTab(tab)}
                                    style={{
                                        flex: 1,
                                        padding: '8px 4px',
                                        borderRadius: '999px',
                                        fontSize: '0.9rem',
                                        fontWeight: 700,
                                        fontFamily: "'Play', sans-serif",
                                        background: wallpaperTab === tab ? 'rgba(var(--accent-color-rgb), 0.25)' : 'transparent',
                                        backdropFilter: wallpaperTab === tab ? 'blur(10px)' : 'none',
                                        color: wallpaperTab === tab ? 'var(--text)' : 'var(--text-secondary)',
                                        border: wallpaperTab === tab ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: wallpaperTab === tab ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
                                    }}
                                >
                                    {tab === 'css' && 'Hiệu ứng CSS'}
                                    {tab === 'image' && 'Hình ảnh'}
                                    {tab === 'video' && 'Video Động'}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Thêm hình nền ({wallpaperTab === 'css' ? 'CSS Code' : wallpaperTab === 'image' ? 'Link hình' : 'Link video'}):</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Tên hiển thị..." 
                                    value={newWallpaperName}
                                    onChange={e => setNewWallpaperName(e.target.value)}
                                    style={{ flex: 1, padding: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text)', fontSize: '0.85rem' }} 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Giá trị (CSS / URL)..." 
                                    value={newWallpaperUrl}
                                    onChange={e => setNewWallpaperUrl(e.target.value)}
                                    style={{ flex: 2, padding: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text)', fontSize: '0.85rem' }} 
                                />
                                <button 
                                    onClick={handleAddWallpaper}
                                    style={{ padding: '0 12px', borderRadius: '999px', background: 'var(--accent-color)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontFamily: "'Play', sans-serif" }}
                                >Thêm</button>
                            </div>
                        </div>

                        {/* Wallpaper Thumbnails list */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }} className="no-scrollbar">
                            {wallpaperTab === 'css' && [...CSS_WALLPAPERS, ...customCssWallpapers].map((wp) => {
                                const isSelected = wallpaper === wp.value;
                                return (
                                    <button
                                        key={wp.id}
                                        onClick={() => setWallpaper(wp.value)}
                                        style={{
                                            border: '1px solid',
                                            borderColor: isSelected ? 'rgba(var(--accent-color-rgb), 0.3)' : 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            padding: '6px',
                                            background: isSelected ? 'rgba(var(--accent-color-rgb), 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            textAlign: 'left',
                                            transition: 'all 0.3s ease',
                                            transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                                            boxShadow: 'none',
                                        }}
                                    >
                                        <div style={{
                                            aspectRatio: '16/9',
                                            borderRadius: '8px',
                                            marginBottom: '6px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            background: wp.value === 'gradient' ? 'linear-gradient(135deg, var(--accent-color) 0%, rgba(20,25,50,0.9) 100%)' : 
                                                        wp.value.startsWith('linear-gradient') || wp.value.startsWith('conic-gradient') ? wp.value : '#111322'
                                        }}>
                                            {wp.value === 'orbiting-planets' && (
                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0b1e' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.2)', position: 'relative', animation: 'spin 10s linear infinite' }}>
                                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)', position: 'absolute', top: '0', left: '50%', marginLeft: '-3px' }}></div>
                                                    </div>
                                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)', position: 'absolute' }}></div>
                                                </div>
                                            )}
                                            {wp.value === 'aurora-dream' && (
                                                <div style={{ position: 'absolute', inset: 0, background: '#020617', overflow: 'hidden' }}>
                                                    <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '60px', height: '60px', background: '#3b82f6', filter: 'blur(15px)', opacity: 0.4, borderRadius: '50%' }}></div>
                                                    <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '60px', height: '60px', background: '#8b5cf6', filter: 'blur(15px)', opacity: 0.4, borderRadius: '50%' }}></div>
                                                    <div style={{ position: 'absolute', top: '20px', right: '10px', width: '30px', height: '30px', background: '#ec4899', filter: 'blur(10px)', opacity: 0.3, borderRadius: '50%' }}></div>
                                                </div>
                                            )}
                                            {wp.value === 'apple-glass' && (
                                                <div style={{ position: 'absolute', inset: 0, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #3b82f6, #ec4899)', borderRadius: '50%', position: 'absolute', top: '10px', left: '10px', opacity: 0.2 }}></div>
                                                    <div style={{ width: '100%', height: '100%', backdropFilter: 'blur(4px)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px' }}></div>
                                                </div>
                                            )}
                                            {wp.value === 'dotted-pattern' && (
                                                <div style={{ position: 'absolute', inset: 0, background: '#f8fafc', backgroundImage: 'radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                                            )}
                                            {wp.value === 'dark-dotted-pattern' && (
                                                <div style={{ position: 'absolute', inset: 0, background: '#0a0b10', backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                                            )}
                                            {wp.value === 'gemini-ai' && (
                                                <div style={{ position: 'absolute', inset: 0, background: '#05060f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(225deg, #7a22ff, #00d2ff, #ffbb00)', opacity: 0.6, filter: 'blur(15px)' }}></div>
                                                    <div style={{ position: 'absolute', width: '30px', height: '30px', background: 'white', borderRadius: '50%', filter: 'blur(8px)', opacity: 0.3 }}></div>
                                                </div>
                                            )}
                                            {wp.value === 'glassmorphism-effect' && (
                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <div style={{ width: '30px', height: '30px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', position: 'absolute', top: '10px', left: '10px', filter: 'blur(5px)' }}></div>
                                                    <div style={{ width: '40px', height: '40px', background: 'var(--accent-color)', borderRadius: '50%', position: 'absolute', bottom: '5px', right: '5px', opacity: 0.3, filter: 'blur(10px)' }}></div>
                                                    <div style={{ width: '100%', height: '100%', backdropFilter: 'blur(3px)', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                                                </div>
                                            )}
                                            {wp.value === 'ai-blob' && (
                                                <div style={{ position: 'absolute', inset: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <div style={{ width: '50px', height: '50px', background: 'linear-gradient(45deg, #3b82f6, #a855f7)', borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', animation: 'blob-spin 5s linear infinite', opacity: 0.6, filter: 'blur(8px)' }}></div>
                                                </div>
                                            )}
                                            {isSelected && (
                                                <div style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>✓</div>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '15px', fontWeight: 600, padding: '0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isSelected ? 'var(--accent-color)' : 'var(--text)' }}>
                                            {wp.name}
                                        </div>
                                    </button>
                                );
                            })}



                            {wallpaperTab === 'image' && [...IMAGE_WALLPAPERS, ...customImgWallpapers].map((wp) => {
                                const isSelected = wallpaper === wp.value;
                                return (
                                    <button
                                        key={wp.id}
                                        onClick={() => setWallpaper(wp.value)}
                                        style={{
                                            border: '1px solid',
                                            borderColor: isSelected ? 'rgba(var(--accent-color-rgb), 0.3)' : 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            padding: '6px',
                                            background: isSelected ? 'rgba(var(--accent-color-rgb), 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            textAlign: 'left',
                                            transition: 'all 0.3s ease',
                                            transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                                            boxShadow: 'none',
                                        }}
                                    >
                                        <div style={{
                                            aspectRatio: '16/9',
                                            borderRadius: '8px',
                                            marginBottom: '6px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}>
                                            <img 
                                                src={wp.value} 
                                                alt={wp.name} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                referrerPolicy="no-referrer"
                                            />
                                            {isSelected && (
                                                <div style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>✓</div>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '15px', fontWeight: 600, padding: '0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isSelected ? 'var(--accent-color)' : 'var(--text)' }}>
                                            {wp.name}
                                        </div>
                                    </button>
                                );
                            })}

                            {wallpaperTab === 'video' && [...VIDEO_WALLPAPERS, ...customVidWallpapers].map((wp) => {
                                const isSelected = wallpaper === wp.value;
                                return (
                                    <button
                                        key={wp.id}
                                        onClick={() => setWallpaper(wp.value)}
                                        style={{
                                            border: '1px solid',
                                            borderColor: isSelected ? 'rgba(var(--accent-color-rgb), 0.3)' : 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: '12px',
                                            padding: '6px',
                                            background: isSelected ? 'rgba(var(--accent-color-rgb), 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                            backdropFilter: 'blur(10px)',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            textAlign: 'left',
                                            transition: 'all 0.3s ease',
                                            transform: isSelected ? 'scale(0.98)' : 'scale(1)',
                                            boxShadow: 'none',
                                        }}
                                    >
                                        <div style={{
                                            aspectRatio: '16/9',
                                            borderRadius: '8px',
                                            marginBottom: '6px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            background: '#050508'
                                        }}>
                                            <video 
                                                src={wp.value} 
                                                muted 
                                                loop 
                                                playsInline 
                                                autoPlay 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                                            />
                                            <div style={{ position: 'absolute', left: '6px', bottom: '6px', padding: '2px 4px', background: 'rgba(0,0,0,0.6)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '8px', color: 'var(--text)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                                <Icons.PlayIcon size={8} /> LIVE
                                            </div>
                                            {isSelected && (
                                                <div style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', zIndex: 10 }}>✓</div>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '15px', fontWeight: 600, padding: '0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isSelected ? 'var(--accent-color)' : 'var(--text)' }}>
                                            {wp.name}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        
                    </div>

                    {/* Cài đặt Độ trong suốt / Transparency Settings */}
                    <div className="settings-section animate-fadeIn" style={{ 
                        background: 'var(--settings-section-bg, rgba(255,255,255,0.1))', 
                        backdropFilter: 'blur(30px)',
                        border: '1px solid var(--settings-section-border, rgba(255,255,255,0.2))', 
                        borderRadius: '16px', 
                        padding: '20px',
                        boxShadow: 'var(--settings-section-shadow, 0 8px 32px rgba(0,0,0,0.1))'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Icons.LayersIcon size={20} style={{ color: isDark ? 'white' : 'var(--text)' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: isDark ? 'white' : 'var(--text)', display: 'flex', alignItems: 'center' }}>
                                    Cài đặt thẻ & Độ trong suốt
                                    <SettingsHelpTooltip 
                                        title="Hướng dẫn Độ trong suốt" 
                                        text="Điều chỉnh độ mờ đục và trong suốt của các thành phần giao diện (Thẻ nội dung, Sidebar, Hình nền, ...) để tạo hiệu ứng phủ kính mờ (Glassmorphism) hoàn hảo phù hợp với từng thiết bị." 
                                        isDark={isDark} 
                                    />
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleSaveSection('transparency')}
                                style={{
                                    padding: '6px 16px',
                                    fontSize: '15px',
                                    borderRadius: '999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.3s ease',
                                    minWidth: '110px',
                                    justifyContent: 'center',
                                    fontWeight: '600',
                                    background: 'var(--card-bg, rgba(255, 255, 255, 0.05))',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
                                    color: 'var(--text-primary, inherit)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }}
                                className="glass-panel-hover"
                            >
                                {savedSection === 'transparency' ? (
                                    <>
                                        <Icons.CheckIcon size={14} />
                                        Đã lưu ✓
                                    </>
                                ) : (
                                    <>
                                        <Icons.SaveIcon size={14} />
                                        Lưu lại
                                    </>
                                )}
                            </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <span>Chọn hình thức trong suốt</span>
                            <select 
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === 'super-light') {
                                        setCardOpacity(0.1);
                                        setSidebarOpacity(0.1);
                                        setGridCardOpacity(0.15);
                                        setContentOpacity(0.01);
                                        setLayoutOpacity(0.02);
                                    } else if (val === 'light') {
                                        setCardOpacity(0.2);
                                        setSidebarOpacity(0.2);
                                        setGridCardOpacity(0.25);
                                        setContentOpacity(0.03);
                                        setLayoutOpacity(0.05);
                                    } else if (val === 'medium') {
                                        setCardOpacity(0.4);
                                        setSidebarOpacity(0.4);
                                        setGridCardOpacity(0.45);
                                        setContentOpacity(0.1);
                                        setLayoutOpacity(0.07);
                                    } else if (val === 'high') {
                                        setCardOpacity(0.05);
                                        setSidebarOpacity(0.1);
                                        setGridCardOpacity(0.1);
                                        setContentOpacity(0.02);
                                        setLayoutOpacity(0.01);
                                    } else if (val === 'opaque') {
                                        setCardOpacity(0.8);
                                        setSidebarOpacity(0.8);
                                        setGridCardOpacity(0.85);
                                        setContentOpacity(0.2);
                                        setLayoutOpacity(0.1);
                                    } else {
                                        handleResetTransparency();
                                    }
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                style={{ 
                                    background: 'rgba(255, 255, 255, 0.05)', 
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)', 
                                    color: 'var(--text)',
                                    borderRadius: '999px',
                                    padding: '6px 12px',
                                    outline: 'none',
                                    maxWidth: '150px',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="default">Mặc định</option>
                                <option value="super-light">Siêu mờ</option>
                                <option value="light">Mờ nhẹ</option>
                                <option value="medium">Mờ trung bình</option>
                                <option value="high">Trong suốt cao</option>
                                <option value="opaque">Đục (Opaque)</option>
                            </select>
                        </div>

                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Card Opacity */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                                    <span style={{ fontWeight: 500 }}>Độ mờ thẻ (Cards)</span>
                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{Math.round(cardOpacity * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0.05" max="0.95" step="0.05" 
                                    value={cardOpacity} 
                                    onChange={(e) => setCardOpacity(parseFloat(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
                                />
                            </div>

                            {/* Sidebar Opacity */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                                    <span style={{ fontWeight: 500 }}>Thanh bên (Sidebar)</span>
                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{Math.round(sidebarOpacity * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0.05" max="0.95" step="0.05" 
                                    value={sidebarOpacity} 
                                    onChange={(e) => setSidebarOpacity(parseFloat(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
                                />
                            </div>

                            {/* Grid Card Opacity */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                                    <span style={{ fontWeight: 500 }}>Thẻ dạng lưới (Grid Cards)</span>
                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{Math.round(gridCardOpacity * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0.05" max="0.95" step="0.05" 
                                    value={gridCardOpacity} 
                                    onChange={(e) => setGridCardOpacity(parseFloat(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
                                />
                            </div>

                            {/* Content Opacity */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                                    <span style={{ fontWeight: 500 }}>Lớp nền nội dung</span>
                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{Math.round(contentOpacity * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0.0" max="0.5" step="0.01" 
                                    value={contentOpacity} 
                                    onChange={(e) => setContentOpacity(parseFloat(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
                                />
                            </div>

                            {/* Sub Component Opacity */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                                    <span style={{ fontWeight: 500 }}>Thành phần phụ (Sub-elements)</span>
                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{Math.round(subComponentOpacity * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0.1" max="1.0" step="0.05" 
                                    value={subComponentOpacity} 
                                    onChange={(e) => setSubComponentOpacity(parseFloat(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--accent-color)', cursor: 'pointer' }}
                                />
                            </div>
                        </div>

                        
                    </div>

                                        {/* Quản lý Dữ liệu / Data Management */}
                    <div className="settings-section animate-fadeIn" style={{ 
                        background: 'var(--settings-section-bg, rgba(255,255,255,0.1))', 
                        backdropFilter: 'blur(30px)',
                        border: '1px solid var(--settings-section-border, rgba(255,255,255,0.2))', 
                        borderRadius: '16px', 
                        padding: '20px',
                        boxShadow: 'var(--settings-section-shadow, 0 8px 32px rgba(0,0,0,0.1))'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Icons.DatabaseIcon size={20} style={{ color: isDark ? 'white' : 'var(--text)' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0, color: isDark ? 'white' : 'var(--text)', display: 'flex', alignItems: 'center' }}>
                                    Quản lý Dữ liệu
                                    <SettingsHelpTooltip 
                                        title="Hướng dẫn Quản lý Dữ liệu"
                                        text="Cho phép xuất toàn bộ thiết lập giao diện cá nhân ra tệp tin định dạng JSON hoặc tải xuống báo cáo tổng hợp thông tin cá nhân và hành trình sự nghiệp chất lượng cao định dạng tệp văn bản .txt."
                                        isDark={isDark}
                                    />
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={handleUpdateSettings}
                                style={{
                                    padding: '6px 16px',
                                    fontSize: '15px',
                                    borderRadius: '999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.3s ease',
                                    justifyContent: 'center',
                                    fontWeight: '600',
                                    background: 'var(--card-bg, rgba(255, 255, 255, 0.05))',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid var(--glass-border, rgba(255, 255, 255, 0.1))',
                                    color: 'var(--text-primary, inherit)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }}
                                className="glass-panel-hover"
                            >
                                <Icons.SaveIcon size={14} /> Cập nhật dữ liệu
                            </button>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                            Xuất tất cả dữ liệu cài đặt và nội dung của website để lưu trữ.
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '10px' }}>
                            <GlassButton 
                                className="!px-3 !py-3 !text-[13px] hover:!bg-white/10"
                                style={{ justifyContent: 'center', height: '100%', borderRadius: '999px' }}
                                onClick={() => {
                                    const data = JSON.stringify(localStorage, null, 2);
                                    const blob = new Blob([data], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'website-data-export.json';
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}>
                                    <Icons.DownloadIcon size={18} /> Xuất JSON Cài đặt
                                </span>
                            </GlassButton>
                            <GlassButton 
                                className="!px-3 !py-3 !text-[13px] border-indigo-500/30 hover:!bg-white/10"
                                style={{ justifyContent: 'center', height: '100%', borderRadius: '999px' }}
                                onClick={exportAllDataToText}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}>
                                    <Icons.FileTextIcon size={18} /> Xuất Thông tin Cá nhân (.txt)
                                </span>
                            </GlassButton>
                            <GlassButton 
                                className="!px-3 !py-3 !text-[13px] border-purple-500/30 hover:!bg-white/10"
                                style={{ justifyContent: 'center', height: '100%', borderRadius: '999px' }}
                                onClick={exportPromptsToText}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}>
                                    <Icons.FileTextIcon size={18} /> Xuất Prompt Website
                                </span>
                            </GlassButton>
                            <GlassButton 
                                className="!px-3 !py-3 !text-[13px] border-red-500/30 hover:!bg-red-500/20"
                                style={{ justifyContent: 'center', height: '100%', borderRadius: '999px', color: '#ef4444' }}
                                onClick={() => alert('Chức năng đang phát triển')}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}>
                                    <Icons.TrashIcon size={18} /> Xóa Dữ liệu
                                </span>
                            </GlassButton>
                        </div>
                    </div>

                    {/* Main Save Button removed from bottom as it is moved to header */}
                </div>


            </div>
        </PageLayout>
    );
};
export default SettingsPage;
