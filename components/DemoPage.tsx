import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../contexts/i18n';
import PageLayout from './PageLayout';
import * as Icons from './Icons';
import GlassButton from './GlassButton';

const DemoPage: React.FC<{ id?: string }> = ({ id }) => {
    const { t, language } = useI18n();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    // Card View 1: Bento Stats State
    const [activeStat, setActiveStat] = useState<number | null>(null);

    // Card View 2: Interactive Project Card Hover State
    const [isCardHovered, setIsCardHovered] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    return (
        <PageLayout id={id}>
            {/* White/Blank Minimalist Demo Page Container */}
            <div className="relative w-full min-h-[500px] flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden">
                
                {/* Visual Decorative Background Blobs for Glassmorphism Context */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Main Clean Workspace ("Nội dung trắng" - Blank Canvas style) */}
                <div className="z-10 text-center max-w-lg space-y-6 flex flex-col items-center">
                    {/* Modern abstract icon representing custom web design */}
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-lg text-[var(--accent-color,rgb(244,63,94))]"
                    >
                        <Icons.SparklesIcon size={32} />
                    </motion.div>

                    <div className="space-y-2">
                        <motion.h2 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent font-sans"
                        >
                            {language === 'vi' ? 'Trang Demo Trống tinh tế' : 'Minimalist Demo Page'}
                        </motion.h2>
                        <motion.p 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-sm text-white/40 font-mono"
                        >
                            {language === 'vi' ? 'Sạch sẽ • Tối giản • Kính mờ' : 'Clean • Minimalist • Glassmorphism'}
                        </motion.p>
                    </div>

                    {/* Minimalist "Trang Trắng" Placeholder Container */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-full max-w-sm py-8 px-6 rounded-2xl bg-white/2 backdrop-blur-sm border border-white/5 flex flex-col items-center justify-center text-center space-y-4"
                    >
                        <div className="w-12 h-[2px] bg-white/10 rounded-full"></div>
                        <p className="text-xs text-white/50 leading-relaxed font-sans px-4">
                           {language === 'vi' 
                                ? 'Không gian thiết kế tối giản được kiến tạo bằng kỹ thuật phủ mờ thủy tinh độc đáo.' 
                                : 'A pristine empty canvas designed with advanced glassmorphic layout layering.'}
                        </p>
                        <div className="w-12 h-[2px] bg-white/10 rounded-full"></div>
                    </motion.div>

                    {/* Glowing View Button - Trigger Pop up */}
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="pt-2"
                    >
                        <button
                            onClick={() => setIsPopupOpen(true)}
                            className="relative group px-8 py-3.5 rounded-2xl bg-white text-black font-semibold text-sm transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 flex items-center gap-2.5"
                        >
                            <Icons.PresentationIcon size={18} className="text-black group-hover:rotate-12 transition-transform duration-300" />
                            <span>{language === 'vi' ? 'Xem Trang (Xem Pop-up)' : 'View Page (Open Pop-up)'}</span>
                        </button>
                    </motion.div>
                </div>

                {/* Extracted Effect Showcase Section */}
                <div className="z-10 mt-16 w-full max-w-4xl">
                    <div className="flex flex-col items-center mb-8">
                        <h3 className="text-xl font-bold text-white mb-2 font-sans text-center">
                            {language === 'vi' ? 'Hiệu Ứng Trích Xuất Premium' : 'Premium Extracted Effects'}
                        </h3>
                        <div className="h-1 w-12 bg-[var(--accent-color,rgb(244,63,94))] rounded-full opacity-60"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Showcase: Solid Glass (NPRPBjd) */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="solid-glass-nprpbjd p-8 rounded-3xl flex flex-col gap-4 group cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 text-white group-hover:scale-110 transition-transform duration-300">
                                <Icons.LayersIcon size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Solid Premium Glass</h4>
                                <p className="text-[10px] text-white/40 font-mono tracking-wider">SOURCE: NPRPBjd</p>
                            </div>
                            <p className="text-sm text-white/70 leading-relaxed font-sans">
                                {language === 'vi' 
                                    ? 'Kỹ thuật phủ mờ đậm đặc với độ bão hòa màu cực cao, mang lại chiều sâu không gian tuyệt đối.' 
                                    : 'Dense frosting technique with extreme color saturation, providing absolute spatial depth.'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] text-white/60">Glassmorphism</span>
                                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] text-white/60">Premium</span>
                            </div>
                        </motion.div>

                        {/* Showcase: Aurora Glow */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 flex flex-col gap-4 relative overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/30 rounded-full blur-2xl group-hover:bg-purple-500/50 transition-colors duration-500"></div>
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 text-white group-hover:scale-110 transition-transform duration-300">
                                <Icons.SparklesIcon size={24} />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Aurora Frosted Glass</h4>
                                <p className="text-[10px] text-white/40 font-mono tracking-wider">UTILITY: .aurora-glass-card</p>
                            </div>
                            <p className="text-sm text-white/70 leading-relaxed font-sans">
                                {language === 'vi' 
                                    ? 'Sự kết hợp hoàn hảo giữa độ nhám kính mờ và dải màu cực quang chuyển động rực rỡ phía sau.' 
                                    : 'A perfect blend of frosted glass texture and vibrant, moving aurora color bands behind.'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] text-white/60">Aurora</span>
                                <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] text-white/60">Modern</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* POP-UP OVERLAY (NẰM TRÊN THẺ CHÍNH - PORTALED TO POPUP-ROOT) */}
                <AnimatePresence>
                    {isPopupOpen && mounted && createPortal(
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-black/65 backdrop-blur-xl"
                        >
                            {/* Backdrop exit click handler */}
                            <div className="absolute inset-0" onClick={() => setIsPopupOpen(false)} />

                            {/* Main Popup Card */}
                            <motion.div
                                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 150 }}
                                className="relative w-full max-w-4xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl bg-slate-950/45 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col z-10"
                            >
                                {/* Glassmorphism Toast notification */}
                                <AnimatePresence>
                                    {toast && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                            className="absolute top-24 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 text-white text-xs font-bold shadow-[0_10px_25px_rgba(16,185,129,0.2)] flex items-center gap-2"
                                        >
                                            <Icons.ShieldCheckIcon size={14} className="text-emerald-400 animate-bounce" />
                                            <span>{toast}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Popup Header */}
                                <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-5 bg-black/30 backdrop-blur-md border-b border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--accent-color,rgb(244,63,94))] to-purple-500/40 flex items-center justify-center shadow-inner border border-white/10 text-white">
                                            <Icons.LayersIcon size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white tracking-tight">
                                                {language === 'vi' ? 'Không Gian Trải Nghiệm Demo' : 'Interactive Demo Space'}
                                            </h3>
                                            <p className="text-xs text-white/50 font-mono">
                                                {language === 'vi' ? 'Phát triển đa phong cách Card View Glassmorphism' : 'Multi-Style Glassmorphic Card Showcase'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setIsPopupOpen(false)}
                                        className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                                        aria-label="Close dialog"
                                    >
                                        <Icons.XIcon size={18} />
                                    </button>
                                </div>

                                {/* Popup Content Body - Multiple Dynamic Card Views */}
                                <div className="p-6 md:p-8 space-y-8 flex-1">
                                    {/* Intro Note */}
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-xs text-white/80 leading-relaxed">
                                            💡 <strong>{language === 'vi' ? 'Ghi chú Thiết kế:' : 'Design Note:'}</strong> {language === 'vi' 
                                                ? 'Pop-up này trình diễn 3 phong cách thiết kế Card View kính mờ khác biệt. Mỗi thẻ đại diện cho một cách tiếp cận UI/UX trực quan giúp gia tăng cảm xúc tương tác.' 
                                                : 'This pop-up showcases 3 distinct styles of frosted-glass card views, optimized for seamless interaction and visual depth.'}
                                        </p>
                                    </div>

                                    {/* Main Cards Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        
                                        {/* STYLE 1: Bento Stats Card (Interactive grid inside card) */}
                                        <motion.div 
                                            whileHover={{ y: -5 }}
                                            className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between space-y-6 shadow-lg relative group overflow-hidden"
                                        >
                                            {/* Glow overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                                        Style 01 • Bento Grid
                                                    </span>
                                                    <Icons.PresentationIcon size={16} className="text-white/40" />
                                                </div>
                                                <h4 className="text-base font-bold text-white">
                                                    {language === 'vi' ? 'Thẻ Chỉ số Bento' : 'Bento Metric Card'}
                                                </h4>
                                                <p className="text-xs text-white/60 leading-relaxed">
                                                    {language === 'vi' 
                                                        ? 'Sắp xếp nội dung theo lưới nhỏ linh hoạt giúp tóm tắt dữ liệu nhanh chóng.' 
                                                        : 'Grid-based structured data presentation. Perfect for fast reading.'}
                                                </p>
                                            </div>

                                            {/* Mini Bento Items inside Card */}
                                            <div className="grid grid-cols-2 gap-2.5 pt-2">
                                                {[
                                                    { val: '22+', label: 'Năm KN', color: 'text-emerald-400' },
                                                    { val: '10+', label: 'Dự án', color: 'text-purple-400' },
                                                    { val: '100%', label: 'CSAT', color: 'text-amber-400' },
                                                    { val: 'Realtime', label: 'Báo cáo', color: 'text-blue-400' },
                                                ].map((stat, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        onClick={() => setActiveStat(activeStat === idx ? null : idx)}
                                                        whileTap={{ scale: 0.95 }}
                                                        className={`p-2.5 rounded-xl cursor-pointer transition-all duration-300 ${
                                                            activeStat === idx 
                                                                ? 'bg-white/20 border-white/30 shadow-md scale-102' 
                                                                : 'bg-white/5 border border-white/5 hover:bg-white/10'
                                                        }`}
                                                    >
                                                        <span className={`block text-sm font-bold ${stat.color}`}>{stat.val}</span>
                                                        <span className="text-[10px] text-white/50 block mt-0.5">{stat.label}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>

                                        {/* STYLE 2: Glowing Acrylic & Reflection Card (Sleek minimalist style) */}
                                        <motion.div 
                                            whileHover={{ y: -5 }}
                                            onHoverStart={() => setIsCardHovered(true)}
                                            onHoverEnd={() => setIsCardHovered(false)}
                                            className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col justify-between space-y-6 shadow-lg relative overflow-hidden group"
                                        >
                                            {/* Dynamic neon line animation on border hover */}
                                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-color,rgb(244,63,94))] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-mono bg-pink-500/10 text-pink-300 border border-pink-500/20">
                                                        Style 02 • Acrylic
                                                    </span>
                                                    <Icons.SparklesIcon size={16} className="text-white/40" />
                                                </div>
                                                <h4 className="text-base font-bold text-white">
                                                    {language === 'vi' ? 'Thẻ Ánh Kim Thủy Tinh' : 'Glass Reflection Card'}
                                                </h4>
                                                <p className="text-xs text-white/60 leading-relaxed">
                                                    {language === 'vi' 
                                                        ? 'Hiệu ứng viền phát sáng kết hợp bóng phản chiếu sang trọng từ mặt gương.' 
                                                        : 'Features high-gloss border gradients and delicate reflections upon cursor interaction.'}
                                                </p>
                                            </div>

                                            {/* Interactive Visual Preview */}
                                            <div className="relative h-24 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-pink-500/10" />
                                                
                                                {/* Floating mockup circle */}
                                                <motion.div 
                                                    animate={{ 
                                                        y: isCardHovered ? [-5, 5, -5] : 0,
                                                        scale: isCardHovered ? 1.08 : 1
                                                    }}
                                                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                                                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500/30 to-[var(--accent-color,rgb(244,63,94))] border border-white/30 flex items-center justify-center shadow-lg text-white font-bold text-xs"
                                                >
                                                    AI
                                                </motion.div>
                                                
                                                {/* Radar rings */}
                                                <span className="absolute w-20 h-20 border border-white/5 rounded-full animate-ping pointer-events-none" />
                                            </div>
                                        </motion.div>

                                        {/* STYLE 3: Neumorphic Glass Hybrid (Rich shadows & raised surfaces) */}
                                        <motion.div 
                                            whileHover={{ y: -5 }}
                                            className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 flex flex-col justify-between space-y-6 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),_0_8px_16px_rgba(0,0,0,0.3)] relative group"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                                        Style 03 • Hybrid
                                                    </span>
                                                    <Icons.BriefcaseIcon size={16} className="text-white/40" />
                                                </div>
                                                <h4 className="text-base font-bold text-white">
                                                    {language === 'vi' ? 'Thẻ Gối Chìm Nổi' : 'Neumorphic Glass'}
                                                </h4>
                                                <p className="text-xs text-white/60 leading-relaxed">
                                                    {language === 'vi' 
                                                        ? 'Kết hợp bóng chìm phía trong để tạo cảm nhận chiều sâu 3D trên bề mặt phủ kính.' 
                                                        : 'Combines inner-shadow embossing with standard blur to form an organic tactile feel.'}
                                                </p>
                                            </div>

                                            {/* Floating Interactive Slider Demo */}
                                            <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-2">
                                                <div className="flex justify-between items-center text-[10px] font-mono">
                                                    <span className="text-white/50">{language === 'vi' ? 'Thanh điều khiển' : 'Controller'}</span>
                                                    <span className="text-[var(--accent-color,rgb(244,63,94))] font-bold">85%</span>
                                                </div>
                                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: '85%' }}
                                                        transition={{ delay: 0.5, duration: 1 }}
                                                        className="h-full bg-gradient-to-r from-emerald-500 to-[var(--accent-color,rgb(244,63,94))] rounded-full" 
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>

                                    </div>

                                    {/* Big Showcase Card below (Full Width detailed card view) */}
                                    <div className="p-6 md:p-8 rounded-3xl bg-white/2 border border-white/5 space-y-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-600/10 to-indigo-600/0 blur-2xl rounded-full pointer-events-none" />
                                        
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-1.5">
                                                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                                    <Icons.LayersIcon size={20} className="text-indigo-400" />
                                                    <span>{language === 'vi' ? 'Thẻ Tiêu Điểm Dự Án Cao Cấp' : 'Premium Case Study Card'}</span>
                                                </h4>
                                                <p className="text-xs text-white/50 leading-relaxed max-w-xl">
                                                    {language === 'vi' 
                                                        ? 'Thiết kế thẻ nâng cao với tiêu đề mờ, hiệu ứng chữ chuyển sắc (gradient) và lưới biểu tượng trực quan sinh động.' 
                                                        : 'Advanced container with blurred headers, gradient text, and clean interactive iconography overlays.'}
                                                </p>
                                            </div>
                                            
                                            {/* Action Button */}
                                            <button 
                                                onClick={() => {
                                                    setToast(language === 'vi' ? 'Cảm ơn bạn đã trải nghiệm tính năng này!' : 'Thank you for interacting with this feature!');
                                                }}
                                                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white font-medium hover:scale-103 transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg active:scale-95 self-start md:self-auto cursor-pointer"
                                            >
                                                <span>{language === 'vi' ? 'Nhấp Đăng Ký' : 'Register Interaction'}</span>
                                                <Icons.SparklesIcon size={12} />
                                            </button>
                                        </div>

                                        {/* Mock Data Panel Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                            {[
                                                { icon: <Icons.UserIcon size={18} />, label: 'UI/UX Design', desc: 'Space Grotesk typography & high contrast grid systems' },
                                                { icon: <Icons.ServerIcon size={18} />, label: 'Frontend Tech', desc: 'Vite, React 18, Tailwind CSS, Motion' },
                                                { icon: <Icons.BriefcaseIcon size={18} />, label: 'CX Leadership', desc: 'Designed for optimal client journey mapping' },
                                                { icon: <Icons.SparklesIcon size={18} />, label: 'Micro-Animations', desc: 'Smooth spring dynamics for premium tactile responses' }
                                            ].map((item, idx) => (
                                                <div key={idx} className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2 hover:bg-white/5 hover:border-white/10 transition-all duration-300">
                                                    <div className="text-indigo-300">{item.icon}</div>
                                                    <h5 className="text-xs font-bold text-white">{item.label}</h5>
                                                    <p className="text-[10px] text-white/40 leading-relaxed">{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Popup Footer */}
                                <div className="px-6 py-4 bg-black/20 border-t border-white/10 flex justify-end gap-3 rounded-b-3xl">
                                    <button
                                        onClick={() => setIsPopupOpen(false)}
                                        className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white/80 hover:text-white transition-all duration-300 cursor-pointer"
                                    >
                                        {language === 'vi' ? 'Đóng lại' : 'Close'}
                                    </button>
                                    <button
                                        onClick={() => setIsPopupOpen(false)}
                                        className="px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-white/95 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer"
                                    >
                                        {language === 'vi' ? 'Xác nhận' : 'Confirm'}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>,
                        document.getElementById('popup-root') || document.body
                    )}
                </AnimatePresence>
            </div>
        </PageLayout>
    );
};

export default DemoPage;
