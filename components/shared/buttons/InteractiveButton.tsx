'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Heart, 
  Share2, 
  Play, 
  ExternalLink, 
  Phone, 
  Mail,
  ChevronRight,
  Star
} from 'lucide-react';

export type InteractiveButtonVariant = 
  | 'virtual-tour' 
  | 'like' 
  | 'share' 
  | 'action' 
  | 'contact' 
  | 'favorite'
  | 'external';

interface InteractiveButtonProps {
  variant: InteractiveButtonVariant;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'only';
}

const variantStyles = {
  'virtual-tour': {
    base: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white',
    icon: <Play className="h-4 w-4" />
  },
  'like': {
    base: 'bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm border',
    icon: <Heart className="h-4 w-4" />
  },
  'share': {
    base: 'bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm border',
    icon: <Share2 className="h-4 w-4" />
  },
  'action': {
    base: 'bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border border-white/20',
    icon: <ChevronRight className="h-4 w-4" />
  },
  'contact': {
    base: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white',
    icon: <Phone className="h-4 w-4" />
  },
  'favorite': {
    base: 'bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm border',
    icon: <Star className="h-4 w-4" />
  },
  'external': {
    base: 'bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm border',
    icon: <ExternalLink className="h-4 w-4" />
  }
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({ 
  variant, 
  children, 
  onClick, 
  className,
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left'
}) => {
  const variantConfig = variantStyles[variant];
  const sizeConfig = sizeStyles[size];
  const displayIcon = icon || variantConfig.icon;
  
  const baseClasses = cn(
    'flex items-center gap-1.5 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed',
    variantConfig.base,
    sizeConfig,
    className
  );
  
  const content = (
    <>
      {iconPosition !== 'right' && displayIcon && (
        <span className="flex-shrink-0">
          {displayIcon}
        </span>
      )}
      {children && iconPosition !== 'only' && (
        <span>{children}</span>
      )}
      {iconPosition === 'right' && displayIcon && (
        <span className="flex-shrink-0">
          {displayIcon}
        </span>
      )}
      {loading && (
        <span className="animate-spin ml-1">
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
        </span>
      )}
    </>
  );
  
  return (
    <button 
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      type="button"
    >
      {content}
    </button>
  );
};

// Specialized button components for common use cases
export const VirtualTourButton: React.FC<{
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}> = ({ onClick, className, size = 'md', disabled, loading, icon }) => (
  <InteractiveButton
    variant="virtual-tour"
    onClick={onClick}
    className={className}
    size={size}
    disabled={disabled}
    loading={loading}
    icon={icon}
  >
    Virtual Tour
  </InteractiveButton>
);

export const LikeButton: React.FC<{
  liked?: boolean;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}> = ({ liked = false, onClick, className, size = 'md', disabled, loading }) => (
  <InteractiveButton
    variant="like"
    onClick={onClick}
    className={cn(
      liked && 'bg-red-500/20 text-red-400 border-red-400/30',
      className
    )}
    size={size}
    disabled={disabled}
    loading={loading}
    icon={<Heart className={cn('h-4 w-4', liked && 'fill-current')} />}
  >
    {liked ? 'Liked' : 'Like'}
  </InteractiveButton>
);

export const ShareButton: React.FC<{
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}> = ({ onClick, className, size = 'md', disabled, loading }) => (
  <InteractiveButton
    variant="share"
    onClick={onClick}
    className={className}
    size={size}
    disabled={disabled}
    loading={loading}
  >
    Share
  </InteractiveButton>
);

export const ContactButton: React.FC<{
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}> = ({ onClick, className, size = 'md', disabled, loading, children = 'Contact' }) => (
  <InteractiveButton
    variant="contact"
    onClick={onClick}
    className={className}
    size={size}
    disabled={disabled}
    loading={loading}
  >
    {children}
  </InteractiveButton>
);

export default InteractiveButton;
