import React from 'react';
import * as Icons from './Icons';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

const GlassButton: React.FC<GlassButtonProps> = ({ 
    children, 
    className = "", 
    onClick,
    ...props 
}) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) onClick(e);
    };

    return (
        <button
            onClick={handleClick}
            className={`
                relative overflow-hidden transition-all duration-300
                bg-white/10 backdrop-blur-md border border-white/20
                hover:bg-white/20 active:scale-95
                flex items-center justify-center gap-2
                py-2.5 px-5 text-sm font-medium rounded-xl
                shadow-lg shadow-black/5
                ${className}
            `}
            {...props}
        >
            <span className="flex items-center gap-2">
                {children}
            </span>
        </button>
    );
};

export default GlassButton;
