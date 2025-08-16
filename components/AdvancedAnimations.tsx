'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';

interface AdvancedAnimationsProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate' | 'bounce';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  trigger?: 'scroll' | 'hover' | 'click' | 'always';
  stagger?: boolean;
  staggerDelay?: number;
}

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  rotate?: number;
}

export default function AdvancedAnimations({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  className = '',
  trigger = 'scroll',
  stagger = false,
  staggerDelay = 0.1
}: AdvancedAnimationsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold });
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const animations = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 }
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    },
    rotate: {
      hidden: { opacity: 0, rotate: -180 },
      visible: { opacity: 1, rotate: 0 }
    },
    bounce: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }
  };

  const selectedAnimation = animations[animation];

  useEffect(() => {
    if (trigger === 'scroll' && isInView) {
      controls.start('visible');
    } else if (trigger === 'always') {
      controls.start('visible');
    }
  }, [isInView, controls, trigger]);

  const handleHover = () => {
    if (trigger === 'hover') {
      setIsHovered(true);
      controls.start('visible');
    }
  };

  const handleHoverEnd = () => {
    if (trigger === 'hover') {
      setIsHovered(false);
      controls.start('hidden');
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsClicked(!isClicked);
      controls.start(isClicked ? 'hidden' : 'visible');
    }
  };

  const getTriggerProps = () => {
    switch (trigger) {
      case 'hover':
        return {
          onHoverStart: handleHover,
          onHoverEnd: handleHoverEnd
        };
      case 'click':
        return {
          onClick: handleClick
        };
      default:
        return {};
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={selectedAnimation}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
      {...getTriggerProps()}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for multiple animated children
export function StaggerContainer({ children, staggerDelay = 0.1, className = '' }: StaggerContainerProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ threshold: 0.1 }}
      className={className}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}

// Parallax effect component
export function Parallax({ children, speed = 0.5, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;
        setOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ y: offset }}
        className="transform-gpu"
      >
        {children}
      </motion.div>
    </div>
  );
}

// Hover card with 3D effect
export function HoverCard({ children, className = '', scale = 1.05, rotate = 2 }: HoverCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      setMousePosition({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 ${className}`}
      whileHover={{
        scale,
        transition: { duration: 0.2 }
      }}
      style={{
        transformStyle: 'preserve-3d',
        transform: `rotateX(${mousePosition.x}deg) rotateY(${mousePosition.y}deg)`
      }}
    >
      {children}
    </motion.div>
  );
}

// Floating animation component
export function Floating({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 1, -1, 0]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

// Pulse animation component
export function Pulse({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

// Shake animation component
export function Shake({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      whileHover={{
        x: [0, -2, 2, -2, 2, 0],
        transition: { duration: 0.5 }
      }}
    >
      {children}
    </motion.div>
  );
}

// Typewriter effect component
export function Typewriter({ 
  text, 
  speed = 50, 
  className = '' 
}: { 
  text: string; 
  speed?: number; 
  className?: string; 
}) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </motion.span>
  );
}

// Loading spinner with advanced animation
export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}

// Progress bar with animation
export function ProgressBar({ 
  progress, 
  className = '' 
}: { 
  progress: number; 
  className?: string; 
}) {
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
      <motion.div
        className="bg-blue-600 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}
