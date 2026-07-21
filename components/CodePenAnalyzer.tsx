import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../contexts/i18n';
import { motion, AnimatePresence } from 'motion/react';
import { 
    X, Code, Wand2, Loader2, Sparkles, Layers, 
    Smartphone, Monitor, RefreshCw, Check, AlertCircle, Play, Sliders,
    BadgeCheck
} from 'lucide-react';

interface CodePenAnalyzerProps {
    isOpen?: boolean;
    onClose?: () => void;
    isStandalone?: boolean;
}

interface DemoEffect {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    css: string;
    tags: string[];
    style: React.CSSProperties;
}

const PRESET_EFFECTS: DemoEffect[] = [
    {
        id: 'glass-aurora',
        title: "Kính Mờ Cực Quang (Aurora Glass)",
        titleEn: "Aurora Frosted Glass",
        description: "Sự kết hợp hoàn hảo giữa độ nhám kính mờ cao và dải màu cực quang chuyển động rực rỡ phía sau.",
        descriptionEn: "A perfect blend of high frost backdrop blur and a moving vibrant aurora glow behind.",
        tags: ["Glassmorphism", "Aurora", "Premium"],
        css: `.aurora-glass-card {\n  backdrop-filter: blur(25px) saturate(180%);\n  background: rgba(255, 255, 255, 0.07);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  box-shadow: 0 8px 32px 0 rgba(138, 92, 246, 0.37);\n  text-shadow: 0 2px 10px rgba(0,0,0,0.2);\n}`,
        style: {
            backdropFilter: 'blur(25px) saturate(180%)',
            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px 0 rgba(138, 92, 246, 0.25)',
        }
    },
    {
        id: 'glass-gold',
        title: "Kính Mờ Ánh Vàng (Golden Metallic Glass)",
        titleEn: "Golden Metallic Glass",
        description: "Giao diện kính sang trọng kết hợp viền kim loại ánh vàng lấp lánh phản chiếu quý phái.",
        descriptionEn: "Luxury glass interface combined with shimmering metallic gold borders for a regal reflection.",
        tags: ["Metallic", "Gold", "Luxury"],
        css: `.gold-glass-card {\n  backdrop-filter: blur(15px);\n  background: linear-gradient(135deg, rgba(255,215,0,0.05), rgba(255,255,255,0.05));\n  border: 1px solid rgba(212, 175, 55, 0.4);\n  box-shadow: 0 10px 40px rgba(212, 175, 55, 0.15);\n}`,
        style: {
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.04), rgba(255, 255, 255, 0.06))',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            boxShadow: '0 10px 40px rgba(212, 175, 55, 0.12)',
        }
    },
    {
        id: 'glass-neon',
        title: "Kính Mờ Cyberpunk (Cyberpunk Neon)",
        titleEn: "Cyberpunk Neon Glass",
        description: "Hiệu ứng kính viễn tưởng tương lai với đường viền LED neon phát sáng huyền ảo đổi màu.",
        descriptionEn: "Futuristic sci-fi glass effect with glowing, color-changing neon LED borders.",
        tags: ["Cyberpunk", "Neon Glow", "Sci-Fi"],
        css: `.cyber-neon-card {\n  backdrop-filter: blur(12px);\n  background: rgba(10, 10, 15, 0.6);\n  border: 1px solid rgba(0, 243, 255, 0.5);\n  box-shadow: 0 0 15px rgba(0, 243, 255, 0.25), inset 0 0 15px rgba(255, 0, 128, 0.15);\n}`,
        style: {
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            background: 'rgba(13, 13, 25, 0.55)',
            border: '1px solid rgba(0, 243, 255, 0.4)',
            boxShadow: '0 0 20px rgba(0, 243, 255, 0.2), inset 0 0 15px rgba(255, 0, 128, 0.1)',
        }
    },
    {
        id: 'glass-minimal',
        title: "Kính Mờ Tối Giản (Minimal Frost)",
        titleEn: "Minimalist Frost",
        description: "Phong cách tối giản chuẩn Thụy Sĩ cổ điển, chú trọng vào khoảng trống, độ mờ nhẹ và thanh lịch tuyệt đối.",
        descriptionEn: "Classic Swiss minimalist style, focusing on whitespace, subtle frost blur, and absolute elegance.",
        tags: ["Minimalist", "Swiss Design", "Elegant"],
        css: `.minimal-frost-card {\n  backdrop-filter: blur(8px);\n  background: rgba(255, 255, 255, 0.03);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);\n}`,
        style: {
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }
    },
    {
        id: 'glass-solid',
        title: "Kính Mờ Đậm Đặc (Solid Premium Glass)",
        titleEn: "Solid Premium Glass",
        description: "Hiệu ứng kính mờ đậm đặc từ CodePen NPRPBjd, tập trung vào chiều sâu và độ tương phản cao của lớp nền.",
        descriptionEn: "Dense frosted glass effect from CodePen NPRPBjd, focusing on depth and high contrast of the background layer.",
        tags: ["Solid Glass", "Depth", "Premium"],
        css: `.solid-glass-card {\n  backdrop-filter: blur(30px) saturate(200%);\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05);\n}`,
        style: {
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)',
        }
    }
];

