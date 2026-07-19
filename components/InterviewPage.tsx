import React from 'react';
import { useI18n } from '../contexts/i18n';
import PageLayout from './PageLayout';
import VideoInterviewCard from './VideoInterviewCard';

const InterviewPage: React.FC<{ id?: string }> = ({ id }) => {
    const { t } = useI18n();
    const pageData = t.interviewPage;
    
    return (
        <PageLayout id={id}>
            <VideoInterviewCard 
                pageData={pageData}
            />
        </PageLayout>
    );
};

export default InterviewPage;

