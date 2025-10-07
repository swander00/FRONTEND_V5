'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';

export type SpacingScale = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export type TypographyScale = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

interface ThemeContextType {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  setMode: (mode: ThemeMode) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  defaultColorScheme?: ColorScheme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'system',
  defaultColorScheme = 'blue'
}) => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme);

  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    const savedColorScheme = localStorage.getItem('theme-color-scheme') as ColorScheme;
    
    if (savedMode) setMode(savedMode);
    if (savedColorScheme) setColorScheme(savedColorScheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    localStorage.setItem('theme-color-scheme', colorScheme);
    
    // Apply theme to document
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
    root.setAttribute('data-color-scheme', colorScheme);
  }, [mode, colorScheme]);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{
      mode,
      colorScheme,
      setMode,
      setColorScheme,
      toggleMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme-aware component wrapper
interface ThemedComponentProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

export const ThemedComponent: React.FC<ThemedComponentProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md'
}) => {
  const { mode, colorScheme } = useTheme();
  
  const variantClasses = {
    primary: `bg-${colorScheme}-500 text-white hover:bg-${colorScheme}-600`,
    secondary: `bg-${colorScheme}-100 text-${colorScheme}-800 hover:bg-${colorScheme}-200`,
    accent: `bg-${colorScheme}-50 text-${colorScheme}-700 hover:bg-${colorScheme}-100`,
    neutral: mode === 'dark' ? 'bg-gray-800 text-gray-100 hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <div className={cn(
      'transition-colors duration-200',
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
};

// Design token utilities
export const getSpacing = (scale: SpacingScale): string => {
  const spacingMap = {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem'     // 64px
  };
  return spacingMap[scale];
};

export const getTypography = (scale: TypographyScale): string => {
  const typographyMap = {
    xs: 'text-xs',      // 12px
    sm: 'text-sm',     // 14px
    base: 'text-base',  // 16px
    lg: 'text-lg',     // 18px
    xl: 'text-xl',     // 20px
    '2xl': 'text-2xl', // 24px
    '3xl': 'text-3xl', // 30px
    '4xl': 'text-4xl'  // 36px
  };
  return typographyMap[scale];
};

export const getColor = (scheme: ColorScheme, shade: number = 500): string => {
  const colorMap = {
    blue: `blue-${shade}`,
    green: `green-${shade}`,
    purple: `purple-${shade}`,
    orange: `orange-${shade}`,
    red: `red-${shade}`,
    gray: `gray-${shade}`
  };
  return colorMap[scheme];
};

// Theme-aware utility components
export const ThemedButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', size = 'md', className, disabled = false }) => {
  const { colorScheme } = useTheme();
  
  const variantClasses = {
    primary: `bg-${colorScheme}-600 hover:bg-${colorScheme}-700 text-white`,
    secondary: `bg-${colorScheme}-100 hover:bg-${colorScheme}-200 text-${colorScheme}-800`,
    outline: `border-2 border-${colorScheme}-600 text-${colorScheme}-600 hover:bg-${colorScheme}-50`,
    ghost: `text-${colorScheme}-600 hover:bg-${colorScheme}-50`
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
};

export const ThemedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}> = ({ children, className, variant = 'default' }) => {
  const { mode } = useTheme();
  
  const variantClasses = {
    default: mode === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200',
    elevated: mode === 'dark'
      ? 'bg-gray-800 border-gray-700 shadow-2xl'
      : 'bg-white border-gray-200 shadow-lg',
    outlined: mode === 'dark'
      ? 'bg-transparent border-gray-600'
      : 'bg-transparent border-gray-300'
  };
  
  return (
    <div className={cn(
      'rounded-lg border transition-colors duration-200',
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  );
};

export default ThemeProvider;
