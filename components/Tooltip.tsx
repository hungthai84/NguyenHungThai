import React, { useState } from 'react';

interface TooltipProps {
    children: React.ReactNode;
    text: string;
    title?: string;
    icon?: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, title, icon }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="relative group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            {children}
            {isHovered && (
                <div 
                    className="sidebar-tooltip"
                    style={{
                        position: 'absolute',
                        right: '65px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 999999,
                        background: 'var(--sidebar-bg)',
                        border: 'var(--color-brand-glass-border)',
                        borderRadius: '15px',
                        padding: '1rem',
                        boxShadow: 'var(--card-box-shadow)',
                        width: '280px',
                        backdropFilter: 'none',
                        WebkitBackdropFilter: 'none',
                        pointerEvents: 'none',
                    }}
                >
                    <div className="tooltip-inner" style={{ position: 'relative' }}>
                        <div className="tooltip-header" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '0.75rem'
                        }}>
                            {icon && (
                                <div className="tooltip-icon-wrapper" style={{
                                    width: '2.25rem',
                                    height: '2.25rem',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--sidebar-bg)',
                                    color: 'var(--accent-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {icon}
                                </div>
                            )}
                            {title && (
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '0.9375rem',
                                    fontWeight: 'bold',
                                    color: 'var(--color-brand-text-primary)'
                                }}>{title}</h3>
                            )}
                        </div>
                        <p style={{
                            margin: 0,
                            fontSize: '0.8rem',
                            lineHeight: '1.4',
                            color: 'var(--color-brand-text-secondary)',
                            textAlign: 'left',
                            whiteSpace: 'normal',
                        }}>{text}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
