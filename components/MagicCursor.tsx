import React, { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MagicCursor: React.FC = () => {
    const { isMouseCursorOn } = useTheme();

    useEffect(() => {
        const innerCursor = document.querySelector('.mmc-inner') as HTMLElement;
        const outerCursor = document.querySelector('.mmc-outer') as HTMLElement;

        if (!innerCursor || !outerCursor) return;

        if (!isMouseCursorOn) {
            innerCursor.style.visibility = 'hidden';
            outerCursor.style.visibility = 'hidden';
            innerCursor.style.display = 'none';
            outerCursor.style.display = 'none';
            return;
        }

        // Reset display
        innerCursor.style.display = 'block';
        outerCursor.style.display = 'block';

        const handleMouseMove = (e: MouseEvent) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Move inner cursor
            innerCursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            innerCursor.style.visibility = 'visible';
            
            // Move outer cursor
            outerCursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            outerCursor.style.visibility = 'visible';
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;
            
            // Check if hovering over any interactive elements
            const isInteractive = target.closest('a, button, [role="button"], input, select, textarea, .glass-panel-hover, .mmc-hover-target, [onClick]');
            if (isInteractive) {
                innerCursor.classList.add('mmc-hover');
                outerCursor.classList.add('mmc-hover');
            } else {
                innerCursor.classList.remove('mmc-hover');
                outerCursor.classList.remove('mmc-hover');
            }
        };

        const handleMouseLeaveWindow = () => {
            innerCursor.style.visibility = 'hidden';
            outerCursor.style.visibility = 'hidden';
        };

        const handleMouseEnterWindow = () => {
            innerCursor.style.visibility = 'visible';
            outerCursor.style.visibility = 'visible';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseleave', handleMouseLeaveWindow);
        document.addEventListener('mouseenter', handleMouseEnterWindow);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseleave', handleMouseLeaveWindow);
            document.removeEventListener('mouseenter', handleMouseEnterWindow);
            
            // Hide on unmount
            if (innerCursor) {
                innerCursor.style.visibility = 'hidden';
                innerCursor.style.display = 'none';
            }
            if (outerCursor) {
                outerCursor.style.visibility = 'hidden';
                outerCursor.style.display = 'none';
            }
        };
    }, [isMouseCursorOn]);

    return null;
};

export default MagicCursor;
