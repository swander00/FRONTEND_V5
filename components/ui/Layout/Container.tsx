import React from 'react';
import { cn } from '@/lib';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  className, 
  maxWidth = '7xl' 
}) => {
  return (
    <div 
      className={cn(
        `w-full px-4 sm:px-6 lg:px-8 max-w-none`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
