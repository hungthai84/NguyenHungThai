import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  strength?: number;
}

/**
 * MagneticButton Component
 * 
 * Architecture:
 * 1. Uses useRef for the DOM element to measure position without re-renders.
 * 2. Uses MotionValues and Springs from Framer Motion for smooth, high-performance animation.
 * 3. Calculates the center of the button and moves the element relative to that center based on mouse proximity.
 */
const MagneticButton: React.FC<MagneticButtonProps> = ({ 
  children, 
  className = "", 
  distance = 100, 
  strength = 0.3 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Motion values for X and Y positions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth "lerp" effect (Linear Interpolation)
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Interior text parallax values
  const textX = useSpring(useMotionValue(0), springConfig);
  const textY = useSpring(useMotionValue(0), springConfig);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate distance from center
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    const dist = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (dist < distance) {
      // Inside magnetic field: calculate pull
      // We multiply by strength (e.g. 0.3) to prevent the button from jumping directly to the cursor
      mouseX.set(distanceX * strength);
      mouseY.set(distanceY * strength);
      
      // Text moves at a different rate (0.2 strength) for parallax effect
      // @ts-ignore
      textX.set(distanceX * (strength * 0.6));
      // @ts-ignore
      textY.set(distanceY * (strength * 0.6));
    } else {
      // Outside: return to origin
      mouseX.set(0);
      mouseY.set(0);
      // @ts-ignore
      textX.set(0);
      // @ts-ignore
      textY.set(0);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={`relative z-50 ${className}`}
    >
      <motion.div 
        style={{ x: textX, y: textY }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default MagneticButton;
