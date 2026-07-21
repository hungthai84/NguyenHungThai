cat << 'INNER_EOF' > components/ProjectCard.tsx
import React from 'react';
import { useI18n } from '../contexts/i18n';
import type { Project, ViewMode } from './project-types';
import OptimizedImage from './OptimizedImage';

interface ProjectCardProps {
    project: Project;
    viewMode: ViewMode;
    hasPost: boolean;
    onClick: () => void;
    groupColor?: string;
}

const STAGE_COLORS: Record<string, string> = {
    '1': '#3b82f6', // Blue
    '2': '#10b981', // Green
    '3': '#f59e0b', // Orange
    '4': '#8b5cf6', // Purple
    '5': '#ef4444', // Red
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, hasPost, onClick }) => {
    const { t } = useI18n();
    
    // Safety checks to prevent rendering errors
    const stageStr = project?.stage || '';
    const match = typeof stageStr === 'string' ? stageStr.match(/\d+/) : null;
    const stageKey = match ? match[0] : '1';
    const stageColor = STAGE_COLORS[stageKey] || '#3b82f6';

    if (!project) return null;

    return (
        <div
            className={`project-card-new h-full flex flex-col ${hasPost ? 'has-post' : ''} group cursor-pointer overflow-hidden rounded-[16px] bg-[var(--card-bg)] shadow-[var(--card-box-shadow)] backdrop-blur-md border border-[var(--color-brand-glass-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            onClick={onClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
            role={hasPost ? "button" : "article"}
            tabIndex={hasPost ? 0 : -1}
            aria-label={`Xem chi tiết dự án: ${project?.title || 'Không có tiêu đề'}`}
        >
            <div className="project-card-new-image relative w-full aspect-video overflow-hidden shrink-0">
                <OptimizedImage src={project?.imageUrl || ''} alt={project?.title || ''} optWidth={600} optQuality={70} hoverScale />
                
                {/* Group Badge - Top Left */}
                {project?.group && (
                    <div className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded-md text-xs font-semibold text-white shadow-md backdrop-blur-md"
                         style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                        {project.group}
                    </div>
                )}

                {/* Stage Badge - Top Right */}
                {project?.stage && (
                    <div className="absolute top-2 right-2 z-10 px-2.5 py-1 rounded-md text-[11px] font-bold text-white shadow-md backdrop-blur-md"
                        style={{ backgroundColor: `${stageColor}CC`, border: '1px solid rgba(255, 255, 255, 0.3)' }}>
                        {project.stage}
                    </div>
                )}

                {/* Hashtags - Bottom Left */}
                {project?.hashtags && Array.isArray(project.hashtags) && project.hashtags.length > 0 && (
                    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5 z-10 pr-2">
                        {project.hashtags.map((tag, idx) => {
                            if (!tag) return null;
                            const displayTag = typeof tag === 'string' && tag.startsWith('#') ? tag : `#${tag}`;
                            return (
                                <span
                                    key={idx}
                                    className="whitespace-nowrap text-[10.5px] px-2 py-1 leading-none font-medium text-white shadow-sm backdrop-blur-md rounded-md"
                                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
                                >
                                    {displayTag}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>
            
            <div className="project-card-new-content relative flex flex-col flex-1 p-4">
                <h4 className="project-card-new-title m-0 mb-2 pr-2 font-bold text-[16px] leading-[1.3] line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                    {project?.id ? <span className="project-card-new-id text-[var(--accent-color)] mr-1">{project.id}.</span> : null}
                    {project?.title || 'Chưa có tiêu đề'}
                </h4>
                <p className="project-card-new-description m-0 text-[13.5px] leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                    {project?.description || 'Chưa có mô tả'}
                </p>
            </div>
        </div>
    );
};

export default ProjectCard;
INNER_EOF
