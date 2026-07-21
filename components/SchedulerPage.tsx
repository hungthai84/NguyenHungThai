import React from 'react';
import { useI18n } from '../contexts/i18n';
import PageLayout from './PageLayout';
import * as Icons from './Icons';
import CardTitle from './CardTitle';

interface SchedulerPageProps {
    id?: string;
}

const SchedulerPage: React.FC<SchedulerPageProps> = ({ id }) => {
    const { t } = useI18n();
    const pageData = t.schedulerPage || { badge: 'Lịch biểu', tooltipTitle: 'Scheduler' };

    const iframeStyle: React.CSSProperties = {
        border: 0,
        width: '100%',
        height: '570px',
        borderRadius: '16px',
        backgroundColor: '#fbfbfb'
    };

    return (
        <PageLayout id={id}>
            <div className="info-card flex flex-col h-full">
                <CardTitle
                    icon={<Icons.CalendarDaysIcon />}
                    text={pageData.badge || 'Lịch biểu'}
                    tooltipTitle={pageData.tooltipTitle}
                    tooltipText={pageData.tooltipText}
                    style={{ marginBottom: '1.5rem' }}
                />

                <div className="flex-1 no-scrollbar" style={{ padding: '0.5rem' }}>
                    <div className="inner-glass-card flex flex-col" style={{ 
                        height: '100%',
                        background: 'var(--card-bg)',
                        backdropFilter: 'var(--glass-blur)',
                        borderRadius: '16px',
                        border: '1px solid var(--card-border)',
                        boxShadow: 'var(--card-box-shadow)',
                        overflow: 'hidden'
                    }}>
                        <div className="w-full relative" style={{ height: '570px' }}>
                            <iframe 
                                src="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1a3Mw_pkdsalTQ8K30r6bUr8UJ1591ZRowrMZn07qSE1n9QBEoQ06TGv9p3MCKctU-tQ2Z-0ma?gv=true" 
                                title={pageData.tooltipTitle}
                                style={iframeStyle}
                                frameBorder="0"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default SchedulerPage;