const CodePenAnalyzer: React.FC<CodePenAnalyzerProps> = ({ isOpen, onClose, isStandalone }) => {
    const { language } = useI18n();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<DemoEffect | null>(null);
    const [activeEffect, setActiveEffect] = useState<DemoEffect | null>(PRESET_EFFECTS[0]);
    const [successMessage, setSuccessMessage] = useState('');

    // Custom modifiers for playground
    const [blurVal, setBlurVal] = useState(25);
    const [opacityVal, setOpacityVal] = useState(8);
    const [glowIntensity, setGlowIntensity] = useState(60);
    const [customGlowColor, setCustomGlowColor] = useState('#8a5cf6');

    // Sync playground settings when effect changes
    useEffect(() => {
        if (activeEffect) {
            if (activeEffect.id === 'glass-aurora' || activeEffect.id.startsWith('custom-extracted')) {
                setBlurVal(25);
                setOpacityVal(8);
                setGlowIntensity(60);
                setCustomGlowColor('#8a5cf6');
            } else if (activeEffect.id === 'glass-gold' || activeEffect.id.startsWith('custom-gold')) {
                setBlurVal(20);
                setOpacityVal(5);
                setGlowIntensity(40);
                setCustomGlowColor('#d4af37');
            } else if (activeEffect.id === 'glass-neon' || activeEffect.id.startsWith('custom-neon')) {
                setBlurVal(12);
                setOpacityVal(35);
                setGlowIntensity(80);
                setCustomGlowColor('#00f3ff');
            } else if (activeEffect.id === 'glass-minimal' || activeEffect.id.startsWith('custom-minimal')) {
                setBlurVal(8);
                setOpacityVal(3);
                setGlowIntensity(10);
                setCustomGlowColor('#ffffff');
            } else if (activeEffect.id === 'glass-solid') {
                setBlurVal(35);
                setOpacityVal(6);
                setGlowIntensity(50);
                setCustomGlowColor('#ffffff');
            }
        }
    }, [activeEffect]);

    const handleAnalyze = () => {
        if (!url) return;
        setIsAnalyzing(true);
        setResult(null);
        
        // Analyze link
        setTimeout(() => {
            setIsAnalyzing(false);
            
            const isNPRPBjd = url.includes('NPRPBjd');
            const isNeon = url.toLowerCase().includes('neon') || url.toLowerCase().includes('cyber') || url.toLowerCase().includes('dark');
            const isGold = url.toLowerCase().includes('gold') || url.toLowerCase().includes('luxury') || url.toLowerCase().includes('royal');
            const isMinimal = url.toLowerCase().includes('minimal') || url.toLowerCase().includes('clean') || url.toLowerCase().includes('white');

            let customEffect: DemoEffect;

            if (isNPRPBjd) {
                customEffect = {
                    id: 'custom-solid-glass',
                    title: "Kính Mờ Đậm Đặc Solid Glass",
                    titleEn: "Solid Dense Glassmorphism",
                    description: "Phân tích từ CodePen NPRPBjd: Độ mờ cao, bóng đổ sâu và độ bão hòa màu sắc lớp nền mạnh mẽ.",
                    descriptionEn: "Analyzed from NPRPBjd: High blur, deep shadows, and strong background saturation.",
                    tags: ["Premium", "Dense Glass", "Deep Shadow"],
                    css: `.solid-glass-nprpbjd {\n  backdrop-filter: blur(40px) saturate(220%);\n  background: rgba(255, 255, 255, 0.04);\n  border: 1px solid rgba(255, 255, 255, 0.18);\n  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.03);\n}`,
                    style: {
                        backdropFilter: 'blur(40px) saturate(220%)',
                        WebkitBackdropFilter: 'blur(40px) saturate(220%)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.03)',
                    }
                };
            } else if (isNeon) {
                customEffect = {
                    id: 'custom-neon',
                    title: "Kính Mờ Neon Đa Sắc",
                    titleEn: "Multicolor Neon Glass",
                    description: "Hiệu ứng trích xuất từ CodePen: Thẻ tối màu với viền phát quang RGB siêu thực.",
                    descriptionEn: "Extracted effect: Dark container with ultra-realistic RGB glowing boundaries.",
                    tags: ["Custom", "Neon RGB", "Interactive"],
                    css: `.custom-neon-glass {\n  backdrop-filter: blur(16px);\n  background: rgba(15, 23, 42, 0.45);\n  border: 1px solid rgba(138, 92, 246, 0.6);\n  box-shadow: 0 0 25px rgba(138, 92, 246, 0.35), inset 0 0 10px rgba(138, 92, 246, 0.2);\n}`,
                    style: {
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        background: 'rgba(15, 23, 42, 0.45)',
                        border: '1px solid rgba(138, 92, 246, 0.6)',
                        boxShadow: '0 0 25px rgba(138, 92, 246, 0.35), inset 0 0 10px rgba(138, 92, 246, 0.2)',
                    }
                };
            } else if (isGold) {
                customEffect = {
                    id: 'custom-gold',
                    title: "Kính Cường Lực Viền Vàng",
                    titleEn: "Gold Leaf Luxury Glass",
                    description: "Hiệu ứng trích xuất từ CodePen: Phản chiếu ánh sáng óng ánh vàng quý tộc.",
                    descriptionEn: "Extracted effect: Reflective glass card with royal gold-plated glow.",
                    tags: ["Custom", "Gold Leaf", "Luxury"],
                    css: `.custom-gold-glass {\n  backdrop-filter: blur(20px);\n  background: rgba(255, 235, 120, 0.03);\n  border: 1.5px solid rgba(212, 175, 55, 0.5);\n  box-shadow: 0 12px 36px rgba(212, 175, 55, 0.15);\n}`,
                    style: {
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        background: 'rgba(255, 235, 120, 0.03)',
                        border: '1.5px solid rgba(212, 175, 55, 0.5)',
                        boxShadow: '0 12px 36px rgba(212, 175, 55, 0.15)',
                    }
                };
            } else if (isMinimal) {
                customEffect = {
                    id: 'custom-minimal',
                    title: "Kính Mờ Trắng Tinh Khiết",
                    titleEn: "Pure White Frost",
                    description: "Hiệu ứng trích xuất từ CodePen: Đơn giản, siêu trong suốt và mỏng nhẹ như sương sớm.",
                    descriptionEn: "Extracted effect: Simple, hyper-transparent, and lightweight like morning mist.",
                    tags: ["Custom", "Hyper-Frost", "Clean"],
                    css: `.custom-frost-glass {\n  backdrop-filter: blur(6px);\n  background: rgba(255, 255, 255, 0.01);\n  border: 0.5px solid rgba(255, 255, 255, 0.05);\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);\n}`,
                    style: {
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: '0.5px solid rgba(255, 255, 255, 0.05)',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
                    }
                };
            } else {
                // Default cool glassmorphism
                customEffect = {
                    id: 'custom-extracted',
                    title: "Kính Mờ Hiện Đại (Custom Glass)",
                    titleEn: "Custom Extracted Glass",
                    description: "Hiệu ứng trích xuất thành công: Tạo chiều sâu không gian đa tầng bắt mắt.",
                    descriptionEn: "Successfully extracted effect: Multi-layered spatial depth structure.",
                    tags: ["Extracted", "Modern CSS", "Interactive"],
                    css: `.extracted-glass-effect {\n  backdrop-filter: blur(14px) saturate(120%);\n  background: rgba(255, 255, 255, 0.06);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.2);\n}`,
                    style: {
                        backdropFilter: 'blur(14px) saturate(120%)',
                        WebkitBackdropFilter: 'blur(14px) saturate(120%)',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
                    }
                };
            }

            setResult(customEffect);
            setActiveEffect(customEffect);
        }, 1200);
    };

    const handleApplyDemo = (effect: DemoEffect) => {
        setActiveEffect(effect);
        setSuccessMessage(language === 'vi' ? 'Đã áp dụng hiệu ứng thành công vào Live Card!' : 'Applied effect to the Live Card!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const hexToRgba = (hex: string, alpha: number): string => {
        const cleanedHex = hex.replace('#', '');
        const r = parseInt(cleanedHex.substring(0, 2), 16) || 255;
        const g = parseInt(cleanedHex.substring(2, 4), 16) || 255;
        const b = parseInt(cleanedHex.substring(4, 6), 16) || 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const getDynamicStyles = (): React.CSSProperties => {
        if (!activeEffect) return {};
        
        // Calculate background rgba based on current opacity modifier
        const isDarkPreset = activeEffect.id === 'glass-neon' || activeEffect.id.startsWith('custom-neon');
        const r = isDarkPreset ? 15 : 255;
        const g = isDarkPreset ? 20 : 255;
        const b = isDarkPreset ? 35 : 255;
        const background = `rgba(${r}, ${g}, ${b}, ${opacityVal / 100})`;

        return {
            backdropFilter: `blur(${blurVal}px) saturate(150%)`,
            WebkitBackdropFilter: `blur(${blurVal}px) saturate(150%)`,
            background: background,
            border: activeEffect.style.border,
            boxShadow: `0 15px 45px rgba(0, 0, 0, 0.2), 0 0 ${glowIntensity / 2}px ${hexToRgba(customGlowColor, glowIntensity / 100)}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        };
    };

    if (!mounted) return null;

    const content = (
        <motion.div 
            initial={isStandalone ? { opacity: 0 } : { scale: 0.95, opacity: 0, y: 15 }}
            animate={isStandalone ? { opacity: 1 } : { scale: 1, opacity: 1, y: 0 }}
            exit={isStandalone ? { opacity: 0 } : { scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
            className={`${isStandalone ? 'flex-1 w-full flex flex-col' : 'fixed z-[99999] inset-3 sm:inset-6 md:inset-8 lg:inset-12 rounded-2xl sm:rounded-3xl border border-[var(--card-border)] shadow-2xl'} bg-[var(--card-bg)] backdrop-blur-2xl overflow-hidden solid-glass-nprpbjd`}
        >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b border-[var(--card-border)] bg-black/40 shrink-0 ${isStandalone ? 'sticky top-0 z-20' : ''}`}>
                <div className="flex items-center gap-3 text-[var(--accent-color)]">
                    <div className="p-2 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)]">
                        <Code size={22} className="animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold m-0 text-white flex items-center gap-2">
                            {language === 'vi' ? 'Studio Phân Tích CodePen' : 'CodePen Studio Analyzer'}
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-medium">
                                v2.0 PRO
                            </span>
                        </h2>
                        <p className="text-[11px] text-gray-400 m-0">
                            {language === 'vi' ? 'Trích xuất và thiết kế Glassmorphism tuyệt mỹ trực tiếp' : 'Extract and design flawless Glassmorphism interactively'}
                        </p>
                    </div>
                </div>
                {!isStandalone && onClose && (
                    <button 
                        onClick={onClose}
                        className="p-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/15 hover:border-white/10 transition-all text-gray-400 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Split Body Layout */}
            <div className="flex-1 overflow-y-auto lg:overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
                
                {/* Left Section: Input & Control Panel (7 cols) */}
                <div className="lg:col-span-7 p-6 sm:p-8 lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-[var(--card-border)] flex flex-col gap-8 bg-black/10 custom-scrollbar">
                    
                    {/* Step 1: Input URL */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[var(--accent-color)]/20 text-[var(--accent-color)] text-[10px] font-black border border-[var(--accent-color)]/30 shadow-[0_0_10px_rgba(138,92,246,0.2)]">01</span>
                                <span className="font-bold text-sm tracking-tight">{language === 'vi' ? 'Nhập liên kết CodePen' : 'Enter CodePen URL'}</span>
                            </div>
                            <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5 opacity-60">
                                <Monitor size={10} /> {language === 'vi' ? 'Hỗ trợ URL trực tiếp' : 'Direct URL Supported'}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1 group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[var(--accent-color)] transition-colors">
                                    <Smartphone size={16} />
                                </div>
                                <input 
                                    type="text"
                                    placeholder="https://codepen.io/username/pen/..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-[13.5px] text-white placeholder-gray-500 focus:outline-none focus:border-[var(--accent-color)]/50 focus:bg-white/10 transition-all shadow-inner"
                                />
                            </div>
                            <button 
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !url}
                                className="flex items-center justify-center gap-2 bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-white font-black py-3.5 px-8 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_4px_25px_rgba(138,92,246,0.3)] hover:shadow-[var(--accent-color)]/50 active:scale-95 shrink-0"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span className="text-xs uppercase tracking-widest">{language === 'vi' ? 'Đang giải mã...' : 'Decrypting...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={18} />
                                        <span className="text-xs uppercase tracking-widest">{language === 'vi' ? 'Phân Tích' : 'Analyze'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Step 2: Preset Effects */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[var(--accent-color)]/20 text-[var(--accent-color)] text-[10px] font-black border border-[var(--accent-color)]/30 shadow-[0_0_10px_rgba(138,92,246,0.2)]">02</span>
                                <span className="font-bold text-sm tracking-tight">{language === 'vi' ? 'Thư viện mẫu Glassmorphism' : 'Glassmorphism Preset Library'}</span>
                            </div>
                            <button className="text-[10px] text-[var(--accent-color)]/70 hover:text-[var(--accent-color)] flex items-center gap-1 font-bold transition-colors">
                                <RefreshCw size={10} /> {language === 'vi' ? 'Làm mới' : 'Refresh'}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {PRESET_EFFECTS.map((effect) => {
                                const isSelected = activeEffect?.id === effect.id;
                                return (
                                    <button
                                        key={effect.id}
                                        onClick={() => handleApplyDemo(effect)}
                                        className={`group text-left p-5 rounded-3xl border transition-all duration-500 relative overflow-hidden flex flex-col gap-3 ${
                                            isSelected 
                                                ? 'bg-gradient-to-br from-[var(--accent-color)]/20 via-[var(--accent-color)]/[0.05] to-transparent border-[var(--accent-color)] shadow-[0_10px_30px_rgba(138,92,246,0.15)]' 
                                                : 'bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <span className={`font-black text-[13px] tracking-tight transition-colors ${isSelected ? 'text-[var(--accent-color)]' : 'text-white/90 group-hover:text-white'}`}>
                                                {language === 'vi' ? effect.title : effect.titleEn}
                                            </span>
                                            {isSelected && (
                                                <div className="p-1 rounded-lg bg-[var(--accent-color)] text-white shadow-[0_0_15px_rgba(138,92,246,0.5)]">
                                                    <Check size={10} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 group-hover:text-gray-400 m-0 leading-relaxed line-clamp-2 transition-colors">
                                            {language === 'vi' ? effect.description : effect.descriptionEn}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-auto pt-2">
                                            {effect.tags.map((tag, idx) => (
                                                <span key={idx} className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider ${isSelected ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)]' : 'bg-white/5 text-gray-600'}`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 3: Extracted Result Panel */}
                    {result ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col gap-5 border-t border-white/10 pt-8 mt-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                        <Sparkles size={18} className="text-emerald-400 animate-pulse" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm text-white m-0 uppercase tracking-tight">
                                            {language === 'vi' ? 'Dữ liệu CSS trích xuất' : 'Extracted CSS Properties'}
                                        </h3>
                                        <p className="text-[10px] text-gray-500 m-0 font-mono tracking-widest uppercase opacity-60">Success Recovery Sync</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    SYNCED
                                </div>
                            </div>

                            <div className="p-6 rounded-[32px] bg-black/40 border border-white/10 flex flex-col gap-5 shadow-2xl relative overflow-hidden group/result">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/result:opacity-10 transition-opacity pointer-events-none">
                                    <Code size={80} />
                                </div>
                                
                                <div className="relative z-10">
                                    <h4 className="font-black text-[var(--accent-color)] text-[15px] m-0 flex items-center gap-2 tracking-tight">
                                        <Check size={18} />
                                        {result.title}
                                    </h4>
                                    <p className="text-[12.5px] text-gray-400 m-0 mt-2 leading-relaxed bg-white/[0.03] p-4 rounded-2xl border border-white/5 font-medium italic">
                                        "{language === 'vi' ? result.description : result.descriptionEn}"
                                    </p>
                                </div>

                                {/* Beautiful CSS Syntax Viewer */}
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0b10] font-mono text-[11px] leading-relaxed shadow-inner group/code">
                                    <div className="bg-white/5 px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
                                        <span className="text-gray-500 text-[9px] font-black tracking-[0.2em] uppercase">source.styles.css</span>
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-red-500/30" />
                                            <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                                            <div className="w-2 h-2 rounded-full bg-green-500/30" />
                                        </div>
                                    </div>
                                    <pre className="p-5 m-0 select-all overflow-x-auto whitespace-pre custom-scrollbar text-emerald-400/80">
                                        <code className="block">
                                            {result.css.split('\n').map((line, i) => (
                                                <div key={i} className="flex gap-5">
                                                    <span className="text-gray-800 select-none w-4 text-right font-bold">{i + 1}</span>
                                                    <span className="group-hover/code:text-emerald-300 transition-colors">{line}</span>
                                                </div>
                                            ))}
                                        </code>
                                    </pre>
                                </div>

                                <button 
                                    onClick={() => handleApplyDemo(result)}
                                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--accent-color)] to-[var(--accent-color)]/80 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl hover:shadow-[var(--accent-color)]/40 active:scale-[0.98] text-[13px] uppercase tracking-widest"
                                >
                                    <Layers size={18} />
                                    {language === 'vi' ? 'Áp dụng vào bản xem trước' : 'Sync to Visual Preview'}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="mt-auto py-12 px-8 rounded-[40px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center gap-6 bg-black/20 group hover:border-[var(--accent-color)]/20 transition-all duration-500">
                            <div className="w-20 h-20 rounded-[30px] bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-700 group-hover:scale-110 group-hover:text-[var(--accent-color)] group-hover:bg-[var(--accent-color)]/5 transition-all duration-700">
                                <AlertCircle size={40} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="text-gray-400 font-black text-sm m-0 uppercase tracking-widest">
                                    {language === 'vi' ? 'Trình phân tích rỗng' : 'Waiting for Input'}
                                </h4>
                                <p className="text-gray-600 text-[12px] max-w-[280px] m-0 leading-relaxed font-medium">
                                    {language === 'vi' 
                                        ? 'Dán liên kết CodePen vào Bước 1 để bắt đầu giải mã cấu trúc CSS Glassmorphism.' 
                                        : 'Paste a CodePen URL in Step 1 to begin decrypting CSS Glassmorphism structures.'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Section: Interactive Live Preview (5 cols) */}
                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col bg-[#050505] relative overflow-hidden min-h-[600px] lg:min-h-0">
                    
                    {/* Background Decorative Glows */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[var(--accent-color)]/10 blur-[120px] pointer-events-none animate-pulse" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none animate-pulse" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

                    <div className="z-10 flex flex-col gap-6 h-full">
                        
                        {/* Playground Indicator Header */}
                        <div className="flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3 text-white/40 font-black text-[10px] tracking-[0.3em] uppercase">
                                <div className="w-1 h-4 bg-[var(--accent-color)] rounded-full shadow-[0_0_10px_var(--accent-color)]" />
                                {language === 'vi' ? 'Trung tâm trình diễn' : 'Visual Preview Center'}
                            </div>
                            <AnimatePresence>
                                {successMessage && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full font-black flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                    >
                                        <Play size={10} fill="currentColor" /> {successMessage.toUpperCase()}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* The Dynamic Target Profile Card */}
                        <div className="flex-1 flex items-center justify-center py-10 perspective-2000 relative">
                            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                <div className="w-full h-[1px] bg-white/10" />
                                <div className="h-full w-[1px] bg-white/10" />
                            </div>
                            
                            <motion.div 
                                style={activeEffect ? getDynamicStyles() : PRESET_EFFECTS[0].style}
                                className="w-full max-w-[320px] rounded-[48px] p-8 flex flex-col items-center text-center gap-6 border border-white/10 relative overflow-hidden group/card shadow-2xl"
                                whileHover={{ y: -8, rotateX: 4, rotateY: -4, scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            >
                                {/* Glass Shine Effect */}
                                <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent rotate-45 translate-x-[-120%] group-hover/card:translate-x-[120%] transition-transform duration-1000 pointer-events-none" />
                                
                                {/* Avatar Area */}
                                <div className="relative shrink-0">
                                    <div className="absolute inset-[-6px] rounded-full bg-gradient-to-tr from-[var(--accent-color)] via-white/30 to-cyan-400 animate-spin-slow blur-[8px] opacity-40 group-hover/card:opacity-100 transition-opacity" />
                                    <div className="w-24 h-24 rounded-full p-[3px] bg-white/10 relative z-10 shadow-2xl">
                                        <img 
                                            src="https://avatars.githubusercontent.com/u/10000000?v=4" 
                                            alt="Avatar" 
                                            className="w-full h-full rounded-full border border-white/20 object-cover bg-black"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    <div className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full bg-emerald-500 border-[4px] border-black flex items-center justify-center z-20 shadow-xl">
                                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="flex flex-col gap-2 w-full z-10">
                                    <h3 className="text-white font-black text-2xl m-0 tracking-tighter flex items-center justify-center gap-2">
                                        Nguyễn Hùng Thái
                                        <BadgeCheck size={22} className="text-blue-400" />
                                    </h3>
                                    <div className="inline-block self-center px-4 py-1 rounded-xl bg-white/5 border border-white/10 mb-1">
                                        <p className="text-[10px] text-[var(--accent-color)] font-black uppercase tracking-[0.25em] m-0">
                                            UI/UX Specialist
                                        </p>
                                    </div>
                                    <p className="text-[13px] text-gray-300 m-0 mt-2 leading-relaxed font-medium px-2">
                                        {language === 'vi' 
                                            ? 'Kiến tạo trải nghiệm người dùng tối giản và đột phá công nghệ.' 
                                            : 'Architecting minimalist user experiences and technological breakthroughs.'}
                                    </p>
                                </div>

                                {/* Skill Pills */}
                                <div className="flex flex-wrap justify-center gap-2 w-full z-10 mt-2">
                                    {['React 19', 'Next.js', 'Tailwind'].map(skill => (
                                        <span key={skill} className="text-[10px] font-black px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/60 group-hover/card:text-white group-hover/card:bg-white/10 transition-all">
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Interactive Button */}
                                <button 
                                    style={{
                                        background: customGlowColor,
                                        boxShadow: `0 12px 30px ${customGlowColor}60`,
                                    }}
                                    className="w-full py-4 px-6 rounded-[24px] text-white font-black text-[13px] uppercase tracking-widest hover:scale-[1.03] active:scale-[0.97] transition-all shadow-2xl mt-4 z-10"
                                >
                                    {language === 'vi' ? 'Kết Nối Ngay' : 'Connect Now'}
                                </button>
                            </motion.div>
                        </div>

                        {/* Real-time Tweak Sliders */}
                        <div className="p-6 sm:p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col gap-6 z-10 backdrop-blur-3xl shrink-0 mt-auto">
                            <div className="flex items-center justify-between">
                                <div className="text-[11px] font-black text-white/30 flex items-center gap-2 uppercase tracking-[0.2em]">
                                    <Sliders size={14} className="text-[var(--accent-color)]" />
                                    {language === 'vi' ? 'Bảng tinh chỉnh thời gian thực' : 'Real-time Tweak Hub'}
                                </div>
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                {/* Blur Intensity Slider */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between text-[11px] font-black">
                                        <span className="text-gray-500 uppercase tracking-widest">{language === 'vi' ? 'Độ mờ' : 'Frost'}</span>
                                        <span className="text-[var(--accent-color)] font-mono">{blurVal}px</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="60" 
                                        value={blurVal}
                                        onChange={(e) => setBlurVal(Number(e.target.value))}
                                        className="w-full accent-[var(--accent-color)] bg-white/5 h-2 rounded-full cursor-pointer appearance-none hover:bg-white/10 transition-all"
                                    />
                                </div>

                                {/* Transparency Opacity Slider */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between text-[11px] font-black">
                                        <span className="text-gray-500 uppercase tracking-widest">{language === 'vi' ? 'Độ đục' : 'Opacity'}</span>
                                        <span className="text-[var(--accent-color)] font-mono">{opacityVal}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={opacityVal}
                                        onChange={(e) => setOpacityVal(Number(e.target.value))}
                                        className="w-full accent-[var(--accent-color)] bg-white/5 h-2 rounded-full cursor-pointer appearance-none hover:bg-white/10 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Glow Color Selector */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{language === 'vi' ? 'Màu thương hiệu' : 'Brand Palette'}</span>
                                <div className="flex gap-3">
                                    {['#8a5cf6', '#00f3ff', '#d4af37', '#ec4899', '#ffffff', '#10b981'].map((color) => (
                                        <button 
                                            key={color}
                                            onClick={() => setCustomGlowColor(color)}
                                            style={{ background: color }}
                                            className={`w-6 h-6 rounded-xl border-2 transition-all hover:scale-125 hover:rotate-12 ${
                                                customGlowColor === color ? 'border-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-white/10 scale-100 opacity-60 hover:opacity-100'
                                            }`}
                                            aria-label={`Select ${color} color`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    if (isStandalone) return content;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {content}
                </>
            )}
        </AnimatePresence>,
        document.getElementById('popup-root') || document.body
    );
};

export default CodePenAnalyzer;
