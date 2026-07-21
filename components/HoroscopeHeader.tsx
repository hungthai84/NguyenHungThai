import React from 'react';

const HoroscopeHeader: React.FC = () => {
    return (
        <header id="tong-quan" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-stone-50 mb-4 tracking-tight transition-colors">
                    Nguyễn Hùng Thái <br />
                    <span className="text-amber-700 dark:text-amber-500 font-light text-3xl md:text-4xl">Lá Số Của Nhà Lãnh Đạo Tối Cao</span>
                </h1>
                <p className="text-lg text-stone-600 dark:text-stone-400 mb-8 transition-colors">
                    Sinh năm Giáp Tý (1984) - Mệnh Hải Trung Kim. Ứng dụng này tổng hợp và trực quan hóa các phân tích chuyên sâu về lá số tử vi, mang đến cái nhìn toàn cảnh về tiềm năng lãnh đạo, dòng chảy tài chính và chiến lược phát triển trong "Thập kỷ Vàng".
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                    <span className="px-4 py-2 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full transition-colors">Cách Cục: Phủ Tướng Triều Viên</span>
                    <span className="px-4 py-2 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-full transition-colors">Mệnh Đồng Cung Tỵ (Hỏa)</span>
                </div>
            </div>
        </header>
    );
};

export default HoroscopeHeader;
