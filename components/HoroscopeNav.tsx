import React from 'react';

const HoroscopeNav: React.FC = () => {
    return (
        <nav className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <span className="text-2xl">👑</span>
                        <span className="font-bold text-xl tracking-tight text-stone-800 dark:text-stone-100">Hồ Sơ Vận Mệnh</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex space-x-6 mr-4">
                            <a href="#tong-quan" className="text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-500 font-medium transition-colors">Tổng Quan</a>
                            <a href="#ban-do-nang-luc" className="text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-500 font-medium transition-colors">Năng Lực</a>
                            <a href="#cung-menh" className="text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-500 font-medium transition-colors">Chi Tiết Cung</a>
                            <a href="#diem-manh-hop-tuoi" className="text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-500 font-medium transition-colors">Làm Việc</a>
                            <a href="#chien-luoc" className="text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-500 font-medium transition-colors">Chiến Lược</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default HoroscopeNav;
