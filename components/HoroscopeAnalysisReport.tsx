import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';

const HoroscopeAnalysisReport: React.FC = () => {
    const [activeTab, setActiveTab] = useState('menh');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'menh':
                return (
                    <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
                        <h3 className="text-xl font-bold mb-2">Người Lãnh Đạo Của Sự Thay Đổi</h3>
                        <p>Mệnh và Thân đồng cung thể hiện ý chí và hành động cực kỳ nhất quán...</p>
                    </div>
                );
            case 'quan':
                return (
                    <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
                        <h3 className="text-xl font-bold mb-2">Ấn Tín Của Quyền Lực</h3>
                        <p>Đây là cung Quan Lộc của một chuyên gia, một người quản lý cấp cao thực thụ...</p>
                    </div>
                );
            case 'tai':
                return (
                    <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-lg">
                        <h3 className="text-xl font-bold mb-2">Tiền Tài Đến Từ Danh Tiếng</h3>
                        <p>Tiền bạc không đến từ sự may rủi mà là hệ quả tất yếu của thương hiệu cá nhân...</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-10 p-6 text-stone-800 dark:text-stone-100">
            {/* Header */}
            <header className="text-center">
                <h1 className="text-4xl font-extrabold mb-4">
                    Nguyễn Hùng Thái <br />
                    <span className="text-amber-700 dark:text-amber-500 font-light text-2xl">Lá Số Của Nhà Lãnh Đạo Tối Cao</span>
                </h1>
                <p className="text-lg text-stone-600 dark:text-stone-400">
                    Sinh năm Giáp Tý (1984) - Mệnh Hải Trung Kim.
                </p>
            </header>

            {/* I. Bản Đồ Năng Lực */}
            <section id="ban-do-nang-luc">
                <h2 className="text-2xl font-bold mb-4">I. Bản Đồ Năng Lực Cốt Lõi</h2>
                <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800">
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={[
                            { subject: 'Kiến tạo Hệ thống', A: 90 },
                            { subject: 'Tái cấu trúc', A: 85 },
                            { subject: 'Uy quyền', A: 95 },
                            { subject: 'Lãnh đạo', A: 95 },
                            { subject: 'Bản lĩnh', A: 80 }
                        ]}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis />
                            <Radar name="Năng lực" dataKey="A" fill="#f59e0b" fillOpacity={0.6} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* II. Trụ Cột Vận Mệnh */}
            <section id="cung-menh">
                <h2 className="text-2xl font-bold mb-4">II. Chi Tiết Các Trụ Cột Vận Mệnh</h2>
                <div className="flex gap-2 mb-4 border-b">
                    <button onClick={() => setActiveTab('menh')} className={`px-4 py-2 ${activeTab === 'menh' ? 'border-b-2 border-amber-600 font-bold' : ''}`}>Mệnh & Thân</button>
                    <button onClick={() => setActiveTab('quan')} className={`px-4 py-2 ${activeTab === 'quan' ? 'border-b-2 border-amber-600 font-bold' : ''}`}>Quan Lộc</button>
                    <button onClick={() => setActiveTab('tai')} className={`px-4 py-2 ${activeTab === 'tai' ? 'border-b-2 border-amber-600 font-bold' : ''}`}>Tài Bạch</button>
                </div>
                {renderTabContent()}
            </section>

            {/* III. Điểm mạnh */}
            <section id="diem-manh-hop-tuoi">
                <h2 className="text-2xl font-bold mb-4">III. Điểm Mạnh Làm Việc</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                        <h3 className="font-bold">Làm Việc Nguyên Tắc & Tinh Anh</h3>
                        <p>Hội tụ Thiên Tướng và Thiên Phủ giúp anh Thái có phong cách chuyên nghiệp...</p>
                    </div>
                </div>
            </section>

            {/* IV. Timeline */}
            <section id="timeline">
                <h2 className="text-2xl font-bold mb-4">IV. Quỹ Đạo Vận Hạn</h2>
                <div className="bg-white dark:bg-stone-900 p-6 rounded-xl border">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={[
                            { name: '<30', Quyền: 30, Tài: 20 },
                            { name: '30-41', Quyền: 65, Tài: 50 },
                            { name: '42-51', Quyền: 100, Tài: 95 },
                            { name: '>52', Quyền: 95, Tài: 85 }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Quyền" stroke="#b45309" />
                            <Line type="monotone" dataKey="Tài" stroke="#57534e" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </div>
    );
};

export default HoroscopeAnalysisReport;
