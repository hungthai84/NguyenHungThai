import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TimelineChart: React.FC = () => {
    const data = [
        { name: '< 30 tuổi', power: 30, finance: 20 },
        { name: '30-41 tuổi', power: 65, finance: 50 },
        { name: '42-51 tuổi', power: 100, finance: 95 },
        { name: '> 52 tuổi', power: 95, finance: 85 },
    ];

    return (
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-6 md:p-10 transition-colors duration-300">
             <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-50 mb-3 transition-colors">IV. Quỹ Đạo Vận Hạn (Timeline)</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="power" stroke="#b45309" strokeWidth={3} />
                            <Line type="monotone" dataKey="finance" stroke="#57534e" strokeWidth={2} strokeDasharray="5 5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                {/* Timeline details... */}
            </div>
        </div>
    );
};

export default TimelineChart;
