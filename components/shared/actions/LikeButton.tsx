"use client";

import { Heart, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface LikeButtonProps {
  initialLiked?: boolean;
  initialSaved?: boolean;
  variant?: 'like' | 'save' | 'both';
  size?: 'sm' | 'md' | 'lg';
  visualVariant?: 'default' | 'card' | 'header' | 'minimal';
  showCount?: boolean;
  count?: number;
  className?: string;
  onLike?: (liked: boolean) => void;
  onSave?: (saved: boolean) => void;
  disabled?: boolean;
}

/**
 * Shared LikeButton component for use across Property Card and Property Details
 * Supports both like and save functionality with multiple visual variants
 */
export default function LikeButton({ 
  initialLiked = false,
  initialSaved = false,
  variant = 'like',
  size = 'md',
  visualVariant = 'default',
  showCount = false,
  count = 0,
  className = '',
  onLike,
  onSave,
  disabled = false
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);

  const getVisualVariantClasses = () => {
    switch (visualVariant) {
      case 'card':
        return 'bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 border border-gray-200 shadow-sm hover:shadow-md backdrop-blur-sm';
      case 'header':
        return 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-red-300 backdrop-blur-sm';
      case 'minimal':
        return 'bg-transparent border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-red-500';
      default:
        return 'bg-white/90 hover:bg-white text-gray-700 hover:text-red-500 border border-gray-200 shadow-sm hover:shadow-md backdrop-blur-sm';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  const handleLikeClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    onLike?.(newLiked);
  };

  const handleSaveClick = () => {
    const newSaved = !saved;
    setSaved(newSaved);
    onSave?.(newSaved);
  };

  const renderLikeButton = () => (
    <Button
      variant="outline"
      size={size === 'md' ? 'default' : size}
      className={`${getVisualVariantClasses()} ${getSizeClasses()} rounded-lg font-semibold transition-all duration-200 ${liked ? 'text-red-500' : ''} ${className}`}
      onClick={handleLikeClick}
      disabled={disabled}
    >
      <Heart className={`${getIconSize()} mr-1 ${liked ? 'fill-current' : ''}`} />
      {showCount && count > 0 && <span className="ml-1">{count}</span>}
      {!showCount && 'Like'}
    </Button>
  );

  const renderSaveButton = () => (
    <Button
      variant="outline"
      size={size === 'md' ? 'default' : size}
      className={`${getVisualVariantClasses()} ${getSizeClasses()} rounded-lg font-semibold transition-all duration-200 ${saved ? 'text-blue-500' : ''} ${className}`}
      onClick={handleSaveClick}
      disabled={disabled}
    >
      <Bookmark className={`${getIconSize()} mr-1 ${saved ? 'fill-current' : ''}`} />
      Save
    </Button>
  );

  if (variant === 'save') {
    return renderSaveButton();
  }

  if (variant === 'both') {
    return (
      <div className="flex gap-1">
        {renderLikeButton()}
        {renderSaveButton()}
      </div>
    );
  }

  return renderLikeButton();
}

/**
 * Compact LikeButton for card contexts
 */
export function CompactLikeButton({ 
  initialLiked = false,
  size = 'sm',
  className = '',
  onLike,
  disabled = false
}: Pick<LikeButtonProps, 'initialLiked' | 'size' | 'className' | 'onLike' | 'disabled'>) {
  return (
    <LikeButton
      initialLiked={initialLiked}
      variant="like"
      size={size}
      visualVariant="card"
      showCount={false}
      className={className}
      onLike={onLike}
      disabled={disabled}
    />
  );
}

/**
 * Header LikeButton for property details header
 */
export function HeaderLikeButton({ 
  initialLiked = false,
  initialSaved = false,
  size = 'sm',
  className = '',
  onLike,
  onSave,
  disabled = false
}: Pick<LikeButtonProps, 'initialLiked' | 'initialSaved' | 'size' | 'className' | 'onLike' | 'onSave' | 'disabled'>) {
  return (
    <LikeButton
      initialLiked={initialLiked}
      initialSaved={initialSaved}
      variant="both"
      size={size}
      visualVariant="header"
      showCount={false}
      className={className}
      onLike={onLike}
      onSave={onSave}
      disabled={disabled}
    />
  );
}
