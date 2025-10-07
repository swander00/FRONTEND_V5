"use client";

import { Heart, Share2 } from 'lucide-react';
import { CircularActionButton } from '@/components/shared/buttons';
import { useState } from 'react';

interface PropertyActionsProps {
  onLike?: (liked: boolean) => void;
  onShare?: () => void;
  className?: string;
}

export default function PropertyActions({ 
  onLike, 
  onShare, 
  className = '' 
}: PropertyActionsProps) {
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    onLike?.(newLiked);
  };

  return (
    <div className={`flex gap-2 justify-end ${className}`}>
      <CircularActionButton
        icon={Heart}
        size="sm"
        visualVariant="header"
        isActive={liked}
        activeColor="text-red-500"
        onClick={handleLikeClick}
        aria-label="Like property"
        title="Like"
      />
      <CircularActionButton
        icon={Share2}
        size="sm"
        visualVariant="header"
        onClick={onShare}
        aria-label="Share property"
        title="Share"
      />
    </div>
  );
}
