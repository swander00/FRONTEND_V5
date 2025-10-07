'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type AnimationType = 
  | 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'
  | 'scale' | 'rotate' | 'bounce' | 'pulse' | 'shake' | 'wiggle'
  | 'flip' | 'zoom' | 'glow' | 'float' | 'tilt';

export type AnimationDuration = 'fast' | 'normal' | 'slow' | 'slower';

export type AnimationDelay = 'none' | 'short' | 'medium' | 'long';

interface AnimationProps {
  type: AnimationType;
  duration?: AnimationDuration;
  delay?: AnimationDelay;
  children: React.ReactNode;
  className?: string;
  trigger?: 'hover' | 'focus' | 'click' | 'always';
  loop?: boolean;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

const animationClasses = {
  // Fade animations
  'fade': 'animate-fade-in',
  'slide-up': 'animate-slide-up',
  'slide-down': 'animate-slide-down',
  'slide-left': 'animate-slide-left',
  'slide-right': 'animate-slide-right',
  
  // Transform animations
  'scale': 'animate-scale',
  'rotate': 'animate-spin',
  'bounce': 'animate-bounce',
  'pulse': 'animate-pulse',
  'shake': 'animate-shake',
  'wiggle': 'animate-wiggle',
  
  // Advanced animations
  'flip': 'animate-flip',
  'zoom': 'animate-zoom',
  'glow': 'animate-glow',
  'float': 'animate-float',
  'tilt': 'animate-tilt'
};

const durationClasses = {
  fast: 'duration-150',
  normal: 'duration-300',
  slow: 'duration-500',
  slower: 'duration-700'
};

const delayClasses = {
  none: 'delay-0',
  short: 'delay-75',
  medium: 'delay-150',
  long: 'delay-300'
};

const triggerClasses = {
  hover: 'hover:animate-trigger',
  focus: 'focus:animate-trigger',
  click: 'active:animate-trigger',
  always: ''
};

export const Animation: React.FC<AnimationProps> = ({
  type,
  duration = 'normal',
  delay = 'none',
  children,
  className,
  trigger = 'always',
  loop = false,
  direction = 'normal'
}) => {
  const animationClass = animationClasses[type];
  const durationClass = durationClasses[duration];
  const delayClass = delayClasses[delay];
  const triggerClass = triggerClasses[trigger];
  
  const loopClass = loop ? 'animate-infinite' : '';
  const directionClass = direction !== 'normal' ? `animate-${direction}` : '';
  
  return (
    <div
      className={cn(
        animationClass,
        durationClass,
        delayClass,
        triggerClass,
        loopClass,
        directionClass,
        className
      )}
    >
      {children}
    </div>
  );
};

// Specialized animation components
export const FadeIn: React.FC<{
  children: React.ReactNode;
  duration?: AnimationDuration;
  delay?: AnimationDelay;
  className?: string;
}> = ({ children, duration = 'normal', delay = 'none', className }) => (
  <Animation
    type="fade"
    duration={duration}
    delay={delay}
    className={className}
  >
    {children}
  </Animation>
);

export const SlideUp: React.FC<{
  children: React.ReactNode;
  duration?: AnimationDuration;
  delay?: AnimationDelay;
  className?: string;
}> = ({ children, duration = 'normal', delay = 'none', className }) => (
  <Animation
    type="slide-up"
    duration={duration}
    delay={delay}
    className={className}
  >
    {children}
  </Animation>
);

export const Scale: React.FC<{
  children: React.ReactNode;
  duration?: AnimationDuration;
  delay?: AnimationDelay;
  className?: string;
  trigger?: 'hover' | 'focus' | 'click' | 'always';
}> = ({ children, duration = 'normal', delay = 'none', className, trigger = 'hover' }) => (
  <Animation
    type="scale"
    duration={duration}
    delay={delay}
    className={className}
    trigger={trigger}
  >
    {children}
  </Animation>
);

export const Bounce: React.FC<{
  children: React.ReactNode;
  duration?: AnimationDuration;
  delay?: AnimationDelay;
  className?: string;
  loop?: boolean;
}> = ({ children, duration = 'normal', delay = 'none', className, loop = false }) => (
  <Animation
    type="bounce"
    duration={duration}
    delay={delay}
    className={className}
    loop={loop}
  >
    {children}
  </Animation>
);

export const Pulse: React.FC<{
  children: React.ReactNode;
  duration?: AnimationDuration;
  delay?: AnimationDelay;
  className?: string;
  loop?: boolean;
}> = ({ children, duration = 'normal', delay = 'none', className, loop = true }) => (
  <Animation
    type="pulse"
    duration={duration}
    delay={delay}
    className={className}
    loop={loop}
  >
    {children}
  </Animation>
);

export const Shake: React.FC<{
  children: React.ReactNode;
  duration?: AnimationDuration;
  delay?: AnimationDelay;
  className?: string;
  trigger?: 'hover' | 'focus' | 'click' | 'always';
}> = ({ children, duration = 'fast', delay = 'none', className, trigger = 'click' }) => (
  <Animation
    type="shake"
    duration={duration}
    delay={delay}
    className={className}
    trigger={trigger}
  >
    {children}
  </Animation>
);

export const Glow: React.FC<{
  children: React.ReactNode;
  duration?: AnimationDuration;
  delay?: AnimationDelay;
  className?: string;
  trigger?: 'hover' | 'focus' | 'click' | 'always';
}> = ({ children, duration = 'normal', delay = 'none', className, trigger = 'hover' }) => (
  <Animation
    type="glow"
    duration={duration}
    delay={delay}
    className={className}
    trigger={trigger}
  >
    {children}
  </Animation>
);

export const Float: React.FC<{
  children: React.ReactNode;
  duration?: AnimationDuration;
  delay?: AnimationDelay;
  className?: string;
  loop?: boolean;
}> = ({ children, duration = 'slow', delay = 'none', className, loop = true }) => (
  <Animation
    type="float"
    duration={duration}
    delay={delay}
    className={className}
    loop={loop}
  >
    {children}
  </Animation>
);

export default Animation;
