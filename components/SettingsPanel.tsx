import React, { useEffect, useState } from 'react';
import { useI18n } from '../contexts/i18n';
import { useTheme, ACCENT_COLORS } from '../contexts/ThemeContext';
import PageLayout from './PageLayout';
import * as Icons from './Icons';
import CardTitle from './CardTitle';
import { useSpeechSynthesis } from './useSpeechSynthesis';

interface SettingsPageProps {
    id?: string;
}

const CSS_WALLPAPERS = [
    { id: 'gradient', name: 'Mặc định (Gradient)', value: 'gradient' },
    { id: 'orbiting-planets', name: 'Hành tinh Quỹ đạo', value: 'orbiting-planets' },
    { id: 'dotted-pattern', name: 'Hạt chấm Dotted', value: 'dotted-pattern' },
    { id: 'dark-dotted-pattern', name: 'Dotted Tối', value: 'dark-dotted-pattern' },
    { id: 'gemini-ai', name: 'Cảm hứng Gemini AI', value: 'gemini-ai' },
    { id: 'glassmorphism-effect', name: 'Kính mờ Glassmorphism', value: 'glassmorphism-effect' },
    { id: 'soft-pastel-gradient', name: 'Pastel nhẹ nhàng', value: 'soft-pastel-gradient' },
    { id: 'apple-glass', name: 'Apple Glass', value: 'apple-glass' },
    { id: 'glass-fluent-hybrid', name: 'Glass Fluent Hybrid', value: 'glass-fluent-hybrid' },
    { id: 'material-design-3', name: 'Material Design 3', value: 'material-design-3' },
    { id: 'neumorphism', name: 'Neumorphism (Soft UI)', value: 'neumorphism' }
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

const SettingsPage: React.FC<SettingsPageProps> = ({ id }) => {
    const { t } = useI18n();
    const {
        isSoundOn, setSoundOn,
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
        resetToDefault
    } = useTheme();
    const { voices, speak, cancel, isSpeaking } = useSpeechSynthesis();

    const [genderPreferred, setGenderPreferred] = useState<string>(() => {
        return (typeof window !== 'undefined' ? localStorage.getItem('aiVoiceGenderPreferred') : 'female') || 'female';
    });

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
    
    const pageData = t.settingsPage || { badge: 'Cài đặt' };

    return (
        <PageLayout id={id}>
            <div className="info-card is-settings flex flex-col h-full" style={{ padding: '15px' }}>
                <div className="about-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <CardTitle
                        icon={<Icons.SettingsIcon />}
                        text={pageData.badge || 'Cài đặt'}
                        tooltipTitle={pageData.tooltipTitle}
                        tooltipText={pageData.tooltipText}
                    />
                </div>
                
                <div className="settings-content no-scrollbar" style={{ overflowY: 'auto', flex: 1, paddingRight: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
                    
                    {/* Tính năng Âm thanh / Sound Features */}
                    <div className="settings-section" style={{ 
                        background: 'rgba(255,255,255,0.60)', 
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255,255,255,0.30)', 
                        borderRadius: '16px', 
                        padding: '20px',
                        boxShadow: '0 20px 60px rgba(130,130,255,.15)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <Icons.SpeakerWaveIcon size={20} style={{ color: 'var(--accent-color)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                                Tính năng Âm thanh
                            </h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(128,128,128,0.1)' }}>
                            <div>
                                <div style={{ fontWeight: 500 }}>Bật/Tắt âm thanh</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-brand-text-secondary)', marginTop: '4px' }}>
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
                    </div>

                    {/* Giọng nói AI / AI Voice Features */}
                    <div className="settings-section" style={{ 
                        background: 'rgba(255,255,255,0.60)', 
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255,255,255,0.30)', 
                        borderRadius: '16px', 
                        padding: '20px',
                        boxShadow: '0 20px 60px rgba(130,130,255,.15)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <Icons.BotIcon size={20} style={{ color: 'var(--accent-color)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                                Giọng nói AI
                            </h3>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(128,128,128,0.1)' }}>
                            <div>
                                <div style={{ fontWeight: 500 }}>Bật/Tắt Giọng nói AI</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-brand-text-secondary)', marginTop: '4px' }}>
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
                                    <div style={{ fontWeight: 500, marginBottom: '8px', fontSize: '0.9rem' }}>
                                        Chọn giọng đọc
                                    </div>
                                    <select 
                                        value={selectedAiVoiceName} 
                                        onChange={(e) => setSelectedAiVoiceName(e.target.value)}
                                        style={{ 
                                            width: '100%', padding: '10px', borderRadius: '8px', 
                                            background: 'var(--color-brand-progress-bg)', 
                                            border: '1px solid var(--border-color)',
                                            color: 'var(--color-brand-text-primary)',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="">-- Tự động (Đề xuất) --</option>
                                        <option value="Google Translate TTS (gTTS)">Google Translate TTS (gTTS)</option>
                                        {voices.map(voice => (
                                            <option key={voice.name} value={voice.name}>
                                                {voice.name} ({voice.lang})
                                            </option>
                                        ))}
                                    </select>
                                    {selectedAiVoiceName === "" && (
                                        <div style={{ marginTop: '10px' }}>
                                            <div style={{ fontWeight: 500, marginBottom: '6px', fontSize: '0.85rem', color: 'var(--color-brand-text-secondary)' }}>
                                                Giới tính giọng đọc (Đề xuất)
                                            </div>
                                            <select 
                                                value={genderPreferred} 
                                                onChange={(e) => handleGenderChange(e.target.value)}
                                                style={{ 
                                                    width: '100%', padding: '8px 10px', borderRadius: '8px', 
                                                    background: 'var(--color-brand-progress-bg)', 
                                                    border: '1px solid var(--border-color)',
                                                    color: 'var(--color-brand-text-primary)',
                                                    outline: 'none',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                <option value="female">Giọng Nữ</option>
                                                <option value="male">Giọng Nam</option>
                                                <option value="any">Bất kỳ / Mặc định</option>
                                            </select>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleTestVoice}
                                        type="button"
                                        style={{
                                            marginTop: '10px',
                                            width: '100%',
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            background: isSpeaking ? 'var(--danger, #FF6B81)' : 'var(--accent-color, #8A5CF6)',
                                            color: '#ffffff',
                                            border: 'none',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            transition: 'all 0.2s ease',
                                            boxShadow: '0 4px 12px rgba(138, 92, 246, 0.15)'
                                        }}
                                    >
                                        {isSpeaking ? (
                                            <>
                                                <Icons.SpeakerOffIcon size={16} />
                                                Dừng nghe thử
                                            </>
                                        ) : (
                                            <>
                                                <Icons.SpeakerWaveIcon size={16} />
                                                Nghe thử giọng nói
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                        <span style={{ fontWeight: 500 }}>Tốc độ đọc</span>
                                        <span style={{ color: 'var(--color-brand-text-secondary)' }}>{aiVoiceRate.toFixed(1)}x</span>
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
                                        <span style={{ color: 'var(--color-brand-text-secondary)' }}>{aiVoicePitch.toFixed(1)}</span>
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
                        background: 'rgba(255,255,255,0.60)', 
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255,255,255,0.30)', 
                        borderRadius: '16px', 
                        padding: '20px',
                        boxShadow: '0 20px 60px rgba(130,130,255,.15)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <Icons.PaletteIcon size={20} style={{ color: 'var(--accent-color)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                                Tính năng Màu sắc
                            </h3>
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
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                        border: '1.5px solid',
                                        borderColor: accentColorType === 'solid' ? 'var(--accent-color)' : 'var(--border-color)',
                                        background: accentColorType === 'solid' ? 'rgba(var(--accent-color-rgb), 0.1)' : 'transparent',
                                        color: accentColorType === 'solid' ? 'var(--accent-color)' : 'var(--color-brand-text-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        textAlign: 'center'
                                    }}
                                >
                                    Màu bình thường
                                </button>
                                <button
                                    onClick={() => setAccentColorType('gradient')}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 500,
                                        border: '1.5px solid',
                                        borderColor: accentColorType === 'gradient' ? 'var(--accent-color)' : 'var(--border-color)',
                                        background: accentColorType === 'gradient' ? 'rgba(var(--accent-color-rgb), 0.1)' : 'transparent',
                                        color: accentColorType === 'gradient' ? 'var(--accent-color)' : 'var(--color-brand-text-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        textAlign: 'center'
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
                                                    color: 'white',
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
                                        <div style={{ marginTop: '15px', fontSize: '0.85rem', color: 'var(--color-brand-text-secondary)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
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

                    {/* Thẻ Giao diện / Interface Card */}
                    <div className="settings-section animate-fadeIn" style={{ 
                        background: 'rgba(255,255,255,0.60)', 
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255,255,255,0.30)', 
                        borderRadius: '16px', 
                        padding: '20px',
                        boxShadow: '0 20px 60px rgba(130,130,255,.15)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <Icons.SparklesIcon size={20} style={{ color: 'var(--accent-color)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                                Thẻ Giao diện
                            </h3>
                        </div>

                        {/* Theme Preset Selection */}
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontWeight: 500, marginBottom: '8px', fontSize: '0.9rem' }}>
                                Chọn Giao diện
                            </div>
                            <select 
                                value={themePreset} 
                                onChange={(e) => setThemePreset(e.target.value as any)}
                                style={{ 
                                    width: '100%', padding: '10px', borderRadius: '8px', 
                                    background: 'var(--color-brand-progress-bg)', 
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--color-brand-text-primary)',
                                    outline: 'none'
                                }}
                            >
                                <option value="default">Default</option>
                                <option value="glass-fluent-hybrid">Glass Fluent Hybrid</option>
                                <option value="material-design-3">Material Design 3</option>
                                <option value="neumorphism">Neumorphism</option>
                                <option value="apple-human-interface">Apple Human Interface</option>
                                <option value="glassmorphism">Glassmorphism</option>
                                <option value="fluent-ui-2">Fluent UI 2</option>
                            </select>
                        </div>

                        {/* Sidebar Layout Options */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '12px', borderRadius: '12px', background: 'rgba(var(--accent-color-rgb), 0.05)', border: '1px solid rgba(var(--accent-color-rgb), 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Icons.LayersIcon size={18} style={{ color: 'var(--accent-color)' }} />
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Dính Sidebar</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-brand-text-secondary)' }}>
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

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', padding: '12px', borderRadius: '12px', background: 'rgba(var(--accent-color-rgb), 0.05)', border: '1px solid rgba(var(--accent-color-rgb), 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Icons.SparklesIcon size={18} style={{ color: 'var(--accent-color)' }} />
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Chế độ Glassmorphism</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-brand-text-secondary)' }}>Hiệu ứng kính mờ siêu thực</div>
                                </div>
                            </div>
                            <label className="switch-toggle" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                                <input 
                                    type="checkbox" 
                                    checked={isGlassEnabled} 
                                    onChange={(e) => {
                                        setIsGlassEnabled(e.target.checked);
                                        if (e.target.checked) {
                                            setCardOpacity(0.15);
                                            setSidebarOpacity(0.15);
                                            setGridCardOpacity(0.2);
                                            setContentOpacity(0.02);
                                            setLayoutOpacity(0.03);
                                            setSubComponentOpacity(0.6);
                                        }
                                    }} 
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

                        {isGlassEnabled && (
                            <div className="animate-fadeIn" style={{ fontSize: '0.75rem', color: 'var(--accent-color)', marginTop: '8px', padding: '8px', borderRadius: '8px', background: 'rgba(var(--accent-color-rgb), 0.1)', border: '1px dashed var(--accent-color)' }}>
                                <strong>Lưu ý Glassmorphism:</strong> Chế độ này tối ưu hiệu ứng kính mờ siêu thực. Hãy chọn hình nền có màu sắc sống động để đạt hiệu ứng tốt nhất.
                            </div>
                        )}

                        {/* UI Scaling / Co giãn tùy chọn */}
                        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '15px' }}>
                            <div style={{ fontWeight: 600, marginBottom: '10px', fontSize: '0.9rem', color: 'var(--color-brand-text-primary)' }}>
                                Co giãn Tỷ lệ giao diện
                            </div>
                            
                            {/* Toggle Auto Scaling */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>Tự động co giãn theo màn hình</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-brand-text-secondary)' }}>Tự động tối ưu giao diện theo kích thước trình duyệt</div>
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
                            
                            <div style={{ marginTop: '10px', fontSize: '0.72rem', color: 'var(--color-brand-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Icons.SparklesIcon size={12} style={{ color: 'var(--accent-color)' }} />
                                <span>Tỷ lệ hiển thị hiện tại: <strong>{Math.round(currentUiScale * 100)}%</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Cài đặt Hình nền / Wallpaper Settings */}
                    <div className="settings-section animate-fadeIn" style={{ 
                        background: 'rgba(255,255,255,0.60)', 
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255,255,255,0.30)', 
                        borderRadius: '16px', 
                        padding: '20px',
                        boxShadow: '0 20px 60px rgba(130,130,255,.15)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <Icons.PhotoIcon size={20} style={{ color: 'var(--accent-color)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                                Hình nền hệ thống
                            </h3>
                        </div>

                        {/* Tabs for wallpaper types */}
                        <div style={{ display: 'flex', background: 'var(--color-brand-progress-bg)', padding: '4px', borderRadius: '10px', marginBottom: '15px' }}>
                            {(['css', 'image', 'video'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setWallpaperTab(tab)}
                                    style={{
                                        flex: 1,
                                        padding: '8px 4px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        background: wallpaperTab === tab ? 'var(--card-bg)' : 'transparent',
                                        color: wallpaperTab === tab ? 'var(--accent-color)' : 'var(--color-brand-text-secondary)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        boxShadow: wallpaperTab === tab ? '0 2px-6px rgba(0,0,0,0.15)' : 'none',
                                    }}
                                >
                                    {tab === 'css' && 'Hiệu ứng CSS'}
                                    {tab === 'image' && 'Hình ảnh'}
                                    {tab === 'video' && 'Video Động'}
                                </button>
                            ))}
                        </div>

                        {/* Wallpaper Thumbnails list */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }} className="no-scrollbar">
                            {wallpaperTab === 'css' && CSS_WALLPAPERS.map((wp) => {
                                const isSelected = wallpaper === wp.value;
                                return (
                                    <button
                                        key={wp.id}
                                        onClick={() => setWallpaper(wp.value)}
                                        style={{
                                            border: '2.5px solid',
                                            borderColor: isSelected ? 'var(--accent-color)' : 'var(--border-color)',
                                            borderRadius: '12px',
                                            padding: '4px',
                                            background: 'var(--color-brand-progress-bg)',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            textAlign: 'left',
                                            transition: 'all 0.25s ease',
                                            transform: isSelected ? 'scale(0.97)' : 'scale(1)',
                                            boxShadow: isSelected ? '0 4px 12px rgba(var(--accent-color-rgb), 0.2)' : 'none',
                                        }}
                                    >
                                        <div style={{
                                            height: '70px',
                                            borderRadius: '8px',
                                            marginBottom: '6px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            background: wp.value === 'gradient' ? 'linear-gradient(135deg, var(--accent-color) 0%, rgba(20,25,50,0.9) 100%)' : '#111322'
                                        }}>
                                            {wp.value === 'orbiting-planets' && (
                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.3)', position: 'relative' }}>
                                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-color)', position: 'absolute', top: '2px', left: '2px' }}></div>
                                                    </div>
                                                </div>
                                            )}
                                            {wp.value === 'dotted-pattern' && (
                                                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                                            )}
                                            {wp.value === 'dark-dotted-pattern' && (
                                                <div style={{ position: 'absolute', inset: 0, background: '#0a0b10', backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                                            )}
                                            {wp.value === 'gemini-ai' && (
                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(225deg, #7a22ff, #00d2ff, #ffbb00)', opacity: 0.45, filter: 'blur(10px)' }}></div>
                                            )}
                                            {wp.value === 'glassmorphism-effect' && (
                                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)' }}></div>
                                                </div>
                                            )}
                                            {isSelected && (
                                                <div style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>✓</div>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isSelected ? 'var(--accent-color)' : 'var(--color-brand-text-primary)' }}>
                                            {wp.name}
                                        </div>
                                    </button>
                                );
                            })}



                            {wallpaperTab === 'image' && IMAGE_WALLPAPERS.map((wp) => {
                                const isSelected = wallpaper === wp.value;
                                return (
                                    <button
                                        key={wp.id}
                                        onClick={() => setWallpaper(wp.value)}
                                        style={{
                                            border: '2.5px solid',
                                            borderColor: isSelected ? 'var(--accent-color)' : 'var(--border-color)',
                                            borderRadius: '12px',
                                            padding: '4px',
                                            background: 'var(--color-brand-progress-bg)',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            textAlign: 'left',
                                            transition: 'all 0.25s ease',
                                            transform: isSelected ? 'scale(0.97)' : 'scale(1)',
                                            boxShadow: isSelected ? '0 4px 12px rgba(var(--accent-color-rgb), 0.2)' : 'none',
                                        }}
                                    >
                                        <div style={{
                                            height: '70px',
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
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isSelected ? 'var(--accent-color)' : 'var(--color-brand-text-primary)' }}>
                                            {wp.name}
                                        </div>
                                    </button>
                                );
                            })}

                            {wallpaperTab === 'video' && VIDEO_WALLPAPERS.map((wp) => {
                                const isSelected = wallpaper === wp.value;
                                return (
                                    <button
                                        key={wp.id}
                                        onClick={() => setWallpaper(wp.value)}
                                        style={{
                                            border: '2.5px solid',
                                            borderColor: isSelected ? 'var(--accent-color)' : 'var(--border-color)',
                                            borderRadius: '12px',
                                            padding: '4px',
                                            background: 'var(--color-brand-progress-bg)',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            textAlign: 'left',
                                            transition: 'all 0.25s ease',
                                            transform: isSelected ? 'scale(0.97)' : 'scale(1)',
                                            boxShadow: isSelected ? '0 4px 12px rgba(var(--accent-color-rgb), 0.2)' : 'none',
                                        }}
                                    >
                                        <div style={{
                                            height: '70px',
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
                                            <div style={{ position: 'absolute', left: '6px', bottom: '6px', padding: '2px 4px', background: 'rgba(0,0,0,0.6)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '8px', color: 'white', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                                <Icons.PlayIcon size={8} /> LIVE
                                            </div>
                                            {isSelected && (
                                                <div style={{ position: 'absolute', top: '6px', right: '6px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', zIndex: 10 }}>✓</div>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: isSelected ? 'var(--accent-color)' : 'var(--color-brand-text-primary)' }}>
                                            {wp.name}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cài đặt Độ trong suốt / Transparency Settings */}
                    <div className="settings-section animate-fadeIn" style={{ 
                        background: 'rgba(255,255,255,0.60)', 
                        backdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255,255,255,0.30)', 
                        borderRadius: '16px', 
                        padding: '20px',
                        boxShadow: '0 20px 60px rgba(130,130,255,.15)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <Icons.LayersIcon size={20} style={{ color: 'var(--accent-color)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                                Cài đặt thẻ & Độ trong suốt
                            </h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--color-brand-text-secondary)' }}>
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
                                    background: 'rgba(255,255,255,0.1)', 
                                    border: '1px solid rgba(255,255,255,0.2)', 
                                    color: 'var(--color-brand-text-primary)',
                                    outline: 'none',
                                    maxWidth: '150px'
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
                                    <span style={{ color: 'var(--color-brand-text-secondary)', fontWeight: 600 }}>{Math.round(cardOpacity * 100)}%</span>
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
                                    <span style={{ color: 'var(--color-brand-text-secondary)', fontWeight: 600 }}>{Math.round(sidebarOpacity * 100)}%</span>
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
                                    <span style={{ color: 'var(--color-brand-text-secondary)', fontWeight: 600 }}>{Math.round(gridCardOpacity * 100)}%</span>
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
                                    <span style={{ color: 'var(--color-brand-text-secondary)', fontWeight: 600 }}>{Math.round(contentOpacity * 100)}%</span>
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
                                    <span style={{ color: 'var(--color-brand-text-secondary)', fontWeight: 600 }}>{Math.round(subComponentOpacity * 100)}%</span>
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

                </div>
            </div>
        </PageLayout>
    );
};
export default SettingsPage;
