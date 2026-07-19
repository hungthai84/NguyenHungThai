import React from 'react';

export interface CardTitleProps {
    icon: React.ReactNode;
    text: string;
    tooltipTitle?: string;
    tooltipText?: string;
    style?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    onClick?: () => void;
    active?: boolean;
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
    icon, 
    text, 
    style, 
    containerStyle,
    onClick,
    active
}) => {
    return (
        <div 
            className={`about-badge-container ${onClick ? 'cursor-pointer select-none' : ''}`} 
            style={containerStyle}
            onClick={onClick}
        >
            <div 
                className={`info-badge ${active ? 'active-badge' : ''}`} 
                style={{
                    ...style,
                    border: active ? '1.5px solid var(--accent-color)' : undefined,
                    boxShadow: active ? '0 0 15px rgba(var(--accent-color-rgb), 0.5)' : undefined
                }}
            >
                <span className="badge-content">
                    {icon}
                    <span>{text}</span>
                </span>
            </div>
        </div>
    );
};

export default CardTitle;